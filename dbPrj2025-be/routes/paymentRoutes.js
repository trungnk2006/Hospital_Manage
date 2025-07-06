const { createPayment, updatePayment } = require('../controller/paymentCtrl')

const router = require('express').Router()

// donKham: { benhLy, mucDoBenh, dieuTri, benhNhanId, bacSiId } 
router.post('/create', createPayment)
// donKham: { id, benhLy?, mucDoBenh?, dieuTri? } 
router.patch('/update', updatePayment)


module.exports = router