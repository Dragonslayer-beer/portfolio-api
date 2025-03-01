const { DataTypes } = require('sequelize');
const sequelize = require("../../config/sequelize_connect"); // Adjust the path as necessary

const Level = sequelize.define('Level', {
  levels_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  levels_name: {
    type: DataTypes.STRING,
    allowNull: true
  },

  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: true
  }
}, {
  tableName: 'levels',
  timestamps: false,

});


module.exports = Level;
