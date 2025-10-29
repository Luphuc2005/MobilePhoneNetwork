function navigateTo(section, event) {
  event.preventDefault();

  // Ẩn tất cả phần nội dung
  document
    .querySelectorAll(
      "#dashboard-content, #customers-content, #pricing-content, #other-content", "#products-content",
      "#import-content"
    )
    .forEach((div) => (div.style.display = "none"));

  // Hiển thị phần tương ứng
  if (section === "dashboard") {
    document.getElementById("dashboard-content").style.display = "block";
  } else if (section === "customers") {
    document.getElementById("customers-content").style.display = "block";
  } else if (section === "pricing") {
    document.getElementById("pricing-content").style.display = "block";
    } else if (section === "products") {
    document.getElementById("products-content").style.display = "block";
  } else if (section === "import") {
    document.getElementById("import-content").style.display = "block";
    // Initialize pricing module
    setTimeout(() => {
      if (typeof initializePricing === "function") {
        initializePricing();
      }
    }, 100);
  } else if (section === "orders") {
    document.getElementById("orders-content").style.display = "block";
    console.log(document.getElementById("orders-id"));
  } else if(section === "inventory") {
    document.getElementById("inventory-content").style.display = "block";
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
    showConfirmDialog(
      "Xác nhận Reset Mật khẩu",
      "Bạn có chắc chắn muốn reset mật khẩu về <strong>123123</strong> không?",
      () => {
        const editPasswordInput = document.getElementById("editPassword");
        if (editPasswordInput) {
          const newPassword = "123123";
          editPasswordInput.value = newPassword;
          // Cập nhật vào users array
          if (editingIndex !== null) {
            users[editingIndex].password = newPassword;
            localStorage.setItem("users", JSON.stringify(users));
          }
          showSuccessNotification(
            "✅ Reset Mật khẩu Thành công!",
            `Mật khẩu mới: <strong>${newPassword}</strong><br>Vui lòng lưu lại thông tin này.`
          );
        }
      }
    );
  };
}

// Nút toggle hiển thị password
const togglePasswordBtn = document.getElementById("togglePasswordBtn");
if (togglePasswordBtn) {
  togglePasswordBtn.onclick = (e) => {
    e.preventDefault(); // Ngăn submit form
    const editPasswordInput = document.getElementById("editPassword");
    if (editPasswordInput) {
      if (editPasswordInput.type === "password") {
        editPasswordInput.type = "text";
        togglePasswordBtn.innerHTML =
          '<img src="assets/images/icons/eyeoff.png" alt="Ẩn" style="width: 20px; height: 20px;" />';
      } else {
        editPasswordInput.type = "password";
        togglePasswordBtn.innerHTML =
          '<img src="assets/images/icons/eye.png" alt="Hiện" style="width: 20px; height: 20px;" />';
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
  editPasswordInput.value = u.password || ""; // Hiển thị mật khẩu
  editPasswordInput.type = "password"; // Ẩn mật khẩu mặc định
  // Reset icon mắt về hiện (để admin có thể click xem)
  if (togglePasswordBtn) {
    togglePasswordBtn.innerHTML =
      '<img src="assets/images/icons/eye.png" alt="Hiện" style="width: 20px; height: 20px;" />';
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
      '<img src="assets/images/icons/eye.png" alt="Hiện" style="width: 20px; height: 20px;" />';
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
  const isLocked = u.trangthai === "Đã khóa";
  const action = isLocked ? "mở khóa" : "khóa";
  const actionIcon = isLocked ? "🔓" : "🔒";

  showConfirmDialog(
    `Xác nhận ${action.charAt(0).toUpperCase() + action.slice(1)} Tài khoản`,
    `Bạn có chắc chắn muốn <strong>${action}</strong> tài khoản của <strong>${u.name}</strong> không?<br><small>Email: ${u.email}</small>`,
    () => {
      if (isLocked) {
        u.trangthai = "Hoạt động";
        showSuccessNotification(
          `${actionIcon} Mở khóa Thành công!`,
          `Tài khoản <strong>${u.name}</strong> đã được kích hoạt lại.`
        );
      } else {
        u.trangthai = "Đã khóa";
        showSuccessNotification(
          `${actionIcon} Khóa Tài khoản Thành công!`,
          `Tài khoản <strong>${u.name}</strong> đã bị khóa. Người dùng không thể đăng nhập.`
        );
      }
      localStorage.setItem("users", JSON.stringify(users));
      renderUsers();
    }
  );
}

// === Xóa ===
function deleteUser(index) {
  const u = users[index];
  showConfirmDialog(
    "⚠️ Xác nhận Xóa Người dùng",
    `Bạn có chắc chắn muốn <strong>xóa vĩnh viễn</strong> người dùng <strong>${u.name}</strong> không?<br><small>Email: ${u.email}</small><br><br><span style="color: red;">Hành động này không thể hoàn tác!</span>`,
    () => {
      users.splice(index, 1);
      localStorage.setItem("users", JSON.stringify(users));
      renderUsers();
      showSuccessNotification(
        "🗑️ Xóa Thành công!",
        `Người dùng <strong>${u.name}</strong> đã được xóa khỏi hệ thống.`
      );
    }
  );
}

// ====== HỘP THOẠI XÁC NHẬN (CONFIRM DIALOG) ======
function showConfirmDialog(title, message, onConfirm) {
  // Tạo overlay
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: fadeIn 0.2s ease;
  `;

  // Tạo dialog box
  const dialog = document.createElement("div");
  dialog.style.cssText = `
    background: white;
    border-radius: 16px;
    padding: 25px 30px;
    max-width: 450px;
    width: 90%;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    animation: slideDown 0.3s ease;
  `;

  dialog.innerHTML = `
    <h3 style="margin: 0 0 15px 0; font-size: 20px; color: #1f2937;">${title}</h3>
    <p style="margin: 0 0 25px 0; font-size: 15px; color: #4b5563; line-height: 1.6;">${message}</p>
    <div style="display: flex; gap: 10px; justify-content: flex-end;">
      <button id="confirmCancel" style="
        background: #f3f4f6;
        color: #374151;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: 0.2s;
      ">Hủy</button>
      <button id="confirmOk" style="
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: 0.2s;
      ">Xác nhận</button>
    </div>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  // Xử lý sự kiện
  const btnCancel = dialog.querySelector("#confirmCancel");
  const btnOk = dialog.querySelector("#confirmOk");

  btnCancel.onclick = () => {
    overlay.remove();
  };

  btnOk.onclick = () => {
    overlay.remove();
    if (onConfirm) onConfirm();
  };

  // Đóng khi click overlay
  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
  };

  // Hover effects
  btnCancel.onmouseover = () => {
    btnCancel.style.background = "#e5e7eb";
  };
  btnCancel.onmouseout = () => {
    btnCancel.style.background = "#f3f4f6";
  };
  btnOk.onmouseover = () => {
    btnOk.style.transform = "scale(1.05)";
  };
  btnOk.onmouseout = () => {
    btnOk.style.transform = "scale(1)";
  };
}

// ====== THÔNG BÁO THÀNH CÔNG (SUCCESS NOTIFICATION) ======
function showSuccessNotification(title, message) {
  // Tạo notification box
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    padding: 20px 25px;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
    z-index: 10000;
    max-width: 400px;
    animation: slideInRight 0.4s ease;
  `;

  notification.innerHTML = `
    <div style="display: flex; align-items: start; gap: 12px;">
      <div style="font-size: 24px;">✓</div>
      <div style="flex: 1;">
        <h4 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 700;">${title}</h4>
        <p style="margin: 0; font-size: 14px; opacity: 0.95; line-height: 1.5;">${message}</p>
      </div>
      <button id="closeNotification" style="
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
        opacity: 0.8;
        transition: 0.2s;
      ">×</button>
    </div>
  `;

  document.body.appendChild(notification);

  // Nút đóng
  const closeBtn = notification.querySelector("#closeNotification");
  closeBtn.onclick = () => {
    notification.style.animation = "slideOutRight 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  };
  closeBtn.onmouseover = () => {
    closeBtn.style.opacity = "1";
  };
  closeBtn.onmouseout = () => {
    closeBtn.style.opacity = "0.8";
  };

  // Tự động đóng sau 5 giây
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.style.animation = "slideOutRight 0.3s ease";
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// ====== KEYFRAMES CHO ANIMATIONS ======
const style = document.createElement("style");
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  @keyframes slideOutRight {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100px);
    }
  }
`;
document.head.appendChild(style);
