const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize_connect"); // Adjust the path as necessary
const User = require("./User");
const ProjectSub = require("./ProjectSub");


const Projects = sequelize.define(
  "projects",
  {
    projects_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    projects_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    projects_dec: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    projects_img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    projects_link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
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
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    
  },
  {
    tableName: "projects",
    timestamps: false, // Add this line if your table does not have `createdAt` and `updatedAt` fields
  }
);
Projects.hasMany(ProjectSub, {
  as: "skill",
  foreignKey: "projects_id",
});
Projects.belongsTo(User, { foreignKey: "user_id", as: "users" });


module.exports = Projects;
