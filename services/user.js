import User from '../models/user.js';

export async function getUsers() {
    return await User.find({});
}

export async function getUser(userName) {
    return await User.findOne({ user_name: userName });
}


export async function createUser(userName, firstName, lastName, password, profilePicture) {
    const newUser = new User({
        user_name: userName,
        first_name: firstName,
        last_name: lastName,
        password: password,
        profilePicture: profilePicture
    });
    return await newUser.save();
}

// Delete a user by username
export async function deleteUser(userName) {
    return await User.findOneAndDelete({ user_name: userName });
}

export default {
    getUsers,
    getUser,
    createUser,
    deleteUser
};
