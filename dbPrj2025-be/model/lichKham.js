const { sequelize } = require('../databaseConnection');
const { DataTypes } = require('sequelize');


const LichKham = sequelize.define('lichKham', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  benhNhanId: DataTypes.INTEGER,
  bacSiId: DataTypes.INTEGER,
  ngay: DataTypes.DATE,
  gio: DataTypes.STRING
}, {
  tableName: 'lichkhams',
  timestamps: true,
});

// (async () => {
//   await LichKham.sync({ alter: true })
// })();

module.exports = LichKham
