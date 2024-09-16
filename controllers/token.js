import * as userService from '../services/userService.js';
import { generateToken } from '../models/tokenModel.js';

// Process login and return a token
export async function processLogin(req, res) {
    const { userName, password } = req.body;
    const user = await userService.getUser(userName);

    // If user exists and the password matches
    if (user && user.password === password) {  // Simple password check (improve by hashing passwords)
        const token = generateToken(user);  // Generate JWT token for the user
        res.status(200).json({ token });  // Send the token as response
    } else {
        res.status(404).json({ error: 'Invalid username or password' });
    }
}

export default {
    processLogin
};
