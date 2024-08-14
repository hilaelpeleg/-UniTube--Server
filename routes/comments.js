import express from 'express';
import { getCommentsByVideoId, addComment, editComment, deleteComment } from '../controllers/comment.js';

const router = express.Router();

router.get('/:videoId', getCommentsByVideoId);
router.post('/', addComment);
router.put('/:commentId', editComment);
router.delete('/:commentId', deleteComment);

export default router;
