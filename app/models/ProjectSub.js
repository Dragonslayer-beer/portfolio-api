const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize_connect"); // Adjust the path as necessary
// const Project = require("./Project");
const Skills = require("./Skills");

const ProjectsSub = sequelize.define(
  "projects_sub",
  {
    projects_sub_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    projects_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    skills_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "projects_sub",
    timestamps: false, // Add this line if your table does not have `createdAt` and `updatedAt` fields
  }
);


ProjectsSub.belongsTo(Skills, { foreignKey: "skills_id", as: "skill" });

// ProjectsSub.belongsTo(Project, { foreignKey: "projects_id", as: "project" });

// ProjectsSub.belongsTo(Project, { foreignKey: "projects_id", as: "project" });
// ProjectsSub.belongsTo(Project, { foreignKey: "project", as: "skill" });

// ProjectSub.belongsTo(Project, {
//   as: "project", // or leave undefined if not needed
//   foreignKey: "projects_id",
// });

module.exports = ProjectsSub;
