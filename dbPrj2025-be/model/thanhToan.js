const { sequelize } = require('../databaseConnection');
const { DataTypes } = require('sequelize');
const BenhNhan = require('./benhNhan')
const DonKham = require('./donKham')

const ThanhToan = sequelize.define('thanhToan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  chiPhi: DataTypes.FLOAT,
  phuongThucThanhToan: DataTypes.STRING,
  hoanThanh: DataTypes.BOOLEAN,
  theBhyt: DataTypes.STRING,
  lichKhamId: DataTypes.INTEGER,
  benhNhanId: DataTypes.INTEGER,
}, {
  tableName: 'thanhtoans',
  timestamps: false
});

// (async () => {
//   await ThanhToan.sync({ alter: true })
// })();

module.exports = ThanhToan