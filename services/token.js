import User from '../models/user.js'; // Assuming you have a User model (mongoose or any other ORM)

// Check if the user exists and the password is correct
export async function isSigned(userName, password) {
    const user = await User.findOne({ userName });
    if (user && user.password === password) {
        return true;
    }
    return false;
}

export async function getUser(userName) {
    return await User.findOne({ userName });
}
