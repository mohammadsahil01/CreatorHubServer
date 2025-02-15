const express = require("express");
const router = express.Router();
const {
  createVideoWithDefaultRoles,
  addCustomRoleToVideo,
  removeRoleFromVideo,
  assignRoleToVideo,
  getChannelVideos,
  getVideoDetails,
  updateVideoStatus,
} = require("../Controllers/Video");

// Create a new video with default roles
// POST /api/videos
router.post("/", createVideoWithDefaultRoles);

// Get videos for a specific channel (with optional year/month filtering)
// GET /api/videos/channel/:channelId
router.get("/channel/:channelId", getChannelVideos);

// Get specific video details
// GET /api/videos/:videoId
router.get("/:videoId", getVideoDetails);

// Add custom role to a video
// POST /api/videos/:videoId/roles
router.post("/:videoId/roles", addCustomRoleToVideo);

// Remove a role from a video
// DELETE /api/videos/:videoId/roles/:roleId
router.put("/:videoId/roles", removeRoleFromVideo);

// Change Video Status
// PUT /api/videos/:videoId/roles/:roleId
router.put("/:videoId", updateVideoStatus);

// Assign a role to someone
// PUT /api/videos/:videoId/roles/:roleId/assign
router.put("/:videoId/roles/:roleId/assign", assignRoleToVideo);

module.exports = router;
