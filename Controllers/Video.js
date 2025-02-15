const { Channel } = require("../Models/Channel");
const { Video } = require("../Models/Video");

// Default roles list
const DEFAULT_ROLES = [
  "Editor",
  "Recorder 1",
  "Recorder 2",
  "Model Maker",
  "Texture Pack-Map Developer",
  "Thumbnail Maker",
];

// Method to create a video with default roles
// Create video with default roles
exports.createVideoWithDefaultRoles = async (req, res) => {
  try {
    const { channelId, videoTitle,roles } = req.body;

    const video = new Video({
      title: videoTitle,
      channel: channelId,
      roles: roles.map((role) => ({
        roleName: role.name,
        assignedTo: null,
      })),
    });

    const savedVideo = await video.save();

    return res.status(201).json({
      isSuccess: true,
      data: savedVideo,
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: `Failed to create video: ${error.message}`,
    });
  }
};

// Add custom role to video
exports.addCustomRoleToVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { customRoleName } = req.body;

    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      {
        $push: {
          roles: {
            roleName: customRoleName,
            assignedTo: null,
          },
        },
      },
      { new: true }
    );

    if (!updatedVideo) {
      return res.status(404).json({
        isSuccess: false,
        message: "Video not found",
      });
    }

    // Get the newly added role (last element in the roles array)
    const newRole = updatedVideo.roles[updatedVideo.roles.length - 1];

    return res.status(200).json({
      isSuccess: true,
      data: {
        id: newRole._id,
        roleName: newRole.roleName,
        assignedTo: newRole.assignedTo
      }
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: `Failed to add custom role: ${error.message}`,
    });
  }
};

// Remove role from video
exports.removeRoleFromVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { roleId } = req.body;

    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      { $pull: { roles: { _id: roleId } } },
      { new: true }
    );

    if (!updatedVideo) {
      return res.status(404).json({
        isSuccess: false,
        message: "Video not found",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      data: updatedVideo,
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: `Failed to remove role: ${error.message}`,
    });
  }
};

// Assign role to video
exports.assignRoleToVideo = async (req, res) => {
  try {
    const { videoId, roleId } = req.params;
    const { assigneeName } = req.body;

    const updatedVideo = await Video.findOneAndUpdate(
      { _id: videoId, "roles._id": roleId },
      { $set: { "roles.$.assignedTo": assigneeName } },
      { new: true }
    );

    if (!updatedVideo) {
      return res.status(404).json({
        isSuccess: false,
        message: "Video or role not found",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      data: updatedVideo,
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: `Failed to assign role: ${error.message}`,
    });
  }
};

// Get channel videos
exports.getChannelVideos = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { year, month } = req.query;

    // Validate channel existence
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({
        isSuccess: false,
        message: "Channel not found",
      });
    }

    // Base query for videos in the channel
    const query = { channel: channelId };

    // If year and month are provided, add date filtering
    if (year && month) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      query.addedDateTime = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    // Retrieve videos with basic details
    const videos = await Video.find(query)
      .select("title addedDateTime status roles")
      .sort({ addedDateTime: -1 });

    return res.status(200).json({
      isSuccess: true,
      data: videos,
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: `Failed to retrieve channel videos: ${error.message}`,
    });
  }
};

//  Get specific video details by videoId
exports.getVideoDetails = async (req, res) => {
  try {
    // Get videoId from request parameters
    const { videoId } = req.params;

    // Find video and populate roles
    const video = await Video.findById(videoId).populate({
      path: "channel",
      select: "name creator",
    });

    if (!video) {
      return res.status(404).json({
        isSuccess: false,
        message: "Video not found",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      data: video,
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: `Failed to retrieve video details: ${error.message}`,
    });
  }
};

exports.updateVideoStatus = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { status } = req.body;

    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      { status },
      { new: true }
    );

    if (!updatedVideo) {
      return res.status(404).json({
        isSuccess: false,
        message: "Video not found",
      });
    }

    return res.status(200).json({
      isSuccess: true,
      data: updatedVideo,
    });
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: `Failed to update video status: ${error.message}`,
    });
  }
};
