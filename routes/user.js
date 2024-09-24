import express from 'express';
import userController from '../controllers/user.js';
import { validateToken } from '../models/token.js';

const router = express.Router();

router.post('/', userController.createUser);

router.get('/:id',userController.getUser);
router.put('/:id',validateToken, userController.updateUser);
router.delete('/:id',validateToken, userController.deleteUser);



export default router;
 