const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../../../models/User");
const moment = require("moment");
const { QueryTypes, Sequelize } = require("sequelize");
const sequelize = require("../../../../config/sequelize_connect");
const RemoveFile = require("../../../functions/RemoveFile");
const uploadProfile = require("../../../functions/Profile");

const {
  ADD_USER_EMPLOYEE,
  RESERT_PASSWORD,
} = require("../../../../helper/validation");

router.post("/register/general", async function (req, res, next) {
  try {
    if (res.locals.level_id === 1) {
      await ADD_USER_EMPLOYEE.validate(req.body);

      const { email, username, password, phone, fullname, villages_id, dob } =
        req.body;

      // const newdob = moment(dob, "YYYY-MM-DD").format("YYYY-MM-DD");
      const created_date = moment().format("YYYY-MM-DD H:m:s");

      const hashedPassword = await bcrypt.hash(password, 8);

      const newUser = await User.create({
        username: username,
        email: email,
        password: hashedPassword,
        fullname: fullname,
        phone: phone,
        created_at: created_date,
        created_by: res.locals.id,
        level_id: 2,
        villages_id: villages_id,
        dob: dob,
      });

      res.status(201).json({
        status: 201,
        message: "ເພິ່ມຂໍ້ມູນ ຜູ້ໃຊ້ງານສຳເລັດ",
        data: newUser,
      });
      // }
    } else {
      res.status(404).json({
        status: 404,
        message: "role ບໍສາມາດໃຊ້ງານໄດ້",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.patch(
  "/change-profile",
  uploadProfile.single("img"),
  async function (req, res, next) {
    try {
      if (req.file?.filename) {
        await User.update(
          {
            profile_img: req.file.filename,
          },
          {
            where: {
              id: res.locals.id,
            },
          }
        );

        if (res.locals.profile_img) {
          RemoveFile(`./uploads/profile/${res.locals.profile_img}`, (err) => {
            if (err) {
              console.log("Failed to remove file");
            }
          });
        }

        return res.status(200).send({
          message: `ປ່ຽນຮູບໂປຟາຍສຳເລັດ`,
          status: 200,
        });
      } else {
        res.status(404).json({
          status: 404,
          message: "ບໍມີຟາຍໃນການອັບໂຫລດ",
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

router.patch("/reset-password", async function (req, res, next) {
  try {
    await RESERT_PASSWORD.validate(req.body);
    const { old_password, new_password } = req.body;

    const isSuccess = bcrypt.compareSync(old_password, res.locals.password);

    if (isSuccess) {
      const hashedPassword = await bcrypt.hash(new_password, 8);

      await User.update(
        {
          password: hashedPassword,
        },
        {
          where: {
            id: res.locals.id,
          },
        }
      );

      return res.status(200).send({
        message: `ຮີເຊັດ ລະຫັດຜ່ານສຳເລັດ`,
        status: 200,
      });
    } else {
      res.status(404).json({
        status: 404,
        message: "ລະຫັດເກົ່າບໍຖືກຕ້ອງ",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.patch("/update", async function (req, res, next) {
  try {
    const { fullname, phone, villages_id, dob } = req.body;

    const id = res.locals.id;

    // console.log("res.locals", res.locals.id);

    const userById = await User.findOne({
      where: {
        id: id,
      },
    });

    if (userById) {
      const update = {};
      update.fullname = fullname;
      update.phone = phone;
      update.villages_id = villages_id;
      update.location = dob;

      await User.update(update, {
        where: {
          id: userById.id,
        },
      });

      res.status(201).json({
        status: 201,
        message: `ອັດເດດຂໍ້ມູນ ສຳເລັດ`,
      });
    } else {
      res.status(404).json({
        status: 404,
        message: "ບໍມິລະຫັດຜູ້ໃຊ້ງານ ໃນການຄົ້ນຫາ",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.patch("/reset-password/:id", async function (req, res, next) {
  try {
    if (res.locals.level_id === 1 || res.locals.level_id === 2) {
      const { id } = req.params;

      const { new_password } = req.body;

      const whereCondition = {
        id: id,
      };

      if (res.locals.level_id === 2 && id != res.locals.id) {
        whereCondition.owner_id = res.locals.id;
      }

      const userById = await User.findOne({
        where: whereCondition,
      });

      if (userById) {
        const hashedPassword = await bcrypt.hash(new_password, 8);

        await User.update(
          {
            password: hashedPassword,
          },
          {
            where: {
              id: userById.id,
            },
          }
        );

        return res.status(200).send({
          message: `ຮີເຊັດ ລະຫັດຜ່ານສຳເລັດ`,
          status: 200,
        });
      } else {
        res.status(404).json({
          status: 404,
          message: "ບໍມິລະຫັດຜູ້ໃຊ້ງານ ໃນການຄົ້ນຫາ",
        });
      }
    } else {
      res.status(404).json({
        status: 404,
        message: "role  ບໍສາມາດໃຊ້ງານໄດ້",
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
