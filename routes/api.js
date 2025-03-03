const express = require("express");
const router = express.Router();

const seqdb = require("../config/sequelize_connect");
const { DataTypes } = require("sequelize");

const jwt = require("../config/jwt");

const authAPI = require("../app/controllers/auth");
router.use("/auth", authAPI);

const userAPI = require("../app/controllers/api/User");
router.use("/user", jwt.verify, userAPI);

module.exports = router;
