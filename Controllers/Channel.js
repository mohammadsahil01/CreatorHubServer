const { Channel } = require("../Models/Channel");
const { Creator } = require("../Models/Creator");
const mongoose = require("mongoose");

const createChannelFunc = async (creatorId, channelData, res) => {
  try {
    // Verify creator exists
    const creator = await Creator.findById(creatorId);
    if (!creator) {
      throw new Error("Creator not found");
    }

    // Check if creator already has a channel with this name
    const existingChannel = await Channel.findOne({
      name: channelData.name,
      creator: creatorId,
    });
    if (existingChannel) {
      return res.status(400).json({
        isSuccess: false,
        message: "Channel with this name already exists",
      });
    }

    // Create new channel
    const newChannel = new Channel({
      name: channelData.name,
      creator: creatorId,
      description: channelData.description || "",
    });

    // Save the channel
    const savedChannel = await newChannel.save();

    // Add channel to creator's channels
    creator.channels.push(savedChannel._id);
    await creator.save();

    return savedChannel;
  } catch (error) {
    // Handle validation errors
    throw new Error(`Failed to create channel: ${error.message}`);
  }
};

const getChannelsOfCreator = async (creatorId) => {
  try {
    return await Channel.aggregate([
      // Match channels for the specific creator
      { $match: { creator: new mongoose.Types.ObjectId(creatorId) } },

      // Lookup videos for each channel
      {
        $lookup: {
          from: "videos", // Assumes the videos collection name is 'videos'
          localField: "_id",
          foreignField: "channel",
          as: "videoList",
        },
      },

      // Project the results to shape the output
      {
        $project: {
          _id: 1,
          name: 1,
          videoCount: { $size: "$videoList" },
          createdAt: 1,
        },
      },

      // Sort by most recently created
      { $sort: { createdAt: -1 } },
    ]);
  } catch (error) {
    throw new Error(`Failed to retrieve channels: ${error.message}`);
  }
};

exports.createChannel = async (req, res) => {
  try {
    const creatorId = req.body.creatorId;
    const channelData = req.body.channelData;

    if (!creatorId) {
      return res.status(400).json({
        isSuccess: false,
        message: "User ID is required",
      });
    }

    if (!channelData) {
      return res.status(400).json({
        isSuccess: false,
        message: "channelData ID is required",
      });
    }

    const channel = await createChannelFunc(creatorId, channelData, res);

    return res.status(201).json({
      isSuccess: true,
      message: "Channel created successfully",
      channel,
    });
  } catch (err) {
    // Handle unexpected errors
    return res.status(500).json({
      isSuccess: false,
      message: "An error occurred while validating the Device ID",
      error: err.message,
    });
  }
};

exports.getChannels = async (req, res) => {
  try {
    const creatorId = req.params.creatorId;

    if (!creatorId) {
      return res.status(400).json({
        isSuccess: false,
        message: "Creator ID is required",
      });
    }

    const channels = await getChannelsOfCreator(creatorId);

    return res.status(200).json({
      isSuccess: true,
      message: "Channels retrieved successfully",
      channels,
    });
  } catch (err) {
    // Handle unexpected errors
    return res.status(500).json({
      isSuccess: false,
      message: "An error occurred while retrieving channels",
      error: err.message,
    });
  }
};
