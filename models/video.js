import mongoose from 'mongoose';
import { type } from 'os';
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
        default: 0,
    },
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
        type: [String],
        default: [],
    },
    dislikesList: {
        type: [String],
        default: [],
    }
});

const Video = mongoose.model('Video', videoSchema, 'videos');
export default Video;
