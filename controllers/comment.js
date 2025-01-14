import commentServices from '../services/comment.js';

export async function getComments(req, res) {
    try {
        const comments = await commentServices.getCommentsByVideoId(req.params.id); // Fetch comments by video ID
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
}

export async function createComment(req, res) {
    try {
        const newComment = await commentServices.createComment(req.params.id, req.body); // Create a new comment
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create comment' });
    }
}

export async function updateComment(req, res) {
    console.log("doyomami");
    try {
        const updatedComment = await commentServices.updateComment(req.params.id, req.body); // Update comment by ID
        if (!updatedComment) {
            return res.status(404).json({ error: 'Comment not found' });
        }
        res.json(updatedComment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update comment' });
    }
}

export async function deleteComment(req, res) {
    try {
        const success = await commentServices.deleteComment(req.params.id); // Delete comment by ID
        if (!success) {
            return res.status(404).json({ error: 'Comment not found or failed to delete' });
        }
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete comment' });
    }
}

export default {
    getComments,
    createComment,
    updateComment,
    deleteComment,
};