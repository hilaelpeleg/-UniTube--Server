
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

// Edit a video's title, description, video URL, and/or thumbnail URL
async function editVideo(user_name, videoId, updatedTitle, updatedDescription, updatedVideoUrl, updatedThumbnailUrl) {
    try {
      // Retrieve the video using getVideoById
      const videoResponse = await getVideoById(user_name, videoId);
  
      // Check if the video was successfully retrieved
      if (videoResponse.code) {
        return videoResponse; // Propagate the error from getVideoById
      }
  
      const video = videoResponse;
  
      // Update the video's properties
      if (updatedTitle) video.title = updatedTitle;
      if (updatedDescription) video.description = updatedDescription;
      if (updatedVideoUrl) video.url = updatedVideoUrl;
      if (updatedThumbnailUrl) video.thumbnailUrl = updatedThumbnailUrl;
  
      // Save the updated video
      await video.save();
      return video;
    } catch (error) {
      console.log(error);
      return { code: 500, error: "Failed to update video" };
    }
  }

// Function to get a video by ID
async function getVideoById(user_name, videoId) {
    try {
      // Find the user
      const user = await User.findOne({ user_name });
      if (!user) {
        return { code: 404, error: "User not found!" };
      }
  
      // Find the index of the video in the user's video list
      const videoIndex = user.videos.findIndex(
        (video) => video._id.toString() === videoId.toString()
      );
  
      // If the video is found
      if (videoIndex !== -1) {
        return await Video.findById(user.videos[videoIndex]);
      } else {
        // If the video is not found
        return { code: 404, error: "Video not found!" };
      }
    } catch (error) {
      console.log(error);
      return { code: 500, error: "Failed to fetch video" };
    }
}  

async function getUserVideos(user_name) {
    try {
      // Find the user whose videos we want to retrieve
      const user = await User.findOne({ user_name }).populate('videos');
      if (!user) {
        return { code: 404, error: "This user doesn't exist!" };
      }
  
      // Sort the videos by publish_date in descending order
      const sortedVideos = await Video.find({ user_name }).sort({ publish_date: -1 });
  
      // Create an array of video objects without the URL
      const videos = sortedVideos.map(video => ({
        _id: video._id,
        user_name: video.user_name,
        title: video.title,
        description: video.description,
        thumbnailUrl: video.thumbnailUrl,
        publish_date: video.publish_date,
      }));
  
      return videos;
    } catch (error) {
      console.error("error:", error);
      return { code: 500, error: "Failed to fetch videos" };
    }
  }
  