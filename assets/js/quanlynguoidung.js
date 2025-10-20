function navigateTo(section, event) {
  event.preventDefault();

  // Ẩn tất cả phần nội dung
  document
    .querySelectorAll("#dashboard-content, #customers-content, #other-content")
    .forEach((div) => (div.style.display = "none"));

  // Hiển thị phần tương ứng
  if (section === "dashboard") {
    document.getElementById("dashboard-content").style.display = "block";
  } else if (section === "customers") {
    document.getElementById("customers-content").style.display = "block";
  } else {
    document.getElementById("other-content").style.display = "block";
  }
}

let searchQuery = "";
const searchInput = document.getElementById("userSearchInput");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    // Ngăn chặn nếu modal đang mở (tránh conflict focus)
    if (
      document.getElementById("modal").style.display === "flex" ||
      document.getElementById("editModal").style.display === "flex"
    ) {
      return;
    }
    searchQuery = e.target.value.trim().toLowerCase();
    currentPage = 1;
    renderUsers();
  });
}

// ====== Biến DOM và biến toàn cục ======
// Lưu các phần tử HTML và biến dùng chung cho quản lý người dùng
const modal = document.getElementById("modal"); // Modal thêm người dùng
const btnAdd = document.getElementById("btnAddUser"); // Nút thêm người dùng
const closeBtn = document.querySelector(".close"); // Nút đóng modal
const cancelBtn = document.querySelector(".cancel"); // Nút hủy modal
const saveBtn = document.querySelector(".save"); // Nút lưu người dùng
const userTable = document.querySelector(".user-table"); // Bảng danh sách người dùng
let users = []; // Mảng lưu danh sách người dùng
let currentPage = 1; // Trang hiện tại
const usersPerPage = 5; // Số người dùng mỗi trang

// ====== Sự kiện mở/đóng modal thêm người dùng ======
btnAdd.onclick = () => {
  modal.style.display = "flex";
  // Đặt mặc định trạng thái là "Hoạt động" khi mở modal thêm mới
  const trangThaiSelect = document.querySelector("#modal select");
  if (trangThaiSelect) {
    trangThaiSelect.value = "Hoạt động";
  }
  // Focus vào input name đầu tiên để tránh nhảy sang search
  const nameInput = document.querySelector("#modal input:nth-of-type(1)");
  if (nameInput) {
    nameInput.focus();
  }
}; // Mở modal
closeBtn.onclick = () => (modal.style.display = "none"); // Đóng modal
cancelBtn.onclick = () => (modal.style.display = "none"); // Đóng modal khi bấm hủy
window.onclick = (e) => {
  // Đóng modal khi click ra ngoài vùng modal
  if (e.target === modal) modal.style.display = "none";
};

// Hàm lấy dữ liệu từ form modal (thêm/sửa)
function getUserFormData(modalSelector) {
  const modalEl = document.querySelector(modalSelector);
  const inputs = modalEl.querySelectorAll("input");
  const select = modalEl.querySelector("select");
  return {
    name: inputs[0].value.trim(), // Họ tên
    email: inputs[1].value.trim(), // Email
    phone: inputs[2].value.trim(), // Số điện thoại
    password: inputs[3] ? inputs[3].value.trim() : "", // Mật khẩu
    trangthai: select ? select.value : "Hoạt động", // Trạng thái (mặc định Hoạt động)
  };
}

// ====== Xử lý lưu người dùng mới ======
saveBtn.onclick = () => {
  // Lấy dữ liệu từ form
  const { name, email, phone, password, trangthai } = getUserFormData("#modal");
  // Kiểm tra dữ liệu hợp lệ
  if (!name || !email || !phone || !password) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }
  // Tạo object người dùng mới
  const newUser = {
    id: users.length + 1,
    name,
    email,
    phone,
    password, // Lưu mật khẩu
    trangthai: trangthai || "Hoạt động", // Đảm bảo mặc định "Hoạt động"
    orders: 0,
    joinDate: new Date().toLocaleDateString(),
  };
  users.push(newUser); // Thêm vào mảng
  localStorage.setItem("users", JSON.stringify(users)); // Lưu vào localStorage
  modal.style.display = "none"; // Đóng modal
  document.querySelectorAll("#modal input").forEach((i) => (i.value = "")); // Xóa input
  const trangThaiSelect = document.querySelector("#modal select");
  if (trangThaiSelect) {
    trangThaiSelect.value = "Hoạt động"; // Reset select về mặc định
  }
  renderUsers(); // Vẽ lại bảng
};

