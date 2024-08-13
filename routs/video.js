const videoController = require('../controllers/video');
const tokenModel = require("../models/token");

const express = require("express");
var router = express.Router();
/*
// Route to get all videos for a specific user
router.route("/:user_name/videos")
    .get(tokenModel.isLoggedIn, videoController.getUserVideos);
*/

// Route to get a specific video by ID
router.route("/videos/:videoId")
    .get(tokenModel.isLoggedIn, videoController.getVideoById);

/*
// Route to update a video
router.route("/videos/:videoId")
    .put(tokenModel.isLoggedIn, videoController.editVideo);
*/
module.exports = router;
