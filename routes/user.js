import express from 'express';
import userController from '../controllers/user.js';
import videoController from '../controllers/video.js';
import { validateToken } from '../models/token.js';
import multer from 'multer';

const router = express.Router();

router.post('/', userController.createUser);
router.get('/:id', userController.getUser);
router.put('/:id', validateToken, userController.updateUser);
router.delete('/:id', validateToken, userController.deleteUser);

router.get('/:id/videos/:pid', validateToken, videoController.getVideoById);
router.put('/:id/videos/:pid', validateToken, videoController.editVideo);
router.delete('/:id/videos/:pid', validateToken, videoController.deleteVideo);

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Set destination based on the field name
        if (file.fieldname === 'url') {
            cb(null, 'public/videos'); // Set destination for videos
        } else if (file.fieldname === 'thumbnailUrl') {
            cb(null, 'public/thumbnailUrl'); // Set destination for thumbnailUrl
        }
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Save file with original name
    }
});

const upload = multer({ storage: storage }); // Create multer instance

// Create video route
router.post('/:id/videos', validateToken, upload.fields([{ name: 'url', maxCount: 1 }, { name: 'thumbnailUrl', maxCount: 1 }]), videoController.createVideo);
router.get('/:id/videos', videoController.getUserVideos);


export default router;
