const userId = localStorage.getItem('userId');

if (!userId) {
  alert("Bạn chưa đăng nhập.");
  window.location.href = "login.html";
}

// DOM Elements
const spanCCCD = document.getElementById('cccd');
const spanTen = document.getElementById('ten');
const spanNgaySinh = document.getElementById('ngaySinh');
const spanGioiTinh = document.getElementById('gioiTinh');
const spanSDT = document.getElementById('sdt');
const spanNamKinhNghiem = document.getElementById('namKinhNghiem');

const form = document.getElementById('updateForm');
const editBtn = document.getElementById('editBtn');
const message = document.getElementById('updateMessage');

const inputTen = document.getElementById('tenInput');
const inputNgaySinh = document.getElementById('ngaySinhInput');
const inputGioiTinh = document.getElementById('gioiTinhInput');
const inputSDT = document.getElementById('sdtInput');

const caSangBtn = document.getElementById('caSangBtn');
const caChieuBtn = document.getElementById('caChieuBtn');
const caSangStatus = document.getElementById('caSangStatus');
const caChieuStatus = document.getElementById('caChieuStatus');

let currentData = {};
let sangLichKhamId = null;
let chieuLichKhamId = null;

// Tải thông tin cá nhân bác sĩ
fetch(`http://localhost:5000/user/info/${userId}`)
  .then(res => res.json())
  .then(data => {
    currentData = data;
    spanCCCD.textContent = data.CCCD;
    spanTen.textContent = data.ten;
    spanNgaySinh.textContent = new Date(data.ngaySinh).toLocaleDateString('vi-VN');
    spanGioiTinh.textContent = data.gioiTinh;
    spanSDT.textContent = data.sdt;
    spanNamKinhNghiem.textContent = data.namKinhNghiem;
  })
  .catch(err => {
    console.error(err);
    alert("Không thể tải dữ liệu bác sĩ.");
  });

// Gửi cập nhật thông tin
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    ten: inputTen.value,
    ngaySinh: inputNgaySinh.value,
    gioiTinh: inputGioiTinh.value,
    sdt: inputSDT.value,
  };

  try {
    const res = await fetch(`http://localhost:5000/user/update/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (res.ok) {
      spanTen.textContent = payload.ten;
      spanNgaySinh.textContent = new Date(payload.ngaySinh).toLocaleDateString('vi-VN');
      spanGioiTinh.textContent = payload.gioiTinh;
      spanSDT.textContent = payload.sdt;

      form.style.display = 'none';
      editBtn.style.display = 'block';
    } else {
      message.style.color = 'red';
      message.textContent = result.message || 'Cập nhật thất bại.';
    }
  } catch (err) {
    console.error(err);
    message.style.color = 'red';
    message.textContent = 'Lỗi kết nối server.';
  }
});

// Sửa thông tin
editBtn.addEventListener('click', () => {
  inputTen.value = currentData.ten || '';
  inputNgaySinh.value = currentData.ngaySinh?.substring(0, 10) || '';
  inputGioiTinh.value = currentData.gioiTinh || '';
  inputSDT.value = currentData.sdt || '';

  form.style.display = 'block';
  editBtn.style.display = 'none';
});

function logout() {
  localStorage.removeItem('userId');
  window.location.href = "login.html";
}

// Lấy trạng thái lịch khám
fetch(`http://localhost:5000/appointment/trangthai/${userId}`)
  .then(res => res.json())
  .then(data => {
    updateLichKhamUI(data);
  })
  .catch(err => {
    console.error("Lỗi tải lịch khám:", err);
    caSangStatus.textContent = "Không xác định";
    caChieuStatus.textContent = "Không xác định";
  });

// Cập nhật UI từ dữ liệu lịch khám
function updateLichKhamUI(lichKham) {
  const sang = lichKham.sang;
  const chieu = lichKham.chieu;

  if (sang.daDat && sang.id) {
    caSangStatus.textContent = "Đã đặt";
    caSangBtn.disabled = false;
    sangLichKhamId = sang.id;
  } else {
    caSangStatus.textContent = "Chưa đặt";
    caSangBtn.disabled = true;
  }

  if (chieu.daDat && chieu.id) {
    caChieuStatus.textContent = "Đã đặt";
    caChieuBtn.disabled = false;
    chieuLichKhamId = chieu.id;
  } else {
    caChieuStatus.textContent = "Chưa đặt";
    caChieuBtn.disabled = true;
  }
}

// Chuyển đến đơn khám theo id lịch khám
function handleLichKham(ca) {
  const lichKhamId = ca === 'Sáng' ? sangLichKhamId : chieuLichKhamId;

  

  window.location.href = `donkham.html?ca=${lichKhamId}`;
}

// Gán sự kiện click
caSangBtn.addEventListener('click', () => handleLichKham('Sáng'));
caChieuBtn.addEventListener('click', () => handleLichKham('Chiều'));
