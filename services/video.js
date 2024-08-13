
import Video from '../models/video';

async function createVideo(user_name, title, description, url, thumbnailUrl, uploadDate, duration) {
    try {
        // Find the highest existing id
        const lastVideo = await Video.findOne().sort({ id: -1 });
        const newId = lastVideo ? lastVideo.id + 1 : 1;

        let video = new Video({
            id: newId,
            user_name, 
            title, 
            description, 
            url, 
            thumbnailUrl, 
            uploadDate, 
            duration
        });

        if (await addVideo(user_name, video)) {
            return await video.save();
        }
        return null;
    } catch (error) {
        console.error("Error creating video:", error);
        return null;
    }
}

async function addVideo(user_name, video) {
    try {
        const user = await User.findOne({ user_name });
        if (user) {
            user.videos.push(video._id);
            await user.save();
            return true;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

async function removeVideo(user_name, videoId) {
    try {
        await User.updateOne(
            { user_name },
            { $pull: { videos: videoId } }
        );
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}


async function deleteVideo(user_name, videoId) {
    try {
        const video = await Video.findById(videoId).populate('comments');
        if (video && video.user_name == user_name) {
            await Video.findOneAndDelete({ _id: videoId });
            const commentIds = video.comments.map(comment => comment._id);
            await Comment.deleteMany({ _id: { $in: commentIds } });
            return removeVideo(user_name, videoId);
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
}
