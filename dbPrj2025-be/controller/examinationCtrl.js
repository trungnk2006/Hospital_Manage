const handleExceptions = require("../utils/handleExceptions");
const { DonKham } = require("../model");
const { ThongTinCaNhan } = require('../model')
const { LichKham } = require('../model')

// const BenhNhan = require('../model/benhNhan')
// const BacSi = require('../model/bacSi')

const createExamination = async (req, res) => {
	try {
		const { benhLy, mucDoBenh, dieuTri, lichKhamId, benhNhanId, bacSiId } = req.body.donKham;

		const benhNhan = await ThongTinCaNhan.findByPk(benhNhanId);
		const bacSi = await ThongTinCaNhan.findByPk(bacSiId);
		const lichKham = await LichKham.findByPk(lichKhamId);

		if (!benhNhan || !bacSi) {
			return handleExceptions(500, 'Không tìm thấy bệnh nhân hoặc bác sĩ!', res);
		}
		if (!lichKham) {
			return handleExceptions(500, 'Không tìm thấy lịch khám', res);
		}

		const newExamination = await DonKham.create({
			benhLy,
			mucDoBenh,
			dieuTri,
			lichKhamId,
			benhNhanId,
			bacSiId
		});
		const findExamination = await DonKham.findOne({
			where: { id: newExamination.id },
			include: [
				{ model: ThongTinCaNhan, as: "benhNhan" },
				{ model: ThongTinCaNhan, as: "bacSi" },
			],
		})
		res.json({
			donKham: { ...findExamination.dataValues },
			message: "Thành công!",
		});
	} catch (e) {
		handleExceptions(500, e.message, res);
	}
};

const updateExamination = async (req, res) => {
	try {
		const { id, benhLy, mucDoBenh, dieuTri } = req.body.donKham;
		const updateData = {};
		if (benhLy != null) updateData.benhLy = benhLy;
		if (mucDoBenh != null) updateData.mucDoBenh = mucDoBenh;
		if (dieuTri != null) updateData.dieuTri = dieuTri;

		await DonKham.update(updateData, {
			where: { id: id },
		});
		const updatedExamination = await DonKham.findOne({
			where: { id: id },
			include: [
				{ model: ThongTinCaNhan, as: "benhNhan" },
				{ model: ThongTinCaNhan, as: "bacSi" },
			],
		})
		if (!updatedExamination) {
			return handleExceptions(500, 'Không tìm thấy đơn khám!', res);
		}
		res.json({
			donKham: { ...updatedExamination.dataValues },
			message: "Thành công",
		});
	} catch (e) {
		handleExceptions(500, e.message, res);
	}
};

module.exports = {
	createExamination: createExamination,
	updateExamination: updateExamination,
};
