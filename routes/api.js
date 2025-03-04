const express = require("express");
const router = express.Router();

const seqdb = require("../config/sequelize_connect");
const { DataTypes } = require("sequelize");

const jwt = require("../config/jwt");

const authAPI = require("../app/controllers/auth");
router.use("/auth", authAPI);

const userAPI = require("../app/controllers/api/User");
router.use("/user", jwt.verify, userAPI);

const regionAPI = require("../app/controllers/api/Region");
router.use("/region", regionAPI);

const levelAPI = require("../app/controllers/api/Level");
router.use("/level", jwt.verify, levelAPI);

const skillAPI = require("../app/controllers/api/Skills");
router.use("/skill", jwt.verify, skillAPI);

module.exports = router;
