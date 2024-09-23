import Video from '../models/video.js';
import User from '../models/user.js';
import Comment from '../models/comment.js';

export async function createVideo(userName, title, description, url, thumbnailUrl, uploadDate, duration) {
    try {
        const lastVideo = await Video.findOne().sort({ id: -1 });
        const newId = lastVideo ? lastVideo.id + 1 : 1;

        let video = new Video({
            id: newId,
            userName, 
            title, 
            description, 
            url, 
            thumbnailUrl, 
            uploadDate, 
            duration
        });

        if (await addVideo(userName, video)) {
            return await video.save();
        }
        return null;
    } catch (error) {
        console.error("Error creating video:", error);
        return null;
    }
}

export async function addVideo(user_name, video) {
    try {
        const user = await User.findOne({ user_name });
        if (user) {
            user.videos.push(video._id);
            await user.save();
            return true;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function removeVideo(user_name, videoId) {
    try {
        await User.updateOne(
            { user_name },
            { $pull: { videos: videoId } }
        );
        return true;
    } catch (error) {
        console.log(error);
        return false;
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


export async function editVideo(user_name, videoId, updatedTitle, updatedDescription, updatedVideoUrl, updatedThumbnailUrl) {
    try {
        const video = await Video.findById(videoId);
        if (!video || video.user_name !== user_name) {
            return { code: 404, error: "Video not found!" };
        }

        if (updatedTitle) video.title = updatedTitle;
        if (updatedDescription) video.description = updatedDescription;
        if (updatedVideoUrl) video.url = updatedVideoUrl;
        if (updatedThumbnailUrl) video.thumbnailUrl = updatedThumbnailUrl;

        await video.save();
        return video;
    } catch (error) {
        console.log(error);
        return { code: 500, error: "Failed to update video" };
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

export async function getUserVideos(user_name) {
    try {
        const user = await User.findOne({ user_name }).populate('videos');
        if (!user) {
            return { code: 404, error: "User not found!" };
        }

        return user.videos;
    } catch (error) {
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

export default {
    getAllVideos,
    createVideo,
    addVideo,
    removeVideo,
    deleteVideo,
    editVideo,
    getVideoById,
    getUserVideos,
};
