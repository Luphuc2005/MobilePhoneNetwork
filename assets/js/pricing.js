// ====== QUẢN LÝ GIÁ BÁN ======

// Biến toàn cục
let products = JSON.parse(localStorage.getItem("product")) || [];
let categoryProfits = JSON.parse(localStorage.getItem("categoryProfits")) || {};
let productProfits = JSON.parse(localStorage.getItem("productProfits")) || {};

// ====== HELPER: LƯU PRODUCTS ======
function saveProductsToStorage() {
  localStorage.setItem("product", JSON.stringify(products));
}

// ====== CALCULATE PROFIT (LỢI NHUẬN) ======
function calculateProfit(product) {
  // Kiểm tra xem có giá vốn không
  if (!product.giavon || product.giavon === 0) {
    return {
      profit: 0,
      profitPercent: 0,
      profitPercentText: "0.00",
      hasProfit: false,
      message: "Chưa có giá vốn",
      color: "#6b7280",
    };
  }

  // Tính lợi nhuận
  const profit = product.gia - product.giavon;
  const profitPercent = (profit / product.giavon) * 100;
  const profitPercentText = profitPercent.toFixed(2);

  // Xác định màu sắc dựa trên % lợi nhuận
  let color = "#10b981"; // Xanh lá - lời tốt
  if (profitPercent < 5) {
    color = "#ef4444"; // Đỏ - lời thấp
  } else if (profitPercent < 15) {
    color = "#f59e0b"; // Vàng - lời trung bình
  }

  return {
    profit: profit,
    profitPercent: profitPercent,
    profitPercentText: profitPercentText,
    hasProfit: true,
    message: `Lời ${formatPrice(profit)} (${profitPercentText}%)`,
    color: color,
  };
}

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
  } else if (tabName === "adjusted") {
    loadAdjustedProducts();
  } else if (tabName === "report") {
    loadProfitReport();
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
      e.preventDefault(); // không cho user nhấn F5
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

  // Apply category profit to price
  const applyCategoryProfitBtn = document.getElementById(
    "applyCategoryProfitBtn"
  );
  if (applyCategoryProfitBtn) {
    applyCategoryProfitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      applyCategoryProfitToPrice();
    });
  }

  // Apply product profit to price
  const applyProductProfitBtn = document.getElementById(
    "applyProductProfitBtn"
  );
  if (applyProductProfitBtn) {
    applyProductProfitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      applyProductProfitToPrice();
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

  // Search adjusted products
  const searchAdjustedInput = document.getElementById("searchAdjustedProduct");
  if (searchAdjustedInput) {
    searchAdjustedInput.addEventListener("input", (e) => {
      loadAdjustedProducts(e.target.value);
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

  // Load categories động từ products (đã được cache)
  const categoriesSet = new Set();
  products.forEach((product) => {
    if (product.danhmuc) {
      categoriesSet.add(product.danhmuc);
    }
  });

  const categories = Array.from(categoriesSet).sort();

  // Xóa options cũ
  categorySelect.innerHTML = '<option value="">Chọn loại sản phẩm</option>';

  // Thêm categories vào select
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });

  console.log("  Categories loaded:", categories.length, "items");
}

// ====== LOAD PRODUCTS ======
function loadProducts() {
  const productSelect = document.getElementById("productSelect");
  if (!productSelect) return;

  // Sắp xếp theo tên sản phẩm
  const sortedProducts = [...products].sort((a, b) =>
    a.tensanpham.localeCompare(b.tensanpham)
  );

  // Xóa options cũ
  productSelect.innerHTML = '<option value="">Chọn sản phẩm</option>';

  // Thêm products vào select, nhóm theo category
  const productsByCategory = {};
  sortedProducts.forEach((product) => {
    if (!productsByCategory[product.danhmuc]) {
      productsByCategory[product.danhmuc] = [];
    }
    productsByCategory[product.danhmuc].push(product);
  });

  // Thêm từng category group
  Object.keys(productsByCategory)
    .sort()
    .forEach((category) => {
      // Tạo optgroup
      const optgroup = document.createElement("optgroup");
      optgroup.label = `📱 ${category}`;

      productsByCategory[category].forEach((product) => {
        const option = document.createElement("option");
        option.value = product.id;
        option.textContent = product.tensanpham;
        optgroup.appendChild(option);
      });

      productSelect.appendChild(optgroup);
    });

  console.log(
    "  Products loaded:",
    products.length,
    "items in",
    Object.keys(productsByCategory).length,
    "categories"
  );
}

// ====== LOAD ADJUSTED PRODUCTS ======
function loadAdjustedProducts(searchTerm = "") {
  const grid = document.getElementById("adjustedProductsGrid");
  if (!grid) return;

  // Lọc sản phẩm đã điều chỉnh giá (từ cache local)
  let adjustedProducts = products.filter(
    (p) => p.oldPrice > 0 || p.discount != 0 || (p.giavon && p.gia > p.giavon)
  );

  // Tìm kiếm nếu có
  if (searchTerm) {
    adjustedProducts = adjustedProducts.filter(
      (p) =>
        p.tensanpham.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.danhmuc.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  grid.innerHTML = "";

  if (adjustedProducts.length === 0) {
    grid.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #6b7280; font-style: italic;">
        ${
          searchTerm
            ? "Không tìm thấy sản phẩm phù hợp"
            : "Chưa có sản phẩm nào được điều chỉnh giá"
        }
      </div>
    `;
    return;
  }

  // Hiển thị sản phẩm
  adjustedProducts.forEach((product) => {
    const card = createProductCard(product);
    grid.appendChild(card);
  });

  console.log("  Adjusted products loaded:", adjustedProducts.length, "items");
}

// ====== CREATE PRODUCT CARD ======
function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card-pricing";

  // Tính % giảm giá nếu chưa có
  let discount = product.discount;
  if (product.oldPrice > 0 && product.gia > 0) {
    discount = Math.round(
      ((product.oldPrice - product.gia) / product.oldPrice) * 100
    );
  }

  // Tính lợi nhuận
  const profitInfo = calculateProfit(product);

  card.innerHTML = `
    <div class="product-image-container">
      <img src="${product.hinhanh}" alt="${
    product.tensanpham
  }" onerror="this.src='/assets/images/products/ip15prm.webp'">
      ${discount < 0 ? `<div class="discount-badge">${discount}%</div>` : ""}
    </div>
    <div class="product-info-pricing">
      <h4 class="product-name-pricing">${product.tensanpham}</h4>
      <p class="product-category-pricing">📦 ${product.danhmuc}</p>
      
      ${
        product.giavon
          ? `<div style="background: #f0f9ff; padding: 8px; border-radius: 6px; margin: 8px 0;">
          <div style="font-size: 12px; color: #0369a1; margin-bottom: 4px;">
            💰 Giá vốn: <strong style="color: #0c4a6e;">${formatPrice(
              product.giavon
            )}</strong>
          </div>
          ${
            product.oldPrice > 0
              ? `<div style="font-size: 12px; color: #9333ea; margin-bottom: 4px;">
            🏷️ Giá niêm yết: <strong>${formatPrice(product.oldPrice)}</strong>
          </div>`
              : ""
          }
          ${
            discount < 0
              ? `<div style="font-size: 12px; color: #dc2626; margin-bottom: 4px;">
            🎁 Khuyến mãi: <strong>${discount}%</strong>
          </div>`
              : ""
          }
          <div style="font-size: 13px; color: #059669; padding-top: 4px; border-top: 1px solid #bae6fd;">
            💳 Giá bán: <strong style="font-size: 14px;">${formatPrice(
              product.gia
            )}</strong>
          </div>
        </div>`
          : `<div class="price-info">
          ${
            product.oldPrice > 0
              ? `<div class="old-price">${formatPrice(product.oldPrice)}</div>`
              : ""
          }
          <div class="current-price">${formatPrice(product.gia)}</div>
        </div>`
      }
      
      ${
        profitInfo.hasProfit
          ? `<div style="padding: 6px 10px; background: linear-gradient(135deg, ${profitInfo.color}15 0%, ${profitInfo.color}25 100%); border-left: 3px solid ${profitInfo.color}; border-radius: 6px; margin: 8px 0; font-size: 12px;">
          <strong style="color: ${profitInfo.color};">💵 ${profitInfo.message}</strong>
        </div>`
          : `<div style="padding: 6px 10px; background: #fef3c7; border-left: 3px solid #f59e0b; border-radius: 6px; margin: 8px 0; font-size: 12px; color: #92400e;">
          ⚠️ ${profitInfo.message}
        </div>`
      }
      
      <div class="product-actions-pricing">
        <button onclick="editProductDiscount(${
          product.id
        })" class="btn-view-detail" title="Xem chi tiết giá">
          <img src="assets/images/icons/info.png" alt="Chi tiết" style="filter: brightness(0) invert(1);" />
          Xem chi tiết
        </button>
        ${
          discount < 0
            ? `<button onclick="removeDiscount(${product.id})" class="btn-remove-discount" title="Xóa khuyến mãi">
          <img src="assets/images/icons/xoa.png" alt="Xóa" />
          Xóa KM
        </button>`
            : ""
        }
        ${
          product.giavon && product.gia > product.giavon
            ? `<button onclick="removeProfitMargin(${product.id})" class="btn-remove-profit" title="Xóa lợi nhuận - Trở về giá vốn" style="background: #f97316;">
          <img src="assets/images/icons/recycle-bin.png" alt="Reset" style="filter: brightness(0) invert(1);" />
          Xóa LN
        </button>`
            : ""
        }
      </div>
    </div>
  `;

  return card;
}

// ====== VIEW PRODUCT DETAILS (Xem chi tiết sản phẩm) ======
function editProductDiscount(productId) {
  const product = products.find((p) => p.id === productId);

  if (!product) {
    showNotification("❌ Lỗi", "Không tìm thấy sản phẩm!", "error");
    return;
  }

  // Tính toán thông tin
  const costPrice = product.giavon || 0;
  const listPrice = product.oldPrice || 0;
  const sellPrice = product.gia;
  const discountPercent =
    listPrice > 0 ? Math.round(((listPrice - sellPrice) / listPrice) * 100) : 0;
  const profitAmount = costPrice > 0 ? sellPrice - costPrice : 0;
  const profitPercent =
    costPrice > 0 ? ((profitAmount / costPrice) * 100).toFixed(1) : 0;

  // Tạo modal xem chi tiết
  const existingModal = document.querySelector(".edit-price-modal");
  if (existingModal) existingModal.remove();

  const modal = document.createElement("div");
  modal.className = "edit-price-modal confirm-modal";
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
      max-width: 500px;
      width: 90%;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px;">
          📱
        </div>
        <div>
          <div style="font-weight: 600; font-size: 18px; color: #1f2937;">${
            product.tensanpham
          }</div>
          <div style="font-size: 13px; color: #6b7280;">Chi tiết giá bán</div>
        </div>
      </div>
      
      <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 16px; border-radius: 10px; margin-bottom: 16px; border: 2px solid #0ea5e9;">
        <table style="width: 100%; font-size: 13px;">
          ${
            costPrice > 0
              ? `
          <tr>
            <td style="padding: 6px 0; color: #374151;">💰 Giá vốn (nhập hàng)</td>
            <td style="padding: 6px 0; text-align: right;"><strong style="color: #0369a1;">${formatPrice(
              costPrice
            )}</strong></td>
          </tr>`
              : ""
          }
          ${
            listPrice > 0
              ? `
          <tr>
            <td style="padding: 6px 0; color: #374151;">🏷️ Giá niêm yết</td>
            <td style="padding: 6px 0; text-align: right;"><strong style="color: #9333ea;">${formatPrice(
              listPrice
            )}</strong></td>
          </tr>`
              : ""
          }
          ${
            discountPercent > 0
              ? `
          <tr>
            <td style="padding: 6px 0; color: #374151;">🎁 Khuyến mãi</td>
            <td style="padding: 6px 0; text-align: right;"><strong style="color: #dc2626;">-${discountPercent}%</strong></td>
          </tr>`
              : ""
          }
          <tr style="border-top: 2px solid #0ea5e9;">
            <td style="padding: 8px 0; color: #374151; font-weight: 600;">💳 Giá bán cuối</td>
            <td style="padding: 8px 0; text-align: right;"><strong style="color: #059669; font-size: 16px;">${formatPrice(
              sellPrice
            )}</strong></td>
          </tr>
          ${
            costPrice > 0
              ? `
          <tr style="background: ${
            profitAmount > 0 ? "#dcfce7" : "#fee2e2"
          }; margin-top: 8px;">
            <td style="padding: 8px; border-radius: 6px; font-weight: 600;">💵 Lợi nhuận thực tế</td>
            <td style="padding: 8px; text-align: right;"><strong style="color: ${
              profitAmount > 0 ? "#059669" : "#dc2626"
            }; font-size: 15px;">${formatPrice(
                  profitAmount
                )} (${profitPercent}%)</strong></td>
          </tr>`
              : ""
          }
        </table>
      </div>
      
      <div style="background: #fef3c7; padding: 12px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 16px;">
        <div style="font-size: 12px; color: #92400e; line-height: 1.6;">
          <strong>💡 Muốn thay đổi giá?</strong><br>
          Vào tab <strong>"⚡ Áp dụng % Lợi nhuận"</strong> để:<br>
          • Thiết lập % lợi nhuận từ giá vốn<br>
          • Thiết lập % khuyến mãi<br>
          • Tự động tính giá bán chính xác
        </div>
      </div>
      
      <div style="display: flex; gap: 12px;">
        <button id="closeDetailBtn" style="
          flex: 1;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s ease;
        ">Đóng</button>
        <button id="goToProfitTab" style="
          flex: 1;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s ease;
        ">⚡ Điều chỉnh giá</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Event: Đóng
  document.getElementById("closeDetailBtn").onclick = () => {
    modal.remove();
  };

  // Event: Chuyển đến tab lợi nhuận
  document.getElementById("goToProfitTab").onclick = () => {
    modal.remove();
    // Chuyển tab
    document.querySelector('[data-tab="profit"]').click();
    // Focus vào dropdown sản phẩm
    setTimeout(() => {
      const productSelect = document.getElementById("productSelect");
      if (productSelect) {
        productSelect.value = productId;
        productSelect.focus();
      }
    }, 100);
  };

  // Đóng khi click bên ngoài
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  };
}

// ====== REMOVE DISCOUNT ======
function removeDiscount(productId) {
  const product = products.find((p) => p.id === productId);

  if (!product) {
    showNotification("❌ Lỗi", "Không tìm thấy sản phẩm!", "error");
    return;
  }

  // Kiểm tra xem có giá cũ không
  if (!product.oldPrice || product.oldPrice === 0) {
    showNotification(
      "ℹ️ Thông báo",
      `Sản phẩm "${product.tensanpham}" không có giảm giá để xóa!`,
      "info"
    );
    return;
  }

  const currentPrice = product.gia;
  const originalPrice = product.oldPrice;

  showConfirmModal(
    "🎁 Xóa khuyến mãi - Trở về giá niêm yết",
    `Bạn có chắc muốn xóa khuyến mãi cho "<strong>${
      product.tensanpham
    }</strong>"?<br><br>
    <div style="background: #f3f4f6; padding: 12px; border-radius: 8px; margin-top: 12px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span>💰 Giá bán hiện tại (sau KM):</span>
        <strong style="color: #ef4444;">${formatPrice(currentPrice)}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; padding-top: 8px; border-top: 2px solid #e5e7eb;">
        <span>🔄 Giá sau khi xóa KM:</span>
        <strong style="color: #2563eb; font-size: 16px;">${formatPrice(
          originalPrice
        )}</strong>
      </div>
      <div style="margin-top: 12px; padding: 10px; background: #dbeafe; border-left: 3px solid #3b82f6; border-radius: 6px; font-size: 12px; color: #1e3a8a;">
        <strong>ℹ️ Lưu ý:</strong><br>
        • Giá sẽ trở về giá niêm yết (${formatPrice(originalPrice)})<br>
        • Xóa badge khuyến mãi<br>
        • Giá vốn vẫn giữ nguyên<br>
        • Tự động đồng bộ với trang người dùng
      </div>
    </div>`,
    () => {
      // Trở về giá niêm yết (xóa khuyến mãi)
      product.gia = product.oldPrice;
      product.oldPrice = 0;
      product.discount = 0;

      const productIndex = products.findIndex((p) => p.id === productId);
      products[productIndex] = product;
      saveProductsToStorage();

      // Broadcast thông báo đến các tab khác
      broadcastPriceUpdate(product.tensanpham);

      loadAdjustedProducts();
      showNotification(
        "  Đã xóa khuyến mãi",
        `"${product.tensanpham}" đã trở về giá niêm yết ${formatPrice(
          originalPrice
        )}. Trang người dùng đã tự động cập nhật!`,
        "success"
      );
    },
    () => {
      showNotification("ℹ️ Đã hủy", "Giữ nguyên giảm giá hiện tại", "info");
    }
  );
}

// ====== REMOVE PROFIT MARGIN (Xóa lợi nhuận - Trở về giá vốn) ======
function removeProfitMargin(productId) {
  const product = products.find((p) => p.id === productId);

  if (!product) {
    showNotification("❌ Lỗi", "Không tìm thấy sản phẩm!", "error");
    return;
  }

  // Kiểm tra xem có giá vốn không
  if (!product.giavon || product.giavon === 0) {
    showNotification(
      "ℹ️ Thông báo",
      `Sản phẩm "${product.tensanpham}" chưa có giá vốn!`,
      "info"
    );
    return;
  }

  // Kiểm tra xem có lợi nhuận không (giá hiện tại > giá vốn)
  if (product.gia <= product.giavon) {
    showNotification(
      "ℹ️ Thông báo",
      `Sản phẩm "${product.tensanpham}" không có lợi nhuận để xóa!`,
      "info"
    );
    return;
  }

  const currentPrice = product.gia;
  const costPrice = product.giavon;
  const currentProfit = currentPrice - costPrice;
  const currentProfitPercent = ((currentProfit / costPrice) * 100).toFixed(2);

  showConfirmModal(
    "🔄 Xóa lợi nhuận - Trở về giá vốn",
    `Bạn có chắc muốn xóa lợi nhuận cho "<strong>${
      product.tensanpham
    }</strong>"?<br><br>
    <div style="background: #f3f4f6; padding: 12px; border-radius: 8px; margin-top: 12px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span>💰 Giá vốn (gốc):</span>
        <strong style="color: #3b82f6;">${formatPrice(costPrice)}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px solid #e5e7eb;">
        <span>🏷️ Giá bán hiện tại:</span>
        <strong style="color: #6b7280;">${formatPrice(currentPrice)}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding: 8px; background: #fee2e2; border-radius: 6px;">
        <span>📊 Lợi nhuận hiện tại:</span>
        <strong style="color: #dc2626;">-${formatPrice(
          currentProfit
        )} (${currentProfitPercent}%)</strong>
      </div>
      <div style="display: flex; justify-content: space-between; padding-top: 8px; border-top: 2px solid #e5e7eb;">
        <span>🔄 Giá sau khi xóa:</span>
        <strong style="color: #10b981; font-size: 16px;">${formatPrice(
          costPrice
        )}</strong>
      </div>
      <div style="margin-top: 12px; padding: 10px; background: #fef3c7; border-left: 3px solid #f59e0b; border-radius: 6px; font-size: 12px; color: #92400e;">
        <strong>⚠️ LƯU Ý:</strong><br>
        • Giá sẽ trở về giá vốn gốc (${formatPrice(costPrice)})<br>
        • Mất toàn bộ lợi nhuận (${formatPrice(currentProfit)})<br>
        • oldPrice và discount sẽ bị xóa<br>
        • Tự động đồng bộ với trang người dùng
      </div>
    </div>`,
    () => {
      // Trở về giá vốn
      product.gia = product.giavon;
      product.oldPrice = 0;
      product.discount = 0;

      const productIndex = products.findIndex((p) => p.id === productId);
      products[productIndex] = product;
      saveProductsToStorage();

      // Broadcast thông báo đến các tab khác
      broadcastPriceUpdate(product.tensanpham);

      loadAdjustedProducts();
      showNotification(
        "  Đã xóa lợi nhuận",
        `"${product.tensanpham}" đã trở về giá vốn ${formatPrice(
          costPrice
        )}. Trang người dùng đã tự động cập nhật!`,
        "success"
      );
    },
    () => {
      showNotification("ℹ️ Đã hủy", "Giữ nguyên giá hiện tại", "info");
    }
  );
}

// ====== APPLY CATEGORY PROFIT TO PRICE ======
function applyCategoryProfitToPrice() {
  const categorySelect = document.getElementById("categorySelect");
  const categoryProfitInput = document.getElementById("categoryProfit");
  const categoryDiscountInput = document.getElementById("categoryDiscount");

  if (!categorySelect || !categoryProfitInput) {
    showNotification("❌ Lỗi", "Không thể tìm thấy form nhập liệu.", "error");
    return;
  }

  const category = categorySelect.value.trim();
  const profit = parseFloat(categoryProfitInput.value);
  const discountPercent = parseFloat(categoryDiscountInput?.value || 0);

  // Validation
  if (!category) {
    showNotification(
      "📋 Thiếu thông tin",
      "Vui lòng chọn loại sản phẩm.",
      "error"
    );
    categorySelect.focus();
    return;
  }

  if (isNaN(profit) || profit < 0 || profit > 100) {
    showNotification(
      "📊 Dữ liệu không hợp lệ",
      "% lợi nhuận phải từ 0 đến 100.",
      "error"
    );
    categoryProfitInput.focus();
    return;
  }

  if (isNaN(discountPercent) || discountPercent < 0 || discountPercent > 100) {
    showNotification(
      "📊 Dữ liệu không hợp lệ",
      "% khuyến mãi phải từ 0 đến 100.",
      "error"
    );
    categoryDiscountInput?.focus();
    return;
  }

  // Lấy danh sách sản phẩm (từ cache)
  const categoryProducts = products.filter((p) => p.danhmuc === category);

  if (categoryProducts.length === 0) {
    showNotification(
      "⚠️ Thông báo",
      `Không tìm thấy sản phẩm nào trong loại "${category}".`,
      "info"
    );
    return;
  }

  // Tính ví dụ
  const exampleCost = 2000000;
  const exampleListPrice = Math.round(exampleCost * (1 + profit / 100));
  const exampleSellPrice = Math.round(
    exampleListPrice * (1 - discountPercent / 100)
  );
  const exampleProfit = exampleSellPrice - exampleCost;
  const exampleProfitPercent = ((exampleProfit / exampleCost) * 100).toFixed(1);
  const exampleDiscount =
    discountPercent > 0
      ? Math.round((exampleListPrice * discountPercent) / 100)
      : 0;

  // Xác nhận trước khi áp dụng
  showConfirmModal(
    `Áp dụng ${profit}% lợi nhuận${
      discountPercent > 0 ? ` + ${discountPercent}% KM` : ""
    } cho ${category}`,
    `Bạn có chắc muốn áp dụng cho <strong>${
      categoryProducts.length
    } sản phẩm</strong> trong loại "${category}"?<br><br>
    
    <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 12px; border-radius: 8px; border: 2px solid #3b82f6; margin-bottom: 12px;">
      <strong style="color: #1e40af; font-size: 14px;">📐 CÔNG THỨC TÍNH:</strong><br>
      <div style="margin: 8px 0; padding: 8px; background: white; border-radius: 6px; font-size: 13px; line-height: 1.8;">
        <strong style="color: #dc2626;">⚠️ QUAN TRỌNG: Luôn tính từ GIÁ VỐN</strong><br>
        1️⃣ Giá niêm yết = <strong>Giá vốn</strong> × (1 + ${profit}%)<br>
        ${
          discountPercent > 0
            ? `2️⃣ Tiền giảm = Giá niêm yết × ${discountPercent}%<br>
        3️⃣ Giá bán = Giá niêm yết - Tiền giảm<br>`
            : ""
        }
        ${
          discountPercent > 0
            ? `4️⃣ Lời thực tế = Giá bán - Giá vốn`
            : `2️⃣ Lời thực tế = Giá bán - Giá vốn`
        }
      </div>
    </div>
    
    <div style="background: #f3f4f6; padding: 12px; border-radius: 8px;">
      <strong style="color: #10b981; font-size: 14px;">💡 VÍ DỤ: Giá vốn 2.000.000₫</strong><br>
      <table style="width: 100%; margin-top: 8px; font-size: 13px;">
        <tr style="background: white;">
          <td style="padding: 6px; border-radius: 4px;">💰 Giá vốn</td>
          <td style="padding: 6px; text-align: right;"><strong>2.000.000₫</strong></td>
        </tr>
        <tr><td colspan="2" style="padding: 2px;"></td></tr>
        <tr style="background: #dbeafe;">
          <td style="padding: 6px; border-radius: 4px;">📊 +${profit}% lợi nhuận</td>
          <td style="padding: 6px; text-align: right;"><strong style="color: #3b82f6;">+${formatPrice(
            exampleListPrice - exampleCost
          )}</strong></td>
        </tr>
        <tr style="background: white;">
          <td style="padding: 6px; border-radius: 4px;">🏷️ Giá niêm yết</td>
          <td style="padding: 6px; text-align: right;"><strong>${formatPrice(
            exampleListPrice
          )}</strong></td>
        </tr>
        ${
          discountPercent > 0
            ? `<tr><td colspan="2" style="padding: 2px;"></td></tr>
        <tr style="background: #fee2e2;">
          <td style="padding: 6px; border-radius: 4px;">🎁 -${discountPercent}% khuyến mãi</td>
          <td style="padding: 6px; text-align: right;"><strong style="color: #ef4444;">-${formatPrice(
            exampleDiscount
          )}</strong></td>
        </tr>`
            : ""
        }
        <tr style="background: #dcfce7;">
          <td style="padding: 6px; border-radius: 4px; font-weight: bold;">💳 Giá bán cuối</td>
          <td style="padding: 6px; text-align: right;"><strong style="color: #10b981; font-size: 15px;">${formatPrice(
            exampleSellPrice
          )}</strong></td>
        </tr>
        <tr><td colspan="2" style="padding: 4px; border-top: 2px solid #cbd5e1;"></td></tr>
        <tr style="background: #fef3c7;">
          <td style="padding: 6px; border-radius: 4px;">💵 Lời thực tế</td>
          <td style="padding: 6px; text-align: right;"><strong style="color: #f59e0b;">${formatPrice(
            exampleProfit
          )} (${exampleProfitPercent}%)</strong></td>
        </tr>
      </table>
      ${
        discountPercent > 0
          ? `<div style="margin-top: 8px; padding: 8px; background: white; border-left: 3px solid #10b981; border-radius: 4px; font-size: 12px;">
          Hiển thị: <del>${formatPrice(
            exampleListPrice
          )}</del> → <strong>${formatPrice(
              exampleSellPrice
            )}</strong> <span style="color: #ef4444;">[-${discountPercent}%]</span>
      </div>`
          : ""
      }
    </div>`,
    () => {
      let updatedCount = 0;
      let totalProfit = 0;

      categoryProducts.forEach((product) => {
        //   LOGIC HOÀN HẢO: LUÔN dựa trên giá vốn
        if (!product.giavon || product.giavon === 0) {
          showNotification(
            "❌ Lỗi",
            `Sản phẩm "${product.tensanpham}" chưa có giá vốn!`,
            "error"
          );
          return;
        }

        const costPrice = product.giavon; // Giá vốn (không đổi)
        const listPrice = Math.round(costPrice * (1 + profit / 100)); // Giá niêm yết (trước KM)
        const sellPrice = Math.round(listPrice * (1 - discountPercent / 100)); // Giá bán (sau KM)

        // Tính lợi nhuận thực tế (dựa trên giá vốn)
        totalProfit += sellPrice - costPrice;

        // Cập nhật sản phẩm
        product.gia = sellPrice; // Giá bán (sau KM)
        product.oldPrice = discountPercent > 0 ? listPrice : 0; // Giá niêm yết (nếu có KM)
        product.discount = discountPercent > 0 ? -discountPercent : 0; // % KM (âm)

        // Cập nhật trong mảng chính
        const productIndex = products.findIndex((p) => p.id === product.id);
        if (productIndex !== -1) {
          products[productIndex] = product;
          updatedCount++;
        }
      });

      // Lưu vào localStorage
      saveProductsToStorage();

      // Broadcast
      broadcastPriceUpdate(`${updatedCount} sản phẩm ${category}`);

      // Reset form
      categorySelect.value = "";
      categoryProfitInput.value = "";

      // Reload adjusted products nếu đang ở tab đó
      if (
        document.getElementById("adjusted-tab").classList.contains("active")
      ) {
        loadAdjustedProducts();
      }

      showNotification(
        "  Thành công",
        `Đã áp dụng ${profit}% lợi nhuận cho ${updatedCount} sản phẩm ${category}! Tổng lợi nhuận: ~${formatPrice(
          totalProfit
        )}`,
        "success"
      );
    },
    () => {
      showNotification("ℹ️ Đã hủy", "Không thay đổi giá sản phẩm.", "info");
    }
  );
}

// ====== APPLY PRODUCT PROFIT TO PRICE ======
function applyProductProfitToPrice() {
  const productSelect = document.getElementById("productSelect");
  const productProfitInput = document.getElementById("productProfit");
  const productDiscountInput = document.getElementById("productDiscount");

  if (!productSelect || !productProfitInput) {
    showNotification("❌ Lỗi", "Không thể tìm thấy form nhập liệu.", "error");
    return;
  }

  const productId = parseInt(productSelect.value);
  const profit = parseFloat(productProfitInput.value);
  const discountPercent = parseFloat(productDiscountInput?.value || 0);

  // Validation
  if (!productId || isNaN(productId)) {
    showNotification("📱 Thiếu thông tin", "Vui lòng chọn sản phẩm.", "error");
    productSelect.focus();
    return;
  }

  if (isNaN(profit) || profit < 0 || profit > 100) {
    showNotification(
      "📊 Dữ liệu không hợp lệ",
      "% lợi nhuận phải từ 0 đến 100.",
      "error"
    );
    productProfitInput.focus();
    return;
  }

  if (isNaN(discountPercent) || discountPercent < 0 || discountPercent > 100) {
    showNotification(
      "📊 Dữ liệu không hợp lệ",
      "% khuyến mãi phải từ 0 đến 100.",
      "error"
    );
    productDiscountInput?.focus();
    return;
  }

  // Lấy sản phẩm (từ cache)
  const product = products.find((p) => p.id === productId);

  if (!product) {
    showNotification("❌ Lỗi", "Không tìm thấy sản phẩm!", "error");
    return;
  }

  //   LOGIC HOÀN HẢO: LUÔN dựa trên giá vốn
  if (!product.giavon || product.giavon === 0) {
    showNotification(
      "❌ Lỗi",
      `Sản phẩm "${product.tensanpham}" chưa có giá vốn! Vui lòng cập nhật giá vốn trước.`,
      "error"
    );
    return;
  }

  const costPrice = product.giavon; // Giá vốn (không đổi)
  const currentPrice = product.gia; // Giá bán hiện tại
  const listPrice = Math.round(costPrice * (1 + profit / 100)); // Giá niêm yết (trước KM)
  const sellPrice = Math.round(listPrice * (1 - discountPercent / 100)); // Giá bán (sau KM)
  const profitAmount = sellPrice - costPrice; // Lợi nhuận thực tế
  const profitPercent = ((profitAmount / costPrice) * 100).toFixed(1);
  const discountAmount =
    discountPercent > 0 ? Math.round((listPrice * discountPercent) / 100) : 0;

  // Xác nhận trước khi áp dụng
  showConfirmModal(
    `Áp dụng ${profit}% lợi nhuận${
      discountPercent > 0 ? ` + ${discountPercent}% KM` : ""
    }`,
    `Áp dụng cho "<strong>${product.tensanpham}</strong>"?<br><br>
    
    <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 12px; border-radius: 8px; border: 2px solid #3b82f6; margin-bottom: 12px;">
      <strong style="color: #1e40af; font-size: 13px;">📐 CÔNG THỨC TÍNH:</strong><br>
      <div style="margin: 6px 0; padding: 8px; background: white; border-radius: 6px; font-size: 12px; line-height: 1.6;">
        <strong style="color: #dc2626;">⚠️ Luôn tính từ GIÁ VỐN</strong><br>
        1️⃣ Giá niêm yết = Giá vốn × (1 + ${profit}%)<br>
        ${
          discountPercent > 0
            ? `2️⃣ Tiền giảm = Giá niêm yết × ${discountPercent}%<br>
        3️⃣ Giá bán = Giá niêm yết - Tiền giảm<br>
        4️⃣ Lời thực tế = Giá bán - Giá vốn`
            : `2️⃣ Lời thực tế = Giá bán - Giá vốn`
        }
      </div>
    </div>
    
    <div style="background: #f3f4f6; padding: 12px; border-radius: 8px;">
      <table style="width: 100%; font-size: 13px;">
        <tr style="background: white;">
          <td style="padding: 6px; border-radius: 4px;">💰 Giá vốn</td>
          <td style="padding: 6px; text-align: right;"><strong>${formatPrice(
            costPrice
          )}</strong></td>
        </tr>
        <tr style="background: #fef3c7;">
          <td style="padding: 6px; border-radius: 4px;">🏷️ Giá bán hiện tại</td>
          <td style="padding: 6px; text-align: right;"><span style="color: #6b7280;">${formatPrice(
            currentPrice
          )}</span></td>
        </tr>
        <tr><td colspan="2" style="padding: 4px; border-top: 2px dashed #cbd5e1;"></td></tr>
        <tr style="background: #dbeafe;">
          <td style="padding: 6px; border-radius: 4px;">📊 +${profit}% lợi nhuận</td>
          <td style="padding: 6px; text-align: right;"><strong style="color: #3b82f6;">+${formatPrice(
            listPrice - costPrice
          )}</strong></td>
        </tr>
        <tr style="background: white;">
          <td style="padding: 6px; border-radius: 4px;">🏷️ Giá niêm yết mới</td>
          <td style="padding: 6px; text-align: right;"><strong>${formatPrice(
            listPrice
          )}</strong></td>
        </tr>
        ${
          discountPercent > 0
            ? `<tr><td colspan="2" style="padding: 2px;"></td></tr>
        <tr style="background: #fee2e2;">
          <td style="padding: 6px; border-radius: 4px;">🎁 -${discountPercent}% khuyến mãi</td>
          <td style="padding: 6px; text-align: right;"><strong style="color: #ef4444;">-${formatPrice(
            discountAmount
          )}</strong></td>
        </tr>`
            : ""
        }
        <tr style="background: #dcfce7;">
          <td style="padding: 6px; border-radius: 4px; font-weight: bold;">💳 Giá bán cuối</td>
          <td style="padding: 6px; text-align: right;"><strong style="color: #10b981; font-size: 15px;">${formatPrice(
            sellPrice
          )}</strong></td>
        </tr>
        <tr><td colspan="2" style="padding: 4px; border-top: 2px solid #cbd5e1;"></td></tr>
        <tr style="background: #fef3c7;">
          <td style="padding: 6px; border-radius: 4px; font-weight: bold;">💵 Lời thực tế</td>
          <td style="padding: 6px; text-align: right;"><strong style="color: #f59e0b; font-size: 14px;">${formatPrice(
            profitAmount
          )} (${profitPercent}%)</strong></td>
        </tr>
      </table>
      ${
        discountPercent > 0
          ? `<div style="margin-top: 8px; padding: 8px; background: white; border-left: 3px solid #10b981; border-radius: 4px; font-size: 12px;">
          Hiển thị: <del>${formatPrice(
            listPrice
          )}</del> → <strong>${formatPrice(
              sellPrice
            )}</strong> <span style="color: #ef4444;">[-${discountPercent}%]</span>
      </div>`
          : `<div style="margin-top: 8px; padding: 8px; background: white; border-left: 3px solid #10b981; border-radius: 4px; font-size: 12px;">
          Không có khuyến mãi, chỉ hiển thị giá ${formatPrice(sellPrice)}
      </div>`
      }
    </div>`,
    () => {
      // Cập nhật sản phẩm
      product.gia = sellPrice; // Giá bán (sau KM)
      product.oldPrice = discountPercent > 0 ? listPrice : 0; // Giá niêm yết (nếu có KM)
      product.discount = discountPercent > 0 ? -discountPercent : 0; // % KM (âm)

      // Lưu vào localStorage
      const productIndex = products.findIndex((p) => p.id === productId);
      products[productIndex] = product;
      saveProductsToStorage();

      // Broadcast
      broadcastPriceUpdate(product.tensanpham);

      // Reset form
      productSelect.value = "";
      productProfitInput.value = "";

      // Reload adjusted products nếu đang ở tab đó
      if (
        document.getElementById("adjusted-tab").classList.contains("active")
      ) {
        loadAdjustedProducts();
      }

      showNotification(
        "  Thành công",
        `Đã áp dụng ${profit}% lợi nhuận cho "${
          product.tensanpham
        }"! Lợi nhuận: ${formatPrice(profitAmount)}`,
        "success"
      );
    },
    () => {
      showNotification("ℹ️ Đã hủy", "Không thay đổi giá sản phẩm.", "info");
    }
  );
}

// ====== APPLY PROFIT FROM TABLE ======
function applyProfitFromTable(name, profit, type) {
  if (type === "category") {
    // Áp dụng cho tất cả sản phẩm trong category (từ cache)
    const categoryProducts = products.filter((p) => p.danhmuc === name);

    if (categoryProducts.length === 0) {
      showNotification(
        "⚠️ Thông báo",
        `Không tìm thấy sản phẩm nào trong loại "${name}".`,
        "info"
      );
      return;
    }

    showConfirmModal(
      `Áp dụng ${profit}% lợi nhuận`,
      `Áp dụng ${profit}% lợi nhuận đã lưu cho <strong>${categoryProducts.length} sản phẩm</strong> trong loại "${name}"?`,
      () => {
        let updatedCount = 0;

        categoryProducts.forEach((product) => {
          //   LOGIC HOÀN HẢO: LUÔN dựa trên giá vốn
          if (!product.giavon || product.giavon === 0) {
            console.warn(
              `Sản phẩm "${product.tensanpham}" chưa có giá vốn, bỏ qua.`
            );
            return;
          }

          const costPrice = product.giavon;
          const sellPrice = Math.round(costPrice * (1 + profit / 100));

          product.gia = sellPrice;
          product.oldPrice = 0;
          product.discount = 0;

          const productIndex = products.findIndex((p) => p.id === product.id);
          if (productIndex !== -1) {
            products[productIndex] = product;
            updatedCount++;
          }
        });

        saveProductsToStorage();
        broadcastPriceUpdate(`${updatedCount} sản phẩm ${name}`);

        if (
          document.getElementById("adjusted-tab").classList.contains("active")
        ) {
          loadAdjustedProducts();
        }

        showNotification(
          "  Thành công",
          `Đã áp dụng ${profit}% lợi nhuận cho ${updatedCount} sản phẩm ${name}!`,
          "success"
        );
      },
      () => {
        showNotification("ℹ️ Đã hủy", "Không thay đổi giá sản phẩm.", "info");
      }
    );
  } else {
    // Áp dụng cho 1 sản phẩm (từ cache)
    const product = products.find((p) => p.tensanpham === name);

    if (!product) {
      showNotification("❌ Lỗi", `Không tìm thấy sản phẩm "${name}"!`, "error");
      return;
    }

    //   LOGIC HOÀN HẢO: LUÔN dựa trên giá vốn
    if (!product.giavon || product.giavon === 0) {
      showNotification(
        "❌ Lỗi",
        `Sản phẩm "${name}" chưa có giá vốn!`,
        "error"
      );
      return;
    }

    const costPrice = product.giavon;
    const sellPrice = Math.round(costPrice * (1 + profit / 100));
    const profitAmount = sellPrice - costPrice;

    showConfirmModal(
      `Áp dụng ${profit}% lợi nhuận`,
      `Áp dụng ${profit}% lợi nhuận cho "${name}"?<br><br>
      <small>💰 Giá vốn: ${formatPrice(
        costPrice
      )} + 💵 Lợi nhuận: ${formatPrice(
        profitAmount
      )} = 💳 Giá bán: <strong>${formatPrice(sellPrice)}</strong><br>
      <span style="color: #10b981;">  Tính toán dựa trên giá vốn</span></small>`,
      () => {
        product.gia = sellPrice;
        product.oldPrice = 0;
        product.discount = 0;

        const productIndex = products.findIndex((p) => p.id === product.id);
        products[productIndex] = product;
        saveProductsToStorage();

        broadcastPriceUpdate(product.tensanpham);

        if (
          document.getElementById("adjusted-tab").classList.contains("active")
        ) {
          loadAdjustedProducts();
        }

        showNotification(
          "  Thành công",
          `Đã áp dụng ${profit}% lợi nhuận cho "${name}"!`,
          "success"
        );
      },
      () => {
        showNotification("ℹ️ Đã hủy", "Không thay đổi giá sản phẩm.", "info");
      }
    );
  }
}

// ====== BROADCAST PRICE UPDATE ======
function broadcastPriceUpdate(productName) {
  // Lưu timestamp để các tab khác biết có cập nhật mới
  const updateInfo = {
    timestamp: Date.now(),
    productName: productName,
    action: "price_updated",
  };
  localStorage.setItem("priceUpdateTrigger", JSON.stringify(updateInfo));

  // Xóa sau 100ms để trigger lại lần sau
  setTimeout(() => {
    localStorage.removeItem("priceUpdateTrigger");
  }, 100);

  console.log("📢 Đã broadcast thông báo cập nhật giá:", productName);
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

      showNotification("  Thành công", successMessage, "success");
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

  const productId = parseInt(productSelect.value);
  const profit = parseFloat(productProfitInput.value);

  // Validation
  if (!productId || isNaN(productId)) {
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

  // Lấy tên sản phẩm từ ID (dùng cache)
  const selectedProduct = products.find((p) => p.id === productId);

  if (!selectedProduct) {
    showNotification("❌ Lỗi", "Không tìm thấy sản phẩm!", "error");
    return;
  }

  const productName = selectedProduct.tensanpham;

  // Kiểm tra xem đã tồn tại chưa
  const isUpdate = productProfits[productName] !== undefined;
  const oldProfit = productProfits[productName];

  const title = isUpdate
    ? "Cập nhật lợi nhuận sản phẩm"
    : "Thiết lập lợi nhuận sản phẩm";
  const message = isUpdate
    ? `Sản phẩm: ${productName}<br>Lợi nhuận hiện tại: ${oldProfit}%<br>Lợi nhuận mới: ${profit}%`
    : `Sản phẩm: ${productName}<br>Lợi nhuận: ${profit}%`;

  showConfirmModal(
    title,
    message,
    () => {
      // Lưu theo TÊN sản phẩm, không phải ID
      productProfits[productName] = profit;
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
        ? `Lợi nhuận "${productName}" đã được cập nhật: ${oldProfit}% → ${profit}%`
        : `Đã thêm lợi nhuận cho "${productName}": ${profit}%`;

      showNotification("  Thành công", successMessage, "success");
    },
    () => {
      showNotification(
        "ℹ️ Đã hủy",
        isUpdate
          ? `Giữ nguyên lợi nhuận cho "${productName}": ${oldProfit}%`
          : `Đã hủy thiết lập lợi nhuận cho "${productName}".`,
        "info"
      );
    }
  );
}

// ====== CLEANUP INVALID PROFIT ENTRIES ======
function cleanupInvalidProfitEntries() {
  let hasInvalidEntries = false;

  // Dọn dẹp productProfits - xóa các entry có key là số (ID)
  const validProductProfits = {};
  Object.keys(productProfits).forEach((key) => {
    // Nếu key là số hoặc chỉ chứa số -> đây là ID cũ, bỏ qua
    if (/^\d+$/.test(key)) {
      console.log(`🧹 Xóa entry không hợp lệ: ID=${key}`);
      hasInvalidEntries = true;
    } else {
      // Key là tên sản phẩm, giữ lại
      validProductProfits[key] = productProfits[key];
    }
  });

  // Cập nhật lại nếu có thay đổi
  if (hasInvalidEntries) {
    productProfits = validProductProfits;
    localStorage.setItem("productProfits", JSON.stringify(productProfits));
    console.log("  Đã dọn dẹp các % lợi nhuận không hợp lệ");

    // Hiển thị thông báo cho user
    showNotification(
      "🧹 Đã dọn dẹp",
      "Đã xóa các % lợi nhuận cũ không hợp lệ. Vui lòng nhập lại nếu cần.",
      "info"
    );
  }
}

// ====== LOAD PROFIT TABLE ======
function loadProfitTable() {
  const tableBody = document.getElementById("profitTableBody");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  // Dọn dẹp các entry không hợp lệ (ID thay vì tên)
  cleanupInvalidProfitEntries();

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
      <button onclick="applyProfitFromTable('${name}', ${profit}, '${type}')" 
              style="background: #8b5cf6; padding: 6px 12px; border-radius: 6px; color: white; font-weight: 600; font-size: 12px;" 
              title="Áp dụng vào giá">
        ⚡ Áp dụng
      </button>
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
    "  Thành công",
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
  showNotification("  Thành công", `Đã xóa % lợi nhuận của ${name}`, "success");
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
      icon = " ";
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
      icon = " ";
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
  setupReportEventListeners(); // Setup báo cáo lợi nhuận

  // Load dữ liệu
  loadAdjustedProducts(); // Load tab mặc định
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

  console.log("  Pricing module initialized successfully!");
}

// ====== PROFIT REPORT (BÁO CÁO LỢI NHUẬN) ======
function loadProfitReport(
  searchTerm = "",
  categoryFilter = "",
  profitFilter = "all"
) {
  // Lọc sản phẩm (từ cache)
  let filteredProducts = products.filter((p) => {
    // Tìm kiếm
    if (
      searchTerm &&
      !p.tensanpham.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Lọc theo loại
    if (categoryFilter && p.danhmuc !== categoryFilter) {
      return false;
    }

    // Tính % lợi nhuận
    if (!p.giavon || p.giavon === 0) return false;

    const profitPercent = ((p.gia - p.giavon) / p.giavon) * 100;

    // Lọc theo mức lợi nhuận
    if (profitFilter === "high" && profitPercent < 20) return false;
    if (
      profitFilter === "medium" &&
      (profitPercent < 10 || profitPercent >= 20)
    )
      return false;
    if (profitFilter === "low" && (profitPercent < 0 || profitPercent >= 10))
      return false;
    if (profitFilter === "loss" && profitPercent > 0) return false;

    return true;
  });

  // Tính toán thống kê
  let totalProfit = 0;
  let totalCost = 0;
  let highProfitCount = 0;
  let mediumProfitCount = 0;
  let lowProfitCount = 0;
  let lossCount = 0;

  const tbody = document.getElementById("profitReportBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  filteredProducts.forEach((product) => {
    const profitInfo = calculateProfit(product);
    if (!profitInfo.hasProfit) return;

    totalProfit += profitInfo.profit;
    totalCost += product.giavon;

    // Phân loại
    if (profitInfo.profitPercent >= 20) highProfitCount++;
    else if (profitInfo.profitPercent >= 10) mediumProfitCount++;
    else if (profitInfo.profitPercent > 0) lowProfitCount++;
    else lossCount++;

    // Xác định badge
    let badge = "";
    if (profitInfo.profitPercent >= 20) {
      badge =
        '<span style="background: #10b981; color: white; padding: 4px 8px; border-radius: 6px; font-size: 12px;">🔥 Cao</span>';
    } else if (profitInfo.profitPercent >= 10) {
      badge =
        '<span style="background: #f59e0b; color: white; padding: 4px 8px; border-radius: 6px; font-size: 12px;">📊 TB</span>';
    } else if (profitInfo.profitPercent > 0) {
      badge =
        '<span style="background: #ef4444; color: white; padding: 4px 8px; border-radius: 6px; font-size: 12px;">⚠️ Thấp</span>';
    } else {
      badge =
        '<span style="background: #6b7280; color: white; padding: 4px 8px; border-radius: 6px; font-size: 12px;">❌ Lỗ</span>';
    }

    const row = document.createElement("tr");
    row.style.cssText =
      "border-bottom: 1px solid #e5e7eb; transition: background 0.2s;";
    row.onmouseenter = () => (row.style.background = "#f8fafc");
    row.onmouseleave = () => (row.style.background = "white");

    row.innerHTML = `
      <td style="padding: 12px;">${product.tensanpham}</td>
      <td style="padding: 12px; color: #6b7280;">${product.danhmuc}</td>
      <td style="padding: 12px; text-align: right; font-family: monospace;">${formatPrice(
        product.giavon
      )}</td>
      <td style="padding: 12px; text-align: right; font-family: monospace; font-weight: bold;">${formatPrice(
        product.gia
      )}</td>
      <td style="padding: 12px; text-align: right; font-family: monospace; color: ${
        profitInfo.color
      }; font-weight: bold;">${formatPrice(profitInfo.profit)}</td>
      <td style="padding: 12px; text-align: center; font-weight: bold; color: ${
        profitInfo.color
      };">${profitInfo.profitPercentText}%</td>
      <td style="padding: 12px; text-align: center;">${badge}</td>
    `;

    tbody.appendChild(row);
  });

  // Cập nhật tổng kết
  const avgPercent =
    totalCost > 0 ? ((totalProfit / totalCost) * 100).toFixed(2) : 0;
  document.getElementById("totalProfitAmount").textContent =
    formatPrice(totalProfit);
  document.getElementById("avgProfitPercent").textContent = avgPercent + "%";

  // Cập nhật thống kê tổng quan
  const summary = document.getElementById("profitSummary");
  if (summary) {
    summary.innerHTML = `
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="font-size: 13px; opacity: 0.9; margin-bottom: 4px;">💰 Tổng lợi nhuận</div>
        <div style="font-size: 24px; font-weight: bold;">${formatPrice(
          totalProfit
        )}</div>
        <div style="font-size: 12px; opacity: 0.8; margin-top: 4px;">${
          filteredProducts.length
        } sản phẩm</div>
      </div>
      
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="font-size: 13px; opacity: 0.9; margin-bottom: 4px;">📊 % LN trung bình</div>
        <div style="font-size: 24px; font-weight: bold;">${avgPercent}%</div>
        <div style="font-size: 12px; opacity: 0.8; margin-top: 4px;">Trên tổng vốn</div>
      </div>
      
      <div style="background: white; border: 2px solid #10b981; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="font-size: 13px; color: #6b7280; margin-bottom: 4px;">🔥 Lời cao (≥20%)</div>
        <div style="font-size: 24px; font-weight: bold; color: #10b981;">${highProfitCount}</div>
        <div style="font-size: 12px; color: #9ca3af; margin-top: 4px;">sản phẩm</div>
      </div>
      
      <div style="background: white; border: 2px solid #f59e0b; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="font-size: 13px; color: #6b7280; margin-bottom: 4px;">📊 Lời TB (10-20%)</div>
        <div style="font-size: 24px; font-weight: bold; color: #f59e0b;">${mediumProfitCount}</div>
        <div style="font-size: 12px; color: #9ca3af; margin-top: 4px;">sản phẩm</div>
      </div>
      
      <div style="background: white; border: 2px solid #ef4444; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="font-size: 13px; color: #6b7280; margin-bottom: 4px;">⚠️ Lời thấp (<10%)</div>
        <div style="font-size: 24px; font-weight: bold; color: #ef4444;">${lowProfitCount}</div>
        <div style="font-size: 12px; color: #9ca3af; margin-top: 4px;">sản phẩm</div>
      </div>
      
      <div style="background: white; border: 2px solid #6b7280; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="font-size: 13px; color: #6b7280; margin-bottom: 4px;">❌ Lỗ/Hòa vốn</div>
        <div style="font-size: 24px; font-weight: bold; color: #6b7280;">${lossCount}</div>
        <div style="font-size: 12px; color: #9ca3af; margin-top: 4px;">sản phẩm</div>
      </div>
    `;
  }

  // Load categories vào filter
  const categorySelect = document.getElementById("filterCategory");
  if (categorySelect && categorySelect.options.length === 1) {
    const categories = new Set();
    products.forEach((p) => categories.add(p.danhmuc));
    Array.from(categories)
      .sort()
      .forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
      });
  }
}

function setupReportEventListeners() {
  const searchInput = document.getElementById("searchReportProduct");
  const categoryFilter = document.getElementById("filterCategory");
  const profitFilter = document.getElementById("filterProfit");

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      loadProfitReport(
        searchInput.value,
        categoryFilter ? categoryFilter.value : "",
        profitFilter ? profitFilter.value : "all"
      );
    });
  }

  if (categoryFilter) {
    categoryFilter.addEventListener("change", () => {
      loadProfitReport(
        searchInput ? searchInput.value : "",
        categoryFilter.value,
        profitFilter ? profitFilter.value : "all"
      );
    });
  }

  if (profitFilter) {
    profitFilter.addEventListener("change", () => {
      loadProfitReport(
        searchInput ? searchInput.value : "",
        categoryFilter ? categoryFilter.value : "",
        profitFilter.value
      );
    });
  }
}

// ====== ĐỒNG BỘ ĐA TAB ======
function setupPricingSync() {
  console.log("[Pricing] Khởi động Pricing Sync...");

  // Lắng nghe thay đổi từ tab khác (storage event)
  window.addEventListener("storage", (e) => {
    // Reload profit data khi có thay đổi từ tab khác
    if (e.key === "categoryProfits" || e.key === "productProfits") {
      console.log("[Pricing] Phát hiện thay đổi từ tab khác!");

      // Reload data từ storage
      categoryProfits =
        JSON.parse(localStorage.getItem("categoryProfits")) || {};
      productProfits = JSON.parse(localStorage.getItem("productProfits")) || {};

      // Reload table để hiển thị
      loadProfitTable();

      showNotification(
        "🔄 Đã cập nhật",
        "Dữ liệu lợi nhuận đã được cập nhật từ tab khác",
        "info"
      );
    }

    // Reload products khi có thay đổi
    if (e.key === "product") {
      console.log("[Pricing] Phát hiện thay đổi sản phẩm từ tab khác!");
      products = JSON.parse(localStorage.getItem("product")) || [];
      loadAdjustedProducts();
      loadProfitReport();
    }
  });

  console.log("[Pricing] Pricing Sync sẵn sàng!");
}

// ====== DEBUG HELPER ======
window.pricingDebug = {
  getCategoryProfits: () => categoryProfits,
  getProductProfits: () => productProfits,
  getProducts: () => products,
  reload: () => {
    products = JSON.parse(localStorage.getItem("product")) || [];
    categoryProfits = JSON.parse(localStorage.getItem("categoryProfits")) || {};
    productProfits = JSON.parse(localStorage.getItem("productProfits")) || {};
    loadProfitTable();
    loadAdjustedProducts();
    console.log("🔄 Đã reload pricing data");
  },
  reset: () => {
    if (confirm("Xóa toàn bộ dữ liệu lợi nhuận?")) {
      localStorage.setItem("categoryProfits", JSON.stringify({}));
      localStorage.setItem("productProfits", JSON.stringify({}));
      categoryProfits = {};
      productProfits = {};
      loadProfitTable();
      console.log("  Đã reset pricing data");
    }
  },
  info: () => {
    console.log("=== [Pricing] DEBUG INFO ===");
    console.log("Products:", products.length, "items");
    console.log("Category Profits:", categoryProfits);
    console.log("Product Profits:", productProfits);
    console.log("Storage Keys:", {
      PRODUCTS: "product",
      CATEGORY_PROFITS: "categoryProfits",
      PRODUCT_PROFITS: "productProfits",
    });
  },
};

console.log("💡 Gõ: pricingDebug.info() để xem thông tin");

// Auto initialize when DOM is ready
// ====== SHOW PROFIT GUIDE MODAL ======
window.showProfitGuide = function () {
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: fadeIn 0.3s ease;
  `;

  const modal = document.createElement("div");
  modal.style.cssText = `
    background: white;
    border-radius: 16px;
    max-width: 700px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    animation: slideDown 0.3s ease;
  `;

  modal.innerHTML = `
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 24px; border-radius: 16px 16px 0 0; color: white;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2 style="margin: 0; font-size: 24px; font-weight: 700;">📘 Hướng dẫn tính % lợi nhuận + khuyến mãi</h2>
        <button onclick="this.closest('.overlay-guide').remove()" style="background: rgba(255,255,255,0.2); border: none; color: white; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 24px; display: flex; align-items: center; justify-content: center; transition: all 0.3s;">
          ×
        </button>
      </div>
    </div>

    <!-- Content -->
    <div style="padding: 30px;">
      <!-- Nguyên tắc -->
      <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 8px 0; color: #991b1b; font-size: 16px;">✅ NGUYÊN TẮC QUAN TRỌNG:</h3>
        <p style="margin: 0; color: #7f1d1d; font-size: 16px; font-weight: 700;">
          ⚠️ LUÔN LUÔN tính dựa trên GIÁ VỐN (giá nhập hàng)
        </p>
      </div>

      <!-- Công thức -->
      <div style="margin-bottom: 24px;">
        <h3 style="margin: 0 0 12px 0; color: #3b82f6; font-size: 16px;">📐 CÔNG THỨC (3 bước):</h3>
        <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border: 2px solid #e2e8f0;">
          <div style="margin-bottom: 8px; font-size: 14px; line-height: 1.8;">
            1️⃣ <strong>Giá niêm yết</strong> = Giá vốn × (1 + % lợi nhuận)
          </div>
          <div style="margin-bottom: 8px; font-size: 14px; line-height: 1.8;">
            2️⃣ <strong>Giá bán cuối</strong> = Giá niêm yết × (1 - % khuyến mãi)
          </div>
          <div style="font-size: 14px; line-height: 1.8;">
            3️⃣ <strong>Lời thực tế</strong> = Giá bán cuối - Giá vốn
          </div>
        </div>
      </div>

      <!-- Ví dụ -->
      <div style="margin-bottom: 24px;">
        <h3 style="margin: 0 0 12px 0; color: #10b981; font-size: 16px;">💡 VÍ DỤ CỤ THỂ:</h3>
        <table style="width: 100%; border-collapse: collapse; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr style="background: #f9fafb;">
            <td style="padding: 12px; font-size: 14px; border-bottom: 1px solid #e5e7eb;">💰 Giá vốn</td>
            <td style="padding: 12px; text-align: right; font-weight: 700; font-size: 15px; border-bottom: 1px solid #e5e7eb;">2.000.000₫</td>
          </tr>
          <tr style="background: #dbeafe;">
            <td style="padding: 12px; font-size: 14px; border-bottom: 1px solid #e5e7eb;">📊 +20% lợi nhuận</td>
            <td style="padding: 12px; text-align: right; color: #3b82f6; font-weight: 600; font-size: 15px; border-bottom: 1px solid #e5e7eb;">+400.000₫</td>
          </tr>
          <tr style="background: white;">
            <td style="padding: 12px; font-size: 14px; border-bottom: 1px solid #e5e7eb;">🏷️ Giá niêm yết</td>
            <td style="padding: 12px; text-align: right; font-weight: 700; font-size: 15px; border-bottom: 1px solid #e5e7eb;">2.400.000₫</td>
          </tr>
          <tr style="background: #fee2e2;">
            <td style="padding: 12px; font-size: 14px; border-bottom: 1px solid #e5e7eb;">🎁 -5% khuyến mãi</td>
            <td style="padding: 12px; text-align: right; color: #ef4444; font-weight: 600; font-size: 15px; border-bottom: 1px solid #e5e7eb;">-120.000₫</td>
          </tr>
          <tr style="background: #dcfce7;">
            <td style="padding: 12px; font-size: 14px; border-bottom: 1px solid #e5e7eb;"><strong>💳 Giá bán cuối</strong></td>
            <td style="padding: 12px; text-align: right; color: #10b981; font-weight: 700; font-size: 16px; border-bottom: 1px solid #e5e7eb;">2.280.000₫</td>
          </tr>
          <tr style="background: #fef3c7;">
            <td style="padding: 12px; font-size: 14px;"><strong>💵 Lời thực tế</strong></td>
            <td style="padding: 12px; text-align: right; color: #f59e0b; font-weight: 700; font-size: 16px;">280.000₫ (14%)</td>
          </tr>
        </table>
      </div>

      <!-- Hiển thị cho khách -->
      <div style="background: #f0f9ff; border: 2px dashed #3b82f6; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
        <div style="font-size: 13px; color: #1e40af; margin-bottom: 8px; font-weight: 600;">👁️ Hiển thị cho khách hàng:</div>
        <div style="font-size: 18px; text-align: center;">
          <span style="text-decoration: line-through; color: #6b7280;">2.400.000₫</span>
          →
          <strong style="color: #10b981;">2.280.000₫</strong>
          <span style="background: #fef2f2; color: #ef4444; padding: 4px 8px; border-radius: 4px; font-weight: 600; font-size: 14px; margin-left: 8px;">-5%</span>
        </div>
      </div>

      <!-- Lưu ý -->
      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 8px;">
        <p style="margin: 0; color: #78350f; font-size: 13px; line-height: 1.6;">
          <strong>⚡ Lưu ý quan trọng:</strong><br>
          • Luôn tính từ <strong>giá vốn gốc</strong>, không phụ thuộc giá hiện tại<br>
          • Áp dụng % lợi nhuận trước, sau đó mới áp dụng % khuyến mãi<br>
          • Lời thực tế được tính bằng: Giá bán cuối - Giá vốn
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="padding: 20px 30px; background: #f9fafb; border-top: 1px solid #e5e7eb; border-radius: 0 0 16px 16px; text-align: right;">
      <button onclick="this.closest('.overlay-guide').remove()" style="padding: 12px 24px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);">
        ✓ Đã hiểu
      </button>
    </div>
  `;

  overlay.className = "overlay-guide";
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  // Close on overlay click
  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
  };
};

// ====== INITIALIZATION ======
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initializePricing();
    setupPricingSync();
  });
} else {
  initializePricing();
  setupPricingSync();
}