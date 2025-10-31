// ====== LẤY DỮ LIỆU TỪ LOCALSTORAGE ======
let products = JSON.parse(localStorage.getItem("phonestore_products")) || [];

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

// ====== HÀM RELOAD DATA TỪ LOCALSTORAGE ======
function reloadProducts() {
  products = JSON.parse(localStorage.getItem("phonestore_products")) || [];
  console.log(
    "🔄 Đã reload products từ localStorage:",
    products.length,
    "items"
  );
  renderProducts(currentPage);
  renderPagination();
}

// ====== LẮNG NGHE THAY ĐỔI TỪ ADMIN (ĐA TAB) ======
// Lắng nghe storage event (khi admin ở tab khác thay đổi)
window.addEventListener("storage", (e) => {
  if (e.key === "product") {
    console.log("📢 Admin đã cập nhật giá sản phẩm!");
    reloadProducts();
  }
});

// Lắng nghe custom event (khi admin ở cùng tab)
window.addEventListener("phonestore-sync", (e) => {
  if (e.detail && e.detail.key === "product") {
    console.log("📢 Admin đã cập nhật giá sản phẩm (same tab)!");
    reloadProducts();
  }
});

// ====== CHẠY LẦN ĐẦU ======
renderProducts();
renderPagination();

console.log(
  "✅ Trang người dùng sẵn sàng - Tự động cập nhật khi admin thay đổi giá"
);
