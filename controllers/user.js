import * as userService from '../services/user.js';

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

        // Get the profile picture file from req.file
        const profilePicture = req.file ? '/' + req.file.path.replace(/^public[\\/]/, '').replace(/\\/g, '/') : null;

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
        await userService.deleteUser(userName); // Proceed to delete if found
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
}

export async function updateUser(req, res) {
    try {
        const userName = req.params.id; // Extract the userName from the request parameters
        const { firstName, lastName, password} = req.body; 
        // Get the profile picture file from req.file
        const profilePicture = req.file ? '/' + req.file.path.replace(/^public[\\/]/, '').replace(/\\/g, '/') : null;
        
        const user = await userService.getUser(userName); // Check if the user exists first
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Store path for to the old profile pic file
        const oldPicFilePath = path.join('public', user.profilePicture); 

        const updatedUser = await userService.updateUser(user, firstName, lastName, password, profilePicture);
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if new file were uploaded and remove old file
        if (req.files) {
            // Check if a new profilePicture file was uploaded
            if (req.files.profilePicture) {
                // Remove the old video file
                if (fs.existsSync(oldPicFilePath)) {
                    fs.unlinkSync(oldPicFilePath);
                    console.log(`Deleted old video file: ${oldPicFilePath}`);
                } else {
                    console.log(`Old video file does not exist: ${oldPicFilePathh}`);
                }
            }
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