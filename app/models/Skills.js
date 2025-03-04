const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize_connect"); // Adjust the path as necessary
const User = require("./User");

const Skill = sequelize.define(
  "skills",
  {
    skills_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    skills_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    skills_icons: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    skills_link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
  },
  {
    tableName: "skills",
    timestamps: false, // Add this line if your table does not have `createdAt` and `updatedAt` fields
  }
);

Skill.belongsTo(User, { foreignKey: "user_id", as: "users" });

module.exports = Skill;
