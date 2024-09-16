import jwt from 'jsonwebtoken';
const key = 'secretpassphrase';

// Generate a token for the user
export function getToken(user) {
    const data = { username: user.username };
    const token = jwt.sign(data, key); // No expiration time set
    return token;
}

// Middleware to validate the token
export function isLoggedIn(req, res, next) {
    const token = req.headers.authorization;
    if (token) {
        try {
            const data = jwt.verify(token, key);
            req.user = data;
            next(); // Proceed if the token is valid
        } catch (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
    } else {
        return res.status(403).json({ error: 'Token required' });
    }
}
