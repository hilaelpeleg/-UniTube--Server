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
        const user = await userService.getUser(req.query.userName);
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
        const { userName, firstName, lastName, password, reEnterPassword, profilePicture } = req.body;
        const newUser = await userService.createUser(userName, firstName, lastName, password, reEnterPassword, profilePicture);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
}

export default {
    getAllUsers,
    getUser,
    createUser
};
