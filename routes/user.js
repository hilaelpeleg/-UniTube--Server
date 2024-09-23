import express from 'express';
import userController from '../controllers/user.js';
import videoController from '../controllers/video.js';
import { validateToken } from '../models/token.js';

const router = express.Router();

// router.get('/user', userController.getUser);
router.get('/users', userController.getAllUsers);
router.post('/user',userController.createUser);
router.delete('/:userName', userController.deleteUser);
router.get('/:userName',userController.getUser);
router.delete('/:id/videos/:pid', validateToken, videoController.deleteVideo);


export default router;
