let productsSearchBar = JSON.parse(localStorage.getItem('phonestore_products')) || [];
let filteredProducts = [...productsSearchBar];
let currentPageSearchProduct = 1;
const paginationContainer = document.querySelector('.search-product-pagination');
const itemsPerPage = 8; 

function filterProducts(filters) {
    console.log(productsSearchBar);
    console.log(filters);
    filteredProducts = productsSearchBar.filter(product => {
        // Lọc theo hãng
        if (filters.manufacturers.length > 0 && 
            !filters.manufacturers.includes(product.danhmuc)) {
            return false;
        }

        // Lọc theo giá
        if (filters.priceRanges.length > 0) {
            const price = parseInt(product.gia);
            const matchesPrice = filters.priceRanges.some(range => {
                // Xử lý trường hợp "30+" (trên 30 triệu)
                if (range.includes('+')) {
                    const min = parseInt(range.replace('+', ''));
                    return price >= min * 1000000;
                }
                // Xử lý trường hợp "5-10" (khoảng giá)
                const [min, max] = range.split('-').map(Number);
                if (max && !isNaN(max)) {
                    return price >= min * 1000000 && price < max * 1000000;
                } else {
                    return price >= min * 1000000;
                }
            });
            if (!matchesPrice) return false;
        }

        // Lọc theo bộ nhớ trong
        if (filters.storage.length > 0) {
            // Sản phẩm có field memory là mảng (ví dụ: ["128GB", "256GB", "512GB"])
            // Kiểm tra xem mảng memory có chứa bất kỳ giá trị storage nào được chọn không
            const productMemory = product.memory || [];
            const hasMatchingStorage = filters.storage.some(storageValue => 
                productMemory.includes(storageValue)
            );
            if (!hasMatchingStorage) {
                return false;
            }
        }

        // Lọc theo đánh giá
        if (filters.rating.length > 0) {
            const minRating = Math.min(...filters.rating);
            if (product.rating < minRating) {
                return false;
            }
        }

        return true;
    });
    console.log(filteredProducts);
    currentPageSearchProduct = 1;
    renderFilteredProducts();
}

function renderFilteredProducts() {
    const productContainer = document.querySelector('.search-product-content');
    if (!productContainer) return;

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPageSearchProduct - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);

    if (productsToShow.length === 0) {
        productContainer.innerHTML = `
            <div class="no-results">
                Không tìm thấy sản phẩm nào phù hợp với bộ lọc
            </div>
        `;
        paginationContainer.innerHTML = ``;
        return;
    }

    const productsHTML = productsToShow.map(item => `
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
                <div class="product-price">${formatPrice(item.gia)}</div>
                <div>
                    <span class="product-old-price">${formatPrice(item.oldPrice || item.gia * 1.1)}</span>
                    <span class="product-discount">-${item.discount || 6}%</span>
                </div>
                <div class="product-promotions">
                    <p class="coupon-price">
                        ${item.description || "Trả góp 0% - 0đ phụ thu - 0đ trả trước - kỳ hạn đến 12 tháng"}
                    </p>
                </div>
            </div>
            <div class="product-actions">
                <button class="btn-detail">Chi tiết</button>
                <button class="btn-cart">Mua ngay</button>
            </div>
        </div>
    `).join('');

    productContainer.innerHTML = `
        ${productsHTML}
    `;
    if (filteredProducts.length > itemsPerPage) {
            renderPagination(totalPages);
    } else {
        paginationContainer.innerHTML = ``;
    }
    
    // Sử dụng hàm setup từ listProductIndex.js (đã xử lý cả btn-detail và btn-cart)
    if (typeof setupProductCardEvents === 'function') {
        setupProductCardEvents();
    }
}

function renderPagination(totalPages) {
    if (!paginationContainer) return;

    let paginationHTML = '';
    
    paginationHTML += `
        <button class="search-product-nav-btn" 
                onclick="changePage(${currentPageSearchProduct - 1})"
                ${currentPageSearchProduct <= 1 ? 'disabled' : ''}>
            ‹ Trước
        </button>
    `;

    for (let i = 1; i <= totalPages; i++) {
        if (totalPages > 7) {
            if (i === 1 || i === totalPages || 
                (i >= currentPageSearchProduct - 2 && i <= currentPageSearchProduct + 2)) {
                paginationHTML += `
                    <button class="search-product-page-btn ${i === currentPageSearchProduct ? 'active' : ''}"
                            onclick="changePage(${i})">
                        ${i}
                    </button>
                `;
            } else if (i === currentPageSearchProduct - 3 || i === currentPageSearchProduct + 3) {
                paginationHTML += `<span>...</span>`;
            }
        } else {
            paginationHTML += `
                <button class="search-product-page-btn ${i === currentPageSearchProduct ? 'active' : ''}"
                        onclick="changePage(${i})">
                    ${i}
                </button>
            `;
        }
    }

    paginationHTML += `
        <button class="search-product-nav-btn" 
                onclick="changePage(${currentPageSearchProduct + 1})"
                ${currentPageSearchProduct >= totalPages ? 'disabled' : ''}>
            Sau ›
        </button>
    `;

    paginationContainer.innerHTML = paginationHTML;
}

window.changePage = function(page) {
    if (page < 1 || page > Math.ceil(filteredProducts.length / itemsPerPage)) return;
    currentPageSearchProduct = page;
    renderFilteredProducts();
    document.querySelector('.search-product-content')?.scrollIntoView({ behavior: 'smooth' });
};

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price);
}

function formatCurrency(value) {
    return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

document.querySelector('.apply-filter')?.addEventListener('click', function() {
    const filters = {
        manufacturers: [],
        priceRanges: [],
        storage: [],
        rating: []
    };

    document.querySelectorAll('.filter-options input:checked').forEach(input => {
        const group = input.closest('.filter-group');
        const groupTitle = group.querySelector('h3').textContent;
        
        switch(groupTitle) {
            case 'Hãng sản xuất':
                filters.manufacturers.push(input.value);
                break;
            case 'Khoảng giá':
                filters.priceRanges.push(input.value);
                break;
            case 'Bộ nhớ trong':
                filters.storage.push(input.value);
                break;
            case 'Đánh giá':
                filters.rating.push(Number(input.value));
                break;
        }
    });
    document.querySelector('.search-product-content')?.scrollIntoView({ behavior: 'smooth' });
    filterProducts(filters);
});
//========Duy Đăng (Quick Acces )==========

document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', function() {
        const filters = {
            manufacturers: [],
            priceRanges: [],
            storage: [],
            rating: []
        };

        const spanText = this.querySelector('span')?.textContent;
        if (spanText) {
            filters.manufacturers.push(spanText);
            console.log(spanText);
            document.querySelector('.search-product-content')?.scrollIntoView({ behavior: 'smooth' });
            filterProducts(filters);
        }
    });
});
document.querySelector('.search-bar-btn').addEventListener('click', function() {
    const filters = {
        manufacturers: [],
        priceRanges: [],
        storage: [],
        rating: []
    };
    const keyword = document.querySelector('.search-bar input').value;

    document.querySelectorAll('.filter-options input:checked').forEach(input => {
        const group = input.closest('.filter-group');
        const groupTitle = group.querySelector('h3').textContent;
        
        switch(groupTitle) {
            case 'Hãng sản xuất':
                filters.manufacturers.push(input.value);
                break;
            case 'Khoảng giá':
                filters.priceRanges.push(input.value);
                break;
            case 'Bộ nhớ trong':
                filters.storage.push(input.value);
                break;
            case 'Đánh giá':
                filters.rating.push(Number(input.value));
                break;
        }
    });

    filterProducts(filters);
    console.log(filteredProducts.length);
    console.log(keyword);
    const keywordNormalized = keyword?.trim().toLowerCase() || "";

    let filteredNameProducts = filteredProducts.filter(product => {
      const name = product?.tensanpham?.toLowerCase() || "";
      return name.includes(keywordNormalized);
    });
    filteredProducts = filteredNameProducts;
    
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    renderPagination(totalPages);
    renderFilteredProducts();
    document.querySelector('.search-product-content')?.scrollIntoView({ behavior: 'smooth' });
})

let typeProduct = JSON.parse(localStorage.getItem('phonestore_categories')) || [];

function renderTypeProduct() {
    let typeProductContainer = document.querySelector('.search-product-type');
    typeProductContainer.innerHTML = ``;
    typeProduct.forEach(type => {
        if (type.status === "Hoạt động") {
            typeProductContainer.innerHTML += `
                <label><input type="checkbox" style="transform: scale(1.3); cursor: pointer;" value="${type.name}">${type.name}</label>
            `
        }
    });
}

window.addEventListener('storage', function(e) {
    if (e.key === 'phonestore_categories') {
        typeProduct = JSON.parse(e.newValue || '[]');
        renderTypeProduct();
    }
    if (e.key === 'phonestore_products') {
        productsSearchBar = JSON.parse(e.newValue || '[]');
        searchInventory();
    }
});


function checkForUpdates() {
    const currentTypes = JSON.parse(localStorage.getItem('phonestore_categories') || '[]');
    const currentInventory = JSON.parse(localStorage.getItem('phonestore_products') || '[]');

    if (JSON.stringify(currentTypes) !== JSON.stringify(typeProduct)) {
        typeProduct = currentTypes;
        renderTypeProduct();
    }

    if (JSON.stringify(currentInventory) !== JSON.stringify(productsSearchBar)) {
        productsSearchBar = currentInventory;
        renderFilteredProducts();
    }
}

setInterval(checkForUpdates, 2000);

document.addEventListener('DOMContentLoaded', () => {
    renderFilteredProducts();
    renderTypeProduct();
});