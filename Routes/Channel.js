const express = require("express");
const router = express.Router();
const { createChannel, getChannels } = require("../Controllers/Channel");

// Route to create a new channel
// POST /api/channels
router.post("/createChannel", createChannel);

// Route to get channels for a specific creator
// GET /api/channels/:creatorId
router.get("/:creatorId", getChannels);

module.exports = router;
