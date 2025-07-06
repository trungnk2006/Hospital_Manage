 const userId = localStorage.getItem('userId');

    if (!userId) {
      alert("Bạn chưa đăng nhập.");
      window.location.href = "login.html";
    }

    const spanCCCD = document.getElementById('cccd');
    const spanTen = document.getElementById('ten');
    const spanNgaySinh = document.getElementById('ngaySinh');
    const spanGioiTinh = document.getElementById('gioiTinh');
    const spanSDT = document.getElementById('sdt');
    const spanDiaChi = document.getElementById('diaChi');

    const form = document.getElementById('updateForm');
    const editBtn = document.getElementById('editBtn');
    const message = document.getElementById('updateMessage');

    // Input fields
    const inputTen = document.getElementById('tenInput');
    const inputNgaySinh = document.getElementById('ngaySinhInput');
    const inputGioiTinh = document.getElementById('gioiTinhInput');
    const inputSDT = document.getElementById('sdtInput');
    const inputDiaChi = document.getElementById('diaChiInput');

    let currentData = {};

    // Load dữ liệu hiện tại
    fetch(`http://localhost:5000/user/info/${userId}`)
      .then(response => response.json())
      .then(data => {
        currentData = data;
        spanCCCD.textContent = data.CCCD;
        spanTen.textContent = data.ten;
        spanNgaySinh.textContent = new Date(data.ngaySinh).toLocaleDateString('vi-VN');
        spanGioiTinh.textContent = data.gioiTinh;
        spanSDT.textContent = data.sdt;
        spanDiaChi.textContent = data.diaChi;
      })
      .catch(err => {
        console.error(err);
        alert("Không thể tải dữ liệu bệnh nhân.");
      });


    editBtn.addEventListener('click', () => {
      // Gán dữ liệu vào form
      inputTen.value = currentData.ten || '';
      inputNgaySinh.value = currentData.ngaySinh?.substring(0, 10) || '';
      inputGioiTinh.value = currentData.gioiTinh || '';
      inputSDT.value = currentData.sdt || '';
      inputDiaChi.value = currentData.diaChi || '';

      form.style.display = 'block';
      editBtn.style.display = 'none';
    });

    // Gửi form cập nhật
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const payload = {
        ten: inputTen.value,
        ngaySinh: inputNgaySinh.value,
        gioiTinh: inputGioiTinh.value,
        sdt: inputSDT.value,
        diaChi: inputDiaChi.value
      };

      try {
        const res = await fetch(`http://localhost:5000/user/update/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const result = await res.json();

        if (res.ok) {

          // Cập nhật hiển thị
          spanTen.textContent = payload.ten;
          spanNgaySinh.textContent = new Date(payload.ngaySinh).toLocaleDateString('vi-VN');
          spanGioiTinh.textContent = payload.gioiTinh;
          spanSDT.textContent = payload.sdt;
          spanDiaChi.textContent = payload.diaChi;

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

    function logout() {
      localStorage.removeItem('userId');
      window.location.href = "login.html";
    }