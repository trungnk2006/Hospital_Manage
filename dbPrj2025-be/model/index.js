// Kết nối Sequelize nếu chưa được load (rất quan trọng)
require('../databaseConnection');

const ThongTinCaNhan = require('./thongTinCaNhan');
const BacSi = require('./bacSi');
const BenhNhan = require('./benhNhan');
const DonKham = require('./donKham');
const LichKham = require('./lichKham');
const ThanhToan = require('./thanhToan');

// Định nghĩa các quan hệ
ThongTinCaNhan.hasOne(BacSi, {
  foreignKey: 'thongTinCaNhanId',
  as: 'bacSi',
});
BacSi.belongsTo(ThongTinCaNhan, {
  foreignKey: 'thongTinCaNhanId',
  as: 'thongTinCaNhan',
});

ThongTinCaNhan.hasOne(BenhNhan, {
  foreignKey: 'thongTinCaNhanId',
  as: 'benhNhan',
});
BenhNhan.belongsTo(ThongTinCaNhan, {
  foreignKey: 'thongTinCaNhanId',
  as: 'thongTinCaNhan',
});

LichKham.hasOne(DonKham, {
  foreignKey: 'lichKhamId',
  as: 'donKham',
});
DonKham.belongsTo(LichKham, {
  foreignKey: 'lichKhamId',
  as: 'lichKham',
});

LichKham.hasOne(ThanhToan, {
  foreignKey: 'lichKhamId',
  as: 'thanhToan',
});
ThanhToan.belongsTo(LichKham, {
  foreignKey: 'lichKhamId',
  as: 'lichKham',
});

ThongTinCaNhan.hasMany(DonKham, { foreignKey: 'bacSiId', as: 'donKhamBacSi' });
ThongTinCaNhan.hasMany(DonKham, { foreignKey: 'benhNhanId', as: 'donKhamBenhNhan' });
DonKham.belongsTo(ThongTinCaNhan, { foreignKey: 'bacSiId', as: 'bacSi' });
DonKham.belongsTo(ThongTinCaNhan, { foreignKey: 'benhNhanId', as: 'benhNhan' });

ThongTinCaNhan.hasMany(LichKham, { foreignKey: 'bacSiId', as: 'lichKhamBacSi' });
ThongTinCaNhan.hasMany(LichKham, { foreignKey: 'benhNhanId', as: 'lichKhamBenhNhan' });
LichKham.belongsTo(ThongTinCaNhan, { foreignKey: 'bacSiId', as: 'bacSi' });
LichKham.belongsTo(ThongTinCaNhan, { foreignKey: 'benhNhanId', as: 'benhNhan' });

ThongTinCaNhan.hasMany(DonKham, { foreignKey: 'bacSiId', as: 'thanhToan' });
ThanhToan.belongsTo(ThongTinCaNhan, {
  foreignKey: 'benhNhanId',
  as: 'benhNhan',
});

module.exports = {
  ThongTinCaNhan,
  BacSi,
  BenhNhan,
  DonKham,
  LichKham,
  ThanhToan,
};
