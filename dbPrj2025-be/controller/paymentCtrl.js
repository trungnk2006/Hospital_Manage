const handleExceptions = require("../utils/handleExceptions");
const { ThanhToan } = require("../model");
const { ThongTinCaNhan } = require('../model')
const { LichKham } = require('../model')

// const BenhNhan = require('../model/benhNhan')
// const BacSi = require('../model/bacSi')

  // id: {
  //   type: DataTypes.INTEGER,
  //   primaryKey: true,
  //   autoIncrement: true
  // },
  // chiPhi: DataTypes.FLOAT,
  // phuongThucThanhToan: DataTypes.STRING,
  // hoanThanh: DataTypes.BOOLEAN,
  // theBhyt: DataTypes.STRING,
  // lichKhamId: DataTypes.INTEGER,
  // benhNhanId: DataTypes.INTEGER,

const createPayment = async (req, res) => {
	try {
		const { chiPhi, phuongThucThanhToan, hoanThanh, theBhyt, lichKhamId, benhNhanId } = req.body.donKham;

		const benhNhan = await ThongTinCaNhan.findByPk(benhNhanId);
		const lichKham = await LichKham.findByPk(lichKhamId);

		if (!benhNhan) {
			return handleExceptions(500, 'Không tìm thấy bệnh nhân!', res);
		}
		if (!lichKham) {
			return handleExceptions(500, 'Không tìm thấy lịch khám!', res);
		}

		const newPayment = await ThanhToan.create({
			chiPhi,
			phuongThucThanhToan,
			hoanThanh,
      theBhyt,
			lichKhamId,
			benhNhanId,
		});
		const findPayment = await ThanhToan.findOne({
			where: { id: newPayment.id },
			include: [
				{ model: ThongTinCaNhan, as: "benhNhan" },
				{ model: LichKham, as: "lichKham" },
			],
		})
		res.json({
			thanhToan: { ...findPayment.dataValues },
			message: "Thành công!",
		});
	} catch (e) {
		handleExceptions(500, e.message, res);
	}
};

const updatePayment = async (req, res) => {
	try {
		const { id,  chiPhi, phuongThucThanhToan, hoanThanh, theBhyt } = req.body.donKham;
		const updateData = {};
		if (chiPhi != null) updateData.chiPhi = chiPhi;
		if (hoanThanh != null) updateData.hoanThanh = hoanThanh;
    if (phuongThucThanhToan != null) updateData.phuongThucThanhToan = phuongThucThanhToan;
		if (theBhyt != null) updateData.theBhyt = theBhyt;

		await ThanhToan.update(updateData, {
			where: { id: id },
		});
		const updatedPayment = await ThanhToan.findOne({
			where: { id: id },
			include: [
				{ model: ThongTinCaNhan, as: "benhNhan" },
				{ model: LichKham, as: "lichKham" },
			],
		})
		if (!updatedOrder) {
			return handleExceptions(500, 'Không tìm thấy đơn khám!', res);
		}
		res.json({
			thanhToan: { ...updatedPayment.dataValues },
			message: "Thành công!",
		});
	} catch (e) {
		handleExceptions(500, e.message, res);
	}
};

module.exports = {
	createPayment: createPayment,
	updatePayment: updatePayment,
};
