
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
          <input type="date" id="importDate" required />

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

  let importList = [
    {
      id: 1,
      date: "2025-10-23",
      status: "Hoàn thành",
      details: [
        { product: "iPhone 16", price: 25000000, qty: 2 },
        { product: "iPad Pro", price: 18000000, qty: 1 },
      ],
    },
  ];

  let editingId = null;

  function formatMoney(n) {
    return Number(n).toLocaleString("vi-VN") + "₫";
  }

  function totalOf(details) {
    return details.reduce((sum, d) => sum + d.price * d.qty, 0);
  }

  function renderTable(list = importList) {
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
  }

  renderTable();

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
    openModal(modal);
  };

  btnCancel.onclick = () => closeModal(modal);
  btnCloseDetail.onclick = () => closeModal(detailModal);

  btnAddDetail.onclick = () => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="text" placeholder="Tên sản phẩm" class="prod-name" required></td>
      <td><input type="number" placeholder="Giá" class="prod-price" required></td>
      <td><input type="number" placeholder="SL" class="prod-qty" required></td>
      <td class="prod-total">0₫</td>
      <td><button type="button" class="btn-del">🗑️</button></td>
    `;
    productDetailBody.appendChild(row);
  };

  productDetailBody.addEventListener("input", (e) => {
    const row = e.target.closest("tr");
    if (!row) return;
    const price = +row.querySelector(".prod-price").value || 0;
    const qty = +row.querySelector(".prod-qty").value || 0;
    row.querySelector(".prod-total").textContent = formatMoney(price * qty);
  });

  productDetailBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-del")) e.target.closest("tr").remove();
  });

  form.onsubmit = (e) => {
    e.preventDefault();
    const date = document.getElementById("importDate").value;
    const details = Array.from(productDetailBody.querySelectorAll("tr"))
      .map((r) => ({
        product: r.querySelector(".prod-name").value.trim(),
        price: +r.querySelector(".prod-price").value,
        qty: +r.querySelector(".prod-qty").value,
      }))
      .filter((d) => d.product && d.qty > 0 && d.price > 0);

    if (!date || details.length === 0) {
      alert("Nhập ngày và ít nhất 1 sản phẩm hợp lệ!");
      return;
    }

    if (editingId) {
      const idx = importList.findIndex((x) => x.id === editingId);
      if (idx > -1) {
        importList[idx].date = date;
        importList[idx].details = details;
      }
    } else {
      const newId = importList.length
        ? Math.max(...importList.map((x) => x.id)) + 1
        : 1;
      importList.push({ id: newId, date, details, status: "Chưa hoàn thành" });
    }

    renderTable();
    closeModal(modal);
  };

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
                <td>${formatMoney(d.price)}</td>
                <td>${d.qty}</td>
                <td>${formatMoney(d.price * d.qty)}</td>
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
      document.getElementById("importDate").value = item.date;
      productDetailBody.innerHTML = "";
      item.details.forEach((d) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td><input type="text" value="${d.product}" class="prod-name"></td>
          <td><input type="number" value="${d.price}" class="prod-price"></td>
          <td><input type="number" value="${d.qty}" class="prod-qty"></td>
          <td class="prod-total">${formatMoney(d.price * d.qty)}</td>
          <td><button type="button" class="btn-del">🗑️</button></td>`;
        productDetailBody.appendChild(row);
      });
      openModal(modal);
    }

    if (e.target.classList.contains("btn-done")) {
      item.status = "Hoàn thành";
      renderTable();
    }
  });

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

