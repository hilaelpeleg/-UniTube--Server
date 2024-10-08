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
    likesList: {
        type: [String], // List of usernames who liked the video
        default: [],
    },

});

const Video = mongoose.model('Video', videoSchema, 'videos');
export default Video;
