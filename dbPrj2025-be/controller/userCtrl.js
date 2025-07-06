const handleExceptions = require("../utils/handleExceptions");
const { ThongTinCaNhan } = require("../model/index");
const { BenhNhan } = require("../model/index");
const { BacSi } = require("../model/index");


const getUserInfo = async (id) => {
  try {
    return await ThongTinCaNhan.findOne({
      where: { id },
      include: [
        { model: BenhNhan, as: "benhNhan" },
        { model: BacSi, as: "bacSi" },
      ],
    });
  } catch (error) {
    throw error;
  }
};

const userRegister = async (req, res) => {
  try {
    if (!req.body.thongTinCaNhan) {
      return handleExceptions(400, "Thiếu thông tin đăng ký", res);
    }

    const { role } = req.body.thongTinCaNhan;
    let newUser;

    if (role == "bacSi") {
      const { ten, CCCD, ngaySinh, gioiTinh, sdt, namKinhNghiem, caTruc } = req.body.thongTinCaNhan;
      
      // Validate required fields
      if (!ten || !CCCD || !ngaySinh || !sdt) {
        return handleExceptions(400, "Thiếu thông tin bắt buộc", res);
      }

      newUser = await ThongTinCaNhan.create(
        {
          CCCD,
          ten,
          ngaySinh,
          gioiTinh,
          sdt,
          bacSi: { namKinhNghiem, caTruc },
        },
        { include: [{ model: BacSi, as: "bacSi" }] }
      );
    } else if (role == "benhNhan") {
      const { ten, CCCD, ngaySinh, gioiTinh, sdt, diaChi } = req.body.thongTinCaNhan;
      
      if (!ten || !CCCD || !ngaySinh || !sdt) {
        return handleExceptions(400, "Thiếu thông tin bắt buộc", res);
      }

      newUser = await ThongTinCaNhan.create(
        {
          CCCD,
          ten,
          ngaySinh,
          gioiTinh,
          sdt,
          benhNhan: { diaChi },
        },
        { include: [{ model: BenhNhan, as: "benhNhan" }] }
      );
    } else {
      return handleExceptions(400, "Vai trò không hợp lệ", res);
    }

    const userWithDetails = await getUserInfo(newUser.id);
    
    res.status(201).json({
      success: true,
      user: {
        ...userWithDetails.dataValues,
        role: userWithDetails.bacSi ? "bacSi" : "benhNhan"
      },
      message: "Đăng ký thành công"
    });

  } catch (e) {
    if (e.name == "SequelizeUniqueConstraintError") {
      return handleExceptions(409, "Số CCCD đã tồn tại", res);
    }
    handleExceptions(500, e.message, res);
  }
};

const userLogin = async (req, res) => {
  try {
    const { CCCD } = req.body;
    
    if (!CCCD) {
      return handleExceptions(400, "Vui lòng nhập CCCD", res);
    }

    const user = await ThongTinCaNhan.findOne({
      where: { CCCD },
      include: [
        { model: BenhNhan, as: "benhNhan" },
        { model: BacSi, as: "bacSi" },
      ],
    });
    
    if (!user) {
      return handleExceptions(404, "CCCD không tồn tại", res);
    }
    
    res.json({
      success: true,
      id: user.id,
      role: user.bacSi ? "bacSi" : "benhNhan",
      message: "Đăng nhập thành công"
    });
    
  } catch (e) {
    handleExceptions(500, "Lỗi server: " + e.message, res);
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return handleExceptions(400, "Thiếu ID người dùng", res);
    }

    const user = await getUserInfo(id);
    
    if (!user) {
      return handleExceptions(404, "Người dùng không tồn tại", res);
    }

    res.json({
      success: true,
      user: {
        ...user.dataValues,
        role: user.bacSi ? "bacSi" : "benhNhan"
      },
      message: "Thành công"
    });
    
  } catch (e) {
    handleExceptions(500, "Lỗi server: " + e.message, res);
  }
};

const userLogout = async (req, res) => {
  res.json({ success: true, message: "Đăng xuất thành công" });
};

module.exports = {
  userRegister,
  userLogin,
  userLogout,
  getUser,
  getUserInfo // Thêm export hàm này
};