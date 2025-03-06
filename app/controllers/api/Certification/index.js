const express = require("express");
const router = express.Router();
const Certification = require("../../../models/Certification");
const Skills = require("../../../models/Skills");
const ProjectSub = require("../../../models/ProjectSub");
const User = require("../../../models/User");
const uploadCertification = require("../../../functions/Certification");
const RemoveFile = require("../../../functions/RemoveFile");
const { QueryTypes, Sequelize } = require("sequelize");
const Encryption = require("../../../functions/Encryption");
const jwt = require("../../../../config/jwt");
const moment = require("moment");

const {
  INSERT_CERTIFICATION,
  UPDATE_CERTIFICATION,
} = require("../../../../helper/validation");

router.post(
  "/insert",
  jwt.verify,
  uploadCertification.single("img"),
  async function (req, res, next) {
    try {
      // console.log("req.body", req.body);

      if (req.file?.filename) {
        // console.log("req.body", req.body);
        await INSERT_CERTIFICATION.validate({
          ...req.body,
          user_id: res.locals.id,
          certification_img: req.file?.filename,
        });

        await Certification.create({
          // ...req.body,
          certification_name: req.body.certification_name,
          certification_dec: req.body.certification_dec,
          certification_link: req.body.certification_link
            ? req.body.certification_link
            : null,
          date: req.body.date,
          certification_img: req.file?.filename,
          user_id: res.locals.id,
          created_at: Sequelize.literal("now()"),
        });

        res.status(201).json({
          status: 201,
          message: "Create Certification success",
        });
      } else {
        res.status(404).json({
          status: 404,
          message: "ບໍມີຟາຍໃນການອັບໂຫລດ",
        });
      }
    } catch (error) {
      if (req.file?.filename) {
        RemoveFile(`./uploads/project/${req.file?.filename}`, (err) => {
          if (err) {
            console.log("Failed to remove file");
          }
        });
      }
      next(error);
    }
  }
);

// Update route
router.patch(
  "/update/:id",
  jwt.verify,
  uploadCertification.single("img"),
  async function (req, res, next) {
    try {
      console.log("req.params.id", req.params.id);
      // Find the certification record for the authenticated user
      const certification = await Certification.findOne({
        where: { certification_id: req.params.id, user_id: res.locals.id },
      });

      console.log("certification", certification);

      if (!certification) {
        return res.status(404).json({
          status: 404,
          message: "Certification not found",
        });
      }

      // Validate the input (using the same validation schema as the insert)
      await UPDATE_CERTIFICATION.validate({
        ...req.body,
        certification_id: req.params.id,
        user_id: res.locals.id,
        certification_img: req.file
          ? req.file.filename
          : certification.certification_img,
      });

      // If a new file is uploaded, remove the old file
      if (req.file) {
        RemoveFile(
          `./uploads/project/${certification.certification_img}`,
          (err) => {
            if (err) {
              console.log("Failed to remove old file");
            }
          }
        );
      }

      // Update the certification record with the new values
      await certification.update(
        {
          certification_name: req.body.certification_name,
          certification_dec: req.body.certification_dec,
          certification_link: req.body.certification_link
            ? req.body.certification_link
            : null,
          date: req.body.date,
          is_active: req.body.is_active,
          certification_img: req.file
            ? req.file.filename
            : certification.certification_img,
        },
        {
          where: {
            certification_id: certification.certification_id,
          },
        }
      );

      res.status(201).json({
        status: 201,
        message: "Certification updated successfully",
      });
    } catch (error) {
      // Remove the uploaded file if there was an error during update
      if (req.file) {
        RemoveFile(`./uploads/project/${req.file.filename}`, (err) => {
          if (err) {
            console.log("Failed to remove file after error");
          }
        });
      }
      next(error);
    }
  }
);

router.delete("/delete/:id", jwt.verify, async function (req, res, next) {
  try {
    // Find the certification record for the authenticated user
    const certification = await Certification.findOne({
      where: { certification_id: req.params.id, user_id: res.locals.id },
    });

    if (!certification) {
      return res.status(404).json({
        status: 404,
        message: "Certification not found",
      });
    }

    // Remove the associated file if it exists
    if (certification.certification_img) {
      RemoveFile(
        `./uploads/project/${certification.certification_img}`,
        (err) => {
          if (err) {
            console.log("Failed to remove file");
          }
        }
      );
    }

    // Delete the certification record from the database
    await certification.destroy({
      where: { certification_id: certification.certification_id },
    });

    res.status(200).json({
      status: 200,
      message: "Certification deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", async function (req, res, next) {
  try {
    const { is_active } = req.query;

    const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page if not specified

    const offset = (page - 1) * limit;
    let user = res.locals.id;

    if (user) {
      const whereCondition = {};

      if (is_active) {
        whereCondition.is_active = is_active;
      }

      const CertificationData = await Certification.findAll({
        where: whereCondition,
        include: [
          {
            model: User,
            as: "users",
          },
        ],
        order: [["created_at", "DESC"]],
        limit,
        offset,
      });

      const totalRecords = await Certification.count({
        where: whereCondition,
      });

      const IdEncrypt = Encryption.encrypt(user.toString());

      res.json({
        meta: {
          totalRecords,
          currentPage: page,
          totalPages: Math.ceil(totalRecords / limit),
        },
        public_profile: `${IdEncrypt}`,
        data: CertificationData,
      });
    } else {
      res.status(404).json({
        status: 404,
        message: "ບໍມີລະຫັດຜູ້ໃຊ້ ໃນການຄົ້ນຫາຂໍ້ມູນ",
      });
    }

    // Calculate the offset
  } catch (error) {
    next(error);
  }
});

module.exports = router;
