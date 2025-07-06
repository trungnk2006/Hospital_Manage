const { ThongTinCaNhan, BenhNhan, BacSi } = require('../model');

const { userLogin, userRegister, getUser, getUserInfo, getDoctors } = require('../controller/userCtrl');

const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({msg: 'Hello user'});
});

router.post('/register', userRegister);
router.post('/login', userLogin);
router.get('/doctors', getDoctors);
router.get('/:id', getUser);

// new routes for info
router.get('/info/:id', async (req, res) => {
  try {
    const user = await getUserInfo(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    let role = 'unknown';
    if (user.bacSi) {
      role = 'bacsi';
    } else if (user.benhNhan) {
      role = 'benhnhan';
    }

    res.json({
      ten: user.ten,
      CCCD: user.CCCD,
      ngaySinh: user.ngaySinh,
      gioiTinh: user.gioiTinh,
      sdt: user.sdt,
      diaChi: user.benhNhan?.diaChi || null,
      namKinhNghiem: user.bacSi?.namKinhNghiem || null,
      role: role  
    });
  } catch (error) {
    console.error('Error getting user info:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// update proflie routes
router.put('/update/:id', async (req, res) => {
  try {
    const { ten, ngaySinh, gioiTinh, sdt, diaChi } = req.body;


    await ThongTinCaNhan.update(
      { ten, ngaySinh, gioiTinh, sdt },
      { where: { id: req.params.id } }
    );


    await BenhNhan.update(
      { diaChi },
      { where: { thongTinCaNhanId: req.params.id } }
    );

    res.json({ message: 'Cập nhật thành công' });
  } catch (error) {
  console.error(' Lỗi cập nhật thông tin:', error); //  Log chi tiết
  res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
}

});


module.exports = router;
