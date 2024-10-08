import Comment from '../models/comment.js';

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

export async function updateCommentsWithProfilePicture(userName, profilePicture) {
   
    try {
        // מצא את כל התגובות של המשתמש לפני העדכון
        const commentsBeforeUpdate = await Comment.find({ name: userName });
        console.log("Comments before update:", commentsBeforeUpdate);

        // עדכן את שדה התמונת פרופיל
        const updateResult = await Comment.updateMany(
            { name: userName }, 
            { $set: { profilePicture: profilePicture } }
        );

        // בדוק אם הייתה עדכון
        if (updateResult.modifiedCount > 0) {
            console.log(`Updated profile picture for all comments by user: ${userName}`);
        } else {
            console.log(`No comments were updated for user: ${userName}`);
        }

        // מצא את כל התגובות של המשתמש אחרי העדכון
        const commentsAfterUpdate = await Comment.find({ user: userName });
        console.log("Comments after update:", commentsAfterUpdate);
        
    } catch (error) {
        console.error('Failed to update comments profile picture:', error);
    }
}

export async function deleteCommentsByUser(userName) {
    try {
        const result = await Comment.deleteMany({ name: userName }); // מחק את כל התגובות של המשתמש
        console.log(`Deleted ${result.deletedCount} comments for user: ${userName}`);
    } catch (error) {
        console.error('Failed to delete comments:', error);
        throw error; // דחוף את השגיאה למעלה
    }
}

export default {
    getCommentsByVideoId,
    createComment,
    updateComment,
    deleteComment,
    updateCommentsWithProfilePicture,
    deleteCommentsByUser
};