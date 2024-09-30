import Video from '../models/video.js';
import User from '../models/user.js';
import Comment from '../models/comment.js';
import fs from 'fs';
import path from 'path';

export async function createVideoInService(videoId, userName, title, description, url, thumbnailUrl, uploadDate, duration, profilePicture) {
    console.log("video service");
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
            comments: [], // Initialize comments as an empty array
            profilePicture
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
        const numericVideoId = Number(videoId);
        console.log('Numeric Video ID:', numericVideoId);

        const video = await Video.findOne({ id: numericVideoId }).populate('comments');
        console.log('Video found:', video);

        if (!video) {
            return false;
        }

        if (video.uploader !== userName) {
            return false;
        }

        await Video.findOneAndDelete({ id: numericVideoId });

        const commentIds = video.comments.map(comment => comment._id);
        await Comment.deleteMany({ _id: { $in: commentIds } });

        const videoFilePath = path.join('public', video.url);
        const thumbnailFilePath = path.join('public', video.thumbnailUrl);

        if (fs.existsSync(videoFilePath)) {
            fs.unlinkSync(videoFilePath);
            console.log(`Successfully deleted video file: ${videoFilePath}`);
        } else {
            console.log(`Video file does not exist: ${videoFilePath}`);
        }

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
    createVideoInService,
    deleteVideo,
    editVideo,
    getVideoById,
    getUserVideos,
    updateLikesById
};