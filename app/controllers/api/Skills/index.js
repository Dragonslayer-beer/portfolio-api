const express = require("express");
const router = express.Router();
const Skills = require("../../../models/Skills");

const sequelize = require("../../../../config/sequelize_connect");
const { QueryTypes, Sequelize } = require("sequelize");
const User = require("../../../models/User");
const { INSERT_SKILL, UPDATE_SKILL } = require("../../../../helper/validation");

router.post("/insert", async function (req, res, next) {
  try {
    const { skills_name, skills_icons, skills_link } = req.body;

    let user = res.locals.id;

    if (user) {
      const users = await User.findOne({
        where: { id: user },
      });

      if (users) {
        await INSERT_SKILL.validate(req.body);
        console.log(Sequelize.literal("now()"));
        const NewRules = await Skills.create({
          skills_name: skills_name,
          skills_icons: skills_icons,
          skills_link: skills_link,

          created_at: Sequelize.literal("now()"),
          user_id: user,
        });

        res.status(201).json({
          status: 201,
          message: "ເພີ່ມ Skills ສຳເລັດ",
          data: NewRules,
        });
      } else {
        res.status(404).json({
          status: 404,
          message: "ບໍມີຂໍ້ມູນຂອງພະນັກງານດັ່ງກ່າວ",
        });
      }
    } else {
      res.status(404).json({
        status: 404,
        message: "ບໍມີຂໍ້ມູນຂອງພະນັກງານດັ່ງກ່າວ",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.patch("/update/:id", async function (req, res, next) {
  try {
    const { id } = req.params;

    await UPDATE_SKILL.validate({
      ...req.body,
      id: id,
    });
    const { skills_name, skills_icons, skills_link, is_active } = req.body;

    let user = res.locals.id;

    const skills = await Skills.findAll({
      where: { skills_id: id, user_id: user },
    });

    if (skills.length > 0) {
      await Skills.update(
        {
          skills_name: skills_name,
          skills_icons: skills_icons,
          skills_link: skills_link,
          is_active: is_active,
          user_id: user,
        },
        {
          where: {
            skills_id: id,
          },
        }
      );

      res.status(201).json({
        status: 201,
        message: "ອັບເດດ Skills ສຳເລັດ",
      });
    } else {
      res.status(404).json({
        status: 404,
        message: "ບໍມີຂໍ້ມູນດັ່ງກ່າວ",
      });
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/delete/:id", async function (req, res, next) {
  try {
    const { id } = req.params;
    let user = res.locals.id;
    const skill = await Skills.findAll({
      where: { skills_id: id, user_id: user },
    });

    console.log("skill", skill);

    if (skill.length > 0) {
      await Skills.destroy({
        where: {
          skills_id: id,
          user_id: user,
        },
      });

      res.status(201).json({
        status: 201,

        message: "ລົບຂໍ້ມູນສຳເລັດ",
      });
    } else {
      res.status(404).json({
        status: 404,
        message: "ບໍມີຂໍ້ມູນດັ່ງກ່າວ",
      });
    }
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

      res.json({
        meta: {
          totalRecords,
          currentPage: page,
          totalPages: Math.ceil(totalRecords / limit),
        },
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

module.exports = router;
