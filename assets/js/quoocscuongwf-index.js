// ====== LẤY DỮ LIỆU TỪ LOCALSTORAGE ======
let products = JSON.parse(localStorage.getItem('phonestore_products')) || [];

// ====== CHỌN PHẦN TỬ DOM ======
const layoutProduct = document.querySelector(".products-section .products-flex");
const pagination = document.querySelector(".products-section .pagination"); // Chỉ lấy pagination trong products-section

// ====== CẤU HÌNH ======
const productsPerPage = 8;
let currentPage = 1;

// ====== HÀM ĐỊNH DẠNG TIỀN TỆ ======
function formatCurrency(value) {
  return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

// ====== HÀM RELOAD VÀ RENDER LẠI TỪ LOCALSTORAGE ======
window.reloadProductsFromStorage = function() {
  products = JSON.parse(localStorage.getItem('phonestore_products')) || [];
  // Chỉ render nếu đang ở trang index (có phần tử DOM)
  if (layoutProduct && pagination) {
    renderProducts(currentPage);
    renderPagination();
  }
}

// ====== HÀM RENDER SẢN PHẨM ======
function renderProducts(page = 1) {
  if (!layoutProduct) return;
  
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
          <button class="btn-cart">Thêm vào giỏ hàng</button>
        </div>
      </div>
    `;
  });
}



// ====== HÀM RENDER PHÂN TRANG ======
function renderPagination() {
  if (!pagination) return;
  
  const totalPages = Math.ceil(products.length / productsPerPage);
  pagination.innerHTML = "";

  // Nút "Trước"
  const prevButton = document.createElement("button");
  prevButton.textContent = "Trước";
  prevButton.disabled = currentPage === 1;
  prevButton.onclick = () => changeProductPage(currentPage - 1);
  pagination.appendChild(prevButton);

  // Các nút số trang
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    if (i === currentPage) pageButton.classList.add("active");
    pageButton.onclick = () => changeProductPage(i);
    pagination.appendChild(pageButton);
  }

  // Nút "Sau"
  const nextButton = document.createElement("button");
  nextButton.textContent = "Sau";
  nextButton.disabled = currentPage === totalPages;
  nextButton.onclick = () => changeProductPage(currentPage + 1);
  pagination.appendChild(nextButton);
}

// ====== HÀM ĐỔI TRANG ======
function changeProductPage(page) {
  currentPage = page;
  renderProducts(currentPage);
  renderPagination();
  setupProductCardEvents(); // Gắn lại event sau khi render
}

// ====== ĐỒNG BỘ DỮ LIỆU TỰ ĐỘNG ======
// Lắng nghe sự thay đổi localStorage từ các tab khác (admin)
window.addEventListener("storage", (e) => {
    if (e.key === "cart" && e.newValue) {
        updateCartCount();
    }
});

window.addEventListener("storage", (e) => {
    if (e.key === "phonestore_currentUser" && e.newValue) {
        checkLoginStatus();
    }
});


window.addEventListener("storage", (e) => {
  // Lắng nghe thay đổi dữ liệu sản phẩm
  if (e.key === "phonestore_products" && e.newValue) {
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
  if (e.key === "priceUpdateTrigger" && e.newValue ) {
    const updateInfo = JSON.parse(e.newValue);
    console.log("📢 Nhận được thông báo cập nhật giá:", updateInfo.productName);

    // Hiển thị thông báo chi tiết
    showUpdateNotification(updateInfo.productName);
  }
});

// ====== KIỂM TRA VÀ CẬP NHẬT ĐỊNH KỲ (cho cùng tab) ======
// Dùng để cập nhật khi thay đổi trong cùng tab
let lastProductData = JSON.stringify(products);


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

// ====== HÀM GẮN EVENT CHO NÚT CHI TIẾT ======
function setupProductCardEvents() {
    const productCards = document.getElementsByClassName('product-card');
    for (let card of productCards) {
        const btnDetail = card.querySelector('.btn-detail');
        const btnCart = card.querySelector('.btn-cart');
        
        // Event cho nút "Chi tiết"
        if (btnDetail) {
            // Use assignment to avoid adding multiple listeners when this setup is called repeatedly
            btnDetail.onclick = function () {
                // 1. Kiểm tra xem có mục cũ không và xóa đi
                let productDetailString = localStorage.getItem('productDetail');
                if (productDetailString) {
                    localStorage.removeItem('productDetail');
                }
                let listProducts = JSON.parse(localStorage.getItem('phonestore_products')) || [];
                productDetailString = listProducts.find(product => product.tensanpham === card.querySelector('.product-name').innerText);
                console.log(productDetailString);
                
                // 2. Thu thập dữ liệu từ card
                let productDetail = {
                    img: productDetailString.images,
                    hinhanh: productDetailString.hinhanh,
                    name: productDetailString.tensanpham,
                    price: productDetailString.gia.toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
                    rating: productDetailString.rating || "4.5",
                    reviews: productDetailString.reviews || "72",
                    priceOld: (productDetailString.oldPrice || productDetailString.gia * 1.1).toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
                    color: productDetailString.color || ["Titan Đen"],  // Giữ nguyên array
                    memory: productDetailString.memory || ["256GB"], // Giữ nguyên array
                    description: productDetailString.description || "",
                };
                
                console.log('📦 Product Detail được tạo:', productDetail);
                
                // 3. Lưu dữ liệu mới vào localStorage
                localStorage.setItem('productDetail', JSON.stringify(productDetail));
                let categoryCard = document.getElementById("category-card");
                categoryCard.style.display="none";
                let searchProductWrapper = document.getElementsByClassName("search-product-wrapper")[0];
                searchProductWrapper.style.display="none";
                let sliderContainer = document.getElementsByClassName("hero-section")[0];
                sliderContainer.style.display="none";
                let productContainer = document.getElementsByClassName('product-container')[0];
                productContainer.style.display="block";
                renderProductDetailPage(productDetail);
                setupThumbnailGallery();
                setupTabSwitching();
                setupAddToCartButton();
                setupColorMemoryTracking(); // Thêm tracking cho màu và bộ nhớ
                setupContinueShoppingButton();
            };
        }
        
        // Event cho nút "Mua ngay"
        if (btnCart) {
            // Use assignment to prevent duplicate handlers when setupProductCardEvents is called again
            btnCart.onclick = function() {
                // Kiểm tra đăng nhập trước khi thêm vào giỏ
                const phonestore_currentUser = localStorage.getItem('phonestore_currentUser');
                if (!phonestore_currentUser) {
                    alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
                    // Chuyển hướng đến trang đăng nhập
                    return;
                }
                
                // Lấy tên sản phẩm từ card
                const productName = card.querySelector('.product-name').innerText;
                
                // Tìm sản phẩm trong danh sách
                let listProducts = JSON.parse(localStorage.getItem('phonestore_products')) || [];
                let foundProduct = listProducts.find(product => product.tensanpham === productName);
                
                if (!foundProduct) {
                    alert('Không tìm thấy thông tin sản phẩm!');
                    return;
                }
                
                // cho nguoi dung Chọn màu và bộ nhớ
                const defaultColor = Array.isArray(foundProduct.color) && foundProduct.color.length > 0 ? foundProduct.color[0] : "";
                const defaultMemory = Array.isArray(foundProduct.memory) && foundProduct.memory.length > 0 ? foundProduct.memory[0] : "";
                
                // Tạo modal overlay
                const modalOverlay = document.createElement('div');
                modalOverlay.id = 'product-options-modal';
                modalOverlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    animation: fadeIn 0.3s ease;
                `;
                
                modalOverlay.innerHTML = `
                    <style>
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                        @keyframes slideUp {
                            from {
                                opacity: 0;
                                transform: translateY(20px);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }
                        #product-options-modal .modal-content {
                            background: #ffffff;
                            border-radius: 16px;
                            padding: 32px;
                            max-width: 450px;
                            width: 90%;
                            position: relative;
                            animation: slideUp 0.3s ease;
                            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                        }
                        #product-options-modal .close-btn {
                            position: absolute;
                            top: 16px;
                            right: 16px;
                            width: 32px;
                            height: 32px;
                            border: none;
                            background: #f3f4f6;
                            border-radius: 50%;
                            font-size: 20px;
                            color: #6b7280;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            transition: all 0.2s ease;
                        }
                        #product-options-modal .close-btn:hover {
                            background: #ef4444;
                            color: white;
                            transform: rotate(90deg);
                        }
                        #product-options-modal h3 {
                            font-size: 24px;
                            font-weight: 700;
                            color: #1f2937;
                            margin-bottom: 24px;
                            padding-right: 40px;
                        }
                        #product-options-modal .product-preview {
                            display: flex;
                            align-items: center;
                            gap: 12px;
                            padding: 12px;
                            background: #f9fafb;
                            border-radius: 10px;
                            margin-bottom: 20px;
                        }
                        #product-options-modal .product-preview img {
                            width: 60px;
                            height: 60px;
                            object-fit: contain;
                            border-radius: 8px;
                            background: white;
                        }
                        #product-options-modal .product-preview-name {
                            font-size: 14px;
                            font-weight: 600;
                            color: #1f2937;
                            margin-bottom: 4px;
                        }
                        #product-options-modal .product-preview-price {
                            font-size: 16px;
                            font-weight: 700;
                            color: #667eea;
                        }
                        #product-options-modal .selection-group {
                            margin-bottom: 20px;
                        }
                        #product-options-modal label {
                            display: block;
                            font-size: 14px;
                            font-weight: 600;
                            color: #374151;
                            margin-bottom: 8px;
                        }
                        #product-options-modal select {
                            width: 100%;
                            padding: 12px 16px;
                            font-size: 15px;
                            color: #1f2937;
                            background: #f9fafb;
                            border: 2px solid #e5e7eb;
                            border-radius: 10px;
                            cursor: pointer;
                            transition: all 0.2s ease;
                        }
                        #product-options-modal select:hover {
                            border-color: #667eea;
                            background-color: #ffffff;
                        }
                        #product-options-modal select:focus {
                            outline: none;
                            border-color: #667eea;
                            background-color: #ffffff;
                            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                        }
                        #product-options-modal .confirm-btn {
                            width: 100%;
                            padding: 14px;
                            margin-top: 24px;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            border: none;
                            border-radius: 10px;
                            font-size: 16px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.2s ease;
                            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                        }
                        #product-options-modal .confirm-btn:hover {
                            transform: translateY(-2px);
                            box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
                        }
                    </style>
                    <div class="modal-content">
                        <button type="button" class="close-btn">&times;</button>
                        <h3>Chọn thông tin sản phẩm</h3>
                        
                        <div class="product-preview">
                            <img src="${foundProduct.hinhanh}" alt="${foundProduct.tensanpham}">
                            <div>
                                <div class="product-preview-name">${foundProduct.tensanpham}</div>
                                <div class="product-preview-price">${foundProduct.gia.toLocaleString('vi-VN')}₫</div>
                            </div>
                        </div>
                        
                        <div class="selection-group">
                            <label>🎨 Màu sắc:</label>
                            <select id="color-select">
                                ${foundProduct.color && Array.isArray(foundProduct.color) ? foundProduct.color.map(color => `<option value="${color}">${color}</option>`).join('') : `<option value="">Mặc định</option>`}
                            </select>
                        </div>
                        
                        <div class="selection-group">
                            <label>💾 Bộ nhớ:</label>
                            <select id="memory-select">
                                ${foundProduct.memory && Array.isArray(foundProduct.memory) ? foundProduct.memory.map(memory => `<option value="${memory}">${memory}</option>`).join('') : `<option value="">Mặc định</option>`}
                            </select>
                        </div>
                        
                        <button type="button" class="confirm-btn">Xác nhận</button>
                    </div>
                `;
                
                document.body.appendChild(modalOverlay);
                
                // Hàm đóng modal
                const closeModal = () => {
                    modalOverlay.remove();
                };
                
                // Đóng khi click nút X
                modalOverlay.querySelector('.close-btn').onclick = closeModal;
                
                // Đóng khi click overlay (không phải modal content)
                modalOverlay.onclick = (e) => {
                    if (e.target === modalOverlay) {
                        closeModal();
                    }
                };
                
                // Xác nhận và thêm vào giỏ
                modalOverlay.querySelector('.confirm-btn').onclick = () => {
                    const selectedColor = document.getElementById('color-select').value || defaultColor;
                    const selectedMemory = document.getElementById('memory-select').value || defaultMemory;
                    closeModal();
                    addToCartWithOptions(foundProduct, selectedColor, selectedMemory);
                };
                
                // Hàm thêm vào giỏ hàng với options đã chọn
                function addToCartWithOptions(product, color, memory) {
                    // Lấy giỏ hàng hiện tại và chuẩn hóa dữ liệu
                    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
                    
                    // Chuẩn hóa cart: đảm bảo price là string, có color và memory
                    cart = cart.map(item => ({
                        ...item,
                        price: typeof item.price === 'number' ? item.price.toString() : item.price,
                        color: item.color || "",
                        memory: item.memory || ""
                    }));
                    
                    // Tìm sản phẩm đã có trong giỏ (so sánh name + color + memory)
                    let existingProduct = cart.find(item => 
                        item.name === product.tensanpham && 
                        (item.color || "") === color && 
                        (item.memory || "") === memory
                    );
                    
                    if (existingProduct) {
                        // Nếu đã có, tăng số lượng
                        existingProduct.quantity += 1;
                        alert(`Đã thêm 1 sản phẩm nữa vào giỏ hàng!\nTổng số lượng: ${existingProduct.quantity}`);
                    } else {
                        // Nếu chưa có, thêm mới
                        cart.push({
                            img: product.hinhanh,
                            name: product.tensanpham,
                            color: color,
                            memory: memory,
                            price: product.gia.toString(),
                            quantity: 1
                        });
                        
                        const productInfo = color && memory 
                            ? `"${product.tensanpham} - ${memory} - ${color}"`
                            : `"${product.tensanpham}"`;
                        alert(`Đã thêm ${productInfo} vào giỏ hàng!`);
                    }
                    
                    // Lưu giỏ hàng vào localStorage
                    console.log('🛒 Giỏ hàng đã được cập nhật:', JSON.stringify(cart));
                    localStorage.setItem('cart', JSON.stringify(cart));
                    
                    // Cập nhật số lượng hiển thị trên icon giỏ hàng
                    if (typeof window.updateCartCount === 'function') {
                        window.updateCartCount();
                    }
                    
                    // Cập nhật render cart nếu đang ở trang giỏ hàng
                    if (typeof window.renderCartItems === 'function') {
                        window.renderCartItems();
                    }
                    
                    // Hiệu ứng animation cho nút
                    const originalText = btnCart.innerHTML;
                    btnCart.innerHTML = '<i class="fa-solid fa-check"></i> Đã thêm';
                    btnCart.style.backgroundColor = '#16A34A';
                    
                    setTimeout(() => {
                        btnCart.innerHTML = originalText;
                        btnCart.style.backgroundColor = '';
                    }, 1500);
                }
            };
        }
    }
}

