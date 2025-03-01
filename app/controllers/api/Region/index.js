const express = require("express");
const router = express.Router();
const Province = require("../../../models/Province");
const District = require("../../../models/District");
const Village = require("../../../models/Village");

router.get("/all/provinces", async function (req, res, next) {
  try {
    const province = await Province.findAll({
      order: [["prov_id", "ASC"]],
    });

    res.json({
      status: 200,
      message: "OK",
      data: province,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/district", async function (req, res, next) {
  try {
    const { prov_id } = req.query;

    const district = await District.findAll({
      where: {
        prov_id: parseInt(prov_id),
      },
      order: [["dist_id", "ASC"]],
    });

    res.json({
      status: 200,
      message: "OK",
      data: district,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/village", async function (req, res, next) {
  try {
    const { dist_id } = req.query;

    const village = await Village.findAll({
      where: {
        dist_id: parseInt(dist_id),
      },
      order: [["vil_id", "ASC"]],
    });

    res.json({
      status: 200,
      message: "OK",
      data: village,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
