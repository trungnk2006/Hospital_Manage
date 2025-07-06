const { createExamination, updateExamination } = require('../controller/examinationCtrl')

const router = require('express').Router()

// donKham: { benhLy, mucDoBenh, dieuTri, benhNhanId, bacSiId } 
router.post('/create', createExamination)
// donKham: { id, benhLy?, mucDoBenh?, dieuTri? } 
router.patch('/update', updateExamination)


module.exports = router