const { sequelize } = require('../databaseConnection');
const { DataTypes } = require('sequelize');
const ThongTinCaNhan = require('./thongTinCaNhan')
const BacSi = sequelize.define('bacSi', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  thongTinCaNhanId: DataTypes.INTEGER,
  namKinhNghiem: DataTypes.INTEGER,
  caTruc: DataTypes.STRING
}, {
  tableName: 'bacsis',
  timestamps: false,
});


// (async () => {
//   await BacSi.sync({ alter: true })
// })();

module.exports = BacSi
