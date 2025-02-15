const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },
    addedDateTime: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Ongoing", "Completed"],
      default: "Ongoing",
    },
    roles: [
      {
        _id: {
          type: String,
          default: function () {
            return uuidv4();
          },
        },
        roleName: {
          type: String,
          required: true,
        },
        assignedTo: {
          type: String,
          default: null,
        },
      },
    ],
  },
  { timestamps: true }
);

exports.Video = mongoose.model("Video", videoSchema);
