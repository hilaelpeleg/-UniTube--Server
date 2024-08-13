const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Video = new Schema({
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
    comments: {
        type: [String], 
        default: [],
    },
    uploadDate: {
        type: Date,
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


module.exports = mongoose.model("User", User);
