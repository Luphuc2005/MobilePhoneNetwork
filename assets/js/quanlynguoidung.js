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
btnAdd.onclick = () => (modal.style.display = "flex"); // Mở modal
closeBtn.onclick = () => (modal.style.display = "none"); // Đóng modal
cancelBtn.onclick = () => (modal.style.display = "none"); // Đóng modal khi bấm hủy
window.onclick = (e) => {
  // Đóng modal khi click ra ngoài vùng modal
  if (e.target === modal) modal.style.display = "none";
};

// Hàm lấy dữ liệu từ form modal (thêm/sửa)
function getUserFormData(modalSelector) {
  const modalEl = document.querySelector(modalSelector);
  const input = modalEl.querySelectorAll("input");
  const select = modalEl.querySelector("select");
  return {
    name: input[0].value.trim(), // Họ tên
    email: input[1].value.trim(), // Email
    phone: input[2].value.trim(), // Số điện thoại
    role: select ? select.options[select.selectedIndex].text.trim() : "", // Vai trò (lấy text hiển thị)
    password: input[3] ? input[3].value.trim() : "", // Mật khẩu
  };
}

// ====== Xử lý lưu người dùng mới ======
saveBtn.onclick = () => {
  // Lấy dữ liệu từ form
  const { name, email, phone, role, password } = getUserFormData("#modal");
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
    role,
    orders: 0,
    joinDate: new Date().toLocaleDateString(),
  };
  users.push(newUser); // Thêm vào mảng
  localStorage.setItem("users", JSON.stringify(users)); // Lưu vào localStorage
  modal.style.display = "none"; // Đóng modal
  document.querySelectorAll("#modal input").forEach((i) => (i.value = "")); // Xóa input
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
    const newRow = document.createElement("div");
    newRow.classList.add("table-row");
    newRow.innerHTML = `
      <div>#${start + i + 1}</div>
      <div>${user.name}</div>
      <div>${user.email}</div>
      <div>${user.phone}</div>
      <div class="col status active">${user.role}</div>
      <div>${user.orders}</div>
      <div>${user.joinDate}</div>
      <div class="col actions">
        <button><img src="assets/images/icons/eye1.png" alt="Xem" /></button>
        <button><img src="assets/images/icons/sua.png" alt="Sửa" /></button>
        <button><img src="assets/images/icons/khoa.png" alt="Khóa" /></button>
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
          role: cells[4].textContent,
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
            role: "Quản trị viên",
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

// === Xem người dùng ===
function viewUser(index) {
  editingIndex = index;
  const u = users[index];
  document.getElementById("editModalTitle").textContent =
    "Xem thông tin người dùng";
  document.getElementById("editName").value = u.name;
  document.getElementById("editEmail").value = u.email;
  document.getElementById("editPhone").value = u.phone;
  // Đặt đúng option cho select role
  const editRoleSelect = document.getElementById("editRole");
  if (editRoleSelect) {
    Array.from(editRoleSelect.options).forEach((opt) => {
      opt.selected = opt.text.trim() === u.role.trim();
    });
  }
  // Khóa input để chỉ xem
  document
    .querySelectorAll("#editModal input, #editModal select")
    .forEach((el) => {
      el.disabled = true;
    });
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
  // Đặt đúng option cho select role
  const editRoleSelect = document.getElementById("editRole");
  if (editRoleSelect) {
    Array.from(editRoleSelect.options).forEach((opt) => {
      opt.selected = opt.text.trim() === u.role.trim();
    });
  }
  // Cho phép nhập lại
  document
    .querySelectorAll("#editModal input, #editModal select")
    .forEach((el) => {
      el.disabled = false;
    });
  saveEdit.style.display = "inline-block";
  editModal.style.display = "flex";
}

// === Lưu chỉnh sửa ===
saveEdit.onclick = () => {
  const name = document.getElementById("editName").value.trim();
  const email = document.getElementById("editEmail").value.trim();
  const phone = document.getElementById("editPhone").value.trim();
  // Lấy text hiển thị của option được chọn
  const editRoleSelect = document.getElementById("editRole");
  const role = editRoleSelect
    ? editRoleSelect.options[editRoleSelect.selectedIndex].text.trim()
    : "";
  if (!name || !email || !phone) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }
  users[editingIndex].name = name;
  users[editingIndex].email = email;
  users[editingIndex].phone = phone;
  users[editingIndex].role = role;
  localStorage.setItem("users", JSON.stringify(users));
  renderUsers();
  editModal.style.display = "none";
};

// === Khóa / Mở khóa ===
function toggleLockUser(index) {
  const u = users[index];
  if (u.role === "Đã khóa") {
    u.role = "Người dùng";
  } else {
    u.role = "Đã khóa";
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
