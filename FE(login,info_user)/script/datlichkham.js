// datlichkham.js - Script for handling appointment booking functionality

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const doctorListEl = document.getElementById("doctorList");
    const scheduleSection = document.getElementById("scheduleSection");
    const paymentSection = document.getElementById("paymentSection");
    const doctorNameEl = document.getElementById("doctorName");
    const myBookingsSection = document.getElementById("myBookingsSection");
    const myBookingsTableBody = document.getElementById("myBookingsTableBody");
    const myExaminationsSection = document.getElementById("myExaminationsSection");
    const myExaminationsTableBody = document.getElementById("myExaminationsTableBody");

    // State variables
    let selectedDoctor = null;
    let selectedSchedule = null;
    let selectedPayment = null;
    let doctors = [];

    // Check if user is logged in
    const userId = localStorage.getItem("userId");
    if (!userId) {
        alert("Vui lòng đăng nhập để sử dụng tính năng đặt lịch khám.");
        window.location.href = "login.html";
    }

    // Load doctors from database
    async function loadDoctors() {
        try {
            // Fetch doctors who are doctors (role = 2)
            const response = await fetch("http://localhost:5000/user/doctors");
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Không thể tải danh sách bác sĩ");
            }

            doctors = data.doctors || [];

            // Clear existing doctor list
            doctorListEl.innerHTML = "";

            // Display doctors
            doctors.forEach((doctor) => {
                const div = document.createElement("div");
                div.className = "doctor-card";
                div.innerHTML = `<h4>${doctor.ten}</h4><p>${doctor.chuyenKhoa || "Đa khoa"}</p>`;
                div.onclick = () => showSchedule(doctor);
                doctorListEl.appendChild(div);
            });
        } catch (error) {
            console.error("Lỗi khi tải danh sách bác sĩ:", error);
            alert("Không thể tải danh sách bác sĩ. Vui lòng thử lại sau.");
        }
    }

    // Show schedule selection for a doctor
    function showSchedule(doctor) {
        selectedDoctor = doctor;
        doctorNameEl.textContent = doctor.ten;
        scheduleSection.style.display = "block";
        paymentSection.style.display = "none";
        myBookingsSection.style.display = "none";
        myExaminationsSection.style.display = "none";
    }

    // Handle schedule selection
    window.selectSchedule = function() {
        const radios = document.getElementsByName("schedule");
        for (let radio of radios) {
            if (radio.checked) {
                selectedSchedule = radio.value;
                paymentSection.style.display = "block";
                return;
            }
        }
        alert("Vui lòng chọn một khung giờ!");
    }

    // Submit booking to database
    window.submitBooking = async function() {
        const radios = document.getElementsByName("payment");
        let selectedPayment = null;

        for (let radio of radios) {
            if (radio.checked) {
                selectedPayment = radio.value;
                break;
            }
        }

        if (!selectedPayment) {
            alert("Vui lòng chọn phương thức thanh toán!");
            return;
        }

        try {
            // Create appointment data
            const today = new Date();
            const appointmentData = {
                lichKham: {
                    ngay: today.toISOString(),
                    gio: selectedSchedule === "Buổi sáng" ? "Sáng" : "Chiều",
                    benhNhanId: parseInt(userId),
                    bacSiId: selectedDoctor.id
                }
            };

            // Send data to API
            const response = await fetch("http://localhost:5000/appointment/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(appointmentData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Không thể đặt lịch khám");
            }

            alert(
                `Đặt lịch thành công:\nBác sĩ: ${selectedDoctor.ten}\nLịch: ${selectedSchedule}\nThanh toán: ${selectedPayment}`
            );

            // Reset form
            document.querySelector('input[name="schedule"]:checked').checked = false;
            document.querySelector('input[name="payment"]:checked').checked = false;
            scheduleSection.style.display = "none";
            paymentSection.style.display = "none";

            // Show updated bookings
            showMyBookings();
        } catch (error) {
            console.error("Lỗi khi đặt lịch khám:", error);
            alert("Không thể đặt lịch khám. Vui lòng thử lại sau.");
        }
    }

    // Show user's bookings
    window.showMyBookings = async function() {
        myBookingsTableBody.innerHTML = "";

        try {
            const response = await fetch(`http://localhost:5000/appointment/patient/${userId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Không thể tải lịch khám");
            }

            if (!data.appointments || data.appointments.length === 0) {
                myBookingsTableBody.innerHTML = `<tr><td colspan="4">Chưa có lịch khám nào.</td></tr>`;
            } else {
                // Get doctor information for each appointment
                for (const appointment of data.appointments) {
                    const doctorResponse = await fetch(`http://localhost:5000/user/${appointment.bacSiId}`);
                    const doctorData = await doctorResponse.json();
                    const doctor = doctorData.user || { ten: `Bác sĩ #${appointment.bacSiId}`, chuyenKhoa: "Không xác định" };

                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${doctor.ten}</td>
                        <td>${doctor.chuyenKhoa || "Đa khoa"}</td>
                        <td>${appointment.gio}</td>
                        <td>Đã thanh toán</td>
                    `;
                    myBookingsTableBody.appendChild(row);
                }
            }

            myBookingsSection.style.display = "block";
            scheduleSection.style.display = "none";
            paymentSection.style.display = "none";
            myExaminationsSection.style.display = "none";
        } catch (error) {
            console.error("Lỗi khi tải lịch khám:", error);
            alert("Không thể tải lịch khám. Vui lòng thử lại sau.");
        }
    }

    // Show user profile
    window.showProfile = function() {
        window.location.href = "profile.html";
    }

    // Show user's examination records
    window.showMyExaminations = async function() {
        myExaminationsTableBody.innerHTML = "";

        try {
            if (!userId) {
                alert("Vui lòng đăng nhập để xem đơn khám của bạn.");
                return;
            }

            const response = await fetch(`http://localhost:5000/examination/patient/${userId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Không thể tải đơn khám");
            }

            if (!data.examinations || data.examinations.length === 0) {
                myExaminationsTableBody.innerHTML = `<tr><td colspan="5">Chưa có đơn khám nào.</td></tr>`;
            } else {
                // Lấy thông tin bác sĩ để hiển thị tên
                const doctorPromises = data.examinations.map(exam => 
                    fetch(`http://localhost:5000/user/${exam.bacSiId}`)
                        .then(res => res.json())
                        .then(data => data.user)
                        .catch(() => null)
                );

                const doctors = await Promise.all(doctorPromises);

                data.examinations.forEach((exam, index) => {
                    const doctor = doctors[index] ? doctors[index].ten : `Bác sĩ #${exam.bacSiId}`;
                    const createdDate = new Date(exam.createdAt).toLocaleDateString("vi-VN");

                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${doctor}</td>
                        <td>${exam.benhLy || "Chưa có thông tin"}</td>
                        <td>${exam.mucDoBenh || "Chưa có thông tin"}</td>
                        <td>${exam.dieuTri || "Chưa có thông tin"}</td>
                        <td>${createdDate}</td>
                    `;
                    myExaminationsTableBody.appendChild(row);
                });
            }

            myExaminationsSection.style.display = "block";
            scheduleSection.style.display = "none";
            paymentSection.style.display = "none";
            myBookingsSection.style.display = "none";
        } catch (error) {
            console.error("Lỗi khi tải đơn khám:", error);
            alert("Không thể tải đơn khám. Vui lòng thử lại sau.");
        }
    }

    // Initialize
    loadDoctors();
});
