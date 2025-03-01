const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const User = require("../app/models/User");

const Level = require("../app/models/Level");
const Village = require("../app/models/Village");
const District = require("../app/models/District");
const Province = require("../app/models/Province");
const { QueryTypes } = require("sequelize");
const sequelize = require("./sequelize_connect");

const privateKey = fs.readFileSync(
  path.join(__dirname + "../../key/private.key"),
  "utf-8"
);
const publicKey = fs.readFileSync(
  path.join(__dirname + "../../key/public.key"),
  "utf-8"
);

const refresh_privateKey = fs.readFileSync(
  path.join(__dirname + "../../key/refresh_private.key"),
  "utf-8"
);
const refresh_publicKey = fs.readFileSync(
  path.join(__dirname + "../../key/refresh_public.key"),
  "utf-8"
);

function sign(payload, signOption) {
  return jwt.sign(payload, privateKey, signOption);
}

function signRefreshToken(payload, signOption) {
  return jwt.sign(payload, refresh_privateKey, signOption);
}

function refreshVerify(refreshToken) {
  return jwt.verify(refreshToken, refresh_publicKey);
}

function verify(req, res, next) {
  let authHeader = req.headers["authorization"];

  if (authHeader) {
    if (authHeader.startsWith("Bearer ")) {
      let token = authHeader.substring(7, authHeader.length);

      jwt.verify(token, publicKey, async function (err, decoded) {
        if (err) {
          if (err.name == "TokenExpiredError") {
            return res
              .status(401)
              .json({ status: 401, message: "Unauthorized." });
          }

          return res.status(401).json({
            status: 401,
            message: "Failed to authentication token",
          });
        } else {
          // console.log("decoded.payload", decoded);
          const usersData = await User.findOne({
            where: { id: decoded.payload.id },
            include: [
              {
                model: Level,
                as: "level",
              },
              {
                model: User,
                as: "created",
              },
              {
                model: Village,
                as: "village",
                include: [
                  {
                    model: District,
                    as: "district",
                    include: [
                      {
                        model: Province,
                        as: "province",
                      },
                    ],
                  },
                ],
              },
            ],
          });

          res.locals = usersData;

          next();
        }
      });
    }
  } else {
    return res.status(401).json({
      status: 401,
      message: "Unauthorized",
    });
  }
}

module.exports = { sign, verify, refreshVerify, signRefreshToken };
