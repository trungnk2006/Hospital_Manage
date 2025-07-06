window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const lichKhamId = urlParams.get("ca");
  const userId = localStorage.getItem("userId");

  let benhNhan = null;

  async function fetchThongTinBenhNhan() {
    try {
      const res = await fetch(`http://localhost:5000/appointment/${lichKhamId}`);
      const data = await res.json();
      console.log("📦 Response từ API:", data);

      if (!data.benhNhan) {
        throw new Error("❌ Không có thông tin bệnh nhân.");
      }

      benhNhan = data.benhNhan;

      document.getElementById('tenBenhNhan').textContent = benhNhan.ten;
      document.getElementById('ngaySinh').textContent = new Date(benhNhan.ngaySinh).toLocaleDateString("vi-VN");
      document.getElementById('gioiTinh').textContent = benhNhan.gioiTinh;
      document.getElementById('sdt').textContent = benhNhan.sdt;

    } catch (error) {
      alert("Không thể tải thông tin bệnh nhân.");
      console.error(error);
    }
  }

  document.getElementById("donKhamForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!benhNhan || !lichKhamId) {
      alert("❌ Thiếu thông tin lịch khám!");
      return;
    }

    const payload = {
      benhLy: document.getElementById("benhLy").value,
      mucDoBenh: document.getElementById("mucDo").value,
      dieuTri: document.getElementById("dieuTri").value,
      bacSiId: parseInt(userId),
      benhNhanId: benhNhan.id,
      lichKhamId: parseInt(lichKhamId)
    };

    try {
      const res = await fetch("http://localhost:5000/examination/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donKham: payload })
      });

      const result = await res.json();

      if (res.ok) {
        // Không reset benhNhanId để giữ liên kết giữa bệnh nhân và lịch khám
        alert("✅ Tạo đơn khám thành công!");
        window.location.href = "doctor.html";
      } else {
        alert("❌ Tạo đơn khám thất bại! " + result.message);
      }
    } catch (err) {
      alert("⚠️ Lỗi kết nối server!");
      console.error(err);
    }
  });

  fetchThongTinBenhNhan();
};
