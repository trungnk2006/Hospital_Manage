const {
  createAppointment,
  deleteAppointment,
  getLichTrangThai,
  getLichKhamById,
  resetBenhNhanId 
} = require('../controller/appointmentCtrl');

const router = require('express').Router();

// Tạo lịch khám mới
router.post('/create', createAppointment);

// Xóa lịch khám
router.patch('/delete', deleteAppointment);

// Lấy trạng thái lịch khám hôm nay của bác sĩ
router.get('/trangthai/:bacSiId', getLichTrangThai);

// Lấy thông tin 1 lịch khám cụ thể (dùng trong donkham.html)
router.get('/:id', getLichKhamById);

// Reset benhNhanId sau khi tạo đơn khám
router.put('/reset/:id', resetBenhNhanId);

module.exports = router;
