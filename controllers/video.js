import videoServices from '../services/video.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Video from '../models/video.js';
import net from 'net';
import customENV from 'custom-env';

// Set the environment explicitly if not already set
process.env.NODE_ENV = process.env.NODE_ENV || 'local';

// Load environment variables
customENV.env(process.env.NODE_ENV, "./config");

export async function getVideos(req, res) {
    try {
        const popularVideos = await Video.find().sort({ views: -1 }).limit(10);
        const featuredVideos = await Video.find({ featured: true }).limit(10);

        const popularVideoIds = new Set(popularVideos.map(video => video.id));

        const uniqueFeaturedVideos = featuredVideos.filter(video => !popularVideoIds.has(video.id));

        const allVideos = [...popularVideos, ...uniqueFeaturedVideos];

        if (allVideos.length < 20) {
            return res.json(allVideos);
        }

        res.json(allVideos);
    } catch (error) {
        console.error("Error fetching videos:", error);
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
}


// Controller function for retrieving recommended videos
const getRecommendedVideos = async (req, res) => {
    const username = req.params.id;
    const videoId = Number(req.params.pid); // Convert videoId from the request parameters to a number

    console.log('Received request for recommendations:');
    console.log('Username:', username);
    console.log('Video ID:', videoId);

    // Check if username or videoId is missing or invalid
    if (!username || isNaN(videoId)) {
        console.error('Missing username or invalid videoId');
        return res.status(400).json({ error: 'Username and valid videoId are required.' });
    }

    try {
        const recommendedVideoIds = await videoServices.getRecommendedVideos(username, videoId);
        console.log('Recommended Video IDs:', recommendedVideoIds);

        // const videoDetails = await videoServices.getVideoDetails(recommendedVideoIds);
        // console.log('Recommended video details retrieved successfully:', videoDetails);
        res.status(200).json(recommendedVideoIds);
    } catch (error) {
        console.error('Error retrieving recommended videos:', error);
        res.status(500).json({ error: 'Failed to retrieve recommended videos' });
    }
};


export async function getHighestVideoId(req, res) {
    try {
        const highestVideo = await Video.findOne({}, {}, { sort: { id: -1 } }); // Find the latest video by ID
        const highestId = highestVideo ? highestVideo.id : 0; // If videos exist, take the highest ID, otherwise return 0
        res.status(200).json({ highestId }); // Return the highest ID
    } catch (error) {
        console.error('Error fetching highest video ID:', error);
        res.status(500).json({ error: 'Failed to fetch highest video ID' });
    }
}

export async function incrementVideoViews(req, res) {
    const videoId = req.params.pid; // Get the ID from the params
    const userName = req.body.userName || 'guest';

    // Do not send a message to the C++ server if the user is a guest
    if (userName === 'guest') {
        console.log("Guest user; not sending data to C++.");
        return res.json({ message: "Guest users do not generate views." });
    }

    try {
        const updatedVideo = await videoServices.incrementViewsById(videoId); // Call the service to increment views

        if (!updatedVideo) {
            return res.status(404).json({ error: 'Video not found' });
        }

        // Notify C++ server about the view
        notifyCppServer(userName, videoId);  // Send User ID and Video ID

        res.json(updatedVideo); // Return the updated video
    } catch (error) {   
        console.error('Error incrementing views:', error);
        res.status(500).json({ error: 'Failed to increment views' });
    }
}

function notifyCppServer(userName, videoId) {
    const socketPort = process.env.SOCKET_PORT || 5555; // Use SOCKET_PORT from the env file or default to 5555
    const virtualMachineIp = process.env.VIRTUAL_MACHINE_IP || '127.0.0.1'; // Use VIRTUAL_MACHINE_IP or default to local IP

    const client = new net.Socket(); // Create a new TCP socket

    client.connect(socketPort, virtualMachineIp, () => { // Connect to the C++ server using port and IP from the environment
        const message = `User:${userName} ,watchedVideo:${videoId}`;  
        console.log(`Sending: ${message} to ${virtualMachineIp}:${socketPort}`);
        client.write(message); 
    });

    client.on('data', (data) => {
        console.log('Received from C++ server: ' + data);
        client.destroy();
    });

    client.on('close', () => {
        console.log('Connection closed');
    });

    client.on('error', (err) => {
        console.error('Error: ' + err.message);
    });
}


export async function createVideo(req, res) {
    try {
        const { title, description, uploadDate, duration } = req.body;
        const userName = req.params.id; // Get the uploader's username from the URL
        const videoId = req.body.id; // Get the video ID from the request body
        const profilePicture = req.body.profilePicture;

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        // Check that files exist
        if (!req.files || !req.files.url || !req.files.thumbnailUrl) {
            return res.status(400).json({ error: 'Video and thumbnail files are required' });
        }

        let url = req.files.url[0].path; // Get the video file path from Multer
        let thumbnailUrl = req.files.thumbnailUrl[0].path; // Get the thumbnail file path from Multer

        // Check if the "public/thumbnailUrl" directory exists, and create it if necessary
        const thumbnailDir = path.join(__dirname, '../public/thumbnailUrl'); // Path to the thumbnail directory
        if (!fs.existsSync(thumbnailDir)) {
            fs.mkdirSync(thumbnailDir, { recursive: true }); // Create the directory recursively
        }

        // Remove the "public/" from the paths
        url = url.replace(/^public[\\/]/, '');  // Use regex to remove 'public/' at the start of the path
        thumbnailUrl = thumbnailUrl.replace(/^public[\\/]/, '');  // Same for thumbnail

        // Ensure paths start with a '/'
        url = url.startsWith('/') ? url : '/' + url;
        thumbnailUrl = thumbnailUrl.startsWith('/') ? thumbnailUrl : '/' + thumbnailUrl;

        // Now pass the userName and videoId to the service
        const video = await videoServices.createVideoInService(videoId, userName, title, description, url, thumbnailUrl,
            uploadDate, duration, profilePicture);

        if (!video) {
            return res.status(400).json({ error: 'Failed to create video' });
        }
        res.status(201).json(video); // Respond with the newly created video
    } catch (error) {
        console.error('Error in createVideo:', error); // Log the error
        res.status(500).json({ error: 'Failed to create video' }); // Respond with server error
    }
}

export async function getUserVideos(req, res) {
    try {
        // Call the service to get videos by uploader's name
        const videos = await videoServices.getUserVideos(req.params.id);
        res.json(videos); // Send back the videos in the response
    } catch (error) {
        // Handle errors and send back a failure response
        res.status(500).json({ error: 'Failed to fetch user videos' });
    }
}

export async function editVideo(req, res) {
    try {
        const { title, description } = req.body; // Video details
        const userName = req.params.id; // Username from URL parameters
        const videoId = Number(req.params.pid); // ID of the video from URL parameters

        // Fetch the existing video details
        const video = await videoServices.getVideoById(videoId);

        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        // Store paths for old files
        const oldVideoFilePath = path.join('public', video.url); // Path to the old video file
        const oldThumbnailFilePath = path.join('public', video.thumbnailUrl); // Path to the old thumbnail file

        // Update video properties and handle new files
        const updatedVideo = await videoServices.editVideo(userName, videoId, title, description, req.files, video);

        if (!updatedVideo) {
            return res.status(404).json({ error: 'Failed to update video' });
        }

        // Check if new files were uploaded and remove old files
        if (req.files) {
            // Check if a new video file was uploaded
            if (req.files.url) {
                // Remove the old video file
                if (fs.existsSync(oldVideoFilePath)) {
                    fs.unlinkSync(oldVideoFilePath);
                    console.log(`Deleted old video file: ${oldVideoFilePath}`);
                } else {
                    console.log(`Old video file does not exist: ${oldVideoFilePath}`);
                }
            }

            // Check if a new thumbnail file was uploaded
            if (req.files.thumbnailUrl) {
                // Remove the old thumbnail file
                if (fs.existsSync(oldThumbnailFilePath)) {
                    fs.unlinkSync(oldThumbnailFilePath);
                    console.log(`Deleted old thumbnail file: ${oldThumbnailFilePath}`);
                } else {
                    console.log(`Old thumbnail file does not exist: ${oldThumbnailFilePath}`);
                }
            }
        }

        res.json(updatedVideo); // Return the updated video
    } catch (error) {
        console.error('Error updating video:', error);
        res.status(500).json({ error: 'Failed to update video' });
    }
}

export async function deleteVideo(req, res) {
    try {
        // Extract userName from the validated token (assuming validateToken middleware was used)
        const loggedInUser = req.user.userName;
        const { id, pid } = req.params;

        // Ensure that the logged-in user is the one who uploaded the video
        if (loggedInUser !== id) {
            return res.status(403).json({ error: 'You are not authorized to delete this video' });
        }

        // Call the service to delete the video
        const success = await videoServices.deleteVideo(id, pid);
        if (!success) {
            return res.status(404).json({ error: 'Video not found or you are not authorized to delete it' });
        }

        res.status(200).json({ message: 'Video deleted successfully' });
    } catch (error) {
        console.error('Error deleting video:', error);
        res.status(500).json({ error: 'Failed to delete video' });
    }
}

export const updateVideoLikes = async (req, res) => {
    const videoId = req.params.pid; // Get video ID from request parameters
    const newLikes = Number(req.body.likes); // Get new likes count from request body

    try {
        const updatedVideo = await videoServices.updateLikesById(videoId, newLikes); // Call the service to update likes
        if (!updatedVideo) {
            return res.status(404).json({ error: 'Video not found' }); // Return 404 if video not found
        }
        res.json(updatedVideo); // Return the updated video
    } catch (error) {
        console.error('Error updating video likes:', error); // Log the error
        res.status(500).json({ error: 'Could not update likes' }); // Return server error
    }
};

export async function getVideoById(req, res) {
    try {
        const video = await videoServices.getVideoById(req.params.pid);
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }
        res.json(video);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch video' });
    }
}

