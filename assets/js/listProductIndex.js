// ====== LẤY DỮ LIỆU TỪ LOCALSTORAGE ======
let products = JSON.parse(localStorage.getItem("products")) || [];

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

function renderProductDetailPage(detail) {
    let productContainer = document.querySelector('.product-container');
    console.log(detail);
    if (detail && productContainer) {
        // Lưu ý: Dùng innerHTML = thay vì += để tránh render đè
        let star, reviewCount;
    try {
        // Tách chuỗi tại vị trí " ("
        // parts sẽ là mảng: ["4.5", "50 đánh giá)"]
        const parts = detail.ratingText.split(' ('); 

        // Lấy phần tử đầu tiên và loại bỏ khoảng trắng thừa
        star = parts[0].trim(); // "4.5"

        // Lấy phần tử thứ hai, rồi tách tiếp bằng dấu cách
        // reviewParts sẽ là mảng: ["50", "đánh", "giá)"]
        const reviewParts = parts[1].split(' ');

        // Lấy con số đầu tiên
        reviewCount = reviewParts[0]; // "50"

        console.log("Số sao:", star);           // Output: 4.5
        console.log("Số đánh giá:", reviewCount); // Output: 50

    } catch (e) {
        console.error("Lỗi khi tách chuỗi rating:", e);
        // Đặt giá trị mặc định nếu chuỗi không đúng định dạng
        const star = "N/A";
        const reviewCount = "0";
    }
        productContainer.innerHTML = ` 
<div class="product-main">
            
            <div class="product-gallery">
                <div class="main-image">
                    <img src="${detail.img}" alt="${detail.name}">
                </div>
                <div class="thumbnail-list">
                    <div class="thumbnail active"><img src="${detail.img}" alt="thumbnail 1"></div>
                    <div class="thumbnail"><img src="${detail.img}" alt="thumbnail 2"></div>
                    <div class="thumbnail"><img src="${detail.img}" alt="thumbnail 3"></div>
                    <div class="thumbnail"><img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-17-pro-max-1_1.jpg" alt="thumbnail 4"></div>
                    <div class="thumbnail"><img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-17-pro-max-1_1.jpg" alt="thumbnail 5"></div>
                </div>
            </div>
            
            <div class="product-details">
                <span class="sale-badge">GIẢM 10%</span>
                <h1>${detail.name}</h1>
                
                <div class="reviews">
                    <span class="rating">${star} <i class="fa-solid fa-star"></i></span>
                    <span class="review-count">${reviewCount} đánh giá</span>
                    <span class="sold-count">Đã bán 224</span>
                </div>
                
                <div class="price-box">
                    <span class="sale-price">${detail.price}₫</span>
                    <span class="original-price">${detail.priceOld}₫</span>
                    <div class="vat-info">Giá đã bao gồm VAT</div>
                </div>

                <div class="options-section">
                    <h3>Chọn màu sắc:</h3>
                    <div class="option-group color-options">
                        <input type="radio" name="color" id="color-black" value="Titan Đen" checked>
                        <label for="color-black">Titan Đen</label>
                        
                        <input type="radio" name="color" id="color-white" value="Titan Trắng">
                        <label for="color-white">Titan Trắng</label>
                        
                        <input type="radio" name="color" id="color-blue" value="Titan Xanh">
                        <label for="color-blue">Titan Xanh</label>

                        <input type="radio" name="color" id="color-natural" value="Titan Tự Nhiên">
                        <label for="color-natural">Titan Tự Nhiên</label>
                    </div>

                    <h3>Dung lượng:</h3>
                    <div class="option-group storage-options">
                        <input type="radio" name="memory" id="memory-256" value="256GB" checked>
                        <label for="memory-256">256GB</label>
                        
                        <input type="radio" name="memory" id="memory-512" value="512GB">
                        <label for="memory-512">512GB</label>
                        
                        <input type="radio" name="memory" id="memory-1tb" value="1TB">
                        <label for="memory-1tb">1TB</label>
                    </div>
                </div>

                <div class="info-snippets">
                    <div class="snippet">
                        <i class="fa-solid fa-truck-fast"></i> Miễn phí vận chuyển
                    </div>
                    <div class="snippet">
                        <i class="fa-solid fa-shield-halved"></i> Bảo hành 12 tháng
                    </div>
                    <div class="snippet">
                        <i class="fa-solid fa-box-open"></i> Đổi trả 7 ngày
                    </div>
                </div>
                
                <div class="action-buttons">
                    <button class="btn btn-add-to-cart">
                        <i class="fa-solid fa-cart-plus"></i> Thêm vào giỏ
                    </button>
                    <button class="btn btn-continue-shopping">Tiếp tục mua hàng</button>
                </div>

                <div class="secondary-actions">
                    <button class="btn-icon">
                        <i class="fa-regular fa-heart"></i> Yêu thích
                    </button>
                    <button class="btn-icon">
                        <i class="fa-solid fa-share-nodes"></i> Chia sẻ
                    </button>
                </div>
            </div>
        </div>

        <div class="product-info-section">
            <div class="tabs">
                <div class="tab-link active">Mô tả chi tiết</div>
                <div class="tab-link">Thông số kỹ thuật</div>
                <div class="tab-link">Đánh giá (234)</div>
            </div>
            
            <div class="tab-content">
                <h2>Thông số kỹ thuật</h2>
                <div class="specs-grid">
                    <div class="spec-item">
                        <span class="spec-label">Màn hình</span>
                        <span class="spec-value">6.7" Super Retina XDR OLED</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Camera sau</span>
                        <span class="spec-value">48MP + 12MP + 12MP</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Camera trước</span>
                        <span class="spec-value">12MP</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Chip</span>
                        <span class="spec-value">Apple A17 Pro</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">RAM</span>
                        <span class="spec-value">8GB</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Bộ nhớ</span>
                        <span class="spec-value">256GB</span>
                    </div>
                     <div class="spec-item">
                        <span class="spec-label">Pin</span>
                        <span class="spec-value">4422 mAh</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Hệ điều hành</span>
                        <span class="spec-value">iOS 17</span>
                    </div>
                </div>

                <h2>Mô tả sản phẩm</h2>
                <div class="description">
                    <p>iPhone 15 Pro Max là chiếc smartphone cao cấp nhất trong dòng iPhone 15 series, mang đến hiệu năng đột phá với chip A17 Pro, camera 48MP chuyên nghiệp và thiết kế titan sang trọng.</p>
                    <p>Với màn hình Super Retina XDR 6.7 inch, viên pin lớn 4422 mAh và hệ điều hành iOS 17, iPhone 15 Pro Max là lựa chọn hoàn hảo cho những ai đang tìm kiếm một chiếc điện thoại flagship đỉnh cao.</p>
                </div>
            </div>
        </div>
            `;
            
        // GẮN EVENT CHO NÚT "TIẾP TỤC MUA HÀNG" SAU KHI RENDER
        setupContinueShoppingButton();
    } else if (!productContainer) {
        console.error("Không tìm thấy '.product-container' để render.");
    }
}

/**
 * Hàm khởi tạo logic cho gallery thumbnail
 * Phải được gọi SAU KHI renderProductDetailPage()
 */
function setupThumbnailGallery() {
    // 1. Lấy TẤT CẢ ảnh thumbnail
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    // 2. Lấy ảnh chính
    const mainImage = document.querySelector('.main-image img');

    // Thoát nếu không tìm thấy các phần tử cần thiết
    if (!mainImage || thumbnails.length === 0) {
        console.warn("Không tìm thấy ảnh chính hoặc thumbnail để thiết lập gallery.");
        return;
    }

    // 3. Thêm sự kiện 'click' cho TỪNG ảnh thumbnail
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // 'this' chính là cái .thumbnail vừa được click

            // 3a. Lấy thumbnail đang "active"
            const currentActive = document.querySelector('.thumbnail.active');
            
            // 3b. Xóa class 'active' khỏi thumbnail đó
            if (currentActive) {
                currentActive.classList.remove('active');
            }

            // 3c. Thêm class 'active' cho thumbnail vừa được click
            this.classList.add('active');

            // 3d. Lấy đường dẫn (src) của ảnh BÊN TRONG thumbnail
            const newImageSrc = this.querySelector('img').src;

            // 3e. Cập nhật đường dẫn cho ảnh chính
            mainImage.src = newImageSrc;
        });
    });
}

/**
 * Hàm gắn event cho nút "Tiếp tục mua hàng"
 * Phải được gọi SAU KHI renderProductDetailPage()
 */
function setupContinueShoppingButton() {
    const btnContinueShopping = document.querySelector('.btn-continue-shopping');
    
    if (!btnContinueShopping) {
        console.warn("Không tìm thấy nút 'Tiếp tục mua hàng'");
        return;
    }
    
    btnContinueShopping.addEventListener('click', function () {
        // Ẩn product-container trước khi reload
        let productContainer = document.querySelector('.product-container');
        if (productContainer) {
            productContainer.style.display = "none";
        }
        
        // Reload lại trang index.html
        location.href = "index.html";
    });
}

/**
 * Hàm thêm sản phẩm vào giỏ hàng
 * Phải được gọi SAU KHI renderProductDetailPage()
 */
function setupAddToCartButton() {
    const addToCartBtn = document.querySelector('.btn-add-to-cart');
    
    if (!addToCartBtn) {
        console.warn("Không tìm thấy nút 'Thêm vào giỏ'");
        return;
    }
    
    addToCartBtn.addEventListener('click', function() {
        // Lấy thông tin sản phẩm từ localStorage
        let storedDetailString = localStorage.getItem('productDetail');
        
        if (!storedDetailString) {
            alert('Không tìm thấy thông tin sản phẩm!');
            return;
        }
        
        let productDetail = JSON.parse(storedDetailString);
        
        // Lấy màu sắc và dung lượng đã chọn
        const selectedColor = document.querySelector('input[name="color"]:checked')?.value || 'Titan Đen';
        const selectedMemory = document.querySelector('input[name="memory"]:checked')?.value || '256GB';
        
        // Lưu tên gốc, màu và bộ nhớ riêng biệt
        const productName = productDetail.name;
        const productColor = selectedColor;
        const productMemory = selectedMemory;
        
        // Lấy giỏ hàng hiện tại từ localStorage
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        // Tìm xem sản phẩm đã có trong giỏ chưa (so sánh name + color + memory)
        let existingProduct = cart.find(item => 
            item.name === productName && 
            item.color === productColor && 
            item.memory === productMemory
        );
        
        if (existingProduct) {
            // Nếu đã có, tăng số lượng
            existingProduct.quantity += 1;
            alert(`Đã thêm 1 sản phẩm nữa vào giỏ hàng!\nTổng số lượng: ${existingProduct.quantity}`);
        } else {
            // Nếu chưa có, thêm mới
            cart.push({
                img: productDetail.img,
                name: productName,
                color: productColor,
                memory: productMemory,
                price: productDetail.price.replace(/[₫,.]/g, '').trim(), // Lưu dạng số
                quantity: 1
            });
            alert(`Đã thêm "${productName} - ${productMemory} - ${productColor}" vào giỏ hàng!`);
        }
        
        // Lưu giỏ hàng vào localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Cập nhật số lượng hiển thị trên icon giỏ hàng (nếu có)
        if (typeof window.updateCartCount === 'function') {
            window.updateCartCount();
        }
        
        // Hiệu ứng animation cho nút (optional)
        addToCartBtn.innerHTML = '<i class="fa-solid fa-check"></i> Đã thêm';
        addToCartBtn.style.backgroundColor = '#16A34A';
        
        setTimeout(() => {
            addToCartBtn.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Thêm vào giỏ';
            addToCartBtn.style.backgroundColor = '';
        }, 1500);
    });
}


// === ĐÂY LÀ ĐIỂM KHỞI ĐỘNG CỦA TRANG DETAIL.HTML ===
// Chạy khi trang HTML đã tải xong
document.addEventListener('DOMContentLoaded', function() {
    // 1. Lấy dữ liệu từ localStorage
    let storedDetailString = localStorage.getItem('productDetail');

    if (storedDetailString) {
        // 2. Chuyển chuỗi JSON thành object
        let productDetail = JSON.parse(storedDetailString);
        console.log(productDetail)
        // 3. Gọi hàm render HTML
        renderProductDetailPage(productDetail);

        // 4. SAU KHI HTML ĐÃ CÓ, gọi hàm thiết lập gallery
        setupThumbnailGallery();
        
        // 5. Gọi hàm thiết lập nút "Thêm vào giỏ"
        setupAddToCartButton();
        
        // (Tùy chọn) Xóa dữ liệu sau khi dùng xong để tránh lỗi
        // localStorage.removeItem('productDetail'); 
    } else {
        // Xử lý trường hợp người dùng vào thẳng trang detail mà không qua trang list
        console.error("Không tìm thấy dữ liệu 'productDetail' trong localStorage.");
        const container = document.querySelector('.product-container');
        if (container) {
            container.innerHTML = "<h1>Lỗi: Không tìm thấy chi tiết sản phẩm. Vui lòng quay lại trang danh sách.</h1>";
        }
    }
});


const productCards = document.getElementsByClassName('product-card');
for (let card of productCards) {
    const btnDetail = card.querySelector('.btn-detail');
    if (btnDetail) {
        btnDetail.addEventListener('click', function () {
            // 1. Kiểm tra xem có mục cũ không và xóa đi
            let productDetailString = localStorage.getItem('productDetail');
            if (productDetailString) {
                localStorage.removeItem('productDetail');
            }
            
            // 2. Thu thập dữ liệu từ card
            let productDetail = {
                img: card.querySelector('.product-img').src,
                name: card.querySelector('.product-name').innerText,
                price: card.querySelector('.product-price').innerText,
                ratingText: card.querySelector('.rating-text').innerText,
                priceOld: card.querySelector('.product-old-price').innerText
                // Lưu ý: Các trường 'reviewCount' và 'soldCount' không có ở đây
                // Bạn cần thêm chúng nếu có trên product-card
            };
            
            // 3. Lưu dữ liệu mới vào localStorage
            localStorage.setItem('productDetail', JSON.stringify(productDetail));
            let products = document.getElementById("products");
            products.style.display="none";
            let categoryCard = document.getElementById("category-card");
            categoryCard.style.display="none";
            let productContainer = document.getElementsByClassName('product-container')[0];
            productContainer.style.display="block";
            renderProductDetailPage(productDetail);
            setupThumbnailGallery();
            setupAddToCartButton();
            setupContinueShoppingButton();
            // 4. Chuyển hướng đến trang chi tiết
        });


    }
}