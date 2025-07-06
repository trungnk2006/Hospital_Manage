const { createExamination, updateExamination, getExaminationsByPatient } = require('../controller/examinationCtrl')

const router = require('express').Router()

// donKham: { benhLy, mucDoBenh, dieuTri, benhNhanId, bacSiId } 
router.post('/create', createExamination)
// donKham: { id, benhLy?, mucDoBenh?, dieuTri? } 
router.patch('/update', updateExamination)
// Lấy đơn khám theo bệnh nhân
router.get('/patient/:benhNhanId', getExaminationsByPatient)

module.exports = router