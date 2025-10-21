// ====== QUẢN LÝ GIÁ BÁN ======
// TODO: Sau này sẽ load dữ liệu từ JSON file
// Cách nối JSON:
// 1. Tạo file products.json trong thư mục data/
// 2. Uncomment phần fetch() trong hàm loadProducts()
// 3. Xóa phần sampleProducts và dùng data.products thay thế

// Biến toàn cục
let categoryProfits = JSON.parse(localStorage.getItem("categoryProfits")) || {};
let productProfits = JSON.parse(localStorage.getItem("productProfits")) || {};

// ====== TAB SWITCHING ======
function switchTab(tabName) {
  // Ẩn tất cả tab content
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active");
    tab.style.display = "none";
  });

  // Ẩn tất cả tab buttons
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  // Hiển thị tab được chọn
  const targetTab = document.getElementById(tabName + "-tab");
  const targetBtn = document.querySelector(`[data-tab="${tabName}"]`);

  if (targetTab) {
    targetTab.classList.add("active");
    targetTab.style.display = "block";
  }
  if (targetBtn) {
    targetBtn.classList.add("active");
  }

  // Load dữ liệu khi chuyển tab
  if (tabName === "profit") {
    loadProfitTable();
    loadProducts();
  }
}

// ====== EVENT LISTENERS ======
function setupEventListeners() {
  // Tab switching
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const tabName = btn.getAttribute("data-tab");
      if (tabName) {
        switchTab(tabName);
      }
    });
  });

  // Save category profit
  const saveCategoryBtn = document.getElementById("saveCategoryBtn");
  if (saveCategoryBtn) {
    saveCategoryBtn.addEventListener("click", (e) => {
      e.preventDefault();
      saveCategoryProfit();
    });
  }

  // Save product profit
  const saveProductBtn = document.getElementById("saveProductBtn");
  if (saveProductBtn) {
    saveProductBtn.addEventListener("click", (e) => {
      e.preventDefault();
      saveProductProfit();
    });
  }

  // Calculate price
  const calculateBtn = document.getElementById("calculateBtn");
  if (calculateBtn) {
    calculateBtn.addEventListener("click", (e) => {
      e.preventDefault();
      calculatePrice();
    });
  }

  // Enter key support
  const categoryProfitInput = document.getElementById("categoryProfit");
  if (categoryProfitInput) {
    categoryProfitInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        saveCategoryProfit();
      }
    });
  }

  const productProfitInput = document.getElementById("productProfit");
  if (productProfitInput) {
    productProfitInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        saveProductProfit();
      }
    });
  }

  const costPriceInput = document.getElementById("costPrice");
  const profitPercentInput = document.getElementById("profitPercent");

  if (costPriceInput) {
    costPriceInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        calculatePrice();
      }
    });
  }

  if (profitPercentInput) {
    profitPercentInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        calculatePrice();
      }
    });
  }
}

// ====== LOAD CATEGORIES ======
function loadCategories() {
  const categorySelect = document.getElementById("categorySelect");
  if (!categorySelect) {
    console.log("Category select element not found!");
    return;
  }

  // Dữ liệu categories
  const categories = ["Iphone", "Samsung", "Xiaomi", "Oppo"];

  // Xóa options cũ
  categorySelect.innerHTML = '<option value="">Chọn loại sản phẩm</option>';

  // Thêm categories vào select
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });

  console.log("✅ Categories loaded:", categories.length, "items");
}

// ====== LOAD PRODUCTS ======
function loadProducts() {
  const productSelect = document.getElementById("productSelect");
  if (!productSelect) return;

  // Dữ liệu mẫu với 4 sản phẩm
  const sampleProducts = [
    { name: "iPhone 15 Pro Max", category: "Iphone", price: 29990000, id: 1 },
    {
      name: "Samsung Galaxy S25 Ultra",
      category: "Samsung",
      price: 27990000,
      id: 2,
    },
    { name: "Xiaomi 15T Pro", category: "Xiaomi", price: 12990000, id: 3 },
    { name: "Oppo Find X8", category: "Oppo", price: 18990000, id: 4 },
  ];

  // Xóa options cũ
  productSelect.innerHTML = '<option value="">Chọn sản phẩm</option>';

  // Thêm products vào select
  sampleProducts.forEach((product) => {
    const option = document.createElement("option");
    option.value = product.name;
    option.textContent = `${product.name} (${product.category})`;
    productSelect.appendChild(option);
  });

  console.log("✅ Products loaded:", sampleProducts.length, "items");

  // TODO: Sau này sẽ load từ JSON
  // fetch("./data/products.json")
  //   .then((response) => response.json())
  //   .then((data) => {
  //     // Load products từ JSON
  //   });
}

// ====== CONFIRM MODAL ======
function showConfirmModal(title, message, onConfirm, onCancel) {
  // Xóa modal cũ nếu có
  const existingModal = document.querySelector(".confirm-modal");
  if (existingModal) {
    existingModal.remove();
  }

  const modal = document.createElement("div");
  modal.className = "confirm-modal";
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10001;
    backdrop-filter: blur(4px);
  `;

  modal.innerHTML = `
    <div style="
      background: white;
      border-radius: 12px;
      padding: 24px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <div style="font-weight: 600; font-size: 18px; margin-bottom: 12px; color: #1f2937;">${title}</div>
      <div style="font-size: 14px; line-height: 1.5; color: #6b7280; margin-bottom: 20px;">${message}</div>
      <div style="display: flex; gap: 12px; justify-content: flex-end;">
        <button id="cancelBtn" style="
          background: #f3f4f6;
          color: #6b7280;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        ">Hủy</button>
        <button id="confirmBtn" style="
          background: #10b981;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        ">Xác nhận</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Event listeners
  const cancelBtn = document.getElementById("cancelBtn");
  const confirmBtn = document.getElementById("confirmBtn");

  cancelBtn.addEventListener("click", () => {
    modal.remove();
    if (onCancel) onCancel();
  });

  confirmBtn.addEventListener("click", () => {
    modal.remove();
    if (onConfirm) onConfirm();
  });

  // Hover effects
  [cancelBtn, confirmBtn].forEach((btn) => {
    btn.addEventListener(
      "mouseenter",
      () => (btn.style.transform = "scale(1.02)")
    );
    btn.addEventListener(
      "mouseleave",
      () => (btn.style.transform = "scale(1)")
    );
  });

  // Escape key to cancel
  const escapeHandler = (e) => {
    if (e.key === "Escape") {
      modal.remove();
      document.removeEventListener("keydown", escapeHandler);
      if (onCancel) onCancel();
    }
  };
  document.addEventListener("keydown", escapeHandler);
}

// ====== SAVE CATEGORY PROFIT ======
function saveCategoryProfit() {
  const categorySelect = document.getElementById("categorySelect");
  const categoryProfitInput = document.getElementById("categoryProfit");

  if (!categorySelect || !categoryProfitInput) {
    showNotification(
      "❌ Lỗi hệ thống",
      "Không thể tìm thấy form nhập liệu. Vui lòng tải lại trang.",
      "error"
    );
    return;
  }

  const category = categorySelect.value.trim();
  const profit = parseFloat(categoryProfitInput.value);

  console.log("🔍 Debug saveCategoryProfit:", {
    category,
    profit,
    optionsCount: categorySelect.options.length,
  });

  // Validation với thông báo chuyên nghiệp
  if (!category) {
    showNotification(
      "📋 Thiếu thông tin",
      "Vui lòng chọn loại sản phẩm từ danh sách.",
      "error"
    );
    categorySelect.focus();
    categorySelect.style.borderColor = "#ef4444";
    setTimeout(() => {
      categorySelect.style.borderColor = "#cbd5e1";
    }, 3000);
    return;
  }

  if (isNaN(profit) || profit < 0 || profit > 100) {
    showNotification(
      "📊 Dữ liệu không hợp lệ",
      "Phần trăm lợi nhuận phải là số từ 0 đến 100.",
      "error"
    );
    categoryProfitInput.focus();
    categoryProfitInput.style.borderColor = "#ef4444";
    setTimeout(() => {
      categoryProfitInput.style.borderColor = "#cbd5e1";
    }, 3000);
    return;
  }

  // Kiểm tra xem đã tồn tại chưa
  const isUpdate = categoryProfits[category] !== undefined;
  const oldProfit = categoryProfits[category];

  const title = isUpdate
    ? "Cập nhật lợi nhuận danh mục"
    : "Thiết lập lợi nhuận danh mục";
  const message = isUpdate
    ? `Loại sản phẩm: ${category}<br>Lợi nhuận hiện tại: ${oldProfit}%<br>Lợi nhuận mới: ${profit}%`
    : `Loại sản phẩm: ${category}<br>Lợi nhuận: ${profit}%`;

  showConfirmModal(
    title,
    message,
    () => {
      // Lưu vào localStorage
      categoryProfits[category] = profit;
      localStorage.setItem("categoryProfits", JSON.stringify(categoryProfits));

      // Reset form với animation
      categorySelect.style.transition = "all 0.3s ease";
      categoryProfitInput.style.transition = "all 0.3s ease";

      categorySelect.value = "";
      categoryProfitInput.value = "";

      categorySelect.style.borderColor = "#10b981";
      categoryProfitInput.style.borderColor = "#10b981";

      setTimeout(() => {
        categorySelect.style.borderColor = "#cbd5e1";
        categoryProfitInput.style.borderColor = "#cbd5e1";
      }, 2000);

      // Reload table
      loadProfitTable();

      const successMessage = isUpdate
        ? `Lợi nhuận "${category}" đã được cập nhật: ${oldProfit}% → ${profit}%`
        : `Đã thêm lợi nhuận cho "${category}": ${profit}%`;

      showNotification("✅ Thành công", successMessage, "success");
    },
    () => {
      showNotification(
        "ℹ️ Đã hủy",
        isUpdate
          ? `Giữ nguyên lợi nhuận cho "${category}": ${oldProfit}%`
          : `Đã hủy thiết lập lợi nhuận cho "${category}".`,
        "info"
      );
    }
  );
}

// ====== SAVE PRODUCT PROFIT ======
function saveProductProfit() {
  const productSelect = document.getElementById("productSelect");
  const productProfitInput = document.getElementById("productProfit");

  if (!productSelect || !productProfitInput) {
    showNotification(
      "❌ Lỗi hệ thống",
      "Không thể tìm thấy form nhập liệu. Vui lòng tải lại trang.",
      "error"
    );
    return;
  }

  const product = productSelect.value.trim();
  const profit = parseFloat(productProfitInput.value);

  console.log("🔍 Debug saveProductProfit:", {
    product,
    profit,
    optionsCount: productSelect.options.length,
  });

  // Validation với thông báo chuyên nghiệp
  if (!product) {
    showNotification(
      "📱 Thiếu thông tin",
      "Vui lòng chọn sản phẩm từ danh sách.",
      "error"
    );
    productSelect.focus();
    productSelect.style.borderColor = "#ef4444";
    setTimeout(() => {
      productSelect.style.borderColor = "#cbd5e1";
    }, 3000);
    return;
  }

  if (isNaN(profit) || profit < 0 || profit > 100) {
    showNotification(
      "📊 Dữ liệu không hợp lệ",
      "Phần trăm lợi nhuận phải là số từ 0 đến 100.",
      "error"
    );
    productProfitInput.focus();
    productProfitInput.style.borderColor = "#ef4444";
    setTimeout(() => {
      productProfitInput.style.borderColor = "#cbd5e1";
    }, 3000);
    return;
  }

  // Kiểm tra xem đã tồn tại chưa
  const isUpdate = productProfits[product] !== undefined;
  const oldProfit = productProfits[product];

  const title = isUpdate
    ? "Cập nhật lợi nhuận sản phẩm"
    : "Thiết lập lợi nhuận sản phẩm";
  const message = isUpdate
    ? `Sản phẩm: ${product}<br>Lợi nhuận hiện tại: ${oldProfit}%<br>Lợi nhuận mới: ${profit}%`
    : `Sản phẩm: ${product}<br>Lợi nhuận: ${profit}%`;

  showConfirmModal(
    title,
    message,
    () => {
      // Lưu vào localStorage
      productProfits[product] = profit;
      localStorage.setItem("productProfits", JSON.stringify(productProfits));

      // Reset form với animation
      productSelect.style.transition = "all 0.3s ease";
      productProfitInput.style.transition = "all 0.3s ease";

      productSelect.value = "";
      productProfitInput.value = "";

      productSelect.style.borderColor = "#10b981";
      productProfitInput.style.borderColor = "#10b981";

      setTimeout(() => {
        productSelect.style.borderColor = "#cbd5e1";
        productProfitInput.style.borderColor = "#cbd5e1";
      }, 2000);

      // Reload table
      loadProfitTable();

      const successMessage = isUpdate
        ? `Lợi nhuận "${product}" đã được cập nhật: ${oldProfit}% → ${profit}%`
        : `Đã thêm lợi nhuận cho "${product}": ${profit}%`;

      showNotification("✅ Thành công", successMessage, "success");
    },
    () => {
      showNotification(
        "ℹ️ Đã hủy",
        isUpdate
          ? `Giữ nguyên lợi nhuận cho "${product}": ${oldProfit}%`
          : `Đã hủy thiết lập lợi nhuận cho "${product}".`,
        "info"
      );
    }
  );
}

// ====== LOAD PROFIT TABLE ======
function loadProfitTable() {
  const tableBody = document.getElementById("profitTableBody");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  // Load category profits
  Object.keys(categoryProfits).forEach((category) => {
    const row = createProfitRow(
      category,
      categoryProfits[category],
      "category"
    );
    tableBody.appendChild(row);
  });

  // Load product profits
  Object.keys(productProfits).forEach((product) => {
    const row = createProfitRow(product, productProfits[product], "product");
    tableBody.appendChild(row);
  });

  // Hiển thị thông báo nếu không có dữ liệu
  if (
    Object.keys(categoryProfits).length === 0 &&
    Object.keys(productProfits).length === 0
  ) {
    const emptyRow = document.createElement("div");
    emptyRow.classList.add("table-row");
    emptyRow.innerHTML = `
      <div colspan="3" style="text-align: center; padding: 20px; color: #6b7280; font-style: italic;">
        Chưa có dữ liệu % lợi nhuận nào được thiết lập
      </div>
    `;
    tableBody.appendChild(emptyRow);
  }
}

// ====== CREATE PROFIT ROW ======
function createProfitRow(name, profit, type) {
  const row = document.createElement("div");
  row.classList.add("table-row");

  row.innerHTML = `
    <div>
      <span class="profit-type">${type === "category" ? "📊" : "📱"}</span>
      <span>${name}</span>
    </div>
    <div><strong>${profit}%</strong></div>
    <div class="actions">
      <button onclick="editProfit('${name}', ${profit}, '${type}')" title="Sửa">
        <img src="assets/images/icons/sua.png" alt="Sửa" />
      </button>
      <button onclick="deleteProfit('${name}', '${type}')" title="Xóa">
        <img src="assets/images/icons/xoa.png" alt="Xóa" />
      </button>
    </div>
  `;

  return row;
}

// ====== EDIT PROFIT ======
function editProfit(name, currentProfit, type) {
  const newProfit = prompt(`Nhập % lợi nhuận mới cho ${name}:`, currentProfit);

  if (newProfit === null) return; // User cancelled

  const profit = parseFloat(newProfit);

  if (isNaN(profit) || profit < 0 || profit > 100) {
    showNotification(
      "⚠️ Lỗi",
      "Vui lòng nhập % lợi nhuận hợp lệ (0-100)!",
      "error"
    );
    return;
  }

  if (type === "category") {
    categoryProfits[name] = profit;
    localStorage.setItem("categoryProfits", JSON.stringify(categoryProfits));
  } else {
    productProfits[name] = profit;
    localStorage.setItem("productProfits", JSON.stringify(productProfits));
  }

  loadProfitTable();
  showNotification(
    "✅ Thành công",
    `Đã cập nhật % lợi nhuận cho ${name}: ${profit}%`,
    "success"
  );
}

// ====== DELETE PROFIT ======
function deleteProfit(name, type) {
  if (!confirm(`Bạn có chắc muốn xóa % lợi nhuận của ${name}?`)) return;

  if (type === "category") {
    delete categoryProfits[name];
    localStorage.setItem("categoryProfits", JSON.stringify(categoryProfits));
  } else {
    delete productProfits[name];
    localStorage.setItem("productProfits", JSON.stringify(productProfits));
  }

  loadProfitTable();
  showNotification(
    "✅ Thành công",
    `Đã xóa % lợi nhuận của ${name}`,
    "success"
  );
}

// ====== CALCULATE PRICE ======
function calculatePrice() {
  const costPriceInput = document.getElementById("costPrice");
  const profitPercentInput = document.getElementById("profitPercent");

  if (!costPriceInput || !profitPercentInput) {
    showNotification(
      "❌ Lỗi hệ thống",
      "Không thể tìm thấy form tính giá. Vui lòng tải lại trang.",
      "error"
    );
    return;
  }

  const costPrice = parseFloat(costPriceInput.value);
  const profitPercent = parseFloat(profitPercentInput.value);

  // Validation với thông báo chuyên nghiệp
  if (isNaN(costPrice) || costPrice < 0) {
    showNotification(
      "💰 Giá vốn không hợp lệ",
      "Vui lòng nhập giá vốn là số dương.",
      "error"
    );
    costPriceInput.focus();
    costPriceInput.style.borderColor = "#ef4444";
    setTimeout(() => {
      costPriceInput.style.borderColor = "#cbd5e1";
    }, 3000);
    return;
  }

  if (isNaN(profitPercent) || profitPercent < 0 || profitPercent > 100) {
    showNotification(
      "📊 Phần trăm không hợp lệ",
      "Phần trăm lợi nhuận phải là số từ 0 đến 100.",
      "error"
    );
    profitPercentInput.focus();
    profitPercentInput.style.borderColor = "#ef4444";
    setTimeout(() => {
      profitPercentInput.style.borderColor = "#cbd5e1";
    }, 3000);
    return;
  }

  // Tính giá bán: Giá bán = Giá vốn × (1 + % lợi nhuận)
  const sellPrice = costPrice * (1 + profitPercent / 100);
  const profitAmount = sellPrice - costPrice;

  // Hiển thị kết quả
  const costDisplay = document.getElementById("costDisplay");
  const profitDisplay = document.getElementById("profitDisplay");
  const sellPriceDisplay = document.getElementById("sellPriceDisplay");
  const profitAmountDisplay = document.getElementById("profitAmountDisplay");

  if (costDisplay) costDisplay.textContent = formatPrice(costPrice);
  if (profitDisplay) profitDisplay.textContent = `${profitPercent}%`;
  if (sellPriceDisplay) sellPriceDisplay.textContent = formatPrice(sellPrice);
  if (profitAmountDisplay)
    profitAmountDisplay.textContent = formatPrice(profitAmount);

  // Highlight kết quả với animation
  const resultDiv = document.querySelector(".price-result");
  if (resultDiv) {
    resultDiv.style.animation = "none";
    resultDiv.style.borderColor = "#10b981";
    resultDiv.style.backgroundColor = "#f0fdf4";
    setTimeout(() => {
      resultDiv.style.animation = "pulse 0.6s ease-in-out";
    }, 10);

    setTimeout(() => {
      resultDiv.style.borderColor = "#0ea5e9";
      resultDiv.style.backgroundColor = "#f0f9ff";
    }, 2000);
  }

  showNotification(
    "🧮 Tính toán thành công",
    `Giá bán: ${formatPrice(sellPrice)} | Lợi nhuận: ${formatPrice(
      profitAmount
    )}`,
    "success"
  );
}

// ====== FORMAT PRICE ======
function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

// ====== SET EXAMPLE ======
function setExample(costPrice, profitPercent) {
  const costPriceInput = document.getElementById("costPrice");
  const profitPercentInput = document.getElementById("profitPercent");

  if (costPriceInput && profitPercentInput) {
    costPriceInput.value = costPrice;
    profitPercentInput.value = profitPercent;
    calculatePrice();
  }
}

// ====== NOTIFICATION FUNCTION ======
function showNotification(title, message, type = "success") {
  // Xóa notification cũ nếu có
  const existingNotification = document.querySelector(".pricing-notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement("div");
  let bgColor, icon;

  switch (type) {
    case "success":
      bgColor = "#10b981";
      icon = "✅";
      break;
    case "error":
      bgColor = "#ef4444";
      icon = "❌";
      break;
    case "info":
      bgColor = "#3b82f6";
      icon = "ℹ️";
      break;
    default:
      bgColor = "#10b981";
      icon = "✅";
  }

  notification.className = "pricing-notification";
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 100%);
    color: white;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    max-width: 380px;
    min-width: 300px;
    animation: slideInRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

  notification.innerHTML = `
    <div style="display: flex; align-items: center; margin-bottom: 8px;">
      <span style="font-size: 18px; margin-right: 8px;">${icon}</span>
      <div style="font-weight: 600; font-size: 15px;">${title}</div>
    </div>
    <div style="font-size: 14px; opacity: 0.95; line-height: 1.4; margin-left: 26px;">${message}</div>
  `;

  document.body.appendChild(notification);

  // Tự động đóng sau 4 giây cho success/info, 5 giây cho error
  const autoCloseTime = type === "error" ? 5000 : 4000;
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.style.animation =
        "slideOutRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      setTimeout(() => notification.remove(), 400);
    }
  }, autoCloseTime);

  // Thêm nút đóng thủ công
  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = "×";
  closeBtn.style.cssText = `
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  `;

  closeBtn.addEventListener("click", () => {
    notification.style.animation =
      "slideOutRight 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    setTimeout(() => notification.remove(), 400);
  });

  closeBtn.addEventListener("mouseenter", () => {
    closeBtn.style.background = "rgba(255, 255, 255, 0.3)";
    closeBtn.style.transform = "scale(1.1)";
  });

  closeBtn.addEventListener("mouseleave", () => {
    closeBtn.style.background = "rgba(255, 255, 255, 0.2)";
    closeBtn.style.transform = "scale(1)";
  });

  notification.appendChild(closeBtn);
}

// ====== KEYFRAMES ======
const pricingStyle = document.createElement("style");
pricingStyle.textContent = `
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
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }
  
  .profit-type {
    margin-right: 8px;
    font-size: 16px;
  }
`;
document.head.appendChild(pricingStyle);

// ====== INITIALIZE ======
function initializePricing() {
  console.log("🚀 Initializing pricing module...");

  // Setup event listeners
  setupEventListeners();

  // Load dữ liệu
  loadProfitTable();
  loadCategories();
  loadProducts();

  // Thêm dữ liệu mẫu nếu chưa có
  if (Object.keys(categoryProfits).length === 0) {
    console.log("📊 Adding sample category profits...");
    categoryProfits = {
      Iphone: 20,
      Samsung: 15,
      Xiaomi: 12,
      Oppo: 18,
    };
    localStorage.setItem("categoryProfits", JSON.stringify(categoryProfits));
    loadProfitTable();
  }

  console.log("✅ Pricing module initialized successfully!");
}

// Auto initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializePricing);
} else {
  initializePricing();
}
