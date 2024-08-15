import express from 'express';
import { getComments, createComment, updateComment, deleteComment } from '../controllers/comment.js';

const router = express.Router();

// Get all comments for a specific video
router.get('/:videoId', getComments);

// Add a new comment to a specific video
router.post('/:videoId', createComment);

// Edit a comment by its ID
router.put('/:commentId', updateComment);

// Delete a comment by its ID
router.delete('/:commentId', deleteComment);

export default router;
