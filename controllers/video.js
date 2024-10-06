import videoServices from '../services/video.js';
import path from 'path';
import fs from 'fs';


export async function getVideos(req, res) {
    try {
        const videos = await videoServices.getAllVideos();
        res.json(videos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
}

export async function createVideo(req, res) {
    try {
        const { title, description, uploadDate, duration } = req.body;
        const userName = req.params.id; // Get the uploader's username from the URL
        const videoId = req.body.id; // Get the video ID from the request body
        const profilePicture = req.body.profilePicture;

        // Check that files exist
        if (!req.files || !req.files.url || !req.files.thumbnailUrl) {
            return res.status(400).json({ error: 'Video and thumbnail files are required' });
        }

        let url = req.files.url[0].path; // Get the video file path from Multer
        let thumbnailUrl = req.files.thumbnailUrl[0].path; // Get the thumbnail file path from Multer

         // Remove the "public/" from the paths
         url = url.replace(/^public[\\/]/, '');  // Use regex to remove 'public/' at the start of the path
         thumbnailUrl = thumbnailUrl.replace(/^public[\\/]/, '');  // Same for thumbnail

         // Ensure paths start with a '/'
        url = url.startsWith('/') ? url : '/' + url;
        thumbnailUrl = thumbnailUrl.startsWith('/') ? thumbnailUrl : '/' + thumbnailUrl;

        console.log('Video URL:', url);
        console.log('Thumbnail URL:', thumbnailUrl);

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
    console.log("getusersvcont");
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
        console.log('Request body:', req.body);
        console.log("User Name:", userName);
        console.log("Video ID:", videoId);
        console.log("Title:", title);
        console.log("Description:", description);

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

        console.log("Updated Video:", updatedVideo);

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
            console.log(id);
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
    const newLikes = req.body.likes; // Get new likes count from request body
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
        const video = await videoServices.getVideoById(req.params.videoId);
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }
        res.json(video);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch video' });
    }
}

export default {
    getVideos,
    getUserVideos,
    editVideo,
    createVideo,
    deleteVideo,
    updateVideoLikes,
    getVideoById
};