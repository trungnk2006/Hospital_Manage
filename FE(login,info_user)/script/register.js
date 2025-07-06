// Ẩn/hiện các trường theo vai trò
document.getElementById('role').addEventListener('change', function () {
  const role = this.value;
  const bacSiFields = document.getElementById('bacSiFields');
  const benhNhanFields = document.getElementById('benhNhanFields');

  bacSiFields.style.display = 'none';
  benhNhanFields.style.display = 'none';

  if (role === 'bacSi') {
    bacSiFields.style.display = 'block';
  } else if (role === 'benhNhan') {
    benhNhanFields.style.display = 'block';
  }
});

// Gửi form đăng ký
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const role = document.getElementById('role').value;
  const ten = document.getElementById('ten').value;
  const CCCD = document.getElementById('CCCD').value;
  const ngaySinh = document.getElementById('ngaySinh').value;
  const gioiTinh = document.getElementById('gioiTinh').value;
  const sdt = document.getElementById('sdt').value;
  const extra = role === 'bacSi'
    ? {
        namKinhNghiem: document.getElementById('namKinhNghiem').value,
        caTruc: document.getElementById('caTruc').value
      }
    : {
        diaChi: document.getElementById('diaChi').value
      };

  const body = {
    thongTinCaNhan: {
      role,
      ten,
      CCCD,
      ngaySinh,
      gioiTinh,
      sdt,
      ...extra
    }
  };

  try {
    const res = await fetch('http://localhost:5000/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    const msg = document.getElementById('message');
    if (res.ok) {
      msg.style.color = 'green';
      msg.textContent = 'Đăng ký thành công!';
      setTimeout(() => location.href = 'login.html', 1500);
    } else {
      msg.textContent = data.message || 'Lỗi khi đăng ký';
    }
  } catch (error) {
    console.error(error);
    document.getElementById('message').textContent = 'Không thể kết nối tới server';
  }
});
