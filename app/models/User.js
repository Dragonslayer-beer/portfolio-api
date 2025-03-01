const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize_connect"); // Adjust the path as necessary
const Level = require("./Level");
const Village = require("./Village");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    level_id: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profile_img: {
      type: DataTypes.STRING,
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
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    villages_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: true,
    },
 
    created_by: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },


  },
  {
    tableName: "users",
    timestamps: false,
    // underscored: true
  }
);

User.belongsTo(Level, { foreignKey: "level_id", as: "level" });
User.belongsTo(User, { foreignKey: "created_by", as: "created" });
User.belongsTo(Village, { foreignKey: "villages_id", as: "village" });

module.exports = User;
