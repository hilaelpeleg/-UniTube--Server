import express from 'express';
import userController from '../controllers/user.js';

const router = express.Router();

router.get('/user', userController.getUser);
router.get('/users', userController.getAllUsers);
router.post('/user',userController.createUser);
router.delete('/users/:userName', userController.deleteUser);

export default router;
