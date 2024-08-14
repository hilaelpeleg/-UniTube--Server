import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    videoId: {
        type: Schema.Types.ObjectId,
        ref: 'Video',
        required: true,
    },
    commentId: {
        type: Number,
        required: true,
        unique: true,
    },
    profilePicture: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
});

const Comment = mongoose.model('Comment', commentSchema, 'comments');
export default Comment;