import * as userService from '../services/user.js';
import * as tokenModel from '../models/token.js';

// Handle login and token generation
export async function processLogin(req, res) {
    const { userName, password } = req.body;
    
    if (await userService.isSigned(userName, password)) {
        const token = tokenModel.getToken({ username: userName });
        return res.status(201).json({ token });
    } else {
        return res.status(401).json({ error: 'Invalid username or password' });
    }
}
