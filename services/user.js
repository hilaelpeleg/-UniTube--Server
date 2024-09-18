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

export const checkUserNameExists = async (userName) => {
    const user = await User.findOne({ userName });
    return !!user;
  };

// Delete a user by username
export async function deleteUser(userName) {
    return await User.findOneAndDelete({ user_name: userName });
}

export default {
    getUsers,
    getUser,
    createUser,
    checkUserNameExists,
    deleteUser
};
