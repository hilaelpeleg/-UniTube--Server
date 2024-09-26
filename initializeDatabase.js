import User from './models/user.js';
import Video from './models/video.js';
import Comment from './models/comment.js';
import fs from 'fs';
import path from 'path';

export async function initializeDatabase() {
    try {
        // Check if the User collection is empty
        const userCount = await User.countDocuments();
        console.log(`User collection contains ${userCount} documents`);
        
        if (userCount === 0) {
            if (fs.existsSync('./data/fictitious_users.json')) {
                // Read users from the JSON file
                const users = JSON.parse(fs.readFileSync('./data/fictitious_users.json', 'utf-8'));
                console.log(`Loaded ${users.length} users from JSON`);

                // Encode profile pictures in Base64
                for (let user of users) {
                    const imagePath = `./public${user.profilePicture}`;

                    if (fs.existsSync(imagePath)) {
                        const imageBuffer = fs.readFileSync(imagePath);
                        // Convert image to Base64 and add the appropriate header (e.g., PNG or JPEG)
                        user.profilePicture = `data:image/png;base64,${imageBuffer.toString('base64')}`;
                        console.log(`Profile picture for ${user.name} encoded successfully`);
                    } else {
                        console.error(`Image not found: ${imagePath}`);
                    }
                }

                // Insert the users into the database
                const createdUsers = await User.insertMany(users);
                console.log('Inserted initial users with Base64 encoded profile pictures');
            } else {
                console.error('User JSON file not found');
            }
        }

        // Check if the Video collection is empty
        const videoCount = await Video.countDocuments();
        console.log(`Video collection contains ${videoCount} documents`);

        if (videoCount === 0) {
            if (fs.existsSync('./data/fictious_videos.json')) {
                // Read videos from the JSON file
                const videos = JSON.parse(fs.readFileSync('./data/fictious_videos.json', 'utf-8'));
                console.log(`Loaded ${videos.length} videos from JSON`);

                // Just save the relative paths for videos
                for (let videoData of videos) {
                    const videoPath = `./public/${videoData.url}`;
                    console.log(`Setting video path for ${videoData.uploader}: ${videoPath}`);

                    if (fs.existsSync(videoPath)) {
                        // Save only the relative path to the video in the database
                        let relativeVideoPath = path.relative('./public', videoPath);

                        // Ensure the path starts with a "/"
                        if (!relativeVideoPath.startsWith('/')) {
                            relativeVideoPath = `/${relativeVideoPath}`;
                        }

                        videoData.url = relativeVideoPath;
                        console.log(`Video path for ${videoData.uploader} set successfully: ${relativeVideoPath}`);
                    } else {
                        console.error(`Video not found: ${videoPath}`);
                    }

                    // Save the video
                    const video = new Video(videoData);
                    await video.save();
                    console.log(`Video by ${videoData.uploader} saved successfully!`);
                }
            } else {
                console.error('Video JSON file not found');
            }
        }

        // Check if the Comment collection is empty
        const commentCount = await Comment.countDocuments();
        console.log(`Comment collection contains ${commentCount} documents`);

        if (commentCount === 0) {
            if (fs.existsSync('./data/fictious_comments.json')) {
                // Read comments from the JSON file
                const comments = JSON.parse(fs.readFileSync('./data/fictious_comments.json', 'utf-8'));

                // Save comments in the database
                for (let commentData of comments) {
                    const comment = new Comment(commentData);
                    await comment.save();
                }
            } else {
                console.error('Comment JSON file not found');
            }
        }
    } catch (error) {
        console.error('Error during database initialization:', error);
    }
}
