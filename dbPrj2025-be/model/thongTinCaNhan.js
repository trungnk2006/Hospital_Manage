const { sequelize } = require('../databaseConnection');
const { DataTypes } = require('sequelize');
const BacSi = require('./bacSi')
const BenhNhan = require('./benhNhan')

const ThongTinCaNhan = sequelize.define('thongTinCaNhan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  CCCD: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  ten: DataTypes.STRING,
  ngaySinh: DataTypes.DATE,
  gioiTinh: DataTypes.STRING,
  sdt: DataTypes.STRING,
}, {
  tableName: 'thongtincanhans',
  timestamps: false
});

// (async () => {
//   await ThongTinCaNhan.sync()
// })();

module.exports = ThongTinCaNhan