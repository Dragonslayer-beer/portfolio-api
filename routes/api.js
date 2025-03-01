const express = require("express");
const router = express.Router();

const seqdb = require("../config/sequelize_connect");
const { DataTypes } = require("sequelize");

const jwt = require("../config/jwt");

const authAPI = require("../app/controllers/auth");
router.use("/auth", authAPI);


module.exports = router;
