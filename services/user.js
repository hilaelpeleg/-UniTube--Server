import User from '../models/user.js';

export async function getUser(userName) {
    return await User.findOne({userName: userName});
}

export async function createUser(userName, firstName, lastName, password, profilePicture) {
    try {
               // Create a new user object
        const newUser = new User({
            userName,
            firstName,
            lastName,
            password, // Make sure to hash the password before saving
            profilePicture,
        });

        // Save the new user to the database
        await newUser.save();
        return newUser; // Return the created user data
    } catch (error) {
        console.error('Error saving user:', error);
        throw new Error('Failed to create user');
    }
}

export const checkUserNameExists = async (userName) => {
    const user = await User.findOne({ userName });
    return !!user;
  };

// Delete a user by username
export async function deleteUser(userName) {
    return await User.findOneAndDelete({ userName: userName });
}

// Update a user by username
export async function updateUser(userName, updatedData) {
    const user = await User.findOneAndUpdate({ userName: userName }, updatedData, {
        new: true, // Return the updated document
        runValidators: true // Ensure schema validation runs on update
    });

    return user;
}

export default {
    getUser,
    createUser,
    checkUserNameExists,
    deleteUser,
    updateUser
};
