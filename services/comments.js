import Comment from '../models/comment.js'

export async function getCommentsByVideoId(videoId) {
    try {
        return await Comment.find({ videoId: videoId });
    } catch (error) {
        console.error("Error fetching comments:", error);
        throw error;
    }
}

export async function createComment(videoId, commentData) {
    try {
        const newComment = new Comment({
            videoId,
            ...commentData
        });

        return await newComment.save();
    } catch (error) {
        console.error("Error creating comment:", error);
        throw error;
    }
}

export async function updateComment(commentId, updatedData) {
    try {
        return await Comment.findByIdAndUpdate(commentId, updatedData, { new: true });
    } catch (error) {
        console.error("Error updating comment:", error);
        throw error;
    }
}

export async function deleteComment(commentId) {
    try {
        return await Comment.findByIdAndDelete(commentId);
    } catch (error) {
        console.error("Error deleting comment:", error);
        throw error;
    }
}

export default {
    getCommentsByVideoId,
    createComment,
    updateComment,
    deleteComment
};
