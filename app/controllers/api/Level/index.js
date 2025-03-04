const express = require("express");
const router = express.Router();
const Level = require("../../../models/Level");

router.get("/all", async function (req, res, next) {
  try {
    const level = await Level.findAll({
      order: [["levels_id", "ASC"]],
    });

    res.json({
      status: 200,
      message: "OK",
      data: level,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
