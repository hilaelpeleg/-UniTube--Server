import videoServices from '../services/video.js';

export async function getVideos(req, res) {
    try {
        const videos = await videoServices.getAllVideos();
        res.json(videos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
}

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

export async function getUserVideos(req, res) {
    try {
        const videos = await videoServices.getUserVideos(req.params.user_name);
        res.json(videos);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user videos' });
    }
}

export async function editVideo(req, res) {
    try {
        const updatedVideo = await videoServices.editVideo(req.params.user_name, req.params.videoId, req.body.title, req.body.description, req.body.url, req.body.thumbnailUrl);
        if (!updatedVideo) {
            return res.status(404).json({ error: 'Video not found or failed to update' });
        }
        res.json(updatedVideo);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update video' });
    }
}

export async function createVideo(req, res) {
    try {
        const video = await videoServices.createVideo(req.body.user_name, req.body.title, req.body.description, req.body.url, req.body.thumbnailUrl, req.body.uploadDate, req.body.duration);
        if (!video) {
            return res.status(400).json({ error: 'Failed to create video' });
        }
        res.status(201).json(video);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create video' });
    }
}

export async function deleteVideo(req, res) {
    try {
        const success = await videoServices.deleteVideo(req.params.user_name, req.params.videoId);
        if (!success) {
            return res.status(404).json({ error: 'Video not found or failed to delete' });
        }
        res.status(200).json({ message: 'Video deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete video' });
    }
}

export default {
    getVideos,
    getVideoById,
    getUserVideos,
    editVideo,
    createVideo,
    deleteVideo
};