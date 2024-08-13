import express from 'express';
import userController from '../controllers/user.js';

const router = express.Router();

router.get('/user', userController.getUser);
router.get('/users', userController.getAllUsers);
router.post('/user',userController.createUser);

export default router;
