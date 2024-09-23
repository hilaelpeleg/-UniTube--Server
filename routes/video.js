import videoController from '../controllers/video.js';
import express from 'express';
const router = express.Router();

router.get('/', videoController.getVideos);
router.get('/:videoId', videoController.getVideoById);
router.get('/user/:user_name', videoController.getUserVideos);
router.put('/:user_name/:videoId', videoController.editVideo);
// router.post('/', videoController.createVideo);

export default router;