// ====== Hiển thị danh sách người dùng ra bảng ======
function renderUsers() {
  // Xóa các dòng cũ (giữ lại header)
  document.querySelectorAll(".table-row").forEach((row, i) => {
    if (i > 0) row.remove();
  });
  // Lọc danh sách theo từ khóa tìm kiếm
  let filteredUsers = users;
  if (searchQuery) {
    filteredUsers = users.filter(
      (u) =>
        u.name.toLowerCase().includes(searchQuery) ||
        u.email.toLowerCase().includes(searchQuery) ||
        u.phone.toLowerCase().includes(searchQuery)
    );
  }
  // Phân trang
  const start = (currentPage - 1) * usersPerPage;
  const end = start + usersPerPage;
  const userToShow = filteredUsers.slice(start, end);
  // Vẽ từng dòng người dùng
  userToShow.forEach((user, i) => {
    const trangthai = user.trangthai || "Hoạt động";
    const lockIconSrc =
      trangthai === "Hoạt động"
        ? "assets/images/icons/khoa.png"
        : "assets/images/icons/3d-unlocked.png";
    const lockAlt = trangthai === "Hoạt động" ? "Khóa" : "Mở khóa";
    const trangthaiColor = trangthai === "Hoạt động" ? "green" : "red"; // Màu xanh cho Hoạt động, đỏ cho Đã khóa
    const newRow = document.createElement("div");
    newRow.classList.add("table-row");
    newRow.innerHTML = `
      <div>#${start + i + 1}</div>
      <div>${user.name}</div>
      <div>${user.email}</div>
      <div>${user.phone}</div>
      <div style="color: ${trangthaiColor};">${trangthai}</div>
      <div>${user.orders}</div>
      <div>${user.joinDate}</div>
      <div class="col actions">
        <button><img src="assets/images/icons/eye1.png" alt="Xem" /></button>
        <button><img src="assets/images/icons/sua.png" alt="Sửa" /></button>
        <button><img src="${lockIconSrc}" alt="${lockAlt}" /></button>
        <button><img src="assets/images/icons/xoa.png" alt="Xóa" /></button>
      </div>
    `;
    userTable.appendChild(newRow);
  });
  renderPagination(filteredUsers.length); // Vẽ phân trang
  updateUserInfo(filteredUsers.length); // Cập nhật info tổng số
  attachActionEvents(); // Gắn lại sự kiện cho nút
}

// phân trang
function renderPagination(totalCount) {
  const total = typeof totalCount === "number" ? totalCount : users.length;
  const totalPages = Math.ceil(total / usersPerPage);
  const pageNumbers = document.getElementById("pageNumbers");
  pageNumbers.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.onclick = () => {
      currentPage = i;
      renderUsers();
    };
    pageNumbers.appendChild(btn);
  }
  document.getElementById("prevPage").disabled = currentPage === 1;
  document.getElementById("nextPage").disabled = currentPage === totalPages;
}

// ====== THÔNG TIN HIỂN THỊ ======
function updateUserInfo(filteredCount) {
  const total =
    typeof filteredCount === "number" ? filteredCount : users.length;
  const start = (currentPage - 1) * usersPerPage + 1;
  const end = Math.min(currentPage * usersPerPage, total);
  // Cập nhật thông tin hiển thị có sẵn trong HTML
  const infoElement = document.querySelector(
    '.user-management > div[style*="margin: 10px 0 0 10px"]'
  );
  if (infoElement) {
    infoElement.textContent = `Hiển thị ${start}-${end} trong tổng số ${total} người dùng`;
  }
}

// ====== NÚT TRƯỚC / SAU ======
document.getElementById("prevPage").onclick = () => {
  if (currentPage > 1) {
    currentPage--;
    renderUsers();
  }
};
document.getElementById("nextPage").onclick = () => {
  const totalPages = Math.ceil(users.length / usersPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderUsers();
  }
};

