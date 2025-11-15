// ============================================================
// QUẢN LÝ KHÁCH HÀNG - PROFESSIONAL VERSION
// Đọc dữ liệu từ user-local-storage.js
// ============================================================

// ====== BIẾN TOÀN CỤC ======
let users = [];
let currentPage = 1;
const usersPerPage = 5;
let searchQuery = "";
let statusFilter = "all";
let sortBy = "id";
let editingIndex = null;
let totalFilteredUsers = 0; // Số lượng users sau khi filter

// ====== DOM ELEMENTS (Sẽ được lấy sau khi DOM load) ====== lữu trữ tham chiếu
let modal,
  editModal,
  btnAdd,
  userTableBody,
  searchInput,
  filterStatusSelect,
  sortBySelect;

// ====== VALIDATION HELPERS ======
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

// ====== NOTIFICATION HELPERS ======
function showNotification(title, message, type = "success") {
  const bgColor =
    type === "success"
      ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
      : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)";
  const icon = type === "success" ? "OK" : "Chưa được";

  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${bgColor};
    color: white;
    padding: 20px 25px;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    z-index: 10000; 
    max-width: 400px;
    animation: slideInRight 0.4s ease;
  `;

  notification.innerHTML = `
    <div style="display: flex; align-items: start; gap: 12px;">
      <div style="font-size: 24px;">${icon}</div>
      <div style="flex: 1;">
        <h4 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 700;">${title}</h4>
        <p style="margin: 0; font-size: 14px; opacity: 0.95; line-height: 1.5;">${message}</p>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" style="
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
        opacity: 0.8;
      ">×</button>
    </div>
  `;

  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 5000); // 5000ms = 5s
}

function showConfirmDialog(title, message, onConfirm) {
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
      <button class="btn-cancel" style="
        background: #f3f4f6;
        color: #374151;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
      ">Hủy</button>
      <button class="btn-ok" style="
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
      ">Xác nhận</button>
    </div>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  dialog.querySelector(".btn-cancel").onclick = () => overlay.remove();
  dialog.querySelector(".btn-ok").onclick = () => {
    overlay.remove();
    if (onConfirm) onConfirm();
  };
  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
  };
}

// ====== STATISTICS UPDATE ======
function updateStatistics() {
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.trangthai === "active").length;
  const lockedUsers = users.filter((u) => u.trangthai === "locked").length;
  let totalOrders = 0;
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const orders = user.orders || 0;
    totalOrders += orders;
  }

  document.getElementById("totalUsersCount").textContent = totalUsers;
  document.getElementById("activeUsersCount").textContent = activeUsers;
  document.getElementById("lockedUsersCount").textContent = lockedUsers;
  document.getElementById("totalOrdersCount").textContent = totalOrders;
}

// ====== RENDER USERS ======
function renderUsers() {
  if (!userTableBody) {
    return;
  }

  userTableBody.innerHTML = "";

  // Filter
  let filteredUsers = users;

  if (searchQuery) {
    filteredUsers = filteredUsers.filter(
      (u) =>
        (u.name && u.name.toLowerCase().includes(searchQuery)) ||
        (u.email && u.email.toLowerCase().includes(searchQuery)) ||
        (u.phone && u.phone.toLowerCase().includes(searchQuery)) ||
        (u.address && u.address.toLowerCase().includes(searchQuery)) ||
        (u.id && u.id.toString().includes(searchQuery))
    );
  }

  if (statusFilter !== "all") {
    filteredUsers = filteredUsers.filter((u) => u.trangthai === statusFilter);
  }

  // Sort
  filteredUsers.sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "joinDate") {
      const dateA = parseVietnameseDate(a.joinDate);
      const dateB = parseVietnameseDate(b.joinDate);
      return dateB - dateA;
    }
    if (sortBy === "orders") return (b.orders || 0) - (a.orders || 0);
    return a.id - b.id;
  });

  // Check if no results
  if (filteredUsers.length === 0) {
    userTableBody.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; color: #64748b;">
        <div style="font-size: 64px; margin-bottom: 16px;">🔍</div>
        <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">Không tìm thấy khách hàng</div>
        <div style="font-size: 14px;">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</div>
      </div>
    `;
    totalFilteredUsers = 0;
    renderPagination(0);
    updateUserInfo(0);
    updateStatistics();
    return;
  }

  // Reset currentPage nếu vượt quá số trang
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  // Pagination
  const start = (currentPage - 1) * usersPerPage;
  const end = start + usersPerPage;
  const userToShow = filteredUsers.slice(start, end);

  // Render rows
  userToShow.forEach((user, index) => {
    const actualIndex = users.findIndex((u) => u.id === user.id);
    const isActive = user.trangthai === "active";
    const statusBadge = isActive
      ? '<span style="background: #d1fae5; color: #065f46; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;"> Hoạt động</span>'
      : '<span style="background: #fee2e2; color: #991b1b; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;"> Đã khóa</span>';

    const lockIcon = isActive ? "khoa.png" : "3d-unlocked.png";
    const lockTitle = isActive ? "Khóa tài khoản" : "Mở khóa tài khoản";

    const row = document.createElement("div");
    row.style.cssText = `
    display: grid;
    grid-template-columns: 60px 1.8fr 2fr 120px 2.2fr 110px 80px 100px 180px;
    gap: 10px;
    padding: 14px 16px;
    border-bottom: 1px solid #e2e8f0;
    align-items: center;
    transition: all 0.2s;
    font-size: 13px;
  `;
    row.onmouseover = () => (row.style.background = "#f8fafc");
    row.onmouseout = () => (row.style.background = "white");

    const truncateText = (text, maxLength) => {
      if (!text) return "Chưa cập nhật";
      return text.length > maxLength
        ? text.substring(0, maxLength) + "..."
        : text;
    };

    row.innerHTML = `
    <div style="text-align: center; font-weight: 700; color: #667eea; font-size: 14px;">#${
      user.id
    }</div>
    <div style="font-weight: 600; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${
      user.name
    }</div>
    <div style="color: #64748b; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${
      user.email
    }</div>
    <div style="color: #475569; text-align: center;">${user.phone}</div>
    <div style="color: #64748b; font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${
      user.address || "Chưa cập nhật"
    }">${truncateText(user.address, 35)}</div>
    <div style="text-align: center;">${statusBadge}</div>
    <div style="text-align: center; font-weight: 700; color: #f59e0b; font-size: 14px;">${
      user.orders || 0
    }</div>
    <div style="text-align: center; color: #64748b; font-size: 11px;">${
      user.joinDate
    }</div>
    <div style="display: flex; gap: 6px; justify-content: center;">
      <button onclick="viewUser(${actualIndex})" title="Xem chi tiết" style="padding: 7px 10px; border: 2px solid #3b82f6; background: white; border-radius: 8px; cursor: pointer; transition: all 0.3s;">
        <img src="assets/images/icons/eye1.png" alt="Xem" style="width: 15px; height: 15px; display: block;" />
      </button>
      <button onclick="editUser(${actualIndex})" title="Chỉnh sửa" style="padding: 7px 10px; border: 2px solid #10b981; background: white; border-radius: 8px; cursor: pointer; transition: all 0.3s;">
        <img src="assets/images/icons/sua.png" alt="Sửa" style="width: 15px; height: 15px; display: block;" />
      </button>
      <button onclick="toggleLockUser(${actualIndex})" title="${lockTitle}" style="padding: 7px 10px; border: 2px solid #f59e0b; background: white; border-radius: 8px; cursor: pointer; transition: all 0.3s;">
        <img src="assets/images/icons/${lockIcon}" alt="Khóa" style="width: 15px; height: 15px; display: block;" />
      </button>
      <button onclick="deleteUser(${actualIndex})" title="Xóa" style="padding: 7px 10px; border: 2px solid #ef4444; background: white; border-radius: 8px; cursor: pointer; transition: all 0.3s;">
        <img src="assets/images/icons/xoa.png" alt="Xóa" style="width: 15px; height: 15px; display: block;" />
      </button>
    </div>
  `;

    userTableBody.appendChild(row);
  });

  // Lưu số lượng users sau khi filter vào biến global
  totalFilteredUsers = filteredUsers.length;

  renderPagination(totalFilteredUsers);
  updateUserInfo(totalFilteredUsers);
  updateStatistics();
}

// ====== PARSE VIETNAMESE DATE ======
function parseVietnameseDate(dateStr) {
  const parts = dateStr.split("/");
  return new Date(parts[2], parts[1] - 1, parts[0]);
}

// ====== PAGINATION ======
function renderPagination(totalCount) {
  const totalPages = Math.ceil(totalCount / usersPerPage);
  const pageNumbers = document.getElementById("pageNumbers");
  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");

  if (!pageNumbers || !prevPageBtn || !nextPageBtn) {
    console.error("❌ [Pagination] Không tìm thấy các element phân trang!");
    return;
  }

  pageNumbers.innerHTML = "";

  // Kiểm tra nếu số lượng <= usersPerPage thì làm mờ và vô hiệu hóa phân trang
  const shouldDisablePagination = totalCount <= usersPerPage;

  // If no pages, chỉ dùng style (không disable)
  if (totalPages === 0) {
    prevPageBtn.removeAttribute("disabled");
    nextPageBtn.removeAttribute("disabled");
    prevPageBtn.style.opacity = "0.5";
    prevPageBtn.style.cursor = "not-allowed";
    nextPageBtn.style.opacity = "0.5";
    nextPageBtn.style.cursor = "not-allowed";
    return;
  }

  // Render page number buttons
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    
    // Làm mờ nếu số lượng <= usersPerPage (chưa đủ 1 trang đầy)
    const opacity = shouldDisablePagination ? "0.4" : "1";
    const cursor = shouldDisablePagination ? "not-allowed" : "pointer";
    
    btn.style.cssText = `
      padding: 8px 14px;
      border: 2px solid ${i === currentPage ? "#667eea" : "#e2e8f0"};
      background: ${
        i === currentPage
          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          : "white"
      };
      color: ${i === currentPage ? "white" : "#475569"};
      border-radius: 8px;
      cursor: ${cursor};
      font-weight: 600;
      transition: all 0.3s;
      opacity: ${opacity};
    `;

    // Chỉ cho phép click nếu số lượng > usersPerPage
    if (!shouldDisablePagination) {
      btn.onclick = () => {
        currentPage = i;
        renderUsers();
      };
    } else {
      btn.onclick = null; // Vô hiệu hóa click
    }
    pageNumbers.appendChild(btn);
  }

  // Update prev/next buttons
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  // Prev button - làm mờ nếu số lượng <= usersPerPage hoặc đang ở trang đầu
  prevPageBtn.removeAttribute("disabled");
  if (shouldDisablePagination || isFirstPage) {
    prevPageBtn.style.opacity = "0.4";
    prevPageBtn.style.cursor = "not-allowed";
  } else {
    prevPageBtn.style.opacity = "1";
    prevPageBtn.style.cursor = "pointer";
  }

  // Next button - làm mờ nếu số lượng <= usersPerPage hoặc đang ở trang cuối
  nextPageBtn.removeAttribute("disabled");
  if (shouldDisablePagination || isLastPage || totalPages === 0) {
    nextPageBtn.style.opacity = "0.4";
    nextPageBtn.style.cursor = "not-allowed";
  } else {
    nextPageBtn.style.opacity = "1";
    nextPageBtn.style.cursor = "pointer";
  }

  // Xóa event listeners cũ bằng cách thay thế onclick
  prevPageBtn.onclick = null;
  nextPageBtn.onclick = null;

  // Chỉ thêm event listeners nếu số lượng > usersPerPage
  if (!shouldDisablePagination) {
    prevPageBtn.onclick = () => {
      if (currentPage > 1) {
        currentPage--;
        renderUsers();
      }
    };

    nextPageBtn.onclick = () => {
      const totalPages = Math.ceil(totalFilteredUsers / usersPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        renderUsers();
      }
    };
  }
}

function updateUserInfo(filteredCount) {
  if (filteredCount === 0) {
    document.getElementById("userInfoText").textContent =
      "Không có khách hàng nào";
    return;
  }
  const start = (currentPage - 1) * usersPerPage + 1;
  const end = Math.min(currentPage * usersPerPage, filteredCount);
  document.getElementById(
    "userInfoText"
  ).textContent = `Hiển thị ${start}-${end} trong tổng số ${filteredCount} khách hàng`;
}

// ====== NOTE: Event listeners đã được chuyển vào setupEventListeners() ======
// ====== Các modal giờ được tạo động, không cần event listeners tĩnh ======

// ====== SHOW ADD USER MODAL ======
window.showAddUserModal = function () {
  console.log(" [showAddUserModal] Đang mở modal thêm khách hàng");
  const overlay = document.createElement("div");
  overlay.id = "addUserOverlay";
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: fadeIn 0.3s ease;
  `;

  const addModal = document.createElement("div");
  addModal.style.cssText = `
    background: white;
    border-radius: 20px;
    max-width: 650px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideDown 0.3s ease;
    position: relative;
  `;

  addModal.innerHTML = `
    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 20px 20px 0 0; position: relative;">
      <button onclick="document.getElementById('addUserOverlay').remove()" style="position: absolute; top: 15px; right: 15px; background: rgba(255,255,255,0.2); border: none; color: white; font-size: 28px; cursor: pointer; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.3s;">×</button>
      
      <div style="display: flex; align-items: center; gap: 16px;">
        <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 32px;">
          ➕
        </div>
        <div>
          <h2 style="margin: 0 0 4px 0; color: white; font-size: 28px; font-weight: 700;">Thêm khách hàng mới</h2>
          <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 14px;">Điền đầy đủ thông tin bên dưới</p>
        </div>
      </div>
    </div>

    <div style="padding: 30px;">
      <form id="addUserForm" style="display: grid; gap: 20px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #1e293b; font-size: 14px;">
              Họ tên <span style="color: #ef4444;">*</span>
            </label>
            <input type="text" id="addNameNew" placeholder="Nhập họ tên đầy đủ" required
              style="width: 100%; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 14px; transition: all 0.3s; box-sizing: border-box;" />
          </div>
          
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #1e293b; font-size: 14px;">
              Email <span style="color: #ef4444;">*</span>
            </label>
            <input type="email" id="addEmailNew" placeholder="example@email.com" required
              style="width: 100%; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 14px; transition: all 0.3s; box-sizing: border-box;" />
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #1e293b; font-size: 14px;">
              Số điện thoại 
            </label>
            <input type="text" id="addPhoneNew" placeholder="0123456789"
              style="width: 100%; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 14px; transition: all 0.3s; box-sizing: border-box;" />
          </div>
          
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #1e293b; font-size: 14px;">
              Trạng thái
            </label>
            <select id="addTrangThaiNew"
              style="width: 100%; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 14px; cursor: pointer; box-sizing: border-box; background: white;">
              <option value="active">👌 Hoạt động</option>
              <option value="locked">🔒 Đã khóa</option>
            </select>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #1e293b; font-size: 14px;">
              Tỉnh/Thành phố
            </label>
            <select id="addProvince" onchange="updateAddDistricts()"
              style="width: 100%; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 14px; cursor: pointer; box-sizing: border-box; background: white;">
              <option value="">-- Chọn Tỉnh/Thành phố --</option>
            </select>
          </div>
          
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #1e293b; font-size: 14px;">
              Quận/Huyện
            </label>
            <select id="addDistrict" disabled
              style="width: 100%; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 14px; cursor: pointer; box-sizing: border-box; background: white;">
              <option value="">-- Chọn Quận/Huyện --</option>
            </select>
          </div>
        </div>

        <div>
          <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #1e293b; font-size: 14px;">
            Xã/Phường/Đường cụ thể
          </label>
          <input type="text" id="addWard" placeholder="Ví dụ: 123 Đường ABC, Phường Bến Nghé"
            style="width: 100%; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 14px; transition: all 0.3s; box-sizing: border-box;" />
        </div>

        <div>
          <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #1e293b; font-size: 14px;">
            Mật khẩu <span style="color: #ef4444;">*</span>
          </label>
          <div style="position: relative;">
            <input type="password" id="addPasswordNew" placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)" required
              style="width: 100%; padding: 12px 16px; padding-right: 50px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 14px; transition: all 0.3s; box-sizing: border-box;" />
            <button type="button" onclick="toggleAddPassword()" 
              style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px;">
              <img id="addPasswordIcon" src="assets/images/icons/eye.png" alt="Toggle" style="width: 20px; height: 20px;" />
            </button>
          </div>
          <p style="margin: 8px 0 0 0; font-size: 12px; color: #64748b;">
            💡 Mật khẩu phải có ít nhất 6 ký tự
          </p>
        </div>

        <div style="background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 8px; margin-top: 10px;">
          <p style="margin: 0; font-size: 13px; color: #1e40af; line-height: 1.6;">
            <strong>📋 Lưu ý:</strong> Các trường có dấu <span style="color: #ef4444;">*</span> là bắt buộc. 
            Email sẽ được sử dụng để đăng nhập và không thể trùng với khách hàng khác.
          </p>
        </div>

        <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 10px;">
          <button type="button" onclick="document.getElementById('addUserOverlay').remove()" 
            style="padding: 12px 24px; background: #f1f5f9; color: #475569; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.3s;">
            ❌ Hủy
          </button>
          <button type="submit"
            style="padding: 12px 24px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
            💾 Lưu khách hàng
          </button>
        </div>
      </form>
    </div>
  `;

  overlay.appendChild(addModal);
  document.body.appendChild(overlay);

  // Close on overlay click
  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
  };

  // Populate provinces
  const provinceSelect = document.getElementById("addProvince");
  getProvinces().forEach((province) => {
    const option = document.createElement("option");
    option.value = province;
    option.textContent = province;
    provinceSelect.appendChild(option);
  });

  // Focus first input
  setTimeout(() => document.getElementById("addNameNew").focus(), 100);

  // Handle form submit
  document.getElementById("addUserForm").onsubmit = (e) => {
    e.preventDefault();
    handleAddUser();
  };

  // Add focus styles
  addModal.querySelectorAll("input, select").forEach((input) => {
    input.onfocus = () => {
      input.style.borderColor = "#10b981";
      input.style.boxShadow = "0 0 0 3px rgba(16, 185, 129, 0.1)";
    };
    input.onblur = () => {
      input.style.borderColor = "#e2e8f0";
      input.style.boxShadow = "none";
    };
  });
};

// Toggle password visibility in add modal
window.toggleAddPassword = function () {
  const input = document.getElementById("addPasswordNew");
  const icon = document.getElementById("addPasswordIcon");

  if (input.type === "password") {
    input.type = "text";
    icon.src = "assets/images/icons/eyeoff.png";
  } else {
    input.type = "password";
    icon.src = "assets/images/icons/eye.png";
  }
};

// ====== UPDATE DISTRICTS FOR ADD MODAL ======
window.updateAddDistricts = function () {
  const province = document.getElementById("addProvince").value;
  const districtSelect = document.getElementById("addDistrict");

  // Clear and disable if no province
  districtSelect.innerHTML = '<option value="">-- Chọn Quận/Huyện --</option>';

  if (!province) {
    districtSelect.disabled = true;
    return;
  }

  // Load districts
  const districts = getDistricts(province);
  districts.forEach((district) => {
    const option = document.createElement("option");
    option.value = district;
    option.textContent = district;
    districtSelect.appendChild(option);
  });

  districtSelect.disabled = false;
};

// ====== HANDLE ADD USER ======
function handleAddUser() {
  const name = document.getElementById("addNameNew").value.trim();
  const email = document.getElementById("addEmailNew").value.trim();
  const phone = document.getElementById("addPhoneNew").value.trim();
  const password = document.getElementById("addPasswordNew").value.trim();
  const trangthai = document.getElementById("addTrangThaiNew").value;

  // Get address from 3 fields
  const ward = document.getElementById("addWard").value.trim();
  const district = document.getElementById("addDistrict").value;
  const province = document.getElementById("addProvince").value;

  // Build full address
  let address = "";
  if (ward) address += ward;
  if (district) address += (address ? ", " : "") + district;
  if (province) address += (address ? ", " : "") + province;
  if (!address) address = "Chưa cập nhật";

  // Validation
  if (!name || !email || !password) {
    showNotification(
      " Thiếu thông tin",
      "Vui lòng nhập đầy đủ các trường bắt buộc!",
      "error"
    );
    return;
  }

  if (!isValidEmail(email)) {
    showNotification(
      "Email không hợp lệ",
      "Vui lòng nhập đúng định dạng email!",
      "error"
    );
    return;
  }

  // if (!isValidPhone(phone)) {
  //   showNotification(
  //     "SĐT không hợp lệ",
  //     "Số điện thoại phải có 10-11 số!",
  //     "error"
  //   );
  //   return;
  // }

  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    showNotification("Email đã tồn tại", "Email này đã được sử dụng!", "error");
    return;
  }

  if (password.length < 6) {
    showNotification(
      " Mật khẩu quá ngắn",
      "Mật khẩu phải có ít nhất 6 ký tự!",
      "error"
    );
    return;
  }

  // Create new user
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
    name,
    email,
    phone,
    address: address || "Chưa cập nhật",
    trangthai,
    joinDate: new Date().toLocaleDateString("vi-VN"),
    orders: 0,
    password,
  };

  users.push(newUser);
  localStorage.setItem("phonestore_users", JSON.stringify(users));
  document.getElementById("addUserOverlay").remove();
  renderUsers();

  showNotification(
    "✅ Thêm khách hàng thành công!",
    `Đã thêm <strong>${name}</strong> vào hệ thống.`
  );
}

// ====== VIEW USER ======
window.viewUser = function (index) {
  editingIndex = index;
  const u = users[index];

  // Create a beautiful profile view modal
  const isActive = u.trangthai === "active";
  const statusBadge = isActive
    ? '<span style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;"><span style="font-size: 16px;">✅</span> Đang hoạt động</span>'
    : '<span style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px;"><span style="font-size: 16px;">🔒</span> Đã khóa</span>';

  const overlay = document.createElement("div");
  overlay.id = "viewUserOverlay";
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: fadeIn 0.3s ease;
  `;

  const viewModal = document.createElement("div");
  viewModal.style.cssText = `
    background: white;
    border-radius: 20px;
    max-width: 700px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideDown 0.3s ease;
    position: relative;
  `;

  viewModal.innerHTML = `
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; border-radius: 20px 20px 0 0; position: relative;">
      <button onclick="document.getElementById('viewUserOverlay').remove()" style="position: absolute; top: 20px; right: 20px; background: rgba(255,255,255,0.2); border: none; color: white; font-size: 28px; cursor: pointer; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.3s;">×</button>
      
      <div style="display: flex; align-items: center; gap: 24px;">
        <div style="width: 100px; height: 100px; border-radius: 50%; background: white; display: flex; align-items: center; justify-content: center; font-size: 48px; font-weight: bold; color: #667eea; box-shadow: 0 8px 20px rgba(0,0,0,0.2);">
          ${u.name.charAt(0).toUpperCase()}
    </div>
        <div style="flex: 1;">
          <h2 style="margin: 0 0 8px 0; color: white; font-size: 32px; font-weight: 700;">${
            u.name
          }</h2>
          <p style="margin: 0 0 12px 0; color: rgba(255,255,255,0.9); font-size: 16px;">📧 ${
            u.email
          }</p>
          ${statusBadge}
        </div>
      </div>
    </div>

    <div style="padding: 30px;">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px;">
        <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #3b82f6;">
          <div style="font-size: 13px; color: #64748b; margin-bottom: 6px; font-weight: 600;">👤 ID KHÁCH HÀNG</div>
          <div style="font-size: 24px; font-weight: 700; color: #1e293b;">#${
            u.id
          }</div>
        </div>
        
        <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #f59e0b;">
          <div style="font-size: 13px; color: #64748b; margin-bottom: 6px; font-weight: 600;">🛒 ĐỢN HÀNG</div>
          <div style="font-size: 24px; font-weight: 700; color: #1e293b;">${
            u.orders || 0
          } đơn</div>
        </div>
        
        <div style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #10b981;">
          <div style="font-size: 13px; color: #64748b; margin-bottom: 6px; font-weight: 600;"> NGÀY THAM GIA</div>
          <div style="font-size: 18px; font-weight: 700; color: #1e293b;">${
            u.joinDate
          }</div>
        </div>
      </div>

      <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 20px 0; color: #1e293b; font-size: 18px; font-weight: 700; display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 24px;">📋</span> Thông tin chi tiết
        </h3>
        
        <div style="display: grid; gap: 16px;">
          <div style="display: flex; padding-bottom: 12px; border-bottom: 2px solid #e2e8f0;">
            <div style="flex: 0 0 140px; color: #64748b; font-weight: 600; font-size: 14px;"> Số điện thoại:</div>
            <div style="flex: 1; color: #1e293b; font-weight: 600; font-size: 14px;">${
              u.phone
            }</div>
          </div>
          
          <div style="display: flex; padding-bottom: 12px; border-bottom: 2px solid #e2e8f0;">
            <div style="flex: 0 0 140px; color: #64748b; font-weight: 600; font-size: 14px;"> Địa chỉ:</div>
            <div style="flex: 1; color: #1e293b; font-size: 14px; line-height: 1.6;">${
              u.address || "Chưa cập nhật"
            }</div>
          </div>
          
          <div style="display: flex; padding-bottom: 12px; border-bottom: 2px solid #e2e8f0;">
            <div style="flex: 0 0 140px; color: #64748b; font-weight: 600; font-size: 14px;">🔐 Mật khẩu:</div>
            <div style="flex: 1; display: flex; align-items: center; gap: 8px;">
              <input type="password" id="viewPassword_${index}" value="${
    u.password || ""
  }" readonly style="border: none; background: white; padding: 8px 12px; border-radius: 6px; font-size: 14px; color: #1e293b; font-weight: 600; flex: 1;" />
              <button onclick="toggleViewPassword(${index})" style="padding: 8px 12px; background: white; border: 2px solid #e2e8f0; border-radius: 8px; cursor: pointer; transition: all 0.3s;">
                <img id="viewPasswordIcon_${index}" src="assets/images/icons/eye.png" alt="Toggle" style="width: 18px; height: 18px; display: block;" />
              </button>
            </div>
          </div>
          
          <div style="display: flex;">
            <div style="flex: 0 0 140px; color: #64748b; font-weight: 600; font-size: 14px;">⚡ Trạng thái:</div>
            <div style="flex: 1;">${statusBadge}</div>
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 12px; justify-content: flex-end;">
        <button onclick="document.getElementById('viewUserOverlay').remove()" style="padding: 12px 24px; background: #f1f5f9; color: #475569; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.3s;">
          ❌ Đóng
        </button>
        <button onclick="document.getElementById('viewUserOverlay').remove(); editUser(${index});" style="padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
          ✏️ Chỉnh sửa
        </button>
      </div>
    </div>
  `;

  overlay.appendChild(viewModal);
  document.body.appendChild(overlay);

  // Close on overlay click
  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
  };
};

// Helper function for password toggle in view mode
window.toggleViewPassword = function (index) {
  const input = document.getElementById(`viewPassword_${index}`);
  const icon = document.getElementById(`viewPasswordIcon_${index}`);

  if (input.type === "password") {
    input.type = "text";
    icon.src = "assets/images/icons/eyeoff.png";
  } else {
    input.type = "password";
    icon.src = "assets/images/icons/eye.png";
  }
};

// ====== EDIT USER ======
window.editUser = function (index) {
  editingIndex = index;
  const u = users[index];

  // Parse existing address (format: "Ward, District, Province")
  let userWard = "",
    userDistrict = "",
    userProvince = "";
  if (u.address && u.address !== "Chưa cập nhật") {
    const parts = u.address.split(",").map((p) => p.trim());
    if (parts.length >= 3) {
      userProvince = parts[parts.length - 1];
      userDistrict = parts[parts.length - 2];
      userWard = parts.slice(0, -2).join(", ");
    } else if (parts.length === 2) {
      userProvince = parts[1];
      userWard = parts[0];
    } else {
      userWard = u.address;
    }
  }

  const overlay = document.createElement("div");
  overlay.id = "editUserOverlay";
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: fadeIn 0.3s ease;
  `;

  const editModalNew = document.createElement("div");
  editModalNew.style.cssText = `
    background: white;
    border-radius: 20px;
    max-width: 650px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideDown 0.3s ease;
    position: relative;
  `;

  editModalNew.innerHTML = `
    <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; border-radius: 20px 20px 0 0; position: relative;">
      <button onclick="document.getElementById('editUserOverlay').remove()" style="position: absolute; top: 15px; right: 15px; background: rgba(255,255,255,0.2); border: none; color: white; font-size: 28px; cursor: pointer; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.3s;">×</button>
      
      <div style="display: flex; align-items: center; gap: 16px;">
        <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: 32px;">
          ✏️
      </div>
        <div>
          <h2 style="margin: 0 0 4px 0; color: white; font-size: 28px; font-weight: 700;">Chỉnh sửa khách hàng</h2>
          <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 14px;">Cập nhật thông tin cho <strong>${
            u.name
          }</strong></p>
        </div>
      </div>
    </div>

    <div style="padding: 30px;">
      <form id="editUserForm" style="display: grid; gap: 20px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #1e293b; font-size: 14px;">
              Họ tên <span style="color: #ef4444;">*</span>
            </label>
            <input type="text" id="editNameNew" value="${
              u.name
            }" placeholder="Nhập họ tên đầy đủ" required
              style="width: 100%; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 14px; transition: all 0.3s; box-sizing: border-box;" />
          </div>
          
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #1e293b; font-size: 14px;">
              Email <span style="color: #ef4444;">*</span>
            </label>
            <input type="email" id="editEmailNew" value="${
              u.email
            }" placeholder="example@email.com" required
              style="width: 100%; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 14px; transition: all 0.3s; box-sizing: border-box;" />
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #1e293b; font-size: 14px;">
              Số điện thoại 
            </label>
            <input type="text" id="editPhoneNew" value="${
              u.phone
            }" placeholder="0123456789"
              style="width: 100%; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 14px; transition: all 0.3s; box-sizing: border-box;" />
          </div>
          
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #1e293b; font-size: 14px;">
              Trạng thái
            </label>
            <select id="editTrangThaiNew"
              style="width: 100%; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 14px; cursor: pointer; box-sizing: border-box; background: white;">
              <option value="active" ${
                u.trangthai === "active" ? "selected" : ""
              }>👌 Hoạt động</option>
              <option value="locked" ${
                u.trangthai === "locked" ? "selected" : ""
              }>🔒 Đã khóa</option>
            </select>
          </div>
        </div>

        <div>
          <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #1e293b; font-size: 14px;">
            🛒 Số đơn hàng
          </label>
          <input type="number" id="editOrdersNew" value="${
            u.orders || 0
          }" placeholder="Nhập số đơn hàng" min="0"
            style="width: 100%; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 14px; transition: all 0.3s; box-sizing: border-box;" />
          <p style="margin: 8px 0 0 0; font-size: 12px; color: #64748b;">
            💡 Số đơn hàng mà khách hàng này đã mua
          </p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #1e293b; font-size: 14px;">
              Tỉnh/Thành phố
            </label>
            <select id="editProvince" onchange="updateEditDistricts()"
              style="width: 100%; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 14px; cursor: pointer; box-sizing: border-box; background: white;">
              <option value="">-- Chọn Tỉnh/Thành phố --</option>
            </select>
          </div>
          
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #1e293b; font-size: 14px;">
              Quận/Huyện
            </label>
            <select id="editDistrict"
              style="width: 100%; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 14px; cursor: pointer; box-sizing: border-box; background: white;">
              <option value="">-- Chọn Quận/Huyện --</option>
            </select>
          </div>
        </div>

        <div>
          <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #1e293b; font-size: 14px;">
            Xã/Phường/Đường cụ thể
          </label>
          <input type="text" id="editWard" value="${userWard}" placeholder="Ví dụ: 123 Đường ABC, Phường Bến Nghé"
            style="width: 100%; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 14px; transition: all 0.3s; box-sizing: border-box;" />
        </div>

        <div>
          <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #1e293b; font-size: 14px;">
            Mật khẩu <span style="color: #ef4444;">*</span>
          </label>
          <div style="position: relative;">
            <input type="password" id="editPasswordNew" value="${
              u.password || ""
            }" placeholder="Nhập mật khẩu mới" required
              style="width: 100%; padding: 12px 16px; padding-right: 50px; border: 2px solid #e2e8f0; border-radius: 10px; font-size: 14px; transition: all 0.3s; box-sizing: border-box;" />
            <button type="button" onclick="toggleEditPassword()" 
              style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; padding: 4px;">
              <img id="editPasswordIcon" src="assets/images/icons/eye.png" alt="Toggle" style="width: 20px; height: 20px;" />
            </button>
          </div>
          <div style="display: flex; gap: 8px; align-items: center; margin-top: 8px;">
            <p style="margin: 0; font-size: 12px; color: #64748b; flex: 1;">
              💡 Để trống nếu không muốn đổi
            </p>
            <button type="button" onclick="resetToDefault()" 
              style="padding: 6px 12px; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; border: none; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer;">
              🔄 Reset về 123123
            </button>
          </div>
        </div>

        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 8px;">
          <p style="margin: 0; font-size: 13px; color: #92400e; line-height: 1.6;">
            <strong>⚠️ Lưu ý:</strong> Việc thay đổi email hoặc mật khẩu sẽ ảnh hưởng đến khả năng đăng nhập của khách hàng này. 
            Hãy chắc chắn bạn đã thông báo cho họ về các thay đổi.
          </p>
        </div>

        <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 10px;">
          <button type="button" onclick="document.getElementById('editUserOverlay').remove()" 
            style="padding: 12px 24px; background: #f1f5f9; color: #475569; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.3s;">
            ❌ Hủy
          </button>
          <button type="submit"
            style="padding: 12px 24px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.3s; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);">
            💾 Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  `;

  overlay.appendChild(editModalNew);
  document.body.appendChild(overlay);

  // Close on overlay click
  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
  };

  // Focus first input
  setTimeout(() => document.getElementById("editNameNew").focus(), 100);

  // Handle form submit
  document.getElementById("editUserForm").onsubmit = (e) => {
    e.preventDefault();
    handleEditUser(index);
  };

  // Populate provinces and pre-select
  const editProvinceSelect = document.getElementById("editProvince");
  getProvinces().forEach((province) => {
    const option = document.createElement("option");
    option.value = province;
    option.textContent = province;
    if (province === userProvince) option.selected = true;
    editProvinceSelect.appendChild(option);
  });

  // If province is selected, load districts
  if (userProvince) {
    const editDistrictSelect = document.getElementById("editDistrict");
    const districts = getDistricts(userProvince);
    districts.forEach((district) => {
      const option = document.createElement("option");
      option.value = district;
      option.textContent = district;
      if (district === userDistrict) option.selected = true;
      editDistrictSelect.appendChild(option);
    });
  }

  // Add focus styles
  editModalNew.querySelectorAll("input, select").forEach((input) => {
    input.onfocus = () => {
      input.style.borderColor = "#f59e0b";
      input.style.boxShadow = "0 0 0 3px rgba(245, 158, 11, 0.1)";
    };
    input.onblur = () => {
      input.style.borderColor = "#e2e8f0";
      input.style.boxShadow = "none";
    };
  });
};

// Toggle password visibility in edit modal
window.toggleEditPassword = function () {
  const input = document.getElementById("editPasswordNew");
  const icon = document.getElementById("editPasswordIcon");

  if (input.type === "password") {
    input.type = "text";
    icon.src = "assets/images/icons/eyeoff.png";
  } else {
    input.type = "password";
    icon.src = "assets/images/icons/eye.png";
  }
};

// ====== UPDATE DISTRICTS FOR EDIT MODAL ======
window.updateEditDistricts = function () {
  const province = document.getElementById("editProvince").value;
  const districtSelect = document.getElementById("editDistrict");

  // Clear
  districtSelect.innerHTML = '<option value="">-- Chọn Quận/Huyện --</option>';

  if (!province) {
    return;
  }

  // Load districts
  const districts = getDistricts(province);
  districts.forEach((district) => {
    const option = document.createElement("option");
    option.value = district;
    option.textContent = district;
    districtSelect.appendChild(option);
  });
};

// Reset password to default
window.resetToDefault = function () {
  showConfirmDialog(
    "🔄 Xác nhận Reset Mật khẩu",
    "Bạn có chắc chắn muốn reset mật khẩu về <strong>123123</strong>?",
    () => {
      document.getElementById("editPasswordNew").value = "123123";
      showNotification(
        "✅ Đã reset!",
        "Mật khẩu tạm thời: <strong>123123</strong>"
      );
    }
  );
};

// ====== HANDLE EDIT USER ======
function handleEditUser(index) {
  const name = document.getElementById("editNameNew").value.trim();
  const email = document.getElementById("editEmailNew").value.trim();
  const phone = document.getElementById("editPhoneNew").value.trim();
  const password = document.getElementById("editPasswordNew").value.trim();
  const trangthai = document.getElementById("editTrangThaiNew").value;
  const orders = parseInt(document.getElementById("editOrdersNew").value) || 0;

  // Get address from 3 fields
  const ward = document.getElementById("editWard").value.trim();
  const district = document.getElementById("editDistrict").value;
  const province = document.getElementById("editProvince").value;

  // Build full address
  let address = "";
  if (ward) address += ward;
  if (district) address += (address ? ", " : "") + district;
  if (province) address += (address ? ", " : "") + province;
  if (!address) address = "Chưa cập nhật";

  // Validation
  if (!name || !email || !phone || !password) {
    showNotification(
      "⚠️ Thiếu thông tin",
      "Vui lòng nhập đầy đủ thông tin!",
      "error"
    );
    return;
  }

  if (!isValidEmail(email)) {
    showNotification(
      "📧 Email không hợp lệ",
      "Vui lòng nhập đúng định dạng email!",
      "error"
    );
    return;
  }

  if (!isValidPhone(phone)) {
    showNotification(
      "📱 SĐT không hợp lệ",
      "Số điện thoại phải có 10-11 số!",
      "error"
    );
    return;
  }

  // Check email duplicate (exclude current user)
  if (
    users.some(
      (u, i) => i !== index && u.email.toLowerCase() === email.toLowerCase()
    )
  ) {
    showNotification(
      "❌ Email đã tồn tại",
      "Email này đã được sử dụng bởi người khác!",
      "error"
    );
    return;
  }

  if (password.length < 6) {
    showNotification(
      "🔒 Mật khẩu quá ngắn",
      "Mật khẩu phải có ít nhất 6 ký tự!",
      "error"
    );
    return;
  }

  // Update user
  users[index] = {
    ...users[index],
    name,
    email,
    phone,
    address: address || "Chưa cập nhật",
    password,
    trangthai,
    orders: orders >= 0 ? orders : 0, // Đảm bảo số đơn hàng >= 0
  };

  localStorage.setItem("phonestore_users", JSON.stringify(users));
  document.getElementById("editUserOverlay").remove();
  renderUsers();

  showNotification(
    "👌  Cập nhật thành công!",
    `Đã cập nhật thông tin cho <strong>${name}</strong>.`
  );
}

// ====== TOGGLE LOCK USER ======
window.toggleLockUser = function (index) {
  const u = users[index];
  const isLocked = u.trangthai === "locked";
  const action = isLocked ? "mở khóa" : "khóa";
  const icon = isLocked ? "🔓" : "🔒";

  showConfirmDialog(
    `${icon} Xác nhận ${action} tài khoản`,
    `Bạn có chắc chắn muốn <strong>${action}</strong> tài khoản của <strong>${u.name}</strong>?<br><small style="color: #64748b;">Email: ${u.email}</small>`,
    () => {
      users[index].trangthai = isLocked ? "active" : "locked";
      localStorage.setItem("phonestore_users", JSON.stringify(users));
      renderUsers();

      showNotification(
        `${icon} ${
          action.charAt(0).toUpperCase() + action.slice(1)
        } thành công!`,
        `Tài khoản <strong>${u.name}</strong> đã được ${action}.`
      );
    }
  );
};

// ====== DELETE USER ======
window.deleteUser = function (index) {
  const u = users[index];
  showConfirmDialog(
    "⚠️ Xác nhận xóa khách hàng",
    `Bạn có chắc chắn muốn <strong style="color: #ef4444;">xóa vĩnh viễn</strong> khách hàng <strong>${u.name}</strong>?<br><small style="color: #64748b;">Email: ${u.email}</small><br><br><strong style="color: #ef4444;">⚠️ Hành động này không thể hoàn tác!</strong>`,
    () => {
      users.splice(index, 1);
      localStorage.setItem("phonestore_users", JSON.stringify(users));
      renderUsers();

      showNotification(
        "🗑️ Xóa thành công!",
        `Khách hàng <strong>${u.name}</strong> đã được xóa khỏi hệ thống.`
      );
    }
  );
};

// ====== SETUP EVENT LISTENERS ======
function setupEventListeners() {
  // Search - lấy element trực tiếp thay vì dùng biến global
  const searchInputElement = document.getElementById("userSearchInput");

  if (searchInputElement) {
    searchInputElement.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim().toLowerCase();

      currentPage = 1; // đưa về trang đầu

      renderUsers();
    });
    console.log(" [Setup] Event listener đã được gắn");
  } else {
    console.error(" [Setup] KHÔNG tìm thấy element #userSearchInput!");
  }

  // Filter status
  if (filterStatusSelect) {
    filterStatusSelect.addEventListener("change", (e) => {
      statusFilter = e.target.value;
      currentPage = 1;
      renderUsers();
    });
  }

  // Sort
  if (sortBySelect) {
    sortBySelect.addEventListener("change", (e) => {
      sortBy = e.target.value;
      renderUsers();
    });
  }

  // Add button
  if (btnAdd) {
    console.log("✅ [Setup] Đã thêm event listener cho nút Thêm");
    btnAdd.addEventListener("click", showAddUserModal);
  } else {
    console.error("❌ [Setup] Không tìm thấy nút btnAddUser!");
  }

  // Pagination
  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");

 
}

// ====== INITIALIZE ======
window.addEventListener("DOMContentLoaded", () => {
  console.log("🔧 [Init] DOM Content Loaded");

  // Lấy DOM elements
  modal = document.getElementById("modal");
  editModal = document.getElementById("editModal");
  btnAdd = document.getElementById("btnAddUser");
  userTableBody = document.getElementById("userTableBody");
  searchInput = document.getElementById("userSearchInput");
  filterStatusSelect = document.getElementById("filterStatus");
  sortBySelect = document.getElementById("sortBy");

 

  // Load users from localStorage
  let savedUsers = JSON.parse(localStorage.getItem("phonestore_users")) || [];

  // Nếu chưa có dữ liệu, khởi tạo dữ liệu mẫu
  if (savedUsers.length === 0) {
    console.log(
      "📦 [Quản lý khách hàng] Chưa có dữ liệu, đang khởi tạo dữ liệu mẫu..."
    );
    const sampleUsers = [
      {
        id: 1,
        name: "Lư Hồng Phúc",
        email: "phucga150625@email.com",
        phone: "0866680197",
        address: "123 ABC, Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
        trangthai: "active",
        joinDate: "01/01/2024",
        orders: 0,
        password: "Password1",
      },
      {
        id: 2,
        name: "Nguyễn Văn An",
        email: "nguyenvana@gmail.com",
        phone: "3173849265",
        address: "23 DEF, Phường 4, Quận 5, Thành phố Hồ Chí Minh",
        trangthai: "active",
        joinDate: "21/09/2025",
        orders: 5,
        password: "Password2",
      },
      {
        id: 3,
        name: "Hoàng Văn Lâm",
        email: "hoangvanlam@gmail.com",
        phone: "5554103873",
        address: "621 GHS, Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
        trangthai: "active",
        joinDate: "14/08/2024",
        orders: 6,
        password: "Password3",
      },
      {
        id: 4,
        name: "Trương Tuấn Tài",
        email: "tuantai@email.com",
        phone: "8123054412",
        address: "106 AMC, Phường 1, Quận 4, Thành phố Hồ Chí Minh",
        trangthai: "locked",
        joinDate: "25/10/2025",
        orders: 12,
        password: "Password4",
      },
      {
        id: 5,
        name: "Ngô Văn Liêm",
        email: "ngovanliem@gmail.com",
        phone: "5361847112",
        address: "402 AMC, Phường 3, Quận 7, Thành phố Hồ Chí Minh",
        trangthai: "active",
        joinDate: "28/10/2025",
        orders: 3,
        password: "Password5",
      },
    ];
    savedUsers = sampleUsers;
    localStorage.setItem("phonestore_users", JSON.stringify(sampleUsers));
    console.log(
      "✅ [Quản lý khách hàng] Đã khởi tạo",
      sampleUsers.length,
      "khách hàng mẫu"
    );
  }

  console.log(
    "🔍 [Quản lý khách hàng] Số lượng khách hàng trong localStorage:",
    savedUsers.length
  );

  // Migration: ensure all users have correct trangthai format (active/locked)
  users = savedUsers.map((user) => ({
    ...user,
    address: user.address || "Chưa cập nhật",
    orders: user.orders || 0,
    trangthai:
      user.trangthai === "Hoạt động"
        ? "active"
        : user.trangthai === "Đã khóa"
        ? "locked"
        : user.trangthai || "active",
  }));

  // Save migrated data nếu có thay đổi
  localStorage.setItem("phonestore_users", JSON.stringify(users));

  console.log("✅ [Quản lý khách hàng] Đã load", users.length, "khách hàng");

  // Initial render
  renderUsers();

  // Setup event listeners
  setupEventListeners();

  // Thêm event listener trực tiếp (backup) để đảm bảo hoạt động
  const searchBox = document.getElementById("userSearchInput");
  if (searchBox) {
    console.log("🔥 [BACKUP] Gắn event listener trực tiếp cho searchBox");
    searchBox.addEventListener("input", function (e) {
      console.log("🔥 [BACKUP] Search triggered:", e.target.value);
      searchQuery = e.target.value.trim().toLowerCase();
      currentPage = 1;
      renderUsers();
    });
  }

  // ====== LẮNG NGHE CẬP NHẬT SỐ ĐƠN HÀNG TỪ TRANG INDEX ======
  // Lắng nghe event khi có đơn hàng mới
  window.addEventListener('phonestore-user-orders-updated', (e) => {
    const { customerId, orders } = e.detail;
    console.log(`🔄 [Quản lý KH] Nhận thông báo cập nhật đơn hàng: Customer ID ${customerId} có ${orders} đơn`);
    
    // Reload users từ localStorage
    const savedUsers = JSON.parse(localStorage.getItem("phonestore_users")) || [];
    users = savedUsers.map((user) => ({
      ...user,
      address: user.address || "Chưa cập nhật",
      orders: user.orders || 0,
      trangthai:
        user.trangthai === "Hoạt động"
          ? "active"
          : user.trangthai === "Đã khóa"
          ? "locked"
          : user.trangthai || "active",
    }));
    
    // Render lại bảng
    renderUsers();
  });

  // Lắng nghe thay đổi localStorage (khi có đơn hàng mới từ tab khác)
  window.addEventListener('storage', (e) => {
    if (e.key === 'phonestore_users') {
      console.log('🔄 [Quản lý KH] Phát hiện thay đổi users từ tab khác');
      
      // Reload users
      const savedUsers = JSON.parse(e.newValue || '[]');
      users = savedUsers.map((user) => ({
        ...user,
        address: user.address || "Chưa cập nhật",
        orders: user.orders || 0,
        trangthai:
          user.trangthai === "Hoạt động"
            ? "active"
            : user.trangthai === "Đã khóa"
            ? "locked"
            : user.trangthai || "active",
      }));
      
      // Render lại bảng
      renderUsers();
    }
  });

  console.log("✅ [Quản lý KH] Đã setup listener cho cập nhật đơn hàng");
});

// ====== ANIMATIONS ======
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
  .stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.15) !important;
  }
  #userSearchInput:focus,
  #filterStatus:focus,
  #sortBy:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    outline: none;
  }
  #btnAddUser:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }
  .pagination button:not(:disabled):hover {
    border-color: #667eea;
    background: #f8fafc;
  }
  .pagination button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* --- Hide search icon --- */
  /* If icon is set as a background-image on the input */
  #userSearchInput {
    background-image: none !important;
    background-repeat: no-repeat !important;
    background-position: right center !important;
    -webkit-appearance: textfield;
    appearance: textfield;
    padding-right: 12px; /* adjust if needed */
  }

  /* Remove default webkit search decorations */
  #userSearchInput::-webkit-search-cancel-button,
  #userSearchInput::-webkit-search-decoration,
  #userSearchInput::-webkit-search-results-button,
  #userSearchInput::-webkit-search-results-decoration {
    -webkit-appearance: none !important;
    appearance: none !important;
    display: none !important;
  }

  /* Hide common icon elements that may sit next to the input */
  .search-icon,
  .input-search-icon,
  .icon-search,
  .user-search-icon,
  img.search-icon,
  img[alt~="search"] {
    display: none !important;
  }

  /* If icon is inside a container next to the input */
  .search-container .search-icon,
  .search-wrapper .search-icon {
    display: none !important;
  }
`;
document.head.appendChild(style);
