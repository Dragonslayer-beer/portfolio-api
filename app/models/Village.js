const { DataTypes } = require("sequelize");
const sequelize = require("../../config/sequelize_connect"); // Adjust the path as necessary

const District = require("./District");

const Village = sequelize.define(
  "Village",
  {
    vil_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    vil_lo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vil_en: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dist_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "districts",
        key: "dist_id",
      },
      allowNull: true,
    },
  },
  {
    tableName: "villages",
    timestamps: false,
  }
);

Village.belongsTo(District, { foreignKey: 'dist_id', as: 'district' });

module.exports = Village;
