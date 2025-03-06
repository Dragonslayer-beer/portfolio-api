const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize_connect"); // Adjust the path as necessary
const User = require("./User");

const Certification = sequelize.define(
  "certification",
  {
    certification_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    certification_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    certification_dec: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    certification_img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Mapping the "date" column. Using field option since it's a reserved word in some contexts.
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "date",
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    certification_link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
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
    tableName: "certification",
    timestamps: false, // Add this line if your table does not have `createdAt` and `updatedAt` fields
  }
);

Certification.belongsTo(User, { foreignKey: "user_id", as: "users" });

module.exports = Certification;
