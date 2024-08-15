import User from './models/user.js';
import Video from './models/video.js';
import fs from 'fs';

export async function initializeDatabase() {
    try {
        // Check if the User collection is empty
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            const users = JSON.parse(fs.readFileSync('./data/fictitious_users.json', 'utf-8'));
            await User.insertMany(users); // Insert initial users
            console.log('Inserted initial users');
        }

        // Check if the Video collection is empty
        const videoCount = await Video.countDocuments();
        if (videoCount === 0) {
            // Optionally add initial videos if necessary
            console.log('Videos collection is empty, consider adding initial videos');
        }
    } catch (error) {
        console.error('Error during database initialization:', error);
    }
}
