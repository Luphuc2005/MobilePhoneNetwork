const products = JSON.parse(localStorage.getItem("product")) || [];
const table = document.getElementById("productTable");
const pagination = document.querySelector(".pagination");

const ITEMS_PER_PAGE = 5;
let currentPage = 1;

// 📌 Render dữ liệu ra bảng
function renderTable(page = 1) {
  table.innerHTML = "";
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageItems = products.slice(start, end);
  pageItems.forEach((p) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="product-info">
        <img src="${p.hinhanh || "https://via.placeholder.com/80"}" alt="${
      p.tensanpham
    }" />
        <div>
          <strong>${p.tensanpham}</strong><br />
          <small>ID: #${p.id}</small>
        </div>
      </td>
      <td><span class="badge">${p.danhmuc}</span></td>
      <td>${p.gia.toLocaleString()}₫</td>
      <td class="${p.soluong === "0" ? "out-stock" : "in-stock"}">${
      p.soluong
    }</td>
      <td>
        <span class="status ${
          p.soluong === "0" ? "status-red" : "status-green"
        }">
          ${p.soluong === "0" ? "Hết hàng" : "Còn hàng"}
        </span>
      </td>
      <td class="actions">
        <button title="Sửa" class="edit"><span>✏️</span></button>
        <button title="Xóa" class="delete"><span><i class="fa-solid fa-trash"></i></span></button>
      </td>
    `;
    table.appendChild(row);

    // ❌ Xóa
    row.querySelector(".delete").addEventListener("click", () => {
      if (confirm(`Bạn có chắc muốn xóa sản phẩm "${p.tensanpham}" không?`)) {
        const index = products.findIndex((x) => x.id === p.id);
        if (index > -1) {
          products.splice(index, 1);
          localStorage.setItem("product", JSON.stringify(products));
          renderTable(currentPage);
          renderPagination();
        }
      }
    });

    // ✏️ Sửa
    row.querySelector(".edit").addEventListener("click", () => openEditForm(p));
    document
      .getElementById("addProductBtn")
      .addEventListener("click", openAddForm);
  });
}

// 📌 Tạo phân trang
function renderPagination() {
  pagination.innerHTML = "";
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  // Nút "Trước"
  const prev = document.createElement("button");
  prev.textContent = "Trước";
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

  // Nút "Sau"
  const next = document.createElement("button");
  next.textContent = "Sau";
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

// 🚀 Khởi chạy
renderTable();
renderPagination();

// ---------- TẠO FORM ----------
const formContainer = document.createElement("div");
formContainer.id = "editFormContainer";
formContainer.innerHTML = `
  <div id="editForm" class="edit-form-overlay" style="display:none; justify-content:center; align-items:center;">
    <div class="edit-form-content">
      <button id="closeForm" class="close-btn">×</button>
      <h2 class="form-title">✏️ Sửa sản phẩm</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 18px;">
        <div class="form-group">
          <label>Tên sản phẩm</label>
          <input type="text" id="editName" placeholder="Nhập tên sản phẩm..." />
        </div>
<div class="form-group">
  <label>Danh mục</label>
  <select id="editCategory" style="
    width: 100%;
    padding: 8px 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #fff;
    outline: none;
    transition: 0.2s;
  ">
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
          <input type="number" id="editPrice" placeholder="Nhập giá..." />
        </div>

        <div class="form-group">
          <label>Số lượng</label>
          <input type="number" id="editQuantity" placeholder="Nhập số lượng..." />
        </div>

        <!-- Upload ảnh -->
        <div class="imagePre" style="grid-column: span 2;">
          <div class="uploadimage" ><label style="font-weight:500; margin-bottom:6px;">Hình ảnh sản phẩm</label>
          <label for="editImageFile"
            style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; height:140px; border:2px dashed #ccc; border-radius:12px; cursor:pointer; background:#fafafa; transition:0.3s;">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" stroke="#aaa" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round" class="mb-2">
              <path d="M4 16v1a1 1 0 001 1h14a1 1 0 001-1v-1M12 12v9m0 0l-3-3m3 3l3-3M12 3v9" />
            </svg>
            <p style="color:#666; font-weight:500;">Click để tải ảnh lên</p>
            <p style="color:#999; font-size:12px;">PNG, JPG (max 5MB)</p>
            <input id="editImageFile" type="file" accept="image/*" style="display:none;" />
          </label></div>

          <div id="editImagePreviewWrap"
            style="margin-top:12px; display:flex; justify-content:center; align-items:center;">
            <img id="editImagePreview" src="" alt="Preview"
              style="max-width:150px; max-height:150px; border-radius:10px; display:none;" />
          </div>
        </div>

        <div style="grid-column: span 2;list-style:none;" class="form-group">
          <label>Mô tả</label>
          <textarea id="editDescription" style="width:100%; min-height:80px; padding:8px; border:1px solid #ddd; border-radius:8px;list-style:none; outline:none "></textarea>
        </div>

        <div class="form-actions" style="grid-column: span 2; text-align:right;">
          <button id="cancelEdit" class="cancel-btn">Hủy</button>
          <button id="saveEdit" class="save-btn">Lưu thay đổi</button>
        </div>
      </div>
    </div>
  </div>
`;
document.body.appendChild(formContainer);

// ===================== JS xử lý form ===================== //
let editImageData = null;
let currentEditingProduct = null;

// chọn file ảnh
document.addEventListener("change", (e) => {
  if (e.target.id === "editImageFile") {
    const file = e.target.files && e.target.files[0];
    const preview = document.getElementById("editImagePreview");
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        editImageData = ev.target.result;
        preview.src = editImageData;
        preview.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  }
});

document.getElementById("closeForm").onclick = () => {
  document.getElementById("editForm").style.display = "none";
};
document.getElementById("cancelEdit").onclick = (e) => {
  e.preventDefault();
  document.getElementById("editForm").style.display = "none";
};
document.getElementById("editForm").addEventListener("click", (e) => {
  if (e.target.id === "editForm") e.target.style.display = "none";
});

function openEditForm(p) {
  currentEditingProduct = p;
  const form = document.getElementById("editForm");
  form.style.display = "flex";
  document.querySelector(".form-title").textContent = "✏️ Sửa sản phẩm";
  document.getElementById("editName").value = p.tensanpham;
  document.getElementById("editCategory").value = p.danhmuc;
  document.getElementById("editPrice").value = p.gia;
  document.getElementById("editQuantity").value = p.soluong;
  document.getElementById("editDescription").value = p.mota || "";

  const preview = document.getElementById("editImagePreview");
  if (p.hinhanh) {
    preview.src = p.hinhanh;
    preview.style.display = "block";
  } else {
    preview.style.display = "none";
  }

  editImageData = null;

  // ✅ Validate + Lưu thay đổi
  document.getElementById("saveEdit").onclick = (e) => {
    e.preventDefault();

    const name = document.getElementById("editName").value.trim();
    const category = document.getElementById("editCategory").value.trim();
    const price = Number(document.getElementById("editPrice").value);
    const quantity = Number(document.getElementById("editQuantity").value);
    const description = document.getElementById("editDescription").value.trim();

    // ⚠️ Validate
    if (!name) {
      alert("⚠️ Vui lòng nhập tên sản phẩm!");
      return;
    }
    if (!category) {
      alert("⚠️ Vui lòng chọn danh mục!");
      return;
    }
    if (isNaN(price) || price <= 0) {
      alert("⚠️ Giá phải lớn hơn 0!");
      return;
    }
    if (isNaN(quantity) || quantity < 0) {
      alert("⚠️ Số lượng không hợp lệ!");
      return;
    }

    // ✅ Lưu dữ liệu
    p.tensanpham = name;
    p.danhmuc = category;
    p.gia = price;
    p.soluong = quantity;
    p.mota = description;
    if (editImageData) p.hinhanh = editImageData;

    localStorage.setItem("product", JSON.stringify(products));
    form.style.display = "none";
    renderTable();

    alert("✅ Cập nhật sản phẩm thành công!");
  };
}

// 🔍 Lọc sản phẩm
const input = document.getElementById("inputSearch");
const filterCategory = document.getElementById("filterCategory");
function filterProducts() {
  const keyword = input.value.toLowerCase();
  const category = filterCategory.value;
  const rows = table.getElementsByTagName("tr");
  for (let i = 0; i < rows.length; i++) {
    const name =
      rows[i].getElementsByTagName("td")[0]?.textContent.toLowerCase() || "";
    const cat = rows[i].getElementsByTagName("td")[1]?.textContent.trim() || "";
    rows[i].style.display =
      name.includes(keyword) && (category === "" || cat === category)
        ? ""
        : "none";
  }
}

function openAddForm() {
  currentEditingProduct = null; // reset chế độ chỉnh sửa
  const form = document.getElementById("editForm");
  form.style.display = "flex";
  document.querySelector(".form-title").textContent = "➕ Thêm sản phẩm mới";
  document.getElementById("editName").value = "";
  document.getElementById("editCategory").value = "";
  document.getElementById("editPrice").value = "";
  document.getElementById("editQuantity").value = "";
  document.getElementById("editDescription").value = "";
  document.getElementById("editImagePreview").style.display = "none";
  editImageData = null;

  // ⚡ Lưu sản phẩm mới
  document.getElementById("saveEdit").onclick = (e) => {
    e.preventDefault();
    const name = document.getElementById("editName").value.trim();
    const category = document.getElementById("editCategory").value.trim();
    const price = Number(document.getElementById("editPrice").value);
    const quantity = Number(document.getElementById("editQuantity").value);
    const description = document.getElementById("editDescription").value.trim();

    // ✅ Validate
    if (!name) {
      alert("⚠️ Vui lòng nhập tên sản phẩm!");
      return;
    }
    if (!category) {
      alert("⚠️ Vui lòng chọn danh mục!");
      return;
    }
    if (isNaN(price) || price <= 0) {
      alert("⚠️ Giá phải lớn hơn 0!");
      return;
    }
    if (isNaN(quantity) || quantity < 0) {
      alert("⚠️ Số lượng không hợp lệ!");
      return;
    }

    // 🆕 Tạo ID mới (dựa vào ID lớn nhất hiện có)
    const newId = products.length
      ? Math.max(...products.map((p) => p.id)) + 1
      : 1;

    // ✅ Tạo object sản phẩm
    const newProduct = {
      id: newId,
      tensanpham: name,
      danhmuc: category,
      gia: price,
      soluong: quantity,
      mota: description,
      hinhanh: editImageData || "https://via.placeholder.com/80",
    };

    // Lưu vào mảng và localStorage
    products.unshift(newProduct);
    localStorage.setItem("product", JSON.stringify(products));

    // render lại bảng
    renderTable(currentPage);
    renderPagination();
    form.style.display = "none";
    alert("✅ Thêm sản phẩm thành công!");
  };
}

input?.addEventListener("keyup", filterProducts);
filterCategory?.addEventListener("change", filterProducts);
