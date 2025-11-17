// ====== AUTOCOMPLETE TÌM KIẾM NHƯ CELLPHONES ======
let searchTimeout;
let currentFocusIndex = -1;

// Lấy sản phẩm từ localStorage
function getProducts() {
    return JSON.parse(localStorage.getItem('phonestore_products') || '[]');
}

// Lấy sản phẩm trending/phổ biến (xu hướng tìm kiếm)
function getTrendingProducts() {
    const products = getProducts();
    
    // Sắp xếp theo rating cao, discount cao, hoặc lấy iPhone/Samsung trước
    return products
        .filter(p => p.tensanpham && p.hinhanh) // Chỉ lấy sản phẩm có đủ thông tin
        .sort((a, b) => {
            // Ưu tiên iPhone và Samsung
            const aIsPopular = (a.danhmuc || '').toLowerCase().includes('iphone') || 
                              (a.danhmuc || '').toLowerCase().includes('samsung');
            const bIsPopular = (b.danhmuc || '').toLowerCase().includes('iphone') || 
                              (b.danhmuc || '').toLowerCase().includes('samsung');
            
            if (aIsPopular && !bIsPopular) return -1;
            if (!aIsPopular && bIsPopular) return 1;
            
            // Sau đó sắp xếp theo rating
            const aRating = parseFloat(a.rating || 0);
            const bRating = parseFloat(b.rating || 0);
            if (bRating !== aRating) return bRating - aRating;
            
            // Cuối cùng sắp xếp theo discount
            const aDiscount = parseFloat(a.discount || 0);
            const bDiscount = parseFloat(b.discount || 0);
            return bDiscount - aDiscount;
        })
        .slice(0, 10); // Lấy 10 sản phẩm đầu
}

// Tìm kiếm sản phẩm
function searchProducts(keyword) {
    const products = getProducts();
    if (!keyword || keyword.trim() === '') {
        return [];
    }

    const keywordLower = keyword.trim().toLowerCase();
    return products.filter(product => {
        const name = (product.tensanpham || '').toLowerCase();
        const category = (product.danhmuc || '').toLowerCase();
        const brand = (product.hang || '').toLowerCase();
        
        return name.includes(keywordLower) || 
               category.includes(keywordLower) || 
               brand.includes(keywordLower);
    }).slice(0, 8); // Giới hạn 8 kết quả
}

// Format giá
function formatPrice(price) {
    if (!price) return '0 ₫';
    return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
}

// Render autocomplete dropdown
function renderAutocomplete(products, keyword) {
    const autocomplete = document.getElementById('searchAutocomplete');
    if (!autocomplete) return;

    // Nếu không có keyword, hiển thị trending searches
    if (!keyword || keyword.trim() === '') {
        const trendingProducts = getTrendingProducts();
        if (trendingProducts.length === 0) {
            hideAutocomplete();
            return;
        }

        // Chia thành 2 cột
        const leftColumn = trendingProducts.slice(0, Math.ceil(trendingProducts.length / 2));
        const rightColumn = trendingProducts.slice(Math.ceil(trendingProducts.length / 2));

        const html = `
            <div class="search-autocomplete-trending">
                <div class="search-autocomplete-trending-header">
                    <span class="trending-icon"></span>
                    <span class="trending-title">Xu hướng tìm kiếm</span>
                </div>
                <div class="search-autocomplete-trending-content">
                    <div class="trending-column">
                        ${leftColumn.map((product, index) => `
                            <div class="search-autocomplete-item" data-index="${index}" data-product-id="${product.id || ''}">
                                <img src="${product.hinhanh || './assets/images/icons/no-image.png'}" 
                                     alt="${product.tensanpham || ''}" 
                                     onerror="this.src='./assets/images/icons/no-image.png'">
                                <div class="search-autocomplete-item-info">
                                    <div class="search-autocomplete-item-name">${product.tensanpham || ''}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="trending-column">
                        ${rightColumn.map((product, index) => `
                            <div class="search-autocomplete-item" data-index="${index + leftColumn.length}" data-product-id="${product.id || ''}">
                                <img src="${product.hinhanh || './assets/images/icons/no-image.png'}" 
                                     alt="${product.tensanpham || ''}" 
                                     onerror="this.src='./assets/images/icons/no-image.png'">
                                <div class="search-autocomplete-item-info">
                                    <div class="search-autocomplete-item-name">${product.tensanpham || ''}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        autocomplete.innerHTML = html;
        autocomplete.classList.add('show');
        currentFocusIndex = -1;

        // Thêm event listeners
        autocomplete.querySelectorAll('.search-autocomplete-item').forEach((item, index) => {
            const productIndex = parseInt(item.dataset.index);
            const product = trendingProducts[productIndex];
            if (product) {
                item.addEventListener('click', () => {
                    selectProduct(product);
                });
            }
        });
        return;
    }

    // Nếu có keyword, hiển thị kết quả tìm kiếm
    if (products.length === 0) {
        autocomplete.innerHTML = `
            <div class="search-autocomplete-no-results">
                Không tìm thấy sản phẩm nào
            </div>
        `;
        autocomplete.classList.add('show');
        return;
    }

    const html = products.map((product, index) => `
        <div class="search-autocomplete-item" data-index="${index}" data-product-id="${product.id || ''}">
            <img src="${product.hinhanh || './assets/images/icons/no-image.png'}" 
                 alt="${product.tensanpham || ''}" 
                 onerror="this.src='./assets/images/icons/no-image.png'">
            <div class="search-autocomplete-item-info">
                <div class="search-autocomplete-item-name">${highlightKeyword(product.tensanpham || '', keyword)}</div>
                <div class="search-autocomplete-item-price">${formatPrice(product.gia || 0)}</div>
            </div>
        </div>
    `).join('');

    autocomplete.innerHTML = html;
    autocomplete.classList.add('show');
    currentFocusIndex = -1;

    // Thêm event listeners cho các item
    autocomplete.querySelectorAll('.search-autocomplete-item').forEach((item, index) => {
        item.addEventListener('click', () => {
            selectProduct(products[index]);
        });
    });
}

// Highlight keyword trong tên sản phẩm
function highlightKeyword(text, keyword) {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// Ẩn autocomplete
function hideAutocomplete() {
    const autocomplete = document.getElementById('searchAutocomplete');
    if (autocomplete) {
        autocomplete.classList.remove('show');
        currentFocusIndex = -1;
    }
}

// Chọn sản phẩm
function selectProduct(product) {
    if (!product) return;
    
    // Điều hướng đến trang chi tiết hoặc scroll đến sản phẩm
    const searchInput = document.getElementById('headerSearchInput');
    if (searchInput) {
        searchInput.value = product.tensanpham || '';
    }
    
    hideAutocomplete();
    
    // Scroll đến phần tìm kiếm và filter
    const searchSection = document.querySelector('.search-product-wrapper');
    if (searchSection) {
        searchSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Trigger tìm kiếm
        setTimeout(() => {
            if (typeof filterProducts === 'function') {
                const keyword = product.tensanpham || '';
                const filters = {
                    manufacturers: [],
                    priceRanges: [],
                    storage: [],
                    rating: []
                };
                filterProducts(filters);
                
                // Filter theo tên
                const keywordNormalized = keyword.trim().toLowerCase();
                const products = getProducts();
                const filteredNameProducts = products.filter(p => {
                    const name = (p.tensanpham || '').toLowerCase();
                    return name.includes(keywordNormalized);
                });
                
                // Update filtered products và render
                if (typeof window.updateFilteredProducts === 'function') {
                    window.updateFilteredProducts(filteredNameProducts);
                }
            }
        }, 300);
    }
}

// Xử lý tìm kiếm khi gõ
function handleSearchInput(event) {
    const keyword = event.target.value.trim();
    
    // Clear timeout cũ
    clearTimeout(searchTimeout);
    
    // Nếu không có keyword, ẩn autocomplete
    if (!keyword) {
        hideAutocomplete();
        return;
    }

    // Debounce để tránh tìm kiếm quá nhiều
    searchTimeout = setTimeout(() => {
        const results = searchProducts(keyword);
        renderAutocomplete(results, keyword);
    }, 200);
}

// Xử lý phím điều hướng
function handleSearchKeydown(event) {
    const autocomplete = document.getElementById('searchAutocomplete');
    const items = autocomplete?.querySelectorAll('.search-autocomplete-item');
    
    if (!autocomplete || !items || items.length === 0) return;

    switch(event.key) {
        case 'ArrowDown':
            event.preventDefault();
            currentFocusIndex = (currentFocusIndex + 1) % items.length;
            updateFocus(items);
            break;
        case 'ArrowUp':
            event.preventDefault();
            currentFocusIndex = currentFocusIndex <= 0 ? items.length - 1 : currentFocusIndex - 1;
            updateFocus(items);
            break;
        case 'Enter':
            event.preventDefault();
            if (currentFocusIndex >= 0 && items[currentFocusIndex]) {
                const productId = items[currentFocusIndex].dataset.productId;
                const products = searchProducts(document.getElementById('headerSearchInput').value);
                const selectedProduct = products.find(p => (p.id || '') === productId) || products[currentFocusIndex];
                if (selectedProduct) {
                    selectProduct(selectedProduct);
                }
            } else {
                // Trigger search button
                const searchBtn = document.querySelector('.search-bar-btn');
                if (searchBtn) searchBtn.click();
            }
            break;
        case 'Escape':
            hideAutocomplete();
            break;
    }
}

// Update focus item
function updateFocus(items) {
    items.forEach((item, index) => {
        if (index === currentFocusIndex) {
            item.classList.add('active');
            item.scrollIntoView({ block: 'nearest' });
        } else {
            item.classList.remove('active');
        }
    });
}

// Initialize search autocomplete
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('headerSearchInput');
    if (!searchInput) return;

    // Event listeners
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('keydown', handleSearchKeydown);
    searchInput.addEventListener('focus', (e) => {
        const keyword = e.target.value.trim();
        if (keyword) {
            const results = searchProducts(keyword);
            renderAutocomplete(results, keyword);
        } else {
            // Hiển thị trending khi focus vào input trống
            renderAutocomplete([], '');
        }
    });

    // Ẩn autocomplete khi click bên ngoài
    document.addEventListener('click', (e) => {
        const autocomplete = document.getElementById('searchAutocomplete');
        const searchWrapper = document.querySelector('.search-bar-wrapper');
        
        if (autocomplete && searchWrapper && !searchWrapper.contains(e.target)) {
            hideAutocomplete();
        }
    });

    // Watch for products changes
    window.addEventListener('storage', (e) => {
        if (e.key === 'phonestore_products') {
            // Reload if user is typing
            const searchInput = document.getElementById('headerSearchInput');
            if (searchInput && searchInput.value.trim()) {
                const results = searchProducts(searchInput.value.trim());
                renderAutocomplete(results, searchInput.value.trim());
            }
        }
    });
});

// Export function để các file khác có thể sử dụng
window.searchProducts = searchProducts;
window.selectProduct = selectProduct;

