const { sequelize } = require('./databaseConnection');
const lichKham = require('./model/lichKham');
const { ThongTinCaNhan } = require('./model');

async function seedLichKham() {
  try {
    await sequelize.sync();

    // Lấy danh sách bác sĩ (role = 2)
    const doctors = await ThongTinCaNhan.findAll({
      where: { role: 2 }
    });

    if (doctors.length === 0) {
      console.log('Không tìm thấy bác sĩ nào trong database');
      return;
    }

    // Xóa dữ liệu cũ
    await lichKham.destroy({ where: {} });

    // Tạo lịch khám mẫu cho từng bác sĩ
    for (const doctor of doctors) {
      // Tạo lịch ca sáng
      await lichKham.create({
        bacSiId: doctor.id,
        ngay: new Date().toISOString().split('T')[0],
        gio: 'Sáng',
        benhNhanId: null // Chưa có ai đặt lịch
      });

      // Tạo lịch ca chiều
      await lichKham.create({
        bacSiId: doctor.id,
        ngay: new Date().toISOString().split('T')[0],
        gio: 'Chiều',
        benhNhanId: null // Chưa có ai đặt lịch
      });

      console.log(`Đã tạo lịch khám cho bác sĩ: ${doctor.ten}`);
    }

    console.log('Hoàn thành việc tạo dữ liệu mẫu lịch khám');
  } catch (error) {
    console.error('Lỗi khi tạo dữ liệu mẫu:', error);
  } finally {
    await sequelize.close();
  }
}

seedLichKham();
