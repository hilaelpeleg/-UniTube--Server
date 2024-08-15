import User from './models/user.js';
import Video from './models/video.js';
import Comment from './models/comment.js';
import fs from 'fs';

export async function initializeDatabase() {
    try {
        // Check if the User collection is empty
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            const users = JSON.parse(fs.readFileSync('./data/fictitious_users.json', 'utf-8'));
            const createdUsers = await User.insertMany(users); // Insert initial users
            console.log('Inserted initial users');
        }

        // Check if the Video collection is empty
        const videoCount = await Video.countDocuments();
        if (videoCount === 0) {
            const videos = JSON.parse(fs.readFileSync('./data/fictious_videos.json', 'utf-8'));
            for (let videoData of videos) {
                const uploader = await User.findOne({ userName: videoData.uploader });
                if (uploader) {
                    const video = new Video(videoData);
                    video.uploader = uploader._id; // Associate the uploader's ObjectId
                    const savedVideo = await video.save();
                    uploader.videos.push(savedVideo._id); // Add the video to the user's video list
                    await uploader.save();
                    //console.log(`Inserted video: ${savedVideo.title}`);
                }
            }
        }

        // Check if the Comment collection is empty
        const commentCount = await Comment.countDocuments();
        if (commentCount === 0) {
            const comments = JSON.parse(fs.readFileSync('./data/fictious_comments.json', 'utf-8'));
            for (let commentData of comments) {
                const video = await Video.findOne({ id: commentData.videoId });
                if (video) {
                    const comment = new Comment(commentData);
                    comment.videoId = video._id; // Associate the video's ObjectId
                    const savedComment = await comment.save();
                    video.comments.push(savedComment._id); // Add the comment to the video's comment list
                    await video.save();
                    //console.log(`Inserted comment by: ${savedComment.name}`);
                }
            }
        }

    } catch (error) {
        console.error('Error during database initialization:', error);
    }
}
