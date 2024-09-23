import * as userService from '../services/user.js';

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

export async function updateUser(req, res) {
    try {
        const { userName } = req.params; // נניח שהמשתמש מזוהה לפי userName
        const { firstName, lastName, password, profilePicture } = req.body; // נתונים שניתן לעדכן

        const updatedUser = await userService.updateUser(userName, firstName, lastName, password, profilePicture);

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
}

export default {
    getUser,
    createUser,
    deleteUser,
    updateUser
};