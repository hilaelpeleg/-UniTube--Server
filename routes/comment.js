import express from 'express';
import { getComments, createComment, updateComment, deleteComment } from '../controllers/comment.js';

const router = express.Router();

// Get all comments for a specific video
router.get('/:id', getComments);

// Add a new comment to a specific video
router.post('/:id', createComment);

// Edit a comment by its ID
router.put('/:id', updateComment);

// Delete a comment by its ID
router.delete('/:id', deleteComment);

export default router;
