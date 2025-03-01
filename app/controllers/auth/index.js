const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const User = require("../../models/User");
const moment = require("moment");
const jwt = require("../../../config/jwt");
const Level = require("../../models/Level");
const Village = require("../../models/Village");
const District = require("../../models/District");
const Province = require("../../models/Province");
const sequelize = require("../../../config/sequelize_connect");

const Encryption = require("../../functions/Encryption");

const { QueryTypes, Sequelize } = require("sequelize");

router.get("/", jwt.verify, function (req, res) {
  res.json({
    status: 200,
    message: "OK",
    data: res.locals,
  });
});

router.get("/detail", jwt.verify, async function (req, res, next) {
  try {
    const users = await User.findOne({
      where: { id: res.locals.id },
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
    console.log(users);
    res.json({
      status: 200,
      message: "OK",
      data: users,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async function (req, res, next) {
  try {
    const username = req.body.username ?? "";
    const email = req.body.email ?? "";
    const password = req.body.password;

    if (!username && !email) {
      res.status(404).json({
        message: `ບໍມີ ຍູເຊີ ຫຼື ອີເມວ ໃນການເຂົ້າລະບົບ`,
        status: 404,
      });
    } else {
      const user = username
        ? await User.findOne({
            where: { username },
            include: [
              {
                model: Level,
                as: "level",
              },
            ],
          })
        : email
        ? await User.findOne({
            where: { email },
            include: [
              {
                model: Level,
                as: "level",
              },
            ],
          })
        : "";

      if (user) {
        const isSuccess = bcrypt.compareSync(password, user.password);

        if (isSuccess) {
          if (!user.level_id === 1 || !user.is_active) {
            return res.status(404).json({
              status: 404,
              message: "User ຖືກປິດໃຊ້ງານ! ກະລຸນາ ຕິດຕໍ່ owner ຫຼື admin",
            });
          }

          const payload = {
            id: user.id,
            fullname: user.fullname,
            created: moment().format("YYYY-MM-DD H:m:s"),
          };

          const accessToken = jwt.sign(
            { payload },
            { expiresIn: "5h", algorithm: "RS256" }
          );

          const refreshToken = jwt.signRefreshToken(
            { payload },
            { expiresIn: "7d", algorithm: "RS256" }
          );

          res.status(200).json({
            status: 200,
            message: "Login Success",
            accessToken: accessToken,
            refreshToken: refreshToken,
            level: user.level,
          });
        } else {
          res.status(404).json({
            status: 404,

            message: username
              ? "Username or password invalid"
              : email
              ? "email or password invalid"
              : "",
          });
        }
      } else {
        res.status(404).json({
          status: 404,

          message: username
            ? "Username or password invalid"
            : email
            ? "email or password invalid"
            : "",
        });
      }
    }
  } catch (error) {
    next(error);
  }
});

router.post("/login-encryption", async function (req, res, next) {
  try {
    const username = req.body.username ?? "";
    const email = req.body.email ?? "";
    const password = req.body.password;
    // const userEncrypt =  Encryption.encrypt(username.toString());
    // const emailEncrypt =  Encryption.encrypt(email.toString());
    // const passwordEncrypt =  Encryption.encrypt(password.toString());

    const userDecrypt = Encryption.decrypt(username.toString());
    const emailDecrypt = Encryption.decrypt(email.toString());
    const passwordDecrypt = Encryption.decrypt(password.toString());

    // console.log("userDecrypt", userDecrypt);
    // console.log("emailDecrypt", emailDecrypt);
    // console.log("passwordDecrypt", passwordDecrypt);

    if (!userDecrypt && !emailDecrypt) {
      res.status(404).json({
        message: `ບໍມີ ຍູເຊີ ຫຼື ອີເມວ ໃນການເຂົ້າລະບົບ`,
        status: 404,
      });
    } else {
      const user = userDecrypt
        ? await User.findOne({
            where: { username: userDecrypt },
            include: [
              {
                model: Level,
                as: "level",
              },
            ],
          })
        : email
        ? await User.findOne({
            where: { email: emailDecrypt },
            include: [
              {
                model: Level,
                as: "level",
              },
            ],
          })
        : "";

      if (user) {
        const isSuccess = bcrypt.compareSync(passwordDecrypt, user.password);

        if (isSuccess) {
          if (!user.level_id === 1 || !user.is_active) {
            return res.status(404).json({
              status: 404,
              message: "User ຖືກປິດໃຊ້ງານ! ກະລຸນາ ຕິດຕໍ່ owner ຫຼື admin",
            });
          }

          const payload = {
            id: user.id,
            fullname: user.fullname,
            created: moment().format("YYYY-MM-DD H:m:s"),
          };

          const accessToken = jwt.sign(
            { payload },
            { expiresIn: "5h", algorithm: "RS256" }
          );

          const refreshToken = jwt.signRefreshToken(
            { payload },
            { expiresIn: "7d", algorithm: "RS256" }
          );

          res.status(200).json({
            status: 200,
            message: "Login Success",
            accessToken: accessToken,
            refreshToken: refreshToken,
            level: user.level,
          });
        } else {
          res.status(404).json({
            status: 404,

            message: username
              ? "Username or password invalid"
              : email
              ? "email or password invalid"
              : "",
          });
        }
      } else {
        res.status(404).json({
          status: 404,

          message: username
            ? "Username or password invalid"
            : email
            ? "email or password invalid"
            : "",
        });
      }
    }
  } catch (error) {
    next(error);
  }
});

router.post("/register", async function (req, res, next) {
  try {
    const { username, email, password, phone, fullname } = req.body;
    const created_date = moment().format("YYYY-MM-DD H:m:s");
    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
      fullname: fullname,
      phone: phone,
      level_id: 1,
      created_at: created_date,
    });
    res.status(201).json({
      status: 201,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/refresh-token", async function (req, res, next) {
  try {
    const { refresh_token } = req.body;

    if (refresh_token) {
      const decoded = jwt.refreshVerify(refresh_token);

      const accessToken = jwt.sign(
        {
          payload: decoded.payload,
        },
        {
          expiresIn: "5h",
          algorithm: "RS256",
        }
      );

      res.status(200).json({
        status: 200,
        message: "Refresh Success",
        accessToken: accessToken,
        refreshToken: refresh_token,
      });
    } else {
      return res.status(401).json({
        status: 401,
        message: "Invalid refresh token",
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