export async function toggleLike(req, res) {
    try {
        const { videoId } = req.params;
        const { userName } = req.body;

        // Check if userName is provided
        if (!userName) {
            return res.status(400).json({ error: "userName is required" });
        }

        const result = await videoServices.toggleLike(videoId, userName);

        if (result.code) {
            return res.status(result.code).json({ error: result.error });
        }

        res.json(result);
    } catch (error) {
        console.error("Error in toggleLike controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const toggleDislike = async (req, res) => {
    try {
        const { videoId } = req.params;
        const { userName } = req.body;

        // Check if userName is provided
        if (!userName) {
            return res.status(400).json({ error: "userName is required" });
        }

        const result = await videoServices.toggleDislike(videoId, userName);

        if (result.code) {
            return res.status(result.code).json({ error: result.error });
        }

        res.json(result);
    } catch (error) {
        console.error("Error in toggleDislike controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Controller function to update video duration
export async function updateVideoDuration(req, res) {
    try {
        const videoId = req.params.pid; // Get the videoId from the URL
        const { duration } = req.body; // Get the duration from the request body

        // Validate that duration is provided in the request
        if (!duration) {
            return res.status(400).json({ error: 'Duration is required' });
        }

        // Call the service to update the video duration in the database
        const updatedVideo = await videoServices.updateVideoDurationInService(videoId, duration);

        if (!updatedVideo) {
            return res.status(404).json({ error: 'Video not found' });
        }

        // Return the updated video data in the response
        res.status(200).json(updatedVideo);
    } catch (error) {
        console.error('Error updating video duration:', error);
        // Respond with a server error in case of failure
        res.status(500).json({ error: 'Server error' });
    }
}

export default {
    getVideos,
    getUserVideos,
    editVideo,
    createVideo,
    deleteVideo,
    updateVideoLikes,
    getVideoById,
    incrementVideoViews,
    toggleLike,
    toggleDislike,
    getHighestVideoId,
    updateVideoDuration,
    notifyCppServer,
    getRecommendedVideos
};