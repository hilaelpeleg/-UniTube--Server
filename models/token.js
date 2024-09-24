import jwt from 'jsonwebtoken';
const key = process.env.JWT_SECRET || 'fallback_secret'; 

// Generate a token for the user
export function generateToken(user) {
    const data = { userName: user.userName };
    const token = jwt.sign(data, key); 
    return token;
}

// Middleware to validate the token
export function validateToken(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (token) {
        try {
            const data = jwt.verify(token, key); // Verify if the token is valid
            req.user = data; // Store the token data in request
            next(); // Continue if the token is valid
        } catch (err) {
            return res.status(401).json({ error: 'Invalid token' }); // Return an error if token is invalid
        }
    } else {
        return res.status(403).json({ error: 'Token required' }); // No token present
    }
}

export default {
    generateToken,
    validateToken
};