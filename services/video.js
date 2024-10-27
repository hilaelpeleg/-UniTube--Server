import Video from '../models/video.js';
import User from '../models/user.js';
import Comment from '../models/comment.js';
import fs from 'fs';
import path from 'path';
import net from 'net';
import customENV from 'custom-env';

// Set the environment explicitly if not already set
process.env.NODE_ENV = process.env.NODE_ENV || 'local';

// Load environment variables
customENV.env(process.env.NODE_ENV, "./config");


export async function createVideoInService(videoId, userName, title, description, url, thumbnailUrl, uploadDate, duration, profilePicture) {
    try {
        const newVideo = new Video({
            id: videoId,  // Ensure the ID is being set
            uploader: userName,
            title,
            description,
            url,
            thumbnailUrl,
            uploadDate,
            duration,
            likes: 0, // Initialize likes to 0
            disLikes: 0, // Initialize dislikes to 0
            likesList: [], // Initialize likes list as an empty array
            dislikesList: [], // Initialize likes to 0
            profilePicture,
            views: 0,
        });

        // Save the video and update the user
        const savedVideo = await newVideo.save();
        await User.findOneAndUpdate({ userName }, { $push: { videos: savedVideo._id } });
        return savedVideo;
    } catch (error) {
        console.error("Error creating video:", error);
        return null;
    }
}

export async function incrementViewsById(videoId) {
    try {
        // Increment the views for the video with the given ID
        return await Video.findOneAndUpdate(
            { id: videoId }, // Search by your ID
            { $inc: { views: 1 } }, // Increment the views field by 1
            { new: true } // Return the updated document
        );
    } catch (error) {
        console.error('Error updating views:', error);
        throw error; // Throw the error to be handled in the controller
    }
}

export async function deleteVideo(userName, videoId) {
    try {
        const numericVideoId = Number(videoId);
        console.log('Numeric Video ID:', numericVideoId);

        // Find the video by its numeric ID
        const video = await Video.findOne({ id: numericVideoId });
        console.log('Video found:', video);

        // Check if the video exists
        if (!video) {
            return false;
        }

        // Check if the uploader is the user requesting deletion
        if (video.uploader !== userName) {
            return false;
        }

        // Delete the video from the database
        await Video.findOneAndDelete({ id: numericVideoId });

        // Delete comments associated with the video directly using videoId
        await Comment.deleteMany({ videoId: numericVideoId }); // Assuming 'videoId' is the field in your comment schema

        // Define the paths for the video and thumbnail files
        const videoFilePath = path.join('public', video.url);
        const thumbnailFilePath = path.join('public', video.thumbnailUrl);

        // Check if the video file exists and delete it
        if (fs.existsSync(videoFilePath)) {
            fs.unlinkSync(videoFilePath);
            console.log(`Successfully deleted video file: ${videoFilePath}`);
        } else {
            console.log(`Video file does not exist: ${videoFilePath}`);
        }

        // Check if the thumbnail file exists and delete it
        if (fs.existsSync(thumbnailFilePath)) {
            fs.unlinkSync(thumbnailFilePath);
            console.log(`Successfully deleted thumbnail file: ${thumbnailFilePath}`);
        } else {
            console.log(`Thumbnail file does not exist: ${thumbnailFilePath}`);
        }

        return true;
    } catch (error) {
        console.error('Error deleting video:', error);
        return false;
    }
}

export async function editVideo(userName, videoId, updatedTitle, updatedDescription, files, existingVideo) {
    try {
        const numericVideoId = Number(videoId); // Convert to number
        // Since you already received the video through existingVideo, there's no need to fetch it again

        if (!existingVideo || existingVideo.uploader !== userName) {
            return null; // Video not found or not authorized
        }
        console.log("updatedTitle", updatedTitle);
        console.log("updatedDescription", updatedDescription);
        // Update fields, using previous values if new ones are not provided
        existingVideo.title = updatedTitle !== undefined ? updatedTitle : existingVideo.title;
        existingVideo.description = updatedDescription !== undefined ? updatedDescription : existingVideo.description;

        // Handle file uploads (if new files are provided)
        if (files) {
            if (files.url) {
                // Update the video path, replacing backslashes and removing 'public/' prefix, and add leading slash
                existingVideo.url = '/' + files.url[0].path.replace(/\\/g, '/').replace(/^public[\/]/, '');
            }
            if (files.thumbnailUrl) {
                // Update the thumbnail path, replacing backslashes and removing 'public/' prefix, and add leading slash
                existingVideo.thumbnailUrl = '/' + files.thumbnailUrl[0].path.replace(/\\/g, '/').replace(/^public[\/]/, '');
            }
        }

        await existingVideo.save(); // Save changes to the database
        return existingVideo; // Return the updated video
    } catch (error) {
        console.log('Error in updating video:', error);
        return null; // Handle error
    }
}

