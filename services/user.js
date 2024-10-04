import User from '../models/user.js';
import fs from 'fs';
import path from 'path';

export async function getUser(userName) {
    return await User.findOne({ userName: userName });
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
    try {
        // Find the user by username
        const user = await User.findOne({ userName: userName });

        if (!user) {
            throw new Error('User not found'); // Throw error if user doesn't exist
        }

        // Delete the user from the database
        await User.findOneAndDelete({ userName: userName });

        // If there is a profile picture, delete it from the server
        if (user.profilePicture) {
            const profilePicturePath = path.join('public', user.profilePicture); // Build the path for the profile picture
            if (fs.existsSync(profilePicturePath)) {
                fs.unlinkSync(profilePicturePath); // Delete the file
                console.log(`Successfully deleted profile picture: ${profilePicturePath}`);
            } else {
                console.log(`Profile picture does not exist: ${profilePicturePath}`); // Log if the file doesn't exist
            }
        }

        console.log('User deleted successfully'); // Log success
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Failed to delete user'); // Throw error if deletion fails
    }
}

export async function updateUser(userName, firstName, lastName, password, profilePicture) {
    try {
        console.log(`updateUser called with: userName=${userName}, firstName=${firstName}, lastName=${lastName}, password=${password}`);
        
        // Find the user by username
        const existingUser = await User.findOne({ userName: userName });
        
        if (!existingUser) {
            console.log('User not found');
            throw new Error('User not found');
        }

        console.log('User found:', existingUser);

        // Update fields, using previous values if new ones are not provided
        existingUser.firstName = firstName !== undefined ? firstName : existingUser.firstName;
        existingUser.lastName = lastName !== undefined ? lastName : existingUser.lastName;
        existingUser.password = password !== undefined ? password : existingUser.password;

        // Handle profile picture upload (if a new file is provided)
        if (profilePicture && profilePicture.path) {  // בדיקה אם יש קובץ תמונה והאם יש מאפיין path
            console.log('Profile picture received:', profilePicture.path);
            existingUser.profilePicture = '/' + profilePicture.path.replace(/\\/g, '/').replace(/^public[\/]/, '');
            console.log('Updating profile picture');
        }

        // Save the updated user to the database
        await existingUser.save();
        console.log('User updated successfully:', existingUser);

        return existingUser;  // Return the updated user
    } catch (error) {
        console.error('Failed to update user:', error);
        throw new Error('Failed to update user');
    }
}


export default {
    getUser,
    createUser,
    deleteUser,
    updateUser
};
