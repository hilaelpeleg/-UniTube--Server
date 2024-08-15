import express from 'express';
import { getCommentsByVideoId, addComment, editComment, deleteComment } from '../controllers/comment.js';

const router = express.Router();

// Get all comments for a specific video
router.get('/:videoId', getCommentsByVideoId);

// Add a new comment to a specific video
router.post('/:videoId', addComment);

// Edit a comment by its ID
router.put('/:commentId', editComment);

// Delete a comment by its ID
router.delete('/:commentId', deleteComment);

export default router;
