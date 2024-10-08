import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const videoSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    thumbnailUrl: {
        type: String,
        required: true,
    },
    uploader: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    disLikes: {
        type: Number,
        default: 0, // Initialize dislikes count
    },
    likesList: {
        type: [String], // List of users who liked the video
        default: [],
    },
    dislikesList: {
        type: [String], // List of users who disliked the video
        default: [],
    },
    views: { // Add this line
        type: Number,
        default: 0, // Initialize with a default value of 0
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    uploadDate: {
        type: String,
        default: Date.now,
    },
    duration: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: null,
    },
});

const Video = mongoose.model('Video', videoSchema, 'videos');
export default Video;