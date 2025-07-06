
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const CCCD = document.getElementById('CCCD').value;
    const msg = document.getElementById('message');

    try {
      const res = await fetch('http://localhost:5000/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ CCCD })
      });

      const data = await res.json();
      console.log('Phản hồi đăng nhập:', data);

      if (res.ok && data.id) {
        const userId = data.id;
        localStorage.setItem('userId', userId);

        // Gọi API lấy thông tin user để xác định vai trò
        const infoRes = await fetch(`http://localhost:5000/user/info/${userId}`);
        const userInfo = await infoRes.json();
        console.log('Thông tin người dùng:', userInfo);

        msg.style.color = 'green';
        msg.textContent = 'Đăng nhập thành công!';

        // Chuyển trang theo vai trò
        setTimeout(() => {
          if (userInfo.role === 'bacsi') {
            window.location.href = 'doctor.html';
          } else if (userInfo.role === 'benhnhan') {
            window.location.href = 'dashboard.html';
          } else {
            alert('Không xác định được loại người dùng!');
          }
        }, 1000);

      } else {
        msg.style.color = 'red';
        msg.textContent = data.message || 'CCCD không đúng';
      }
    } catch (err) {
      console.error(err);
      msg.style.color = 'red';
      msg.textContent = 'Không thể kết nối tới server';
    }
  });

