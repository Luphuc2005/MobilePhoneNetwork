// Lấy dữ liệu tồn kho từ localStorage
const inventory = JSON.parse(localStorage.getItem('product')) || [];

const nameInput = document.getElementById("inventory-name");
const typeSelect = document.getElementById("inventory-type");
const btnSearch = document.getElementById("btn-search-inventory");
const inventoryList = document.getElementById("inventory-list");

function renderInventory(list) {
  inventoryList.innerHTML = "";

  if (!list || list.length === 0) {
    inventoryList.innerHTML = "<p>Không tìm thấy sản phẩm nào</p>";
    return;
  }

  list.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("inventory-item");

    // Thêm cảnh báo
    let warningText = "";
    if (Number(item.soluong) === 0) {
      div.classList.add("out-of-stock");
      warningText = "Hết hàng";
    } else if (Number(item.soluong) < 10) {
      div.classList.add("low-stock");
      warningText = "Sắp hết hàng!!";
    }

    div.innerHTML = `
      <div>
        <strong>${item.tensanpham}</strong> (${item.danhmuc})
      </div>
      <div>
        <span>Số lượng: <strong>${item.soluong}</strong></span>
        ${warningText ? `<span class="warning">${warningText}</span>` : ""}
      </div>
    `;

    inventoryList.appendChild(div);
  });
}

function searchInventory() {
  const nameValue = nameInput.value.trim().toLowerCase();
  const typeValue = typeSelect.value;

  const filtered = inventory.filter(item => {
    const matchName = item.tensanpham.toLowerCase().includes(nameValue);
    const matchType = !typeValue || item.danhmuc === typeValue;
    return matchName && matchType;
  });

  renderInventory(filtered);
}

// Lắng nghe sự kiện
btnSearch.addEventListener("click", searchInventory);
nameInput.addEventListener("input", searchInventory);
typeSelect.addEventListener("change", searchInventory);

// Hiển thị danh sách ban đầu
renderInventory(inventory);