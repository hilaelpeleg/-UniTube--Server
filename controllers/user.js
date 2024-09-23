import * as userService from '../services/user.js';

export async function getAllUsers(req, res) {
    try {
        const users = await userService.getUsers();
        res.render('../views/user', { users });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}

export async function getUser(req, res) {
    try {
        const user = await userService.getUser(req.params.userName);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
}

export async function createUser(req, res) {
    try {
        const { userName, firstName, lastName, password, profilePicture } = req.body;

        // check if the userName already exist
        const userExists = await userService.checkUserNameExists(userName);
        if (userExists) {
            return res.status(409).json({ error: 'User name already exists' });
        }

        const newUser = await userService.createUser(userName, firstName, lastName, password, profilePicture);

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
}

// Delete a user by username
export async function deleteUser(req, res) {
    try {
        const userName = req.params.userName; // assuming the username is passed as a URL parameter
        const user = await userService.deleteUser(userName);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
}

// Update a user by username
export async function updateUser(req, res) {
    try {
        const userName = req.body.userName;
        const updatedData = req.body;

        const updatedUser = await userService.updateUser(userName, updatedData);

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
}

export default {
    getAllUsers,
    getUser,
    createUser,
    deleteUser,
    updateUser 
};