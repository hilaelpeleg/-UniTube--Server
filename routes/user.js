import express from 'express';
import userController from '../controllers/user.js';
import videoController from '../controllers/video.js';
import { validateToken } from '../models/token.js';

const router = express.Router();

router.get('/:id',userController.getUser);
router.put('/:id',userController.);
router.delete('/:id', userController.deleteUser);
router.delete('/:id/videos/:pid', validateToken, videoController.deleteVideo);


export default router;
