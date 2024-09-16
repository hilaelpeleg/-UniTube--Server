import express from 'express';
import * as tokenController from '../controllers/tokenController.js';
import * as tokenModel from '../models/token.js';

const router = express.Router();

// Login route to generate token
router.post('/login', tokenController.processLogin);

// Protected route, requires a valid token to access user information
router.get('/user', tokenModel.isLoggedIn, (req, res) => {
    res.json({ message: `Hello, ${req.user.username}` });
});

export default router;
