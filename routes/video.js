import videoController from '../controllers/video.js';
import express from 'express';
const router = express.Router();

router.get('/all', videoController.getVideos);
router.get('/:videoId', videoController.getVideoById);
router.get('/user/:user_name', videoController.getUserVideos);
router.put('/:user_name/:videoId', videoController.editVideo);
router.post('/', videoController.createVideo);
router.delete('/:user_name/:videoId', videoController.deleteVideo);

export default router;
