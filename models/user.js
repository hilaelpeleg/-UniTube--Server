const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const User = new Schema({
    user_name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    reEnterPassword: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        required: true,
    },
    videos: [
        
    ]
});



module.exports = mongoose.model("User", User);