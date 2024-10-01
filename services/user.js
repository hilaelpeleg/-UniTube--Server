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
    getUser,
    createUser,
    deleteUser,
    updateUser
};
