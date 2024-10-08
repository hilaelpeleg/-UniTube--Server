import express from 'express';
import { getComments, createComment, updateComment, deleteComment } from '../controllers/comment.js';
import { validateToken } from '../models/token.js';

const router = express.Router();

// Get all comments for a specific video
router.get('/:id', getComments);

// Add a new comment to a specific video
router.post('/:id', validateToken, createComment);

// Edit a comment by its ID
router.put('/:id', validateToken, updateComment);

// Delete a comment by its ID
router.delete('/:id', validateToken, deleteComment);


export default router;