if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    let pageImport = `
<div class="import-container">
  <h2>📦 Quản lý phiếu nhập hàng</h2>
  <div class="import-toolbar">
    <input type="text" id="searchImport" placeholder="🔍 Tìm phiếu nhập..." />
    <button id="btnAddImport" class="btn-primary">➕ Thêm phiếu nhập</button>
  </div>

  <table id="importTable" class="import-table">
    <thead>
      <tr>
        <th>Mã phiếu</th>
        <th>Ngày nhập</th>
        <th>Số mặt hàng</th>
        <th>Tổng giá trị</th>
        <th>Trạng thái</th>
        <th>Hành động</th>
      </tr>
    </thead>
    <tbody id="importTableBody"></tbody>
  </table>

  <!-- Modal thêm/sửa -->
  <div id="importModal" class="modal">
    <div class="modal-card">
      <h3 id="formTitle">➕ Thêm phiếu nhập</h3>
      <form id="importForm">
        <label>Ngày nhập:</label>
        <input type="date" id="importDate" required min="" />

        <h4>Danh sách sản phẩm</h4>
        <table class="sub-table" id="productDetailTable">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Giá nhập</th>
              <th>Số lượng</th>
              <th>Thành tiền</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="productDetailBody"></tbody>
        </table>
        <button type="button" id="btnAddDetail" class="btn-ghost">➕ Thêm sản phẩm</button>
        <div class="form-actions">
          <button type="button" id="btnCancelForm" class="btn-ghost">Hủy</button>
          <button type="submit" class="btn-primary">Lưu phiếu</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal xem chi tiết -->
  <div id="detailModal" class="modal">
    <div class="modal-card">
      <h3>📄 Chi tiết phiếu nhập</h3>
      <div id="detailBody"></div>
      <div class="form-actions">
        <button type="button" id="btnCloseDetail" class="btn-primary">Đóng</button>
      </div>
    </div>
  </div>
</div>
`;

    const productsContent = document.getElementById("import-content");
    productsContent.innerHTML = pageImport;

    initImportPage();
  });
  initImportPage();
} else {
}
function initImportPage() {
  const tableBody = document.getElementById("importTableBody");
  const btnAdd = document.getElementById("btnAddImport");
  const modal = document.getElementById("importModal");
  const detailModal = document.getElementById("detailModal");
  const form = document.getElementById("importForm");
  const btnCancel = document.getElementById("btnCancelForm");
  const btnAddDetail = document.getElementById("btnAddDetail");
  const productDetailBody = document.getElementById("productDetailBody");
  const detailBody = document.getElementById("detailBody");
  const btnCloseDetail = document.getElementById("btnCloseDetail");
  const searchInput = document.getElementById("searchImport");

  let importList =
    JSON.parse(localStorage.getItem("phonestore_import_orders")) || [];
  let editingId = null;

  // =================== HÀM TIỆN ÍCH ===================
  const saveToLocal = () =>
    localStorage.setItem(
      "phonestore_import_orders",
      JSON.stringify(importList)
    );

  const formatMoney = (n) => Number(n).toLocaleString("vi-VN") + "₫";

  const totalOf = (details) =>
    details.reduce((sum, d) => sum + (d.price ? d.price : d.gia * d.qty), 0);

  const renderTable = (list = importList) => {
    tableBody.innerHTML = "";
    list.forEach((p) => {
      tableBody.innerHTML += `
        <tr>
          <td>#${p.id}</td>
          <td>${p.date}</td>
          <td>${p.details.length}</td>
          <td>${formatMoney(totalOf(p.details))}</td>
          <td><span class="badge ${
            p.status === "Hoàn thành" ? "done" : "pending"
          }">${p.status}</span></td>
          <td>
            <div class="action-group">
              <button class="btn-detail" data-id="${p.id}">Xem</button>
              <button class="btn-edit" data-id="${p.id}">Sửa</button>
              <button class="btn-done" data-id="${p.id}">Hoàn thành</button>
            </div>
          </td>
        </tr>`;
    });
    saveToLocal();
  };

  renderTable();

  // =================== MODAL ===================
  const openModal = (m) => {
    m.style.display = "flex";
    document.body.style.overflow = "hidden";
  };
  const closeModal = (m) => {
    m.style.display = "none";
    document.body.style.overflow = "";
  };

  btnAdd.onclick = () => {
    editingId = null;
    form.reset();
    productDetailBody.innerHTML = "";
    document.getElementById("formTitle").textContent = "➕ Thêm phiếu nhập";
    
    // Set min date là hôm nay (chỉ cho phép chọn từ hiện tại và tương lai)
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const importDateInput = document.getElementById("importDate");
    if (importDateInput) {
      importDateInput.setAttribute('min', todayStr);
      importDateInput.value = todayStr; // Set mặc định là hôm nay
    }
    
    openModal(modal);
  };

  btnCancel.onclick = () => closeModal(modal);
  btnCloseDetail.onclick = () => closeModal(detailModal);

  // =================== THÊM DÒNG SẢN PHẨM ===================
  btnAddDetail.onclick = () => {
    const products =
      JSON.parse(localStorage.getItem("phonestore_products")) || [];

    const options = products
      .map((p) => `<option value="${p.id}">${p.tensanpham}</option>`)
      .join("");

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <select class="prod-select">
          <option value="">-- Chọn sản phẩm --</option>
          ${options}
         
        </select>
        <input type="text" class="prod-name" placeholder="Tên sản phẩm mới" style="display:none;">
      </td>
      <td><input type="number" class="prod-gia" placeholder="Giá nhập"></td>
      <td><input type="number" class="prod-qty" placeholder="Số lượng" id="quality"></td>
      <td class="prod-total">0₫</td>
      <td><button type="button" class="btn-del">🗑️</button></td>`;
    productDetailBody.appendChild(row);
  };

  // =================== CHỌN SP CÓ SẴN HOẶC THÊM MỚI ===================
  productDetailBody.addEventListener("change", (e) => {
    if (!e.target.classList.contains("prod-select")) return;

    const select = e.target;
    const row = select.closest("tr");
    const nameInput = row.querySelector(".prod-name");
    const giaInput = row.querySelector(".prod-gia");
    const selectedId = select.value;

    const products =
      JSON.parse(localStorage.getItem("phonestore_products")) || [];

    if (selectedId === "new") {
      // thêm sản phẩm mới
      nameInput.style.display = "inline-block";
      nameInput.value = "";
      giaInput.value = "";
      giaInput.removeAttribute("readonly");
    } else if (selectedId) {
      const prod = products.find((p) => p.id == selectedId);
      if (prod) {
        nameInput.style.display = "none";
        giaInput.value = prod.gia || prod.gia || 0; // lấy giá từ local
      }
    } else {
      nameInput.style.display = "none";
      giaInput.value = "";
    }
  });

  // =================== TÍNH TỔNG TỰ ĐỘNG ===================
  productDetailBody.addEventListener("input", (e) => {
    const row = e.target.closest("tr");
    if (!row) return;
    const gia = +row.querySelector(".prod-gia").value || 0;
    const qty = +row.querySelector(".prod-qty").value || 0;
    row.querySelector(".prod-total").textContent = formatMoney(gia * qty);
  });

  // =================== XOÁ DÒNG SẢN PHẨM ===================
  productDetailBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-del")) e.target.closest("tr").remove();
  });

  // =================== LƯU PHIẾU NHẬP ===================
  // =================== LƯU PHIẾU NHẬP ===================
  form.onsubmit = (e) => {
    e.preventDefault();
    let sl = document.getElementById("quality");
    if (sl.value < 1) {
      const products =
        JSON.parse(localStorage.getItem("phonestore_products")) || [];
      console.log(products.length);

      alert("Vui lòng nhập số lượng lớn hơn 1");
      return;
    }
    const date = document.getElementById("importDate").value;
    
    // Kiểm tra ngày nhập không được là quá khứ
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset về 00:00:00 để so sánh chính xác
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      alert("Ngày nhập không được là quá khứ! Vui lòng chọn ngày từ hôm nay trở đi.");
      return;
    }
    
    const rows = Array.from(productDetailBody.querySelectorAll("tr"));

    const details = rows
      .map((r) => {
        const select = r.querySelector(".prod-select");
        const name = r.querySelector(".prod-name");
        const productName =
          name.style.display === "none"
            ? select.options[select.selectedIndex].text
            : name.value.trim();
        const gia = +r.querySelector(".prod-gia").value;
        const qty = +r.querySelector(".prod-qty").value;

        return { product: productName, gia, qty };
      })
      .filter((d) => d.product && d.qty > 0 && d.gia > 0);

    if (!date || details.length === 0) {
      alert("Nhập ngày và ít nhất 1 sản phẩm hợp lệ!");
      return;
    }

    // 🔹 Chỉ lưu phiếu vào danh sách
    if (editingId) {
      const idx = importList.findIndex((x) => x.id === editingId);
      if (idx > -1) {
        importList[idx].date = date;
        importList[idx].details = details;
        importList[idx].status = "Chưa hoàn thành";
      }
    } else {
      const newId = importList.length
        ? Math.max(...importList.map((x) => x.id)) + 1
        : 1;
      importList.push({ id: newId, date, details, status: "Chưa hoàn thành" });
    }

    renderTable();
    saveToLocal();
    closeModal(modal);
  };

  // =================== CHI TIẾT, SỬA, HOÀN THÀNH ===================
  tableBody.addEventListener("click", (e) => {
    const id = +e.target.dataset.id;
    const item = importList.find((x) => x.id === id);
    if (!item) return;

    if (e.target.classList.contains("btn-detail")) {
      detailBody.innerHTML = `
        <p><b>Mã phiếu:</b> #${item.id}</p>
        <p><b>Ngày nhập:</b> ${item.date}</p>
        <p><b>Trạng thái:</b> ${item.status}</p>
        <table class="sub-table">
          <thead><tr><th>Sản phẩm</th><th>Giá</th><th>SL</th><th>Thành tiền</th></tr></thead>
          <tbody>
            ${item.details
              .map(
                (d) => `
              <tr>
                <td>${d.product}</td>
                <td>${formatMoney(d.price ? d.price : d.gia)}</td>
                <td>${d.qty}</td>
                <td>${formatMoney(d.price ? d.price : d.gia * d.qty)}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>`;
      openModal(detailModal);
    }

    if (e.target.classList.contains("btn-edit")) {
      if (item.status === "Hoàn thành")
        return alert("Không thể sửa phiếu đã hoàn thành!");
      editingId = id;
      document.getElementById("formTitle").textContent = `✏️ Sửa phiếu #${id}`;
      
      // Set min date là hôm nay (chỉ cho phép chọn từ hiện tại và tương lai)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
      const importDateInput = document.getElementById("importDate");
      if (importDateInput) {
        importDateInput.setAttribute('min', todayStr);
        
        // Parse ngày cũ (có thể là định dạng dd/mm/yyyy hoặc yyyy-mm-dd)
        let oldDate;
        if (item.date.includes('/')) {
          // Định dạng dd/mm/yyyy
          const [day, month, year] = item.date.split('/');
          oldDate = new Date(year, month - 1, day);
        } else {
          // Định dạng yyyy-mm-dd
          oldDate = new Date(item.date);
        }
        oldDate.setHours(0, 0, 0, 0);
        
        // Kiểm tra nếu ngày cũ là quá khứ, set về hôm nay
        if (oldDate < today) {
          importDateInput.value = todayStr;
          alert("Ngày nhập cũ là quá khứ. Đã tự động đổi về hôm nay. Vui lòng kiểm tra lại!");
        } else {
          // Chuyển đổi sang định dạng yyyy-mm-dd cho input type="date"
          const year = oldDate.getFullYear();
          const month = String(oldDate.getMonth() + 1).padStart(2, '0');
          const day = String(oldDate.getDate()).padStart(2, '0');
          importDateInput.value = `${year}-${month}-${day}`;
        }
      }
      
      productDetailBody.innerHTML = "";
      item.details.forEach((d) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td><input type="text" value="${d.product}" class="prod-name"></td>
          <td><input type="number" value="${d.gia}" class="prod-gia"></td>
          <td><input type="number" value="${d.qty}" class="prod-qty"></td>
          <td class="prod-total">${formatMoney(d.gia * d.qty)}</td>
          <td><button type="button" class="btn-del">🗑️</button></td>`;
        productDetailBody.appendChild(row);
      });
      openModal(modal);
    }

    if (e.target.classList.contains("btn-done")) {
      if (confirm("Xác nhận hoàn thành phiếu này?")) {
        item.status = "Hoàn thành";

        // 🔸 Cập nhật vào localStorage sản phẩm tại đây
        const products =
          JSON.parse(localStorage.getItem("phonestore_products")) || [];
        item.details.forEach((d) => {
          const exist = products.find(
            (p) => p.tensanpham?.toLowerCase() === d.product.toLowerCase()
          );

          if (exist) {
            exist.soluong = String(
              (Number(exist.soluong) || 0) + Number(d.qty)
            );
            exist.gia = Number(d.gia);
          } else {
            const newId = products.length
              ? Math.max(...products.map((p) => p.id)) + 1
              : 1;
            products.push({
              id: newId,
              tensanpham: d.product,
              gia: Number(d.gia),
              soluong: String(d.qty),
              giavon: Number(d.gia),
            });
          }
        });

        localStorage.setItem("phonestore_products", JSON.stringify(products));
        renderTable();
        saveToLocal();
      }
    }
  });

  // =================== TÌM KIẾM ===================
  searchInput.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) return renderTable();
    const filtered = importList.filter(
      (x) =>
        x.date.includes(q) ||
        String(x.id).includes(q) ||
        x.details.some((d) => d.product.toLowerCase().includes(q))
    );
    renderTable(filtered);
  });
}
