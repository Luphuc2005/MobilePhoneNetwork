function navigateTo(section, event) {
  event.preventDefault();

  // Ẩn tất cả các phần nội dung
  document
    .querySelectorAll(
      "#dashboard-content, #customers-content, #pricing-content, #other-content, #products-content, #import-content"
    )
    .forEach((div) => (div.style.display = "none"));
  switch (section) {
    case "dashboard":
      document.getElementById("dashboard-content").style.display = "block";
      break;

    case "customers":
      document.getElementById("customers-content").style.display = "block";
      break;

    case "pricing":
      document.getElementById("pricing-content").style.display = "block";
      break;

    case "products":
      document.getElementById("products-content").style.display = "block";

      // ✅ Khởi tạo trang sản phẩm nếu chưa có
      if (!document.getElementById("productTable")) {
        const productsContent = document.getElementById("products-content");
        productsContent.innerHTML = page;
        initProductPage();
      }
      break;

    case "import":
      document.getElementById("import-content").style.display = "block";
      setTimeout(() => {
        if (typeof initializePricing === "function") {
          initializePricing();
        }
      }, 100);
      break;

    default:
      document.getElementById("other-content").style.display = "block";
      break;
  }
}

// ====================== TEMPLATE PAGE ======================
let page = `
  <h1>📦 Quản lý sản phẩm</h1>
  <div class="product-header">
    <input type="text" id="inputSearch" placeholder="🔍 Tìm kiếm sản phẩm..." />
    <select id="filterCategory">
      <option value="">Tất cả danh mục</option>
      <option value="Samsung">Samsung</option>
      <option value="Iphone">Iphone</option>
      <option value="Realme">Realme</option>
      <option value="Xiaomi">Xiaomi</option>
    </select>
    <button id="addProductBtn">+ Thêm sản phẩm</button>
  </div>
  <table>
    <thead>
      <tr>
        <th>Sản phẩm</th>
        <th>Danh mục</th>
        <th>Giá</th>
        <th>Tồn kho</th>
        <th>Trạng thái</th>
        <th>Hành động</th>
      </tr>
    </thead>
    <tbody id="productTable"></tbody>
  </table>
  <div id="pagination" style="margin-top:15px; display:flex; gap:5px; justify-content:center;"></div>
`;

// ====================== PRODUCT PAGE ======================
function initProductPage() {
  renderForm();
  const table = document.getElementById("productTable");
  const pagination = document.getElementById("pagination");
  const input = document.getElementById("inputSearch");
  const filterCategory = document.getElementById("filterCategory");
  const ITEMS_PER_PAGE = 5;
  let currentPage = 1;
  let products = JSON.parse(localStorage.getItem("product")) || [];

  function renderTable(page = 1) {
    table.innerHTML = "";
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageItems = products.slice(start, end);

    pageItems.forEach((p) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="product-info">
          <img src="${p.hinhanh}" alt=""/>
          <div>
            <strong>${p.tensanpham}</strong><br />
            <small>ID: #${p.id}</small>
          </div>
        </td>
        <td><span class="badge">${p.danhmuc}</span></td>
        <td>${p.gia.toLocaleString()}₫</td>
        <td class="${p.soluong === 0 ? "out-stock" : "in-stock"}">${
        p.soluong
      }</td>
        <td>
          <span class="status ${
            p.soluong === 0 ? "status-red" : "status-green"
          }">
            ${p.soluong === 0 ? "Hết hàng" : "Còn hàng"}
          </span>
        </td>
        <td class="actions">
          <button title="Sửa" class="edit">✏️</button>
          <button title="Xóa" class="delete"><i class="fa-solid fa-trash"></i></button>
        </td>
      `;
      table.appendChild(row);

      // Xóa
      row.querySelector(".delete").addEventListener("click", () => {
        if (confirm(`Xóa "${p.tensanpham}"?`)) {
          products = products.filter((x) => x.id !== p.id);
          localStorage.setItem("product", JSON.stringify(products));
          reload();
        }
      });

      // Sửa
      row
        .querySelector(".edit")
        .addEventListener("click", () => openEditForm(p, reload));
    });
  }

  function renderPagination() {
    pagination.innerHTML = "";
    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
    if (totalPages <= 1) return;

    // Nút trước
    const prev = document.createElement("button");
    prev.textContent = "← Trước";
    prev.disabled = currentPage === 1;
    prev.onclick = () => {
      if (currentPage > 1) {
        currentPage--;
        renderTable(currentPage);
        renderPagination();
      }
    };
    pagination.appendChild(prev);

    // Nút số trang
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = currentPage === i ? "active" : "";
      btn.onclick = () => {
        currentPage = i;
        renderTable(currentPage);
        renderPagination();
      };
      pagination.appendChild(btn);
    }

    // Nút sau
    const next = document.createElement("button");
    next.textContent = "Sau →";
    next.disabled = currentPage === totalPages;
    next.onclick = () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderTable(currentPage);
        renderPagination();
      }
    };
    pagination.appendChild(next);
  }
  function reload() {
    products = JSON.parse(localStorage.getItem("product")) || [];
    renderTable(currentPage);
    renderPagination();
  }

  document
    .getElementById("addProductBtn")
    .addEventListener("click", () => openAddForm(reload));
  input.addEventListener("keyup", filterProducts);
  filterCategory.addEventListener("change", filterProducts);

  function filterProducts() {
    const keyword = input.value.toLowerCase();
    const category = filterCategory.value;
    Array.from(table.rows).forEach((r) => {
      const name = r.cells[0]?.textContent.toLowerCase() || "";
      const cat = r.cells[1]?.textContent.trim() || "";
      r.style.display =
        name.includes(keyword) && (category === "" || cat === category)
          ? ""
          : "none";
    });
  }

  renderTable();
  renderPagination();
}
// ====================== EDIT / ADD FORM ======================
function openEditForm(p, onSaved) {
  const form = document.querySelector(".edit-form-overlay");
  form.style.display = "flex";
  form.querySelector(".form-title").textContent = "✏️ Sửa sản phẩm";

  form.querySelector(".editName").value = p.tensanpham;
  form.querySelector(".editCategory").value = p.danhmuc;
  form.querySelector(".editPrice").value = p.gia;
  form.querySelector(".editQuantity").value = p.soluong;
  form.querySelector(".editDescription").value = p.mota || "";

  // --- Xử lý preview ảnh cũ ---
  const preview = form.querySelector("#editImagePreview");
  if (p.hinhanh) {
    preview.src = p.hinhanh;
    preview.style.display = "block";
  } else {
    preview.src = "";
    preview.style.display = "none";
  }

  // --- Lưu thay đổi ---
  form.querySelector(".save-btn").onclick = (e) => {
    e.preventDefault();
    const products = JSON.parse(localStorage.getItem("product")) || [];
    const idx = products.findIndex((x) => x.id === p.id);
    if (idx > -1) {
      products[idx] = {
        ...products[idx],
        tensanpham: form.querySelector(".editName").value.trim(),
        danhmuc: form.querySelector(".editCategory").value,
        gia: +form.querySelector(".editPrice").value,
        soluong: +form.querySelector(".editQuantity").value,
        mota: form.querySelector(".editDescription").value.trim(),
        hinhanh: preview.src || p.hinhanh, // ✅ giữ ảnh cũ nếu chưa chọn mới
      };
      localStorage.setItem("product", JSON.stringify(products));
      alert("✅ Cập nhật thành công!");
      form.style.display = "none";
      onSaved();
    }
  };
}

function openAddForm(onSaved) {
  const form = document.querySelector(".edit-form-overlay");
  form.style.display = "flex";
  form.querySelector(".form-title").textContent = "➕ Thêm sản phẩm mới";
  form.querySelectorAll("input, textarea").forEach((el) => (el.value = ""));
  const preview = form.querySelector("#editImagePreview");
  preview.src = "";
  preview.style.display = "none";

  form.querySelector(".save-btn").onclick = (e) => {
    e.preventDefault();
    const products = JSON.parse(localStorage.getItem("product")) || [];
    const newProduct = {
      id: products.length ? Math.max(...products.map((x) => x.id)) + 1 : 1,
      tensanpham: form.querySelector(".editName").value.trim(),
      danhmuc: form.querySelector(".editCategory").value,
      gia: +form.querySelector(".editPrice").value,
      soluong: +form.querySelector(".editQuantity").value,
      mota: form.querySelector(".editDescription").value.trim(),
      hinhanh: preview.src || "https://via.placeholder.com/80",
    };
    products.unshift(newProduct);
    localStorage.setItem("product", JSON.stringify(products));
    alert("✅ Thêm sản phẩm thành công!");
    form.style.display = "none";
    onSaved();
  };
}

// ====================== RENDER FORM (1 LẦN DUY NHẤT) ======================
function renderForm() {
  if (document.querySelector(".edit-form-overlay")) return;

  const formContainer = document.createElement("div");
  formContainer.className = "edit-form-overlay";
  formContainer.style.display = "none";
  formContainer.style.justifyContent = "center";
  formContainer.style.alignItems = "center";

  formContainer.innerHTML = `
    <div class="edit-form-content">
      <button class="close-btn">×</button>
      <h2 class="form-title">✏️ Sửa sản phẩm</h2>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px;">
        <div class="form-group">
          <label>Tên sản phẩm</label>
          <input type="text" class="editName" placeholder="Nhập tên sản phẩm..." />
        </div>
        <div class="form-group">
          <label>Danh mục</label>
          <select class="editCategory" style="width:100%;padding:8px 10px;border:1px solid #ddd;border-radius:8px;">
            <option value="">-- Chọn danh mục --</option>
            <option value="Iphone">🍎 Iphone</option>
            <option value="Samsung">📱 Samsung</option>
            <option value="Xiaomi">🔋 Xiaomi</option>
            <option value="Oppo">💚 Oppo</option>
            <option value="Vivo">💙 Vivo</option>
            <option value="Realme">⚡ Realme</option>
            <option value="Nokia">📞 Nokia</option>
          </select>
        </div>
        <div class="form-group">
          <label>Giá</label>
          <input type="number" class="editPrice" placeholder="Nhập giá..." />
        </div>
        <div class="form-group">
          <label>Số lượng</label>
          <input type="number" class="editQuantity" placeholder="Nhập số lượng..." />
        </div>

        <!-- Upload ảnh -->
        <div class="imagePre" style="grid-column: span 2;">
          <div class="uploadimage">
            <label style="font-weight:500; margin-bottom:6px;">Hình ảnh sản phẩm</label>
            <label for="editImageFile"
              style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:140px; border:2px dashed #ccc; border-radius:12px; cursor:pointer; background:#fafafa;">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" stroke="#aaa" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" class="mb-2">
                <path d="M4 16v1a1 1 0 001 1h14a1 1 0 001-1v-1M12 12v9m0 0l-3-3m3 3l3-3M12 3v9" />
              </svg>
              <p style="color:#666; font-weight:500;">Click để tải ảnh lên</p>
              <p style="color:#999; font-size:12px;">PNG, JPG (max 5MB)</p>
              <input id="editImageFile" type="file" accept="image/*" style="display:none;" />
            </label>
          </div>

          <div id="editImagePreviewWrap"
            style="margin-top:12px; display:flex; justify-content:center; align-items:center;">
            <img id="editImagePreview" src="" alt="Preview"
              style="max-width:150px; max-height:150px; border-radius:10px; display:none;" />
          </div>
        </div>

        <div class="form-group" style="grid-column:span 2;">
          <label>Mô tả</label>
          <textarea class="editDescription" style="width:100%;min-height:80px;padding:8px;border:1px solid #ddd;border-radius:8px;"></textarea>
        </div>

        <div class="form-group" style="grid-column:span 2;text-align:right;">
          <button class="cancel-btn">Hủy</button>
          <button class="save-btn">Lưu thay đổi</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(formContainer);

  // --- Đóng form ---
  formContainer.querySelector(".close-btn").onclick = () =>
    (formContainer.style.display = "none");
  formContainer.querySelector(".cancel-btn").onclick = (e) => {
    e.preventDefault();
    formContainer.style.display = "none";
  };
  formContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-form-overlay")) {
      e.target.style.display = "none";
    }
  });

  // ✅ Xử lý preview ảnh khi upload mới
  formContainer
    .querySelector("#editImageFile")
    .addEventListener("change", (e) => {
      const file = e.target.files[0];
      const preview = document.getElementById("editImagePreview");
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          preview.src = event.target.result;
          preview.style.display = "block";
        };
        reader.readAsDataURL(file);
      } else {
        preview.src = "";
        preview.style.display = "none";
      }
    });
}
