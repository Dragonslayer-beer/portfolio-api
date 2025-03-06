const express = require("express");
const router = express.Router();
const Project = require("../../../models/Project");
const Skills = require("../../../models/Skills");
const ProjectSub = require("../../../models/ProjectSub");
const User = require("../../../models/User");
const uploadProject = require("../../../functions/Project");
const RemoveFile = require("../../../functions/RemoveFile");
const { QueryTypes, Sequelize } = require("sequelize");
const Encryption = require("../../../functions/Encryption");
const jwt = require("../../../../config/jwt");
const {
  INSERT_PROJECT,
  UPDATE_PROJECT_SKILL,
} = require("../../../../helper/validation");

router.post(
  "/insert",
  jwt.verify,
  uploadProject.single("img"),
  async function (req, res, next) {
    try {
      // console.log("req.body", req.body);

      if (req.file?.filename) {
        // console.log("req.body", req.body);
        await INSERT_PROJECT.validate({
          ...req.body,
          user_id: res.locals.id,
          projects_img: req.file?.filename,
        });

        const NewProject = await Project.create({
          projects_name: req.body.projects_name,
          projects_dec: req.body.projects_dec,
          projects_img: req.file?.filename,
          user_id: res.locals.id,
          projects_link: req.body.projects_link,
          created_at: Sequelize.literal("now()"),
        });

        const newProjectSub = await req.body.skill.map((r) => ({
          projects_id: NewProject.projects_id,
          skills_id: r.skills_id,
          created_at: Sequelize.literal("now()"),
        }));

        await ProjectSub.bulkCreate(newProjectSub);

        res.status(201).json({
          status: 201,
          message: "Create project success",
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

router.patch(
  "/update/:id",
  jwt.verify,
  uploadProject.single("img"),
  async function (req, res, next) {
    try {
      // Find the existing project by its id and verify the user ownership
      const project = await Project.findOne({
        where: { projects_id: req.params.id, user_id: res.locals.id },
      });

      if (!project) {
        return res.status(404).json({
          status: 404,
          message: "Project not found",
        });
      }

      // Determine the image to use: new file if provided, else keep the old one
      const projects_img = req.file?.filename || project.projects_img;

      // Validate the updated input (reusing INSERT_PROJECT validation here, adjust if necessary)
      await UPDATE_PROJECT_SKILL.validate({
        ...req.body,
        projects_id: req.params.id,
        user_id: res.locals.id,
        projects_img,
      });

      // Update the project record with new values
      await Project.update(
        {
          projects_name: req.body.projects_name,
          projects_dec: req.body.projects_dec,
          projects_img,
          projects_link: req.body.projects_link,
          updated_at: Sequelize.literal("now()"),
          is_active: req.body.is_active,
        },
        { where: { projects_id: req.params.id } }
      );

      const existingSkills = await ProjectSub.findAll({
        where: { projects_id: req.params.id },
      });
      const existingSkillIds = existingSkills
        .map((skill) => skill.skills_id)
        .sort();

      const newSkillIds = req.body.skill.map((r) => r.skills_id).sort();

      if (JSON.stringify(existingSkillIds) !== JSON.stringify(newSkillIds)) {
        // Only update if the skills differ.
        await ProjectSub.destroy({ where: { projects_id: req.params.id } });
        const newProjectSub = req.body.skill.map((r) => ({
          projects_id: req.params.id,
          skills_id: r.skills_id,
          created_at: Sequelize.literal("now()"),
        }));
        await ProjectSub.bulkCreate(newProjectSub);
      }
      // If a new file was uploaded, remove the old file if it exists and is different from the new file.
      if (
        req.file?.filename &&
        project.projects_img &&
        project.projects_img !== req.file.filename
      ) {
        RemoveFile(`./uploads/project/${project.projects_img}`, (err) => {
          if (err) {
            console.log("Failed to remove old file");
          }
        });
      }

      res.status(201).json({
        status: 201,
        message: "Update project success",
      });
    } catch (error) {
      // If an error occurs and a new file was uploaded, remove it to clean up.
      if (req.file?.filename) {
        RemoveFile(`./uploads/project/${req.file.filename}`, (err) => {
          if (err) {
            console.log("Failed to remove file");
          }
        });
      }
      next(error);
    }
  }
);

router.delete("/delete/:id", jwt.verify, async (req, res, next) => {
  try {
    // Find the project by id and verify that it belongs to the user.
    const project = await Project.findOne({
      where: { projects_id: req.params.id, user_id: res.locals.id },
    });

    if (!project) {
      return res.status(404).json({
        status: 404,
        message: "Project not found",
      });
    }

    // If there's an image associated with the project, attempt to remove the file.
    if (project.projects_img) {
      RemoveFile(`./uploads/project/${project.projects_img}`, (err) => {
        if (err) {
          console.log("Failed to remove project image");
        }
      });
    }

    // Remove the associated ProjectSub records.
    await ProjectSub.destroy({ where: { projects_id: req.params.id } });

    // Remove the project record.
    await Project.destroy({ where: { projects_id: req.params.id } });

    res.status(201).json({
      status: 201,
      message: "Project deleted successfully",
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

      const IdEncrypt = Encryption.encrypt(user.toString());

      res.json({
        meta: {
          totalRecords,
          currentPage: page,
          totalPages: Math.ceil(totalRecords / limit),
        },
        public_profile: `${IdEncrypt}`,
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

module.exports = router;