// ====== CHẠY LẦN ĐẦU ======
// Chỉ render nếu đang ở trang index (có các phần tử DOM cần thiết)
if (layoutProduct && pagination) {
    renderProducts(currentPage);
    renderPagination();
    setupProductCardEvents(); // Gắn event cho trang 1
}

function renderProductDetailPage(detail) {
    let productContainer = document.querySelector('.product-container');
    console.log(detail);
    if (detail && productContainer) {
        // Render các option bộ nhớ
        let memoryOptions = '';
        if (detail.memory && Array.isArray(detail.memory)) {
            detail.memory.forEach((mem, index) => {
                const checked = index === 0 ? 'checked' : '';
                memoryOptions += `
                    <input type="radio" name="memory" id="memory-${mem}" value="${mem}" ${checked}>
                    <label for="memory-${mem}">${mem}</label>
                `;
            });
        }
        let listImg=`<div class="thumbnail-list">
                    ${detail.img.map((img, index) => `
                        <div class="thumbnail ${index === 0 ? 'active' : ''}">
                            <img src="${img}" alt="thumbnail ${index + 1}">
                        </div>
                    `).join('')}
                </div>`;

        // Render các option màu sắc
        let colorOptions = '';
        if (detail.color && Array.isArray(detail.color)) {
            detail.color.forEach((col, index) => {
                const checked = index === 0 ? 'checked' : '';
                colorOptions += `
                    <input type="radio" name="color" id="color-${col}" value="${col}" ${checked}>
                    <label for="color-${col}">${col}</label>
                `;
            });
        }
        
    productContainer.innerHTML = ` 
<div class="product-main">
            
            <div class="product-gallery">
                <div class="main-image">
                    <img src="${detail.hinhanh}" alt="${detail.name}">
                </div>
                ${listImg}
            </div>
            
            <div class="product-details">
                <span class="sale-badge">GIẢM 10%</span>
                <h1>${detail.name}</h1>
                
                <div class="reviews">
                    <span class="rating">${detail.rating} <i class="fa-solid fa-star"></i></span>
                    <span class="review-count">${detail.reviews} đánh giá</span>
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
                        ${colorOptions}
                    </div>

                    <h3>Dung lượng:</h3>
                    <div class="option-group storage-options">
                        ${memoryOptions}
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
                <div class="tab-link" data-tab="specs">Thông số kỹ thuật</div>
                <div class="tab-link active" data-tab="description">Mô tả chi tiết</div>
                <div class="tab-link" data-tab="reviews">Đánh giá (234)</div>
            </div>
            
            <div class="tab-content" id="tab-specs">
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
            </div>
            
            <div class="tab-content active" id="tab-description">
                <h2>Mô tả sản phẩm</h2>
                <div class="description">
                    <p>${detail.description}</p>
                </div>
            </div>
            
            <div class="tab-content" id="tab-reviews">
                <h2>Đánh giá sản phẩm</h2>
                <div class="reviews-section">
                    <p>Tính năng đánh giá sẽ được cập nhật sớm...</p>
                </div>
            </div>
        </div>
            `;
            
        //Di Chuyển đến đầu trang
        window.scrollTo(0, 0);
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
 * Hàm khởi tạo logic chuyển tab
 * Phải được gọi SAU KHI renderProductDetailPage()
 */
function setupTabSwitching() {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabLinks.length === 0 || tabContents.length === 0) {
        console.warn("Không tìm thấy tab links hoặc tab contents để thiết lập chuyển tab.");
        return;
    }
    
    tabLinks.forEach(tabLink => {
        tabLink.addEventListener('click', function() {
            // Lấy giá trị data-tab từ tab được click
            const targetTab = this.getAttribute('data-tab');
            
            // Xóa class 'active' khỏi tất cả tab links
            tabLinks.forEach(link => link.classList.remove('active'));
            
            // Thêm class 'active' cho tab link được click
            this.classList.add('active');
            
            // Xóa class 'active' khỏi tất cả tab contents
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Thêm class 'active' cho tab content tương ứng
            const activeContent = document.getElementById(`tab-${targetTab}`);
            if (activeContent) {
                activeContent.classList.add('active');
            }
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
 * Hàm theo dõi thay đổi màu sắc và bộ nhớ, cập nhật localStorage
 */
function setupColorMemoryTracking() {
    const colorInputs = document.querySelectorAll('input[name="color"]');
    const memoryInputs = document.querySelectorAll('input[name="memory"]');
    
    function updateProductDetail() {
        let storedDetailString = localStorage.getItem('productDetail');
        if (!storedDetailString) return;
        
        let productDetail = JSON.parse(storedDetailString);
        
        // Cập nhật màu và bộ nhớ được chọn
        const selectedColor = document.querySelector('input[name="color"]:checked')?.value || 'Titan Đen';
        const selectedMemory = document.querySelector('input[name="memory"]:checked')?.value || '256GB';
        
        productDetail.selectedColor = selectedColor;
        productDetail.selectedMemory = selectedMemory;
        
        // Lưu lại vào localStorage
        localStorage.setItem('productDetail', JSON.stringify(productDetail));
        console.log('✅ Đã cập nhật productDetail:', { selectedColor, selectedMemory });
    }
    
    // Thêm event listener cho các radio button màu sắc
    colorInputs.forEach(input => {
        input.addEventListener('change', updateProductDetail);
    });
    
    // Thêm event listener cho các radio button bộ nhớ
    memoryInputs.forEach(input => {
        input.addEventListener('change', updateProductDetail);
    });
    
    // Cập nhật lần đầu với giá trị mặc định
    updateProductDetail();
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
        // Kiểm tra đăng nhập trước khi thêm vào giỏ
        const phonestore_currentUser = localStorage.getItem('phonestore_currentUser');
        if (!phonestore_currentUser) {
            alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
            // Chuyển hướng đến trang đăng nhập
            return;
        }
        
        // Lấy thông tin sản phẩm từ localStorage
        let storedDetailString = localStorage.getItem('productDetail');
        
        if (!storedDetailString) {
            alert('Không tìm thấy thông tin sản phẩm!');
            return;
        }
        
        let productDetail = JSON.parse(storedDetailString);
        
        // Ưu tiên lấy từ localStorage (đã được cập nhật bởi setupColorMemoryTracking)
        // Nếu không có thì mới lấy từ DOM
        const selectedColor = productDetail.selectedColor || document.querySelector('input[name="color"]:checked')?.value || 'Titan Đen';
        const selectedMemory = productDetail.selectedMemory || document.querySelector('input[name="memory"]:checked')?.value || '256GB';
        
        console.log('🛒 Đang thêm vào giỏ hàng:', { 
            name: productDetail.name, 
            color: selectedColor, 
            memory: selectedMemory,
            fromLocalStorage: !!(productDetail.selectedColor && productDetail.selectedMemory)
        });
        
        // Lưu tên gốc, màu và bộ nhớ riêng biệt
        const productName = productDetail.name;
        const productColor = selectedColor;
        const productMemory = selectedMemory;
        
        // Lấy giỏ hàng hiện tại từ localStorage và chuẩn hóa
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        // Chuẩn hóa cart: đảm bảo price là string, có color và memory
        cart = cart.map(item => ({
            ...item,
            price: typeof item.price === 'number' ? item.price.toString() : item.price,
            color: item.color || "",
            memory: item.memory || ""
        }));
        
        // Tìm xem sản phẩm đã có trong giỏ chưa (so sánh name + color + memory)
        let existingProduct = cart.find(item => 
            item.name === productName && 
            (item.color || "") === productColor && 
            (item.memory || "") === productMemory
        );
        
        if (existingProduct) {
            // Nếu đã có, tăng số lượng
            existingProduct.quantity += 1;
            alert(`Đã thêm 1 sản phẩm nữa vào giỏ hàng!\nTổng số lượng: ${existingProduct.quantity}`);
        } else {
            // Nếu chưa có, thêm mới
            cart.push({
                img: productDetail.img[0],
                name: productName,
                color: productColor,
                memory: productMemory,
                price: productDetail.price.replace(/[₫,.]/g, '').trim(), // Lưu dạng string
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
        
        // 5. Gọi hàm thiết lập chuyển tab
        setupTabSwitching();
        
        // 6. Gọi hàm thiết lập nút "Thêm vào giỏ"
        setupAddToCartButton();
        
        // 7. Theo dõi thay đổi màu sắc và bộ nhớ
        setupColorMemoryTracking();
        
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


// Code này đã được chuyển vào hàm setupProductCardEvents() ở trên