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
        // Call the service to get videos by uploader's name
        const videos = await videoServices.getUserVideos(req.params.userName);
        res.json(videos); // Send back the videos in the response
    } catch (error) {
        // Handle errors and send back a failure response
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

export async function addCommentToVideo(videoId, commentData) {
    try {
        const video = await Video.findOne({ id: videoId });
        if (!video) {
            throw new Error('Video not found');
        }

        const newCommentId = video.comments.length + 1; // יצירת id חדש לתגובה
        const newComment = {
            id: newCommentId,
            ...commentData
        };

        video.comments.push(newComment);
        await video.save();

        return video;
    } catch (error) {
        console.error("Error adding comment:", error);
        throw error;
    }
}

export default {
    getVideos,
    getVideoById,
    getUserVideos,
    editVideo,
    createVideo,
    deleteVideo,
    addCommentToVideo,
};