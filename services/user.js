import User from '../models/user.js';

export async function getUsers() {
    return await User.find({});
}

export async function getUser(userName) {
    return await User.findOne({userName: userName});
}

export async function createUser(userName, firstName, lastName, password, profilePicture) {
    const newUser = new User({
        userName: userName,
        firstName: firstName,
        lastName: lastName,
        password: password,
        profilePicture: profilePicture
    });
    return await newUser.save();
}

// Delete a user by username
export async function deleteUser(userName) {
    return await User.findOneAndDelete({ userName: userName });
}

export async function updateUser(userName, firstName, lastName, password, profilePicture) {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { userName },  // חיפוש לפי userName
            { firstName, lastName, password, profilePicture },  // שדות לעדכון
            { new: true }  // מחזיר את המסמך המעודכן
        );

        return updatedUser;
    } catch (error) {
        throw new Error('Failed to update user');
    }
}
export default {
    getUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser
};