export async function getVideoById(videoId) {
    try {
        // Convert the ID to a number
        const numericVideoId = Number(videoId);

        // Search for the video by ID
        const video = await Video.findOne({ id: numericVideoId });

        // Check if the video was found
        if (!video) {
            return { code: 404, error: "Video not found!" };
        }
        return video;  // Return the video if everything is okay
    } catch (error) {
        console.log('Error fetching video:', error);
        return { code: 500, error: "Failed to fetch video" };
    }
}

export async function getUserVideos(userName) {
    try {
        // Find videos by uploader's name
        const videos = await Video.find({ uploader: userName });

        // If no videos are found, return a 404 error
        if (!videos || videos.length === 0) {
            return { code: 404, error: "No videos found for this user" };
        }

        // Return the user's videos
        return videos;
    } catch (error) {
        // Log the error and return a 500 internal server error
        console.error("Error fetching user videos:", error);
        return { code: 500, error: "Failed to fetch user videos" };
    }
}

export async function getAllVideos() {
    try {
        const videos = await Video.find({});
        // console.log("Videos from MongoDB: ", videos);
        return videos;
    } catch (error) {
        console.error("Error fetching videos:", error);
        throw new Error("Failed to fetch videos");
    }
}

export async function getTopViewedVideos(excludedVideoID) {
    try {
         // Fetch the top 10 most viewed videos from your data source (e.g., database, cache)
         const topViewedVideos = await Video.find({ id: { $ne: excludedVideoID } }) // Exclude the video with excludedVideoID
         .sort({ viewCount: -1 })
         .limit(10);
        // Print the selected videos
        console.log('Top viewed videos fetched:', topViewedVideos);

        return topViewedVideos;
    } catch (error) {
        console.error('Error fetching top viewed videos:', error);
        throw error;
    }
}

// Function to get recommended videos
export const getRecommendedVideos = async (username, videoId) => {

    return new Promise((resolve, reject) => {
        const socketPort = process.env.SOCKET_PORT || 5555; // Use SOCKET_PORT from environment or default to 5555
        const virtualMachineIp = process.env.VIRTUAL_MACHINE_IP || '127.0.0.1'; // Use VIRTUAL_MACHINE_IP or default to local IP

        // Create a connection to the C++ server
        const client = net.createConnection({ port: socketPort, host: virtualMachineIp }, () => {
            console.log('Connected to C++ server');
            const message = `recommend:${username}:${videoId}`;
            client.write(message);  // Send the request to the C++ server
            console.log('Sending request to C++ server:', message);
        });

        // Handle data received from the server
        client.on('data', async (data) => {
            console.log('Received from server:', data.toString());
            const responseString = data.toString().trim();

            let recommendedVideoIds;
            try {
                recommendedVideoIds = JSON.parse(responseString); // Parse the string from the C++ server
            } catch (error) {
                console.error('Error parsing server response:', error);
                return reject(new Error('Failed to parse server response'));
            }

            // Convert the IDs to numbers
            recommendedVideoIds = recommendedVideoIds.map(id => Number(id)); 
            
            // Print the IDs and their types to verify they are numbers
            recommendedVideoIds.forEach(id => {
                console.log(`ID received from C++ server: ${id}, type: ${typeof id}`);
            });

            // If there are not enough recommended videos, fetch random ones from MongoDB
            if (!recommendedVideoIds || recommendedVideoIds.length < 6) {
                console.log('Not enough recommended videos, fetching random videos from MongoDB');
                const randomVideos = await getRandomVideos(10 - recommendedVideoIds.length); // השלמת רשימה ל-10 סרטונים
                recommendedVideoIds = [...recommendedVideoIds, ...randomVideos.map(video => video.id)];
            }

            // Limit the list to a maximum of 10 videos
            recommendedVideoIds = recommendedVideoIds.slice(0, 10);

            // Get the video details based on the IDs
            console.log("please work", recommendedVideoIds);
            const videoDetails = await getVideoDetails(recommendedVideoIds); 
            resolve(videoDetails);  // Return the video details to the client
            client.end();
        });

        client.on('error', (err) => {
            console.error('Error connecting to C++ server:', err);
            reject(err);
        });

        client.on('end', () => {
            console.log('Disconnected from C++ server');
        });
    });
};

// Function to fetch random videos from the MongoDB database
export const getRandomVideos = async (limit) => {
    try {
        console.log(`Fetching ${limit} random videos from MongoDB`);
        const randomVideos = await Video.aggregate([{ $sample: { size: limit } }]); // Fetch random videos using MongoDB's $sample aggregation
        console.log('Fetched random videos:', randomVideos);
        return randomVideos;  // Return the fetched random videos
    } catch (error) {
        console.error('Error fetching random videos:', error);
        throw new Error('Failed to fetch random videos');
    }
};

// Function to fetch video details based on video IDs
export const getVideoDetails = async (videoIds) => {
    try {
        console.log('Fetching video details for IDs:', videoIds);
        // Ensure that the `videoIds` are converted to numbers in the query
        const videos = await Video.find({ id: { $in: videoIds.map(id => Number(id)) } });  // Convert video IDs to numbers in the query
        console.log('Fetched videos:', videos);
        return videos; // Return the fetched video details
    } catch (error) {
        console.error('Error fetching video details:', error);
        throw new Error('Failed to fetch video details');
    }
};

// Service function to update video likes
export const updateLikesById = async (videoId, newLikes) => {
    try {
        const video = await Video.findOneAndUpdate({ id: videoId }, { likes: newLikes }, { new: true }); // Update video likes
        return video; // Return updated video
    } catch (error) {
        throw new Error('Could not update likes'); // Throw an error if update fails
    }
};

export async function toggleLike(videoId, userName) {
    try {
      const video = await Video.findOne({ id: Number(videoId) });
      if (!video) {
        return { code: 404, error: "Video not found!" };
      }
  
      const userIndex = video.likesList.indexOf(userName);
      if (userIndex > -1) {
        // User has already liked, so remove the like
        video.likesList.splice(userIndex, 1);
        video.likes--;
      } else {
        // User hasn't liked, so add the like
        video.likesList.push(userName);
        video.likes++;
        // Remove from dislikes if present
        const dislikeIndex = video.dislikesList.indexOf(userName);
        if (dislikeIndex > -1) {
          video.dislikesList.splice(dislikeIndex, 1);
          video.dislikes--;
        }
      }
  
      await video.save();
      return video;
    } catch (error) {
      console.error("Error toggling like:", error);
      return { code: 500, error: "Failed to toggle like" };
    }
}
  
export async function toggleDislike(videoId, userName) {
    try {
        const numericVideoId = Number(videoId);

        const video = await Video.findOne({ id: numericVideoId });
        if (!video) {
            console.log("Video not found with ID:", numericVideoId);
            return { code: 404, error: "Video not found!" };
        }

        const userIndex = video.dislikesList.indexOf(userName);
        if (userIndex > -1) {
            // User has already disliked, so remove the dislike
            video.dislikesList.splice(userIndex, 1);
            video.disLikes--;
        } else {
            // User hasn't disliked, so add the dislike
            video.dislikesList.push(userName);
            video.disLikes++;
            // Remove from likes if present
            const likeIndex = video.likesList.indexOf(userName);
            if (likeIndex > -1) {
                video.likesList.splice(likeIndex, 1);
                video.likes--;
            }
        }

        await video.save();
        console.log("Video saved successfully with updated dislikes and likes.");
        return video;
    } catch (error) {
        console.error("Error toggling dislike:", error);
        return { code: 500, error: "Failed to toggle dislike" };
    }
}

export async function updateVideosProfilePicture(userName, profilePicture) {
    try {
        // Find all videos by the user before the update
        const videosBeforeUpdate = await Video.find({ uploader: userName });

        // Update the profile picture field
        const updateResult = await Video.updateMany(
            { uploader: userName }, // Find all videos by the user
            { $set: { profilePicture: profilePicture } } // Update the profile picture field
        );

        // Check if any videos were updated
        if (updateResult.modifiedCount > 0) {
            console.log(`Updated profile picture for all videos uploaded by user: ${userName}`);
        } else {
            console.log(`No videos were updated for user: ${userName}`);
        }

        // Find all videos by the user after the update
        const videosAfterUpdate = await Video.find({ uploader: userName });
        
    } catch (error) {
        console.error('Failed to update videos profile picture:', error);
    }
}

export async function deleteVideosByUser(userName) {
    try {
        // Get all videos by the user
        const videos = await Video.find({ uploader: userName });

        // Delete each video by calling the deleteVideo function
        for (const video of videos) {
            const success = await deleteVideo(userName, video.id);
            if (!success) {
                console.error(`Failed to delete video with ID: ${video.id}`);
            }
        }
    } catch (error) {
        console.error('Failed to delete videos:', error);
        throw error;
    }
}

// Service function to update video duration in the database
export async function updateVideoDurationInService(videoId, duration) {
    try {
        // Convert the videoId to a number
        const numericVideoId = Number(videoId); // Ensure videoId is treated as a number

        // Find the video by its numeric id and update its duration
        const updatedVideo = await Video.findOneAndUpdate(
            { id: numericVideoId }, // Find the video by the custom 'id' field (number)
            { duration },            // Update the duration
            { new: true }            // Return the updated document after update
        );

        return updatedVideo; // Return the updated video object
    } catch (error) {
        console.error('Error updating video duration in service:', error);
        throw new Error('Failed to update video duration in DB');
    }
}

export default {
    getAllVideos,
    createVideoInService,
    deleteVideo,
    editVideo,
    getVideoById,
    getUserVideos,
    updateLikesById,
    incrementViewsById,
    toggleLike,
    toggleDislike,
    updateVideosProfilePicture,
    deleteVideosByUser,
    updateVideoDurationInService,
    getRecommendedVideos,
    getVideoDetails,
    getRandomVideos,
    getTopViewedVideos
};