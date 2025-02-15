const express = require("express");
const { createCreator, getCreatorsList } = require("../Controllers/Creator");
const router = express.Router();

// Route to create a new creator
// POST /api/creators
router.post("/CreateCreator", createCreator);

// Route to get list of all creators
// GET /api/creators
router.get("/", getCreatorsList);

module.exports = router;