// ====== LOAD DỮ LIỆU KHI VÀO TRANG ======
window.onload = () => {
  // Lấy dữ liệu từ localStorage nếu có
  const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
  // Lấy dữ liệu có sẵn trong HTML (nếu có)
  const htmlUsers = Array.from(document.querySelectorAll(".table-row"))
    .slice(1)
    .map((row, index) => {
      const cells = row.querySelectorAll("div");
      if (cells.length >= 7) {
        return {
          id: index + 1,
          name: cells[1].textContent,
          email: cells[2].textContent,
          phone: cells[3].textContent,
          password: "", // Mặc định rỗng nếu không có
          trangthai: cells[4].textContent || "Hoạt động", // Đảm bảo mặc định nếu thiếu
          orders: parseInt(cells[5].textContent) || 0,
          joinDate: cells[6].textContent,
        };
      }
      return null;
    })
    .filter(Boolean);
  // Kết hợp dữ liệu từ HTML và localStorage, loại trùng email
  const allUsers = [
    ...htmlUsers,
    ...savedUsers.filter((u) => !htmlUsers.some((h) => h.email === u.email)),
  ];
  users =
    allUsers.length > 0
      ? allUsers
      : [
          {
            id: 1,
            name: "Lư Hồng Phúc",
            email: "phucga150625@email.com",
            phone: "0866680197",
            password: "", // Mặc định rỗng
            trangthai: "Hoạt động", // Mặc định
            orders: 12,
            joinDate: "01/01/2024",
          },
        ];
  renderUsers();
};
// === Xử lý Xem / Sửa / Khóa / Xóa ===
function attachActionEvents() {
  const rows = document.querySelectorAll(".table-row");
  rows.forEach((row, i) => {
    if (i === 0) return; // bỏ qua header
    const buttons = row.querySelectorAll("button");
    if (buttons.length === 4) {
      buttons[0].onclick = () => viewUser(i - 1);
      buttons[1].onclick = () => editUser(i - 1);
      buttons[2].onclick = () => toggleLockUser(i - 1);
      buttons[3].onclick = () => deleteUser(i - 1);
    }
  });
}

// === Modal xem/sửa ===
const editModal = document.getElementById("editModal");
const closeEdit = document.querySelector(".close-edit");
const cancelEdit = document.querySelector(".cancel-edit");
const saveEdit = document.querySelector(".save-edit");
let editingIndex = null;

// Đóng modal
closeEdit.onclick = cancelEdit.onclick = () =>
  (editModal.style.display = "none");

window.onclick = (e) => {
  if (e.target === editModal) editModal.style.display = "none";
};

// Nút reset mật khẩu (chỉ trong edit mode)
const resetPasswordBtn = document.getElementById("resetPasswordBtn");
if (resetPasswordBtn) {
  // Làm đẹp nút reset
  resetPasswordBtn.style.cssText = `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 12px;
    font-weight: bold;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
  `;
  resetPasswordBtn.onmouseover = () => {
    resetPasswordBtn.style.transform = "scale(1.05)";
    resetPasswordBtn.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
  };
  resetPasswordBtn.onmouseout = () => {
    resetPasswordBtn.style.transform = "scale(1)";
    resetPasswordBtn.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
  };
  resetPasswordBtn.onclick = () => {
    const editPasswordInput = document.getElementById("editPassword");
    if (editPasswordInput) {
      editPasswordInput.value = "123123"; // Reset về mật khẩu mặc định
      alert("Mật khẩu đã được reset về 123123!");
    }
  };
}

// Nút toggle hiển thị password (mắt)
const togglePasswordBtn = document.getElementById("togglePasswordBtn");
if (togglePasswordBtn) {
  togglePasswordBtn.onclick = () => {
    const editPasswordInput = document.getElementById("editPassword");
    if (editPasswordInput) {
      if (editPasswordInput.type === "password") {
        editPasswordInput.type = "text";
        togglePasswordBtn.innerHTML =
          '<img src="assets/images/icons/eye-off.png" alt="Ẩn" />'; // Giả sử có icon eye-off
      } else {
        editPasswordInput.type = "password";
        togglePasswordBtn.innerHTML =
          '<img src="assets/images/icons/eye.png" alt="Hiện" />'; // Giả sử có icon eye
      }
    }
  };
}

