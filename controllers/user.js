import * as userService from '../services/user.js';
import * as commentService from '../services/comment.js';
import * as videoService from '../services/video.js';
import path from 'path';

export async function getUser(req, res) {
    try {
        const user = await userService.getUser(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
}

// Controller function to create a user
export async function createUser(req, res) {
    try {
        // Get the fields from the request body
        const { userName, firstName, lastName, password } = req.body;

        // Check if the user already exists
        const existingUser = await userService.getUser(userName);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Get the profile picture file from req.file, or use the default profile picture
        const profilePicture = req.file
            ? '/' + req.file.path.replace(/^public[\\/]/, '').replace(/\\/g, '/')
            : '/profiles/default_profile_picture.png';  // Default picture if none is uploaded


        // Create a new user using the user service
        const newUser = await userService.createUser(userName, firstName, lastName, password, profilePicture);

        // Respond with the created user data
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
}

export async function deleteUser(req, res) {
    try {
        const userName = req.params.id;
        const user = await userService.getUser(userName); // Check if the user exists first
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Delete the user's comments
        await commentService.deleteCommentsByUser(userName);

        // Delete the user's videos
        await videoService.deleteVideosByUser(userName);

        // Delete the user
        await userService.deleteUser(userName);
        res.status(200).json({ message: 'User and related data deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
}

export async function updateUser(req, res) {
    try {
        console.log('Update user called');

        // Extract the userName from the request parameters
        const userName = req.params.id;
        console.log(`User name received: ${userName}`);

        // Extract other fields from request body
        const { firstName, lastName, password } = req.body;
        console.log(`Received body: firstName=${firstName}, lastName=${lastName}, password=${password}`);

        // Get the profile picture file from req.file
        const profilePicture = req.file ? '/' + req.file.path.replace(/^public[\\/]/, '').replace(/\\/g, '/') : null;
        console.log(`Profile picture path: ${profilePicture}`);

        // Fetch the user from the database
        const user = await userService.getUser(userName);
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ error: 'User not found' });
        }
        console.log('User found:', user);

        // Store path to the old profile picture file
        const oldPicFilePath = path.join('public', user.profilePicture);
        console.log(`Old profile picture path: ${oldPicFilePath}`);

        // Update user information in the database
        const updatedUser = await userService.updateUser(user.userName, firstName, lastName, password, profilePicture);
        if (!updatedUser) {
            console.log('Failed to update user in the database');
            return res.status(404).json({ error: 'User not found' });
        }
        console.log('User updated:', updatedUser);

        // Update the profile picture in all comments made by this user
        if (profilePicture) {
            await commentService.updateCommentsWithProfilePicture(user.userName, profilePicture);
            // Update the profile picture in all videos uploaded by this user
            await videoService.updateVideosProfilePicture(user.userName, profilePicture);
        }

        // Respond with the updated user details
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error occurred:', error);  // Log the actual error
        res.status(500).json({ error: 'Failed to update user' });
    }
}

export default {
    getUser,
    createUser,
    deleteUser,
    updateUser,
};