import User from '../models/user.js'; 

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