// === Xem người dùng ===
function viewUser(index) {
  editingIndex = index;
  const u = users[index];
  document.getElementById("editModalTitle").textContent =
    "Xem thông tin người dùng";
  document.getElementById("editName").value = u.name;
  document.getElementById("editEmail").value = u.email;
  document.getElementById("editPhone").value = u.phone;
  const editPasswordInput = document.getElementById("editPassword");
  editPasswordInput.value = u.password || ""; // Hiển thị mật khẩu cũ (ẩn mặc định)
  editPasswordInput.type = "password"; // Đảm bảo ẩn khi xem
  // Reset icon mắt về hiện
  if (togglePasswordBtn) {
    togglePasswordBtn.innerHTML =
      '<img src="assets/images/icons/eye.png" alt="Hiện" />';
  }
  // Đặt đúng option cho select trạng thái
  const editTrangThaiSelect = document.getElementById("editTrangThai");
  if (editTrangThaiSelect) {
    Array.from(editTrangThaiSelect.options).forEach((opt) => {
      opt.selected = opt.value === (u.trangthai || "Hoạt động");
    });
  }
  // Khóa input để chỉ xem
  document
    .querySelectorAll("#editModal input:not(#editPassword), #editModal select")
    .forEach((el) => {
      el.disabled = true;
    });
  // Password vẫn có thể toggle để xem (không disabled)
  editPasswordInput.disabled = false; // Cho phép toggle xem password
  // Ẩn nút reset khi chỉ xem
  if (resetPasswordBtn) resetPasswordBtn.style.display = "none";
  saveEdit.style.display = "none";
  editModal.style.display = "flex";
}

// === Sửa người dùng ===
function editUser(index) {
  editingIndex = index;
  const u = users[index];
  document.getElementById("editModalTitle").textContent =
    "Chỉnh sửa người dùng";
  document.getElementById("editName").value = u.name;
  document.getElementById("editEmail").value = u.email;
  document.getElementById("editPhone").value = u.phone;
  const editPasswordInput = document.getElementById("editPassword");
  editPasswordInput.value = u.password || ""; // Hiển thị password cũ (ẩn mặc định)
  editPasswordInput.type = "password"; // Ẩn mặc định, có thể toggle
  // Reset icon mắt về hiện
  if (togglePasswordBtn) {
    togglePasswordBtn.innerHTML =
      '<img src="assets/images/icons/eye.png" alt="Hiện" />';
  }
  // Đặt đúng option cho select trạng thái
  const editTrangThaiSelect = document.getElementById("editTrangThai");
  if (editTrangThaiSelect) {
    Array.from(editTrangThaiSelect.options).forEach((opt) => {
      opt.selected = opt.value === (u.trangthai || "Hoạt động");
    });
  }
  // Cho phép nhập lại (bao gồm password)
  document
    .querySelectorAll("#editModal input, #editModal select")
    .forEach((el) => {
      el.disabled = false;
    });
  // Hiện nút reset khi edit
  if (resetPasswordBtn) resetPasswordBtn.style.display = "inline-block";
  saveEdit.style.display = "inline-block";
  editModal.style.display = "flex";
  // Focus vào input name đầu tiên khi mở edit modal
  const editNameInput = document.getElementById("editName");
  if (editNameInput) {
    editNameInput.focus();
  }
}

// === Lưu chỉnh sửa ===
saveEdit.onclick = () => {
  const name = document.getElementById("editName").value.trim();
  const email = document.getElementById("editEmail").value.trim();
  const phone = document.getElementById("editPhone").value.trim();
  const password = document.getElementById("editPassword").value.trim(); // Lấy mật khẩu mới
  // Lấy value của option được chọn cho trạng thái
  const editTrangThaiSelect = document.getElementById("editTrangThai");
  const trangthai = editTrangThaiSelect
    ? editTrangThaiSelect.value
    : "Hoạt động";
  if (!name || !email || !phone || !password) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }
  users[editingIndex].name = name;
  users[editingIndex].email = email;
  users[editingIndex].phone = phone;
  users[editingIndex].password = password; // Cập nhật mật khẩu
  users[editingIndex].trangthai = trangthai; // Sử dụng giá trị từ select, fallback "Hoạt động"
  localStorage.setItem("users", JSON.stringify(users));
  renderUsers();
  editModal.style.display = "none";
};

// === Khóa / Mở khóa ===
function toggleLockUser(index) {
  const u = users[index];
  if (u.trangthai === "Đã khóa") {
    u.trangthai = "Hoạt động";
  } else {
    u.trangthai = "Đã khóa";
  }
  localStorage.setItem("users", JSON.stringify(users));
  renderUsers();
}

// === Xóa ===
function deleteUser(index) {
  if (confirm("Bạn có chắc muốn xóa người dùng này không?")) {
    users.splice(index, 1);
    localStorage.setItem("users", JSON.stringify(users));
    renderUsers();
  }
}
