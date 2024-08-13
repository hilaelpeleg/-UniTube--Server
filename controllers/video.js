const Video = require('../models/video'); // Import your Video model
const User = require('../models/user'); // Import your User model

// Get all videos for a specific user
async function getUserVideos(req, res) {
    try {
        const user_name = req.params.user_name;
        const user = await User.findOne({ user_name }).populate('videos');
        if (!user) {
            return res.status(404).json({ code: 404, error: "User not found!" });
        }

        const videos = user.videos.map(video => ({
            _id: video._id,
            user_name: video.user_name,
            title: video.title,
            description: video.description,
            thumbnailUrl: video.thumbnailUrl,
            publish_date: video.publish_date,
        }));

        res.json(videos);
    } catch (error) {
        console.error("Error fetching user videos:", error);
        res.status(500).json({ code: 500, error: "Failed to fetch user videos" });
    }
}

// Get a specific video by ID
async function getVideoById(req, res) {
    try {
        const videoId = req.params.videoId;
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ code: 404, error: "Video not found!" });
        }

        res.json({
            _id: video._id,
            user_name: video.user_name,
            title: video.title,
            description: video.description,
            url: video.url, // Include URL for playback if needed
            thumbnailUrl: video.thumbnailUrl,
            publish_date: video.publish_date,
        });
    } catch (error) {
        console.error("Error fetching video by ID:", error);
        res.status(500).json({ code: 500, error: "Failed to fetch video" });
    }
}

// Update a video
async function editVideo(req, res) {
    try {
        const videoId = req.params.videoId;
        const { title, description, url, thumbnailUrl } = req.body;

        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ code: 404, error: "Video not found!" });
        }

        if (title) video.title = title;
        if (description) video.description = description;
        if (url) video.url = url;
        if (thumbnailUrl) video.thumbnailUrl = thumbnailUrl;

        await video.save();

        res.json({
            _id: video._id,
            user_name: video.user_name,
            title: video.title,
            description: video.description,
            url: video.url,
            thumbnailUrl: video.thumbnailUrl,
            publish_date: video.publish_date,
        });
    } catch (error) {
        console.error("Error updating video:", error);
        res.status(500).json({ code: 500, error: "Failed to update video" });
    }
}

module.exports = {
    getUserVideos,
    getVideoById,
    editVideo,
};
