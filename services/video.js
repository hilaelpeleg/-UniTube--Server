import Video from '../models/video.js';
import User from '../models/user.js';
import Comment from '../models/comment.js';

// export async function createVideo(userName, title, description, url, thumbnailUrl, uploadDate, duration) {
//     try {
//         const lastVideo = await Video.findOne().sort({ id: -1 });
//         const newId = lastVideo ? lastVideo.id + 1 : 1;

//         let video = new Video({
//             id: newId,
//             userName, 
//             title, 
//             description, 
//             url, 
//             thumbnailUrl, 
//             uploadDate, 
//             duration
//         });

//         if (await addVideo(userName, video)) {
//             return await video.save();
//         }
//         return null;
//     } catch (error) {
//         console.error("Error creating video:", error);
//         return null;
//     }
// }

export async function createVideo(userName, title, description, url, thumbnailUrl, uploadDate, duration) {
    try {
        const newVideo = new Video({
            userName,
            title,
            description,
            url,
            thumbnailUrl,
            uploadDate,
            duration
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

export async function deleteVideo(userName, videoId) {
    try {
        // Convert the videoId to a Number
        const numericVideoId = Number(videoId); // Ensure videoId is a number

        // Find the video by its numeric ID
        const video = await Video.findOne({ id: numericVideoId }).populate('comments');

        // Check if the video exists
        if (!video) {
            return false; // Video not found
        }

        // Ensure the logged-in user is the uploader
        if (video.uploader !== userName) {
            return false; // User is not authorized to delete this video
        }

        // Delete the video by its numeric ID
        await Video.findOneAndDelete({ id: numericVideoId });

        // Get the IDs of the comments associated with the video
        const commentIds = video.comments.map(comment => comment._id);

        // Delete all comments associated with the video
        await Comment.deleteMany({ _id: { $in: commentIds } });

        return true; // Deletion successful
    } catch (error) {
        console.error('Error deleting video:', error);
        return false; // Deletion failed
    }
}

export async function editVideo(userName, videoId, updatedTitle, updatedDescription, updatedVideoUrl) {
    try {
        const video = await Video.findById(videoId);
        if (!video || video.userName !== userName) {
            return null; // Video not found or not authorized
        }

        video.title = updatedTitle || video.title;
        video.description = updatedDescription || video.description;
        video.url = updatedVideoUrl || video.url;

        await video.save();
        return video;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function getVideoById(videoId) {
    try {
        const video = await Video.findById(videoId);
        if (!video) {
            return { code: 404, error: "Video not found!" };
        }
        return video;
    } catch (error) {
        console.log(error);
        return { code: 500, error: "Failed to fetch video" };
    }
}

export async function getUserVideos(userName) {
    try {
        // Find the user by username and populate their videos
        const user = await User.findOne({ userName }).populate('videos');
        
        // If the user is not found, return a 404 error
        if (!user) {
            return { code: 404, error: "User not found!" };
        }

        // Return the user's videos
        return user.videos;
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

// Service function to update video likes
export const updateLikesById = async (videoId, newLikes) => {
    try {
        const video = await Video.findOneAndUpdate({ id: videoId }, { likes: newLikes }, { new: true }); // Update video likes
        return video; // Return updated video
    } catch (error) {
        throw new Error('Could not update likes'); // Throw an error if update fails
    }
};

export default {
    getAllVideos,
    createVideo,
    deleteVideo,
    editVideo,
    getVideoById,
    getUserVideos,
    updateLikesById
};