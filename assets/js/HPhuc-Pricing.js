// ====== QUẢN LÝ GIÁ BÁN ======

// Biến toàn cục
let products = JSON.parse(localStorage.getItem("phonestore_products")) || [];
let categoryProfits =
  JSON.parse(localStorage.getItem("phonestore_category_profit")) || {};
// Load product profits với xử lý lỗi an toàn
let productProfits = {};
try {
  const stored = localStorage.getItem("phonestore_products_profit");
  if (stored) {
    productProfits = JSON.parse(stored) || {};
  }
} catch (e) {
  console.warn("⚠️ Lỗi khi load phonestore_products_profit:", e);
  productProfits = {};
  localStorage.setItem("phonestore_products_profit", JSON.stringify({}));
}

// ====== HELPER: LƯU PRODUCTS ======
function saveProductsToStorage() {
  // 1. Lưu vào localStorage
  localStorage.setItem("phonestore_products", JSON.stringify(products));

  localStorage.setItem("phonestore_last_update", Date.now().toString());
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
  } else if (tabName === "lookup") {
    // Reset lookup search khi chuyển tab
    const productLookupSearch = document.getElementById("productLookupSearch");
    if (productLookupSearch) {
      productLookupSearch.value = "";
      searchProductForLookup("");
    }
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

  // Search product for lookup
  const productLookupSearch = document.getElementById("productLookupSearch");
  if (productLookupSearch) {
    productLookupSearch.addEventListener("input", (e) => {
      searchProductForLookup(e.target.value);
    });
  }

  // Auto-fill product profit and discount when selecting a product
  const productSelect = document.getElementById("productSelect");
  const productDiscountInput = document.getElementById("productDiscount");
  
  if (productSelect && productProfitInput && productDiscountInput) {
    productSelect.addEventListener("change", (e) => {
      const productId = parseInt(e.target.value);
      if (!productId || isNaN(productId)) {
        // Reset về trống khi không chọn sản phẩm
        productProfitInput.value = "";
        productDiscountInput.value = "0";
        return;
      }

      // Tìm sản phẩm được chọn
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      // Điền % lợi nhuận từ productProfits hoặc tính từ giá hiện tại
      if (productProfits[product.tensanpham]) {
        productProfitInput.value = productProfits[product.tensanpham];
      } else if (product.giavon && product.giavon > 0 && product.oldPrice > 0) {
        // Tính % lợi nhuận từ giá niêm yết và giá vốn
        const currentProfitPercent = ((product.oldPrice - product.giavon) / product.giavon) * 100;
        if (currentProfitPercent > 0) {
          productProfitInput.value = currentProfitPercent.toFixed(1);
        }
      }

      // Điền % khuyến mãi hiện tại (lấy giá trị dương từ discount)
      const currentDiscount = product.discount ? Math.abs(product.discount) : 0;
      productDiscountInput.value = currentDiscount > 0 ? currentDiscount : "0";
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

// ====== HELPER: LẤY THÔNG TIN % LỢI NHUẬN VÀ KHUYẾN MÃI CỦA SẢN PHẨM ======
function getProductProfitAndDiscount(product) {
  let profitPercent = null;
  let discountPercent = 0;

  // Lấy % lợi nhuận từ productProfits hoặc tính từ giá hiện tại
  if (productProfits[product.tensanpham]) {
    profitPercent = parseFloat(productProfits[product.tensanpham]);
  } else if (product.giavon && product.giavon > 0 && product.oldPrice > 0) {
    // Tính % lợi nhuận từ giá niêm yết và giá vốn
    profitPercent = ((product.oldPrice - product.giavon) / product.giavon) * 100;
  } else if (product.giavon && product.giavon > 0 && product.gia > 0) {
    // Tính từ giá bán hiện tại và giá vốn
    profitPercent = ((product.gia - product.giavon) / product.giavon) * 100;
  }

  // Lấy % khuyến mãi
  if (product.discount) {
    discountPercent = Math.abs(product.discount);
  }

  return {
    profit: profitPercent !== null ? profitPercent.toFixed(1) : null,
    discount: discountPercent > 0 ? discountPercent.toFixed(0) : null
  };
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
      // Tạo optgroup (optgroup label không hỗ trợ HTML, chỉ text)
      const optgroup = document.createElement("optgroup");
      optgroup.label = category; // Bỏ emoji vì không hỗ trợ HTML

      productsByCategory[category].forEach((product) => {
        const option = document.createElement("option");
        option.value = product.id;
        
        // Lấy thông tin % lợi nhuận và khuyến mãi
        const info = getProductProfitAndDiscount(product);
        let displayText = product.tensanpham;
        
        // Thêm thông tin % vào tên sản phẩm
        const parts = [];
        if (info.profit !== null) {
          parts.push(`LN: ${info.profit}%`);
        }
        if (info.discount !== null) {
          parts.push(`KM: ${info.discount}%`);
        }
        
        if (parts.length > 0) {
          displayText += ` (${parts.join(', ')})`;
        }
        
        option.textContent = displayText;
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
        ${(() => {
          const categoryLogo = window.getCategoryLogo ? window.getCategoryLogo(product.danhmuc) : null;
          if (categoryLogo) {
            return `<div style="width: 40px; height: 40px; background: white; border: 2px solid #e5e7eb; border-radius: 10px; display: flex; align-items: center; justify-content: center; padding: 4px;">
              <img src="${categoryLogo}" alt="${product.danhmuc}" style="width: 100%; height: 100%; object-fit: contain; border-radius: 6px;" onerror="this.style.display='none';">
            </div>`;
          }
          return `<div style="width: 40px; height: 40px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center;"></div>`;
        })()}
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

      // Broadcast để cập nhật index.html
      broadcastPriceUpdate(product.tensanpham);
      // Dispatch event với key phonestore_products để index.html nhận được
      window.dispatchEvent(
        new CustomEvent("phonestore-sync", {
          detail: {
            key: "phonestore_products",
            action: "price_updated",
            productName: product.tensanpham,
          },
        })
      );

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

      // Broadcast để cập nhật index.html
      broadcastPriceUpdate(product.tensanpham);
      // Dispatch event với key phonestore_products để index.html nhận được
      window.dispatchEvent(
        new CustomEvent("phonestore-sync", {
          detail: {
            key: "phonestore_products",
            action: "price_updated",
            productName: product.tensanpham,
          },
        })
      );

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
            ? `2️⃣ Giá bán cuối = Giá niêm yết × (1 - ${discountPercent}%)<br>
        3️⃣ Lời thực tế = Giá bán cuối - Giá vốn`
            : `2️⃣ Giá bán cuối = Giá niêm yết<br>
        3️⃣ Lời thực tế = Giá bán cuối - Giá vốn`
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

        // QUAN TRỌNG: Nếu không nhập % khuyến mãi mới (hoặc = 0) nhưng sản phẩm đã có khuyến mãi
        // thì giữ lại % khuyến mãi cũ của sản phẩm đó
        let productDiscountPercent = discountPercent;
        if ((!discountPercent || discountPercent === 0) && product.discount && product.discount !== 0) {
          productDiscountPercent = Math.abs(product.discount); // Lấy giá trị dương từ discount cũ
        }

        const costPrice = product.giavon; // Giá vốn (không đổi)
        const listPrice = Math.round(costPrice * (1 + profit / 100)); // Giá niêm yết (trước KM)
        const sellPrice = Math.round(listPrice * (1 - productDiscountPercent / 100)); // Giá bán (sau KM)

        // Tính lợi nhuận thực tế (dựa trên giá vốn)
        totalProfit += sellPrice - costPrice;

        // Cập nhật sản phẩm theo công thức đúng:
        // 1️⃣ Giá niêm yết = Giá vốn × (1 + % lợi nhuận)
        // 2️⃣ Giá bán cuối = Giá niêm yết × (1 - % khuyến mãi)
        // 3️⃣ Lời thực tế = Giá bán cuối - Giá vốn
        product.gia = sellPrice; // Giá bán cuối (sau KM)
        product.oldPrice = listPrice; // Giá niêm yết (luôn lưu để hiển thị)
        product.discount = productDiscountPercent > 0 ? -productDiscountPercent : 0; // % KM (âm)

        // Cập nhật trong mảng chính
        const productIndex = products.findIndex((p) => p.id === product.id);
        if (productIndex !== -1) {
          products[productIndex] = product;
          updatedCount++;
        }
      });

      // Lưu vào localStorage
      saveProductsToStorage();

      // Lưu % lợi nhuận vào categoryProfits để dùng lại sau
      categoryProfits[category] = profit;
      localStorage.setItem(
        "phonestore_category_profit",
        JSON.stringify(categoryProfits)
      );

      // Reload bảng % lợi nhuận
      loadProfitTable();

      // Broadcast để cập nhật index.html
      broadcastPriceUpdate(`${updatedCount} sản phẩm ${category}`);
      // Dispatch event với key phonestore_products để index.html nhận được
      window.dispatchEvent(
        new CustomEvent("phonestore-sync", {
          detail: {
            key: "phonestore_products",
            action: "price_updated",
            category: category,
            count: updatedCount,
          },
        })
      );

      // Reset form
      categorySelect.value = "";
      categoryProfitInput.value = "";
      if (categoryDiscountInput) {
        categoryDiscountInput.value = "0";
      }

      // Đếm số sản phẩm có giữ lại % khuyến mãi cũ
      let keptDiscountCount = 0;
      categoryProducts.forEach((p) => {
        if ((!discountPercent || discountPercent === 0) && p.discount && p.discount !== 0) {
          keptDiscountCount++;
        }
      });

      const discountInfo = discountPercent > 0 
        ? ` + ${discountPercent}% khuyến mãi`
        : keptDiscountCount > 0 
          ? ` (${keptDiscountCount} sản phẩm giữ lại % khuyến mãi cũ)`
          : '';

      showNotification(
        "  Thành công",
        `Đã áp dụng ${profit}% lợi nhuận${discountInfo} cho ${updatedCount} sản phẩm ${category}! Tổng lợi nhuận: ~${formatPrice(
          totalProfit
        )}. % lợi nhuận đã được lưu.`,
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
  let discountPercent = parseFloat(productDiscountInput?.value || 0);

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

  // Lấy sản phẩm (từ cache)
  const product = products.find((p) => p.id === productId);

  if (!product) {
    showNotification("❌ Lỗi", "Không tìm thấy sản phẩm!", "error");
    return;
  }

  // QUAN TRỌNG: Nếu không nhập % khuyến mãi mới (hoặc = 0) nhưng sản phẩm đã có khuyến mãi
  // thì giữ lại % khuyến mãi cũ của sản phẩm
  const originalDiscountInput = parseFloat(productDiscountInput?.value || 0);
  let finalDiscountPercent = discountPercent;
  let isUsingOldDiscount = false;
  
  if ((!discountPercent || discountPercent === 0) && product.discount && product.discount !== 0) {
    finalDiscountPercent = Math.abs(product.discount); // Lấy giá trị dương từ discount cũ
    isUsingOldDiscount = true;
    // Cập nhật lại input để hiển thị cho người dùng biết
    if (productDiscountInput) {
      productDiscountInput.value = finalDiscountPercent;
    }
  }

  // Validation % khuyến mãi sau khi đã xử lý logic giữ lại
  if (isNaN(finalDiscountPercent) || finalDiscountPercent < 0 || finalDiscountPercent > 100) {
    showNotification(
      "📊 Dữ liệu không hợp lệ",
      "% khuyến mãi phải từ 0 đến 100.",
      "error"
    );
    productDiscountInput?.focus();
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
  const sellPrice = Math.round(listPrice * (1 - finalDiscountPercent / 100)); // Giá bán (sau KM)
  const profitAmount = sellPrice - costPrice; // Lợi nhuận thực tế
  const profitPercent = ((profitAmount / costPrice) * 100).toFixed(1);
  const discountAmount =
    finalDiscountPercent > 0 ? Math.round((listPrice * finalDiscountPercent) / 100) : 0;

  // Xác nhận trước khi áp dụng
  showConfirmModal(
    `Áp dụng ${profit}% lợi nhuận${
      finalDiscountPercent > 0 ? ` + ${finalDiscountPercent}% KM` : ""
    }`,
    `Áp dụng cho "<strong>${product.tensanpham}</strong>"?<br><br>
    
    ${isUsingOldDiscount ? `
    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; border-radius: 8px; margin-bottom: 12px;">
      <strong style="color: #92400e; font-size: 13px;">💡 Lưu ý:</strong><br>
      <div style="margin-top: 6px; font-size: 12px; color: #78350f; line-height: 1.6;">
        Bạn chưa nhập % khuyến mãi mới, hệ thống sẽ <strong>giữ lại % khuyến mãi cũ</strong> của sản phẩm: <strong>${finalDiscountPercent}%</strong>
      </div>
    </div>
    ` : ""}
    
    <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 12px; border-radius: 8px; border: 2px solid #3b82f6; margin-bottom: 12px;">
      <strong style="color: #1e40af; font-size: 13px;">📐 CÔNG THỨC TÍNH:</strong><br>
      <div style="margin: 6px 0; padding: 8px; background: white; border-radius: 6px; font-size: 12px; line-height: 1.6;">
        <strong style="color: #dc2626;">⚠️ Luôn tính từ GIÁ VỐN</strong><br>
        1️⃣ Giá niêm yết = Giá vốn × (1 + ${profit}%)<br>
        ${
          finalDiscountPercent > 0
            ? `2️⃣ Giá bán cuối = Giá niêm yết × (1 - ${finalDiscountPercent}%)<br>
        3️⃣ Lời thực tế = Giá bán cuối - Giá vốn`
            : `2️⃣ Giá bán cuối = Giá niêm yết<br>
        3️⃣ Lời thực tế = Giá bán cuối - Giá vốn`
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
          finalDiscountPercent > 0
            ? `<tr><td colspan="2" style="padding: 2px;"></td></tr>
        <tr style="background: #fee2e2;">
          <td style="padding: 6px; border-radius: 4px;">🎁 -${finalDiscountPercent}% khuyến mãi${isUsingOldDiscount ? ' <span style="font-size: 11px; color: #f59e0b;">(giữ lại)</span>' : ''}</td>
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
        finalDiscountPercent > 0
          ? `<div style="margin-top: 8px; padding: 8px; background: white; border-left: 3px solid #10b981; border-radius: 4px; font-size: 12px;">
          Hiển thị: <del>${formatPrice(
            listPrice
          )}</del> → <strong>${formatPrice(
              sellPrice
            )}</strong> <span style="color: #ef4444;">[-${finalDiscountPercent}%]</span>
      </div>`
          : `<div style="margin-top: 8px; padding: 8px; background: white; border-left: 3px solid #10b981; border-radius: 4px; font-size: 12px;">
          Không có khuyến mãi, chỉ hiển thị giá ${formatPrice(sellPrice)}
      </div>`
      }
    </div>`,
    () => {
      // Cập nhật sản phẩm theo công thức đúng:
      // 1️⃣ Giá niêm yết = Giá vốn × (1 + % lợi nhuận)
      // 2️⃣ Giá bán cuối = Giá niêm yết × (1 - % khuyến mãi)
      // 3️⃣ Lời thực tế = Giá bán cuối - Giá vốn
      product.gia = sellPrice; // Giá bán cuối (sau KM)
      product.oldPrice = listPrice; // Giá niêm yết (luôn lưu để hiển thị)
      product.discount = finalDiscountPercent > 0 ? -finalDiscountPercent : 0; // % KM (âm)

      // Lưu vào localStorage
      const productIndex = products.findIndex((p) => p.id === productId);
      products[productIndex] = product;
      saveProductsToStorage();

      // Lưu % lợi nhuận vào productProfits để dùng lại sau
      if (product.tensanpham) {
        productProfits[product.tensanpham] = profit;
        localStorage.setItem(
          "phonestore_products_profit",
          JSON.stringify(productProfits)
        );
      }

      // Reload bảng % lợi nhuận
      loadProfitTable();
      
      // Reload products dropdown để cập nhật hiển thị % lợi nhuận và khuyến mãi
      loadProducts();

      // Broadcast để cập nhật index.html
      broadcastPriceUpdate(product.tensanpham);
      // Dispatch event với key phonestore_products để index.html nhận được
      window.dispatchEvent(
        new CustomEvent("phonestore-sync", {
          detail: {
            key: "phonestore_products",
            action: "price_updated",
            productName: product.tensanpham,
          },
        })
      );

      // Reset form
      productSelect.value = "";
      productProfitInput.value = "";
      if (productDiscountInput) {
        productDiscountInput.value = "0";
      }

      showNotification(
        "  Thành công",
        `Đã áp dụng ${profit}% lợi nhuận${finalDiscountPercent > 0 ? ` + ${finalDiscountPercent}% khuyến mãi` : ''} cho "${
          product.tensanpham
        }"! Giá bán: ${formatPrice(sellPrice)}. Lợi nhuận: ${formatPrice(profitAmount)}.`,
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
          // Tính theo công thức đúng:
          // 1️⃣ Giá niêm yết = Giá vốn × (1 + % lợi nhuận)
          const listPrice = Math.round(costPrice * (1 + profit / 100));
          // 2️⃣ Giá bán cuối = Giá niêm yết (không có KM)
          const sellPrice = listPrice;
          // 3️⃣ Lời thực tế = Giá bán cuối - Giá vốn

          product.gia = sellPrice; // Giá bán cuối
          product.oldPrice = listPrice; // Giá niêm yết
          product.discount = 0; // Không có khuyến mãi

          const productIndex = products.findIndex((p) => p.id === product.id);
          if (productIndex !== -1) {
            products[productIndex] = product;
            updatedCount++;
          }
        });

        saveProductsToStorage();
        broadcastPriceUpdate(`${updatedCount} sản phẩm ${name}`);

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
    // Tính theo công thức đúng: Giá niêm yết = Giá vốn × (1 + % lợi nhuận)
    const listPrice = Math.round(costPrice * (1 + profit / 100));
    const sellPrice = listPrice; // Không có KM nên giá bán = giá niêm yết
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
        // Cập nhật sản phẩm theo công thức đúng
        product.gia = sellPrice; // Giá bán cuối
        product.oldPrice = listPrice; // Giá niêm yết (luôn lưu để hiển thị)
        product.discount = 0; // Không có KM

        const productIndex = products.findIndex((p) => p.id === product.id);
        products[productIndex] = product;
        saveProductsToStorage();

        // Broadcast để cập nhật index.html
        broadcastPriceUpdate(product.tensanpham);
        // Dispatch event với key phonestore_products để index.html nhận được
        window.dispatchEvent(
          new CustomEvent("phonestore-sync", {
            detail: {
              key: "phonestore_products",
              action: "price_updated",
              productName: product.tensanpham,
            },
          })
        );

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

  // Trigger custom event cho cùng tab (nếu index đang mở)
  window.dispatchEvent(
    new CustomEvent("phonestore-sync", {
      detail: {
        key: "phonestore_products",
        action: "price_updated",
        productName: productName,
      },
    })
  );

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
      localStorage.setItem(
        "phonestore_category_profit",
        JSON.stringify(categoryProfits)
      );

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

      // Broadcast thông báo cập nhật lợi nhuận
      const updateInfo = {
        timestamp: Date.now(),
        type: "category_profit",
        category: category,
        action: "profit_updated",
      };
      localStorage.setItem(
        "phonestore_category_profit_update",
        JSON.stringify(updateInfo)
      );
      window.dispatchEvent(
        new CustomEvent("phonestore-sync", {
          detail: {
            key: "phonestore_category_profit",
            action: "profit_updated",
            category: category,
          },
        })
      );
      setTimeout(() => {
        localStorage.removeItem("phonestore_category_profit_update");
      }, 100);

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
      localStorage.setItem(
        "phonestore_products_profit",
        JSON.stringify(productProfits)
      );

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
      
      // Reload products dropdown để cập nhật hiển thị % lợi nhuận
      loadProducts();

      // Broadcast thông báo cập nhật lợi nhuận
      const updateInfo = {
        timestamp: Date.now(),
        type: "product_profit",
        productName: productName,
        action: "profit_updated",
      };
      localStorage.setItem(
        "phonestore_products_profit_update",
        JSON.stringify(updateInfo)
      );
      window.dispatchEvent(
        new CustomEvent("phonestore-sync", {
          detail: {
            key: "phonestore_products_profit",
            action: "profit_updated",
            productName: productName,
          },
        })
      );
      setTimeout(() => {
        localStorage.removeItem("phonestore_products_profit_update");
      }, 100);

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
    localStorage.setItem(
      "phonestore_products_profit",
      JSON.stringify(productProfits)
    );
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

  // Sắp xếp danh sách để hiển thị gọn gàng
  const sortedCategories = Object.keys(categoryProfits).sort();
  const sortedProducts = Object.keys(productProfits).sort();

  // Load category profits (loại sản phẩm)
  sortedCategories.forEach((category) => {
    const row = createProfitRow(
      category,
      categoryProfits[category],
      "category"
    );
    tableBody.appendChild(row);
  });

  // Load product profits (sản phẩm cụ thể)
  sortedProducts.forEach((productName) => {
    const row = createProfitRow(
      productName,
      productProfits[productName],
      "product"
    );
    tableBody.appendChild(row);
  });

  // Hiển thị thông báo nếu không có dữ liệu
  if (
    Object.keys(categoryProfits).length === 0 &&
    Object.keys(productProfits).length === 0
  ) {
    const emptyRow = document.createElement("div");
    emptyRow.classList.add("table-row");
    emptyRow.style.cssText =
      "grid-column: 1 / -1; text-align: center; padding: 30px; color: #6b7280;";
    emptyRow.innerHTML = `
      Chưa có % lợi nhuận nào được thiết lập. Hãy thiết lập ở trên.
    `;
    tableBody.appendChild(emptyRow);
  }
}

// ====== CREATE PROFIT ROW ======
function createProfitRow(name, profit, type) {
  const row = document.createElement("div");
  row.classList.add("table-row");

  // Escape ký tự đặc biệt để tránh lỗi onclick
  const escapedName = name.replace(/'/g, "\\'").replace(/"/g, '\\"');

  // Xác định màu cho % lợi nhuận
  let profitColor =
    profit >= 15 ? "#10b981" : profit >= 10 ? "#f59e0b" : "#ef4444";

  // Lấy logo cho category
  let logoHtml = '';
  if (type === "category") {
    const categoryLogo = window.getCategoryLogo ? window.getCategoryLogo(name) : null;
    if (categoryLogo) {
      logoHtml = `<img src="${categoryLogo}" alt="${name}" style="width: 24px; height: 24px; object-fit: contain; border-radius: 4px; margin-right: 4px;" onerror="this.style.display='none';">`;
    }
  }

  row.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      ${logoHtml}
      <span style="font-weight: 500;">${name}</span>
    </div>
    <div>
      <strong style="color: ${profitColor}; font-size: 15px;">${profit}%</strong>
    </div>
    <div class="actions">
      <button onclick="applyProfitFromTable('${escapedName}', ${profit}, '${type}')" 
              style="background: #8b5cf6; padding: 6px 12px; border-radius: 6px; color: white; font-weight: 600; font-size: 12px; border: none; cursor: pointer;" 
              title="Áp dụng vào giá">
        Áp dụng
      </button>
      <button onclick="editProfit('${escapedName}', ${profit}, '${type}')" 
              style="background: none; border: none; cursor: pointer; padding: 4px;" 
              title="Sửa">
        <img src="assets/images/icons/sua.png" alt="Sửa" style="width: 16px; height: 16px;" />
      </button>
      <button onclick="deleteProfit('${escapedName}', '${type}')" 
              style="background: none; border: none; cursor: pointer; padding: 4px;" 
              title="Xóa">
        <img src="assets/images/icons/xoa.png" alt="Xóa" style="width: 16px; height: 16px;" />
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
    localStorage.setItem(
      "phonestore_category_profit",
      JSON.stringify(categoryProfits)
    );
  } else {
    productProfits[name] = profit;
    localStorage.setItem(
      "phonestore_products_profit",
      JSON.stringify(productProfits)
    );
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
    localStorage.setItem(
      "phonestore_category_profit",
      JSON.stringify(categoryProfits)
    );
  } else {
    delete productProfits[name];
    localStorage.setItem(
      "phonestore_products_profit",
      JSON.stringify(productProfits)
    );
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

  // Tính theo công thức đúng:
  // 1️⃣ Giá niêm yết = Giá vốn × (1 + % lợi nhuận)
  const listPrice = costPrice * (1 + profitPercent / 100);
  // 2️⃣ Giá bán cuối = Giá niêm yết (không có khuyến mãi)
  const sellPrice = listPrice;
  // 3️⃣ Lời thực tế = Giá bán cuối - Giá vốn
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

// ====== SEARCH PRODUCT FOR LOOKUP ======
function searchProductForLookup(searchTerm) {
  const resultDiv = document.getElementById("productLookupResult");
  const emptyDiv = document.getElementById("productLookupEmpty");
  
  if (!resultDiv || !emptyDiv) return;

  // Nếu không có từ khóa tìm kiếm
  if (!searchTerm || searchTerm.trim() === "") {
    resultDiv.style.display = "none";
    emptyDiv.style.display = "block";
    return;
  }

  // Tìm kiếm sản phẩm
  const searchLower = searchTerm.toLowerCase().trim();
  const matchedProducts = products.filter((p) =>
    p.tensanpham.toLowerCase().includes(searchLower) ||
    p.danhmuc.toLowerCase().includes(searchLower)
  );

  // Hiển thị kết quả
  if (matchedProducts.length === 0) {
    resultDiv.style.display = "none";
    emptyDiv.style.display = "block";
    emptyDiv.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #6b7280;">
        <div style="font-size: 48px; margin-bottom: 16px;">🔍</div>
        <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">Không tìm thấy sản phẩm</div>
        <div style="font-size: 14px;">Không có sản phẩm nào khớp với "${searchTerm}"</div>
      </div>
    `;
    return;
  }

  // Hiển thị kết quả
  emptyDiv.style.display = "none";
  resultDiv.style.display = "block";
  
  // Tạo HTML cho kết quả
  let resultHTML = `
    <div style="margin-bottom: 16px; font-size: 14px; color: #6b7280;">
      Tìm thấy <strong style="color: #2563eb;">${matchedProducts.length}</strong> sản phẩm
    </div>
    <div style="display: grid; gap: 16px;">
  `;

  matchedProducts.forEach((product) => {
    const profitInfo = calculateProfit(product);
    const discount = Math.abs(product.discount || 0);
    const listPrice = product.oldPrice || product.gia;
    const sellPrice = product.gia;
    
    // Tính % lợi nhuận thực tế từ giá vốn
    let actualProfitPercent = 0;
    if (product.giavon && product.giavon > 0) {
      actualProfitPercent = ((sellPrice - product.giavon) / product.giavon) * 100;
    }

    // Tính % lợi nhuận từ giá niêm yết (nếu có)
    let listPriceProfitPercent = 0;
    if (product.giavon && product.giavon > 0 && listPrice > product.giavon) {
      listPriceProfitPercent = ((listPrice - product.giavon) / product.giavon) * 100;
    }

    resultHTML += `
      <div style="background: white; border: 2px solid #e5e7eb; border-radius: 12px; padding: 20px; transition: all 0.3s; hover:border-color: #2563eb;">
        <div style="display: flex; gap: 20px; align-items: flex-start;">
          <!-- Hình ảnh sản phẩm -->
          <div style="flex-shrink: 0;">
            <img src="${product.hinhanh}" alt="${product.tensanpham}" 
                 style="width: 120px; height: 120px; object-fit: cover; border-radius: 10px; border: 2px solid #e5e7eb;"
                 onerror="this.src='/assets/images/products/ip15prm.webp'">
          </div>
          
          <!-- Thông tin sản phẩm -->
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
              ${(() => {
                const categoryLogo = window.getCategoryLogo ? window.getCategoryLogo(product.danhmuc) : null;
                if (categoryLogo) {
                  return `<img src="${categoryLogo}" alt="${product.danhmuc}" style="width: 32px; height: 32px; object-fit: contain; border-radius: 6px;" onerror="this.style.display='none';">`;
                }
                return '';
              })()}
              <div>
                <h4 style="margin: 0; font-size: 18px; font-weight: 700; color: #1f2937;">${product.tensanpham}</h4>
                <div style="font-size: 13px; color: #6b7280; margin-top: 4px;">${product.danhmuc}</div>
              </div>
            </div>

            <!-- Bảng thông tin giá -->
            <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 16px; border-radius: 10px; border: 1px solid #e2e8f0;">
              <table style="width: 100%; font-size: 13px;">
                ${product.giavon && product.giavon > 0 ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-weight: 500; width: 40%;">💰 Giá vốn:</td>
                  <td style="padding: 8px 0; text-align: right;">
                    <strong style="color: #475569; font-size: 15px;">${formatPrice(product.giavon)}</strong>
                  </td>
                </tr>
                ` : `
                <tr>
                  <td style="padding: 8px 0; color: #ef4444; font-weight: 500; width: 40%;">💰 Giá vốn:</td>
                  <td style="padding: 8px 0; text-align: right;">
                    <span style="color: #ef4444; font-size: 13px;">Chưa có</span>
                  </td>
                </tr>
                `}
                
                ${listPrice > sellPrice ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-weight: 500;">🏷️ Giá niêm yết:</td>
                  <td style="padding: 8px 0; text-align: right;">
                    <span style="text-decoration: line-through; color: #94a3b8; font-size: 14px;">${formatPrice(listPrice)}</span>
                    ${product.giavon && product.giavon > 0 ? `
                      <span style="color: #10b981; font-size: 12px; margin-left: 8px;">(+${listPriceProfitPercent.toFixed(1)}%)</span>
                    ` : ''}
                  </td>
                </tr>
                ` : ''}
                
                ${discount > 0 ? `
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-weight: 500;">🎁 Khuyến mãi:</td>
                  <td style="padding: 8px 0; text-align: right;">
                    <strong style="color: #ef4444; font-size: 14px;">-${discount}%</strong>
                  </td>
                </tr>
                ` : ''}
                
                <tr style="border-top: 2px solid #e5e7eb; margin-top: 8px;">
                  <td style="padding: 10px 0; color: #1e293b; font-weight: 600; font-size: 14px;">💳 Giá bán cuối:</td>
                  <td style="padding: 10px 0; text-align: right;">
                    <strong style="font-size: 20px; color: #059669; font-weight: 700;">${formatPrice(sellPrice)}</strong>
                  </td>
                </tr>
                
                ${profitInfo.hasProfit ? `
                <tr style="background: ${profitInfo.profitPercent >= 15 ? '#dcfce7' : profitInfo.profitPercent >= 10 ? '#fef3c7' : '#fee2e2'}; margin-top: 8px; border-radius: 6px;">
                  <td style="padding: 10px; border-radius: 6px; color: #374151; font-weight: 600;">💵 Lợi nhuận thực tế:</td>
                  <td style="padding: 10px; text-align: right; border-radius: 6px;">
                    <strong style="color: ${profitInfo.color}; font-size: 16px; font-weight: 700;">
                      ${formatPrice(profitInfo.profit)} (${profitInfo.profitPercentText}%)
                    </strong>
                  </td>
                </tr>
                ` : `
                <tr style="background: #fef3c7; margin-top: 8px; border-radius: 6px;">
                  <td style="padding: 10px; border-radius: 6px; color: #78350f; font-weight: 600;">⚠️ Trạng thái:</td>
                  <td style="padding: 10px; text-align: right; border-radius: 6px;">
                    <span style="color: #92400e; font-size: 13px; font-weight: 600;">${profitInfo.message}</span>
                  </td>
                </tr>
                `}
              </table>
            </div>

            <!-- Nút xem chi tiết -->
            <div style="margin-top: 12px;">
              <button onclick="editProductDiscount(${product.id})" 
                      style="width: 100%; padding: 10px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; border: none; border-radius: 8px; font-weight: 600; font-size: 13px; cursor: pointer; transition: all 0.2s;">
                📊 Xem chi tiết giá
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  resultHTML += `</div>`;
  resultDiv.innerHTML = resultHTML;
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
    localStorage.setItem(
      "phonestore_category_profit",
      JSON.stringify(categoryProfits)
    );
    loadProfitTable();
  }

  // Đảm bảo key phonestore_products_profit luôn tồn tại trong localStorage
  if (!localStorage.getItem("phonestore_products_profit")) {
    localStorage.setItem("phonestore_products_profit", JSON.stringify({}));
    productProfits = {};
    console.log("📱 Đã khởi tạo phonestore_products_profit trong localStorage");
  }

  // Thêm dữ liệu mẫu cho lợi nhuận theo sản phẩm nếu chưa có
  if (Object.keys(productProfits).length === 0 && products.length > 0) {
    console.log("📱 Adding sample product profits...");
    // Lấy một vài sản phẩm đầu tiên để làm mẫu
    const sampleProducts = products.slice(0, 3);
    sampleProducts.forEach((product, index) => {
      if (product.tensanpham) {
        // Thêm % lợi nhuận mẫu khác nhau cho mỗi sản phẩm
        const sampleProfit = [18, 22, 16][index] || 20;
        productProfits[product.tensanpham] = sampleProfit;
      }
    });

    if (Object.keys(productProfits).length > 0) {
      localStorage.setItem(
        "phonestore_products_profit",
        JSON.stringify(productProfits)
      );
      loadProfitTable();
      console.log(
        `✅ Đã thêm ${
          Object.keys(productProfits).length
        } lợi nhuận sản phẩm mẫu`
      );
    }
  }

  console.log("  Pricing module initialized successfully!");
}


// ====== ĐỒNG BỘ ĐA TAB (ĐƠN GIẢN) ======
function setupPricingSync() {
  console.log("[Pricing] Khởi động Pricing Sync...");

  // Lắng nghe thay đổi từ tab khác (storage event)
  window.addEventListener("storage", (e) => {
    // Chỉ xử lý khi có cập nhật từ tab khác
    if (e.key === "phonestore_last_update") {
      console.log("🔄 Tab khác vừa cập nhật giá");

      // Reload dữ liệu từ localStorage
      products = JSON.parse(localStorage.getItem("phonestore_products")) || [];
      categoryProfits =
        JSON.parse(localStorage.getItem("phonestore_category_profit")) || {};
      productProfits =
        JSON.parse(localStorage.getItem("phonestore_products_profit")) || {};

      // Reload UI nếu đang ở tab đó
      const activeTabId = document.querySelector(".tab-content.active")?.id;
      if (activeTabId === "profit-tab") {
        loadProfitTable();
      }

      showNotification(
        "🔄 Đã đồng bộ",
        "Dữ liệu đã được cập nhật từ tab khác",
        "info"
      );
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
    products = JSON.parse(localStorage.getItem("phonestore_products")) || [];
    categoryProfits =
      JSON.parse(localStorage.getItem("phonestore_category_profit")) || {};
    productProfits =
      JSON.parse(localStorage.getItem("phonestore_products_profit")) || {};
    loadProfitTable();
    console.log("🔄 Đã reload pricing data");
  },
  reset: () => {
    if (confirm("Xóa toàn bộ dữ liệu lợi nhuận?")) {
      localStorage.setItem("phonestore_category_profit", JSON.stringify({}));
      localStorage.setItem("phonestore_products_profit", JSON.stringify({}));
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
      PRODUCTS: "phonestore_products",
      CATEGORY_PROFITS: "phonestore_category_profit",
      PRODUCT_PROFITS: "phonestore_products_profit",
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
