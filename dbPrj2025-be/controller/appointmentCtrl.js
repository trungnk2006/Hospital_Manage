const { Op } = require('sequelize');
const handleExceptions = require("../utils/handleExceptions");
const lichKham = require("../model/lichKham");

const { ThongTinCaNhan } = require('../model');

// Tạo lịch khám mới
const createAppointment = async (req, res) => {
  try {
    const { ngay, gio, benhNhanId, bacSiId } = req.body.lichKham;

    const benhNhan = await ThongTinCaNhan.findByPk(benhNhanId);
    const bacSi = await ThongTinCaNhan.findByPk(bacSiId);

    if (!benhNhan || !bacSi) {
      return handleExceptions(500, 'Không tìm thấy bệnh nhân hoặc bác sĩ!', res);
    }

    const newOrder = await lichKham.create({
      ngay,
      gio,
      benhNhanId,
      bacSiId
    });

    const findOrder = await lichKham.findOne({
      where: { id: newOrder.id },
      include: [
        { model: ThongTinCaNhan, as: "benhNhan" },
        { model: ThongTinCaNhan, as: "bacSi" },
      ],
    });

    res.json({
      lichKham: { ...findOrder.dataValues },
      message: "Thành công!",
    });
  } catch (e) {
    handleExceptions(500, e.message, res);
  }
};

// Xóa lịch khám
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.body.lichKham;

    await lichKham.destroy({
      where: { id },
    });

    res.json({
      message: "Thành công",
    });
  } catch (e) {
    handleExceptions(500, e.message, res);
  }
};

// Lấy trạng thái lịch khám hôm nay theo bác sĩ
const getLichTrangThai = async (req, res) => {
  try {
    const bacSiId = parseInt(req.params.bacSiId);

    const caSang = await lichKham.findOne({
      where: { bacSiId, gio: 'Sáng' }
    });

    const caChieu = await lichKham.findOne({
      where: { bacSiId, gio: 'Chiều' }
    });

    res.json({
      sang: {
        id: caSang?.id || null,
        daDat: !!(caSang && caSang.benhNhanId)
      },
      chieu: {
        id: caChieu?.id || null,
        daDat: !!(caChieu && caChieu.benhNhanId)
      }
    });
  } catch (err) {
    console.error('🔥 Lỗi getLichTrangThai:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy trạng thái lịch khám' });
  }
};

// get id for lịch khám 
const getLichKhamById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const item = await lichKham.findOne({
      where: { id },
      include: [
        { model: ThongTinCaNhan, as: "benhNhan" }
      ]
    });

  

    res.json(item);
  } catch (error) {
    console.error("❌ Lỗi khi lấy lịch khám theo ID:", error);
    res.status(500).json({ message: "Lỗi server khi lấy lịch khám" });
  }
};

//rết benh nhan
const resetBenhNhanId = async (req, res) => {
  try {
    const { id } = req.params;

    const lich = await lichKham.findByPk(id);
    if (!lich) {
      return res.status(404).json({ message: "Không tìm thấy lịch khám." });
    }

    lich.benhNhanId = null;
    await lich.save();

    res.json({ message: "Đã reset benhNhanId về null." });
  } catch (error) {
    console.error("Lỗi khi reset benhNhanId:", error);
    res.status(500).json({ message: "Lỗi server khi reset lịch khám." });
  }
};


// Export
module.exports = {
  createAppointment,
  deleteAppointment,
  getLichTrangThai,
   getLichKhamById,
   resetBenhNhanId  
};
