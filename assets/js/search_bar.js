let allProducts = JSON.parse(localStorage.getItem('product')) || [];
let filteredProducts = [...allProducts];

let currentPageSearchProduct = 1;
const itemsPerPage = 6;

function filterProducts(filters) {
    filteredProducts = allProducts.filter(product => {
        // Lọc theo hãng
        if (filters.manufacturers.length > 0 && 
            !filters.manufacturers.includes(product.danhmuc)) {
            return false;
        }

        // Lọc theo giá
        if (filters.priceRanges.length > 0) {
            const price = parseInt(product.gia);
            const matchesPrice = filters.priceRanges.some(range => {
                const [min, max] = range.split('-').map(Number);
                if (max) {
                    return price >= min * 1000000 && price < max * 1000000;
                } else {
                    return price >= min * 1000000;
                }
            });
            if (!matchesPrice) return false;
        }

        if (filters.storage.length > 0 && 
            !filters.storage.includes(product.storage)) {
            return false;
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
        renderPagination(totalPages);
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
                <div class="product-price">${formatCurrency(item.gia)}</div>
                <div>
                    <span class="product-old-price">${formatCurrency(item.oldPrice || item.gia * 1.1)}</span>
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

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    const paginationContainer = document.querySelector('.search-product-pagination');
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

    filterProducts(filters);
});

document.querySelector('.search-bar-btn').addEventListener('click', function() {
    const filters = {
        manufacturers: [],
        priceRanges: [],
        storage: [],
        rating: []
    };
    const keyword = document.querySelector('.search-bar-inp').value;

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

document.addEventListener('DOMContentLoaded', () => {
    renderFilteredProducts();
});
