const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize_connect"); // Adjust the path as necessary

const Province = sequelize.define(
  "Province",
  {
    prov_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    prov_lo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    prov_en: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "provinces",
    timestamps: false,
    //   underscored: true
  }
);

module.exports = Province;
