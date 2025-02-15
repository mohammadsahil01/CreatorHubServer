const { Creator } = require("../Models/Creator");

const createCreator = async (creatorData) => {
  try {
    // Check if creator with email already exists
    const existingCreator = await Creator.findOne({ email: creatorData.email });
    if (existingCreator) {
      throw new Error("Creator with this email already exists");
    }

    // Create new creator
    const newCreator = new Creator({
      name: creatorData.name,
      email: creatorData.email,
    });

    // Save and return the creator
    return await newCreator.save();
  } catch (error) {
    // Handle validation errors
    throw new Error(`Failed to create creator: ${error.message}`);
  }
};

const getCreatorsListFunc = async () => {
  try {
    return await Creator.find({}, "name").sort({ name: 1 }).select({
      _id: 1,
      name: 1,
    });
  } catch (error) {
    throw new Error(`Failed to retrieve creators list: ${error.message}`);
  }
};

exports.createCreator = async (req, res) => {
  try {
    const creator = await createCreator(req.body);
    res.status(201).json({
      isSuccess: true,
      message: "Creator created successfully",
      creator,
    });
  } catch (error) {
    res.status(400).json({
      isSuccess: false,
      message: error.message,
    });
  }
};

exports.getCreatorsList = async (req, res) => {
  try {
    const creators = await getCreatorsListFunc();
    res.status(200).json({
      isSuccess: true,
      data:creators,
    });
  } catch (error) {
    res.status(400).json({
      isSuccess: false,
      message: error.message,
    });
  }
};
