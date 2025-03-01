const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize_connect"); // Adjust the path as necessary
const Province = require("./Province");
const District = sequelize.define(
  "District",
  {
    dist_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dist_lo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dist_en: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    prov_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "provinces",
        key: "prov_id",
      },
      allowNull: true,
    },
  },
  {
    tableName: "districts",
    timestamps: false,
    //   underscored: true
  }
);

District.belongsTo(Province, { foreignKey: "prov_id", as: "province" });

module.exports = District;
