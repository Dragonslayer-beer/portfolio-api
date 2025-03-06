var express = require("express");
var router = express.Router();
const User = require("../app/models/User");
const Encryption = require("../app/functions/Encryption");
const Skills = require("../app/models/Skills");
const ProjectSub = require("../app/models/ProjectSub");
// const ProjectSub = require("../app/models/ProjectSub");
const Project = require("../app/models/Project");
const Certification = require("../app/models/Certification");

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/user/:id", async function (req, res, next) {
  try {
    const { id } = req.params;

    const userDecrypt = Encryption.decrypt(id.toString());

    // console.log("userDecrypt", userDecrypt)
    const user = userDecrypt ? userDecrypt : null;

    const userById = await User.findOne({
      where: {
        id: user,
      },
    });

    if (userById) {
      res.json({
        public_profile: `${id}`,
        data: userById,
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

router.get("/skill/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    // const { is_active } = req.query;

    const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page if not specified

    const offset = (page - 1) * limit;

    const userDecrypt = Encryption.decrypt(id.toString());

    // console.log("userDecrypt", userDecrypt)
    const user = userDecrypt ? userDecrypt : null;

    const userById = await User.findOne({
      where: {
        id: user,
      },
    });

    if (userById) {
      const whereCondition = {};

      // if (is_active) {
      whereCondition.is_active = true;
      // }

      const SkillsData = await Skills.findAll({
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

      const totalRecords = await Skills.count({
        where: whereCondition,
      });

      // const IdEncrypt = Encryption.encrypt(user.toString());

      res.json({
        meta: {
          totalRecords,
          currentPage: page,
          totalPages: Math.ceil(totalRecords / limit),
        },
        public_profile: `${id}`,
        data: SkillsData,
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

router.get("/project/:id", async function (req, res, next) {
  try {
    // const { is_active } = req.query;
    const { id } = req.params;
    const userDecrypt = Encryption.decrypt(id.toString());
    const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page if not specified

    const offset = (page - 1) * limit;

    const user = userDecrypt ? userDecrypt : null;

    if (user) {
      const whereCondition = {};

      // if (is_active) {
      whereCondition.is_active = true;
      // }

      const ProjectData = await Project.findAll({
        where: whereCondition,
        include: [
          {
            model: User,
            as: "users",
          },
          {
            model: ProjectSub,
            as: "skill",
            required: false,
            include: [
              {
                model: Skills,
                as: "skill",
              },
            ],
          },
        ],
        order: [["created_at", "DESC"]],
        limit,
        offset,
      });

      const totalRecords = await Project.count({
        where: whereCondition,
      });

      res.json({
        meta: {
          totalRecords,
          currentPage: page,
          totalPages: Math.ceil(totalRecords / limit),
        },
        public_profile: `${id}`,
        data: ProjectData,
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

router.get("/certification/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    const userDecrypt = Encryption.decrypt(id.toString());

    const page = parseInt(req.query.page, 10) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page if not specified

    const offset = (page - 1) * limit;

    const user = userDecrypt ? userDecrypt : null;

    if (user) {
      const whereCondition = {};

      // if (is_active) {
      whereCondition.is_active = true;
      // }

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
