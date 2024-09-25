import User from './models/user.js';
import Video from './models/video.js';
import Comment from './models/comment.js';
import fs from 'fs';

export async function initializeDatabase() {
    try {
        // Check if the User collection is empty
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            if (fs.existsSync('./data/fictitious_users.json')) {
                // Read users from the JSON file
                const users = JSON.parse(fs.readFileSync('./data/fictitious_users.json', 'utf-8'));

                // Encode profile pictures in Base64
                for (let user of users) {
                    const imagePath = `./public/profiles/${user.profilePicture}`;
                    if (fs.existsSync(imagePath)) {
                        const imageBuffer = fs.readFileSync(imagePath);
                        user.profilePicture = imageBuffer.toString('base64'); // Convert image to Base64
                    }
                }

                // Insert the users into the database
                const createdUsers = await User.insertMany(users);
                console.log('Inserted initial users');
            } else {
                console.error('User JSON file not found');
            }
        }

        // Check if the Video collection is empty
        const videoCount = await Video.countDocuments();
        if (videoCount === 0) {
            if (fs.existsSync('./data/fictious_videos.json')) {
                // Read videos from the JSON file
                const videos = JSON.parse(fs.readFileSync('./data/fictious_videos.json', 'utf-8'));

                // Encode video files in Base64 and save them in the database
                for (let videoData of videos) {
                    const videoPath = `./public/videos/${videoData.url}`;
                    if (fs.existsSync(videoPath)) {
                        const videoBuffer = fs.readFileSync(videoPath);
                        videoData.url = videoBuffer.toString('base64'); // Convert video to Base64
                    }

                    // No need to associate uploader ObjectId, just use the uploader name from the JSON
                    const video = new Video(videoData);
                    const savedVideo = await video.save();

                    console.log(`Video by ${videoData.uploader} saved successfully!`);
                }
            } else {
                console.error('Video JSON file not found');
            }
        }

        // Check if the Comment collection is empty
        const commentCount = await Comment.countDocuments();
        if (commentCount === 0) {
            if (fs.existsSync('./data/fictious_comments.json')) {
                // Read comments from the JSON file
                const comments = JSON.parse(fs.readFileSync('./data/fictious_comments.json', 'utf-8'));

                // Loop through comments from the JSON file
                for (let commentData of comments) {
                    // Use the videoId directly from commentData
                    const comment = new Comment(commentData);

                    // Save the comment in the database
                    const savedComment = await comment.save();

                    console.log(`Comment by ${commentData.userName} saved successfully!`);
                }
            } else {
                console.error('Comment JSON file not found');
            }
        }

    } catch (error) {
        console.error('Error during database initialization:', error);
    }
}
