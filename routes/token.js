import express from 'express';
import { processLogin } from '../controllers/TokenController.js';

const router = express.Router();

// Route to handle login and token generation
router.post('/', processLogin);

export default router;
