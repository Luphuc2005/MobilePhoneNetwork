// ====== LẤY DỮ LIỆU TỪ LOCALSTORAGE ======
let products = JSON.parse(localStorage.getItem("product")) || [];

// ====== CHỌN PHẦN TỬ DOM ======
const layoutProduct = document.querySelector(".products-flex");
const pagination = document.querySelector(".pagination");

// ====== CẤU HÌNH ======
const productsPerPage = 8;
let currentPage = 1;

// ====== HÀM ĐỊNH DẠNG TIỀN TỆ ======
function formatCurrency(value) {
  return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

// ====== HÀM RENDER SẢN PHẨM ======
function renderProducts(page = 1) {
  layoutProduct.innerHTML = "";

  // Tính toán chỉ mục bắt đầu và kết thúc
  const start = (page - 1) * productsPerPage;
  const end = start + productsPerPage;
  const paginatedProducts = products.slice(start, end);

  paginatedProducts.forEach((item) => {
    layoutProduct.innerHTML += `
      <div class="product-card">
        <img src="${item.hinhanh}" alt="${item.tensanpham}" class="product-img">
        <h3 class="product-name">${item.tensanpham}</h3>
        <div class="product-rating">
          <span class="rating-text">
            ${item.rating || "4.5"}
            <img src="./assets/images/icons/star.png" alt="stars" class="icon-stars">
            (${item.reviews || "72"} đánh giá)
          </span>
        </div>
        <div class="product-price-wrapper">
          <div class="product-price">${formatCurrency(item.gia)}</div>
          <div>
            <span class="product-old-price">${formatCurrency(
              item.oldPrice || item.gia * 1.1
            )}</span>
            <span class="product-discount">-${item.discount || 6}%</span>
          </div>
          <div class="product-promotions">
            <p class="coupon-price">
              ${
                item.description ||
                "Trả góp 0% - 0đ phụ thu - 0đ trả trước - kỳ hạn đến 12 tháng"
              }
            </p>
          </div>
        </div>
        <div class="product-actions">
          <button class="btn-detail">Chi tiết</button>
          <button class="btn-cart">Mua ngay</button>
        </div>
      </div>
    `;
  });
}

// ====== HÀM RENDER PHÂN TRANG ======
function renderPagination() {
  const totalPages = Math.ceil(products.length / productsPerPage);
  pagination.innerHTML = "";

  // Nút "Trước"
  const prevButton = document.createElement("button");
  prevButton.textContent = "Trước";
  prevButton.disabled = currentPage === 1;
  prevButton.onclick = () => changePage(currentPage - 1);
  pagination.appendChild(prevButton);

  // Các nút số trang
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    if (i === currentPage) pageButton.classList.add("active");
    pageButton.onclick = () => changePage(i);
    pagination.appendChild(pageButton);
  }

  // Nút "Sau"
  const nextButton = document.createElement("button");
  nextButton.textContent = "Sau";
  nextButton.disabled = currentPage === totalPages;
  nextButton.onclick = () => changePage(currentPage + 1);
  pagination.appendChild(nextButton);
}

// ====== HÀM ĐỔI TRANG ======
function changePage(page) {
  currentPage = page;
  renderProducts(currentPage);
  renderPagination();
}

// ====== ĐỒNG BỘ DỮ LIỆU TỰ ĐỘNG ======
// Lắng nghe sự thay đổi localStorage từ các tab khác (admin)
window.addEventListener("storage", (e) => {
  // Lắng nghe thay đổi dữ liệu sản phẩm
  if (e.key === "product" && e.newValue) {
    console.log("🔄 Phát hiện thay đổi giá từ admin, đang cập nhật...");

    // Cập nhật dữ liệu sản phẩm
    products = JSON.parse(e.newValue);
    lastProductData = JSON.stringify(products);

    // Render lại sản phẩm với trang hiện tại
    renderProducts(currentPage);
    renderPagination();

    // Hiển thị thông báo nhỏ cho user
    showUpdateNotification();
  }

  // Lắng nghe trigger cập nhật giá cụ thể
  if (e.key === "priceUpdateTrigger" && e.newValue) {
    const updateInfo = JSON.parse(e.newValue);
    console.log("📢 Nhận được thông báo cập nhật giá:", updateInfo.productName);

    // Hiển thị thông báo chi tiết
    showUpdateNotification(updateInfo.productName);
  }
});

// ====== KIỂM TRA VÀ CẬP NHẬT ĐỊNH KỲ (cho cùng tab) ======
// Dùng để cập nhật khi thay đổi trong cùng tab
let lastProductData = JSON.stringify(products);

setInterval(() => {
  const currentProductData = localStorage.getItem("product");
  if (currentProductData !== lastProductData) {
    console.log("🔄 Phát hiện thay đổi dữ liệu, đang cập nhật...");
    products = JSON.parse(currentProductData);
    lastProductData = currentProductData;
    renderProducts(currentPage);
    renderPagination();
    showUpdateNotification();
  }
}, 2000); // Kiểm tra mỗi 2 giây

// ====== HÀM HIỂN THỊ THÔNG BÁO CẬP NHẬT ======
function showUpdateNotification(productName = null) {
  // Xóa thông báo cũ nếu có
  const existingNotif = document.querySelector(".update-notification");
  if (existingNotif) existingNotif.remove();

  const notification = document.createElement("div");
  notification.className = "update-notification";
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    z-index: 9999;
    font-size: 14px;
    font-weight: 600;
    animation: slideIn 0.3s ease-out;
    display: flex;
    align-items: center;
    gap: 8px;
    max-width: 350px;
  `;

  const message = productName
    ? `Giá "${productName}" đã được cập nhật!`
    : "Giá sản phẩm đã được cập nhật!";

  notification.innerHTML = `
    <span style="font-size: 18px;">🔄</span>
    <span style="line-height: 1.4;">${message}</span>
  `;

  document.body.appendChild(notification);

  // Tự động ẩn sau 4 giây
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out";
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// Thêm CSS animation
const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideOut {
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

// ====== CHẠY LẦN ĐẦU ======
renderProducts();
renderPagination();
