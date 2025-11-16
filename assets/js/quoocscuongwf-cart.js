// Import hàm addOrder từ order-local-storage
import * as orderLocal from './nt_nhan-order-local-storage.js';

// --- Hàm Global để cập nhật cart count ---
// Có thể gọi từ các file khác
window.updateCartCount = function() {
    try {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const totalQuantity = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
            cartCount.textContent = totalQuantity;
            console.log('✅ Cart count updated:', totalQuantity);
        }
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
};


// --- Hàm Global để xử lý logout ---
// Gọi từ các file khác khi user đăng xuất
window.handleCartLogout = function() {
    // Lấy user ID trước khi xóa currentUser
    const currentUser = JSON.parse(localStorage.getItem('phonestore_currentUser'));
    if (currentUser) {
        // Xóa flag đã merge cart
        localStorage.removeItem(`cart_merged_${currentUser.id}`);
    }
    
    // Xóa giỏ hàng khi đăng xuất
    localStorage.removeItem("cart");
    
    // Cập nhật cart count về 0
    window.updateCartCount();
};

// --- Chờ cho DOM sẵn sàng ---
document.addEventListener('DOMContentLoaded', () => {

    // --- Các hàm hỗ trợ ---
    window.checkLoginStatus = function() {
        const userKey = window.STORAGE_KEYS ? window.STORAGE_KEYS.CURRENT_USER : 'phonestore_currentUser';
        const user = JSON.parse(localStorage.getItem(userKey)) || null;
        console.log('🔍 Kiểm tra login status:', user ? `User ID: ${user.id}` : 'Chưa đăng nhập');
        
        if (user) {
            // Kiểm tra xem đã merge chưa (dùng flag với user ID)
            const mergeKey = `cart_merged_${user.id}`;
            const alreadyMerged = localStorage.getItem(mergeKey);
            
            console.log('🔄 Merge status:', alreadyMerged === 'true' ? 'Đã merge' : 'Chưa merge');
            
            // Nếu đã merge rồi (và flag = 'true') thì chỉ cập nhật cart count
            if (alreadyMerged === 'true') {
                console.log('✅ Đã merge cart trước đó, chỉ update count');
                window.updateCartCount();
                return;
            }
            
            let cartUser = JSON.parse(localStorage.getItem("phonestore_cart")) || [];
            console.log('📦 Cart user từ phonestore_cart:', cartUser.length, 'items');
            
            // Nếu không có cart user thì KHÔNG set flag (để có thể merge sau)
            if (cartUser.length === 0) {
                console.log('ℹ️ Không có cart user, không merge');
                window.updateCartCount();
                return;
            }
            
            let cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
            console.log('🛒 Cart hiện tại:', cart.length, 'items');
            
            // Merge cartUser vào cart, tránh trùng lặp
            cartUser.forEach(userItem => {
                // Tìm xem sản phẩm đã có trong cart chưa (so sánh name + color + memory)
                let existingProduct = cart.find(item => 
                    item.name === userItem.name &&
                    (item.color || '') === (userItem.color || '') &&
                    (item.memory || '') === (userItem.memory || '')
                );
                
                if (existingProduct) {
                    // Nếu đã có, cộng thêm số lượng
                    existingProduct.quantity = (parseInt(existingProduct.quantity) || 0) + (parseInt(userItem.quantity) || 0);
                    console.log('➕ Cộng thêm số lượng cho:', userItem.name);
                } else {
                    // Nếu chưa có, thêm mới
                    cart.push({
                        ...userItem,
                        quantity: parseInt(userItem.quantity) || 1
                    });
                    console.log('➕ Thêm mới sản phẩm:', userItem.name);
                }
            });
            
            // LƯU LẠI VÀO LOCALSTORAGE
            localStorage.setItem("cart", JSON.stringify(cart));
            console.log('💾 Đã lưu cart sau merge:', cart.length, 'items');
            
            // Xóa phonestore_cart sau khi merge
            localStorage.removeItem("phonestore_cart");
            
            // CHỈ đánh dấu đã merge khi thực sự đã merge data
            localStorage.setItem(mergeKey, 'true');
            console.log('✅ Đã đánh dấu merge hoàn tất');
            
            // Cập nhật cart count
            window.updateCartCount();
            
            // Render lại cart nếu đang ở trang giỏ hàng
            if (window.renderCartItems) {
                window.renderCartItems();
            }
        } else {
            console.log('ℹ️ Chưa đăng nhập');
            // Nếu chưa login, vẫn cập nhật cart count
            window.updateCartCount();
        }
    }
    /**
     * Lấy số lượng tồn kho của sản phẩm từ localStorage
     * @param {string} productName - Tên sản phẩm
     * @returns {number} - Số lượng tồn kho (0 nếu không tìm thấy)
     */
    function getProductStock(productName) {
        const products = JSON.parse(localStorage.getItem('phonestore_products') || '[]');
        const product = products.find(p => p.tensanpham === productName);
        if (product && product.soluong !== undefined) {
            return typeof product.soluong === 'string' ? parseInt(product.soluong) : product.soluong;
        }
        return 0; // Nếu không tìm thấy, trả về 0
    }

    /**
     * Cập nhật tổng tiền cho một hàng sản phẩm.
     * @param {HTMLElement} item - Phần tử .cart-item.
     */
    function updateItemTotal(item) {
        // Tìm các phần tử *bên trong* item cụ thể đó
        const priceElement = item.querySelector('.item-price');
        const quantityInput = item.querySelector('.item-quantity');
        const totalElement = item.querySelector('.item-total');

        if (!priceElement || !quantityInput || !totalElement) return;

        // Xử lý parse giá: loại bỏ tất cả ký tự không phải số
        // Định dạng VNĐ: "29.999.999₫" -> "29999999"
        let priceText = priceElement.textContent.replace(/[^\d]/g, '').trim();
        const price = parseFloat(priceText);
        
        // Lấy số lượng từ input
        const quantity = parseInt(quantityInput.value) || 1;
        
        // Tính thành tiền
        const total = price * quantity;
        
        // Format theo VNĐ (dùng dấu chấm để phân cách hàng nghìn)
        totalElement.textContent = `${total.toLocaleString('vi-VN')}₫`;

        // Sau khi cập nhật tổng tiền của item, cập nhật tổng tiền toàn bộ giỏ hàng
        updateCartTotal();
    }



    /**
     * Tính toán và cập nhật tổng tiền cho toàn bộ giỏ hàng.
     */
    function updateCartTotal() {
        // Tìm tất cả các tổng tiền của item hiện có trong tài liệu
        const allItemTotals = document.querySelectorAll('.cart-item .item-total');
        
        let grandTotal = 0;
        allItemTotals.forEach(totalElement => {
            // Parse giá: loại bỏ tất cả ký tự không phải số
            // Định dạng VNĐ: "29.999.999₫" -> "29999999"
            let totalText = totalElement.textContent.replace(/[^\d]/g, '').trim();
            grandTotal += parseFloat(totalText) || 0;
        });

        // Tìm phần tử hiển thị tổng tiền và cập nhật nó
        const grandTotalElement = document.getElementById('cart-grand-total');
        if (grandTotalElement) {
            grandTotalElement.textContent = `${grandTotal.toLocaleString('vi-VN')}₫`;
        }
        
        // Cập nhật tạm tính trong tóm tắt đơn hàng (user-account.html)
        const tamTinhElement = document.querySelector('.tam-tinh-price');
        if (tamTinhElement) {
            tamTinhElement.textContent = `${grandTotal.toLocaleString('vi-VN')}₫`;
        }
        
        // Cập nhật tổng cộng trong tóm tắt đơn hàng (user-account.html)
        const totalPriceElements = document.querySelectorAll('.total-price');
        // Element thứ 2 là span hiển thị giá (element đầu là div container)
        if (totalPriceElements.length > 1) {
            totalPriceElements[1].textContent = `${grandTotal.toLocaleString('vi-VN')}₫`;
        }
    }

    /**
     * Gắn event listeners cho một cart item.
     * @param {HTMLElement} item - Phần tử .cart-item.
     */
    function attachCartItemEvents(item) {
        const increaseBtn = item.querySelector('.increase');
        const decreaseBtn = item.querySelector('.decrease');
        const removeBtn = item.querySelector('.item-remove');

        if (increaseBtn) {
            increaseBtn.onclick = () => {
                const quantityInput = item.querySelector('.item-quantity');
                
                // Lấy từ data attributes - chính xác 100%
                const itemName = item.dataset.productName;
                const itemMemory = item.dataset.productMemory || '';
                const itemColor = item.dataset.productColor || '';
                
                // Kiểm tra số lượng tồn kho
                const currentQuantity = parseInt(quantityInput.value) || 1;
                const stockQuantity = getProductStock(itemName);
                
                if (currentQuantity >= stockQuantity) {
                    alert(`Số lượng tồn kho chỉ còn ${stockQuantity} sản phẩm. Không thể thêm nữa!`);
                    quantityInput.value = stockQuantity;
                    return;
                }
                
                quantityInput.value = currentQuantity + 1;
                updateItemTotal(item);
                
                // Cập nhật localStorage
                if (itemName) {
                    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
                    const product = cart.find(p => 
                        p.name === itemName &&
                        (p.memory || '') === itemMemory &&
                        (p.color || '') === itemColor
                    );
                    if (product) {
                        product.quantity = parseInt(quantityInput.value);
                        localStorage.setItem('cart', JSON.stringify(cart));
                        
                        // Cập nhật cart count
                        window.updateCartCount();
                    }
                }
            };
        }

        if (decreaseBtn) {
            decreaseBtn.onclick = () => {
                const quantityInput = item.querySelector('.item-quantity');
                
                // Lấy từ data attributes
                const itemName = item.dataset.productName;
                const itemMemory = item.dataset.productMemory || '';
                const itemColor = item.dataset.productColor || '';
                if (quantityInput.value > 1) {
                    quantityInput.value = parseInt(quantityInput.value) - 1;
                    updateItemTotal(item);
                    
                    // Cập nhật localStorage
                    if (itemName) {
                        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
                        const product = cart.find(p => 
                            p.name === itemName &&
                            (p.memory || '') === itemMemory &&
                            (p.color || '') === itemColor
                        );
                        if (product) {
                            product.quantity = parseInt(quantityInput.value);
                            localStorage.setItem('cart', JSON.stringify(cart));
                            
                            // Cập nhật cart count
                            window.updateCartCount();
                        }
                    }
                }
            };
        }

        if (removeBtn) {
            removeBtn.onclick = (e) => {
                e.preventDefault(); // Ngăn link reload trang
                
                // Lấy từ data attributes - chính xác 100%
                const itemName = item.dataset.productName;
                const itemMemory = item.dataset.productMemory || '';
                const itemColor = item.dataset.productColor || '';
                
                if (itemName) {
                    // Lấy giỏ hàng từ localStorage
                    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
                    
                    console.log('🗑️ Đang xóa:', { itemName, itemMemory, itemColor });
                    console.log('📦 Cart hiện tại:', cart);
                    
                    // Lọc bỏ sản phẩm cần xóa (so sánh name + color + memory)
                    cart = cart.filter(product => {
                        const match = product.name === itemName &&
                            (product.memory || '') === itemMemory &&
                            (product.color || '') === itemColor;
                        console.log('So sánh:', { 
                            product: { name: product.name, memory: product.memory, color: product.color },
                            searching: { itemName, itemMemory, itemColor },
                            match
                        });
                        return !match; // Giữ lại những item KHÔNG khớp
                    });
                    
                    console.log('📦 Cart sau khi xóa:', cart);
                
                    
                    // Lưu lại vào localStorage
                    localStorage.setItem('cart', JSON.stringify(cart));
                    
                    // Cập nhật cart count
                    window.updateCartCount();
                }
                
                // Xóa khỏi DOM
                item.remove();
                
                // Cập nhật tổng tiền sau khi xóa
                updateCartTotal();
            };
        }

        // Thêm event listener cho input số lượng khi người dùng nhập trực tiếp
        const quantityInput = item.querySelector('.item-quantity');
        if (quantityInput) {
            // Lấy số lượng tồn kho và set max cho input
            const itemName = item.dataset.productName;
            if (itemName) {
                const stockQuantity = getProductStock(itemName);
                if (stockQuantity > 0) {
                    quantityInput.setAttribute('max', stockQuantity);
                }
            }
            
            quantityInput.addEventListener('input', () => {
                const itemName = item.dataset.productName;
                const itemMemory = item.dataset.productMemory || '';
                const itemColor = item.dataset.productColor || '';
                const inputValue = parseInt(quantityInput.value) || 1;
                
                // Đảm bảo số lượng tối thiểu là 1
                if (inputValue < 1) {
                    quantityInput.value = 1;
                    updateItemTotal(item);
                    return;
                }
                
                // Kiểm tra số lượng tồn kho
                if (itemName) {
                    const stockQuantity = getProductStock(itemName);
                    if (stockQuantity > 0 && inputValue > stockQuantity) {
                        alert(`Số lượng tồn kho chỉ còn ${stockQuantity} sản phẩm. Vui lòng nhập số lượng không vượt quá ${stockQuantity}!`);
                        quantityInput.value = stockQuantity;
                        updateItemTotal(item);
                        
                        // Cập nhật localStorage với số lượng đã điều chỉnh
                        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
                        const product = cart.find(p => 
                            p.name === itemName &&
                            (p.memory || '') === itemMemory &&
                            (p.color || '') === itemColor
                        );
                        if (product) {
                            product.quantity = stockQuantity;
                            localStorage.setItem('cart', JSON.stringify(cart));
                            window.updateCartCount();
                        }
                        return;
                    }
                }
                
                // Cập nhật giá ngay lập tức
                updateItemTotal(item);
                
                // Cập nhật localStorage
                if (itemName) {
                    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
                    const product = cart.find(p => 
                        p.name === itemName &&
                        (p.memory || '') === itemMemory &&
                        (p.color || '') === itemColor
                    );
                    if (product) {
                        product.quantity = inputValue;
                        localStorage.setItem('cart', JSON.stringify(cart));
                        
                        // Cập nhật cart count
                        window.updateCartCount();
                    }
                }
            });
            
            // Cũng cập nhật khi blur (khi người dùng rời khỏi input)
            quantityInput.addEventListener('blur', () => {
                const itemName = item.dataset.productName;
                const inputValue = parseInt(quantityInput.value) || 1;
                
                if (inputValue < 1) {
                    quantityInput.value = 1;
                } else if (itemName) {
                    const stockQuantity = getProductStock(itemName);
                    if (stockQuantity > 0 && inputValue > stockQuantity) {
                        alert(`Số lượng tồn kho chỉ còn ${stockQuantity} sản phẩm. Đã tự động điều chỉnh về ${stockQuantity}!`);
                        quantityInput.value = stockQuantity;
                    }
                }
                updateItemTotal(item);
            });
        }

        // Cũng cập nhật tổng tiền khi tải trang (phòng trường hợp số lượng đã được điền sẵn)
        updateItemTotal(item);
    }

    // --- Logic Giỏ hàng Chính ---

    // Lấy tất cả các mục trong giỏ hàng *tại thời điểm này*
    const cartItems = document.querySelectorAll('.cart-item');

    cartItems.forEach(item => {
        attachCartItemEvents(item);
    });

    // --- Các Nút khác ---

    const deleteAllItemsBtn = document.querySelector('.delete-all-item');
    if (deleteAllItemsBtn) {
        deleteAllItemsBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Ngăn reload trang nếu là link
            
            // Xác nhận trước khi xóa tất cả
            if (confirm('Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?')) {
                // Xóa tất cả khỏi localStorage
                localStorage.removeItem('cart');
                
                // Cập nhật cart count về 0
                window.updateCartCount();
                
                // Chọn lại tất cả các mục *tại thời điểm nhấp chuột*
                const allItems = document.querySelectorAll('.cart-item');
                allItems.forEach(item => item.remove());
                
                // Cập nhật tổng tiền
                updateCartTotal();
            }
        });
    }

    // Hàm parse địa chỉ từ string sang object
    function parseAddress(addressString) {
        if (!addressString || addressString === 'Chưa cập nhật' || addressString === 'Chưa có địa chỉ') {
            return { detail: '', ward: '', district: '', province: '' };
        }
        
        // Format thường gặp: "Số nhà, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
        // Hoặc: "Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
        // Hoặc: "Quận/Huyện, Tỉnh/Thành phố"
        const parts = addressString.split(',').map(p => p.trim());
        
        if (parts.length >= 4) {
            // "Số nhà, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
            return {
                detail: parts[0] || '',
                ward: parts[1] || '',
                district: parts[2] || '',
                province: parts.slice(3).join(', ') || ''
            };
        } else if (parts.length === 3) {
            // "Phường/Xã, Quận/Huyện, Tỉnh/Thành phố" hoặc "Số nhà, Phường/Xã, Quận/Huyện"
            // Kiểm tra phần đầu có phải là số nhà không
            if (/\d/.test(parts[0])) {
                return {
                    detail: parts[0] || '',
                    ward: parts[1] || '',
                    district: parts[2] || '',
                    province: ''
                };
            } else {
                return {
                    detail: '',
                    ward: parts[0] || '',
                    district: parts[1] || '',
                    province: parts[2] || ''
                };
            }
        } else if (parts.length === 2) {
            // "Quận/Huyện, Tỉnh/Thành phố"
            return {
                detail: '',
                ward: '',
                district: parts[0] || '',
                province: parts[1] || ''
            };
        } else {
            return {
                detail: addressString,
                ward: '',
                district: '',
                province: ''
            };
        }
    }

    // Hàm populate dropdown tỉnh/thành từ vietnam-address.js
    function populateProvinces() {
        const provinceSelect = document.getElementById('tinh-thanh');
        if (!provinceSelect || typeof window.getProvinces !== 'function') return;
        
        // Chỉ populate nếu chưa có (tránh duplicate)
        if (provinceSelect.children.length > 1) {
            return; // Đã có data rồi
        }
        
        // Thêm các tỉnh/thành phố
        const provinces = window.getProvinces();
        provinces.forEach(province => {
            const option = document.createElement('option');
            option.value = province;
            option.textContent = province;
            provinceSelect.appendChild(option);
        });
    }

    // Hàm populate dropdown quận/huyện khi chọn tỉnh/thành
    function populateDistricts(province) {
        const districtSelect = document.getElementById('quan-huyen');
        if (!districtSelect) {
            console.warn('District select not found');
            return;
        }
        
        if (typeof window.getDistricts !== 'function') {
            console.error('getDistricts function not available. Make sure vietnam-address.js is loaded.');
            return;
        }
        
        // Xóa các option cũ
        districtSelect.innerHTML = '<option value="">-- Chọn Quận/Huyện --</option>';
        
        // Đảm bảo select không bị disabled
        districtSelect.disabled = false;
        districtSelect.style.pointerEvents = 'auto';
        districtSelect.style.cursor = 'pointer';
        districtSelect.style.opacity = '1';
        
        if (!province || province === '') {
            districtSelect.disabled = true;
            return;
        }
        
        const districts = window.getDistricts(province);
        if (!districts || districts.length === 0) {
            console.warn('No districts found for province:', province);
            districtSelect.disabled = true;
            return;
        }
        
        districts.forEach(district => {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            districtSelect.appendChild(option);
        });
        
        // Đảm bảo select được enable sau khi populate
        districtSelect.disabled = false;
        districtSelect.style.pointerEvents = 'auto';
        districtSelect.style.cursor = 'pointer';
        
        console.log('✅ Populated', districts.length, 'districts for province:', province);
    }

    // Hàm điền địa chỉ vào form địa chỉ mới
    function fillNewAddressForm(address) {
        const parsed = parseAddress(address);
        
        // Điền địa chỉ chi tiết
        const addressDetail = document.getElementById('address-detail');
        if (addressDetail) {
            addressDetail.value = parsed.detail;
        }
        
        // Chọn tỉnh/thành phố
        const provinceSelect = document.getElementById('tinh-thanh');
        if (provinceSelect && parsed.province) {
            // Tìm tỉnh khớp
            for (let i = 0; i < provinceSelect.options.length; i++) {
                if (provinceSelect.options[i].textContent.includes(parsed.province) || 
                    parsed.province.includes(provinceSelect.options[i].textContent)) {
                    provinceSelect.value = provinceSelect.options[i].value;
                    populateDistricts(provinceSelect.value);
                    break;
                }
            }
        }
        
        // Chọn quận/huyện (sau khi đã load)
        setTimeout(() => {
            const districtSelect = document.getElementById('quan-huyen');
            if (districtSelect && parsed.district) {
                for (let i = 0; i < districtSelect.options.length; i++) {
                    if (districtSelect.options[i].textContent.includes(parsed.district) ||
                        parsed.district.includes(districtSelect.options[i].textContent)) {
                        districtSelect.value = districtSelect.options[i].value;
                        break;
                    }
                }
            }
            
            // Điền phường/xã (nếu có) - là input text
            const wardInput = document.getElementById('phuong-xa');
            if (wardInput && parsed.ward) {
                wardInput.value = parsed.ward;
            }
        }, 100);
    }

    // ===== HỆ THỐNG QUẢN LÝ ĐỊA CHỈ =====
    
    // Lấy danh sách địa chỉ đã lưu của user
    function getUserAddresses(userId) {
        const key = `phonestore_user_addresses_${userId}`;
        const addresses = JSON.parse(localStorage.getItem(key) || '[]');
        return addresses;
    }

    // Lưu danh sách địa chỉ của user
    function saveUserAddresses(userId, addresses) {
        const key = `phonestore_user_addresses_${userId}`;
        localStorage.setItem(key, JSON.stringify(addresses));
    }

    // Thêm địa chỉ mới vào danh sách
    function addUserAddress(userId, addressData) {
        const addresses = getUserAddresses(userId);
        const newAddress = {
            id: Date.now(), // ID đơn giản
            name: addressData.name || 'Địa chỉ mới',
            fullAddress: addressData.fullAddress,
            province: addressData.province || '',
            district: addressData.district || '',
            ward: addressData.ward || '',
            detail: addressData.detail || '',
            createdAt: new Date().toISOString()
        };
        addresses.push(newAddress);
        saveUserAddresses(userId, addresses);
        return newAddress;
    }

    // Render danh sách địa chỉ đã lưu
    function renderSavedAddresses(userId) {
        const container = document.getElementById('saved-addresses-list');
        if (!container) return;

        const addresses = getUserAddresses(userId);
        const currentUser = JSON.parse(localStorage.getItem('phonestore_currentUser') || 'null');
        
        // Nếu có địa chỉ từ user.address nhưng chưa có trong danh sách, thêm vào
        if (currentUser && currentUser.address && 
            currentUser.address !== 'Chưa cập nhật' && 
            currentUser.address !== 'Chưa có địa chỉ') {
            const hasMainAddress = addresses.some(addr => addr.isMain);
            if (!hasMainAddress) {
                const parsed = parseAddress(currentUser.address);
                addresses.unshift({
                    id: 'main',
                    name: 'Địa chỉ mặc định',
                    fullAddress: currentUser.address,
                    province: parsed.province || '',
                    district: parsed.district || '',
                    ward: parsed.ward || '',
                    detail: parsed.detail || '',
                    isMain: true
                });
                saveUserAddresses(userId, addresses);
            }
        }

        container.innerHTML = '';

        if (addresses.length === 0) {
            container.innerHTML = `
                <div class="no-saved-addresses" style="padding: 12px; color: #64748b; font-size: 14px;">
                    Chưa có địa chỉ đã lưu. Vui lòng nhập địa chỉ mới.
                </div>
            `;
            return;
        }

        addresses.forEach((address, index) => {
            const addressItem = document.createElement('label');
            addressItem.className = 'custom-radio address-item';
            addressItem.style.cssText = 'display: flex; align-items: flex-start; gap: 12px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 8px; cursor: pointer; transition: all 0.2s;';
            addressItem.innerHTML = `
                <input type="radio" name="saved_address" value="${address.id}" id="address-${address.id}" ${index === 0 ? 'checked' : ''}>
                <span class="checkmark"></span>
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: #1e293b; margin-bottom: 4px;">${address.name || 'Địa chỉ ' + (index + 1)}</div>
                    <div style="color: #64748b; font-size: 14px; line-height: 1.5;">${address.fullAddress}</div>
                </div>
            `;
            
            // Hover effect
            addressItem.addEventListener('mouseenter', function() {
                this.style.borderColor = '#667eea';
                this.style.backgroundColor = '#f8fafc';
            });
            addressItem.addEventListener('mouseleave', function() {
                this.style.borderColor = '#e2e8f0';
                this.style.backgroundColor = 'transparent';
            });

            container.appendChild(addressItem);
        });
    }

    // Lấy địa chỉ đã chọn
    function getSelectedAddress(userId) {
        const selectedRadio = document.querySelector('input[name="saved_address"]:checked');
        if (!selectedRadio || selectedRadio.value === 'new') return null;

        const addresses = getUserAddresses(userId);
        const selectedAddress = addresses.find(addr => addr.id.toString() === selectedRadio.value);
        return selectedAddress ? selectedAddress.fullAddress : null;
    }

    // Khởi tạo địa chỉ form khi DOM ready (chỉ gọi một lần)
    let addressFormInitialized = false;
    function initAddressForm() {
        if (addressFormInitialized) return;
        addressFormInitialized = true;
        
        populateProvinces();
        
        // Event listener cho dropdown tỉnh/thành (sử dụng event delegation để tránh duplicate)
        document.addEventListener('change', function(e) {
            if (e.target && e.target.id === 'tinh-thanh') {
                const selectedProvince = e.target.value;
                console.log('📍 Province selected:', selectedProvince);
                
                // Reset quận/huyện và phường/xã khi đổi tỉnh
                const districtSelect = document.getElementById('quan-huyen');
                const wardInput = document.getElementById('phuong-xa');
                if (districtSelect) {
                    districtSelect.innerHTML = '<option value="">-- Chọn Quận/Huyện --</option>';
                    districtSelect.disabled = false;
                    districtSelect.style.pointerEvents = 'auto';
                    districtSelect.style.cursor = 'pointer';
                }
                if (wardInput) wardInput.value = '';
                
                // Populate quận/huyện cho tỉnh đã chọn
                if (selectedProvince) {
                    populateDistricts(selectedProvince);
                } else {
                    if (districtSelect) {
                        districtSelect.disabled = true;
                    }
                }
            }
        });
        
        // Event listener cho radio chọn địa chỉ (sử dụng event delegation)
        document.addEventListener('change', function(e) {
            if (e.target && e.target.name === 'saved_address') {
                const newAddressForm = document.getElementById('new-address-form');
                if (e.target.value === 'new') {
                    // Hiển thị form nhập địa chỉ mới
                    if (newAddressForm) {
                        newAddressForm.style.display = 'block';
                        // Bật required cho các field
                        const requiredFields = newAddressForm.querySelectorAll('[required]');
                        requiredFields.forEach(field => field.required = true);
                        
                        // Đảm bảo dropdown quận/huyện được enable
                        const districtSelect = document.getElementById('quan-huyen');
                        if (districtSelect) {
                            districtSelect.disabled = false;
                            districtSelect.style.pointerEvents = 'auto';
                            districtSelect.style.cursor = 'pointer';
                            
                            // Nếu đã có tỉnh được chọn, populate quận/huyện
                            const provinceSelect = document.getElementById('tinh-thanh');
                            if (provinceSelect && provinceSelect.value) {
                                populateDistricts(provinceSelect.value);
                            }
                        }
                    }
                } else {
                    // Ẩn form nhập địa chỉ mới
                    if (newAddressForm) {
                        newAddressForm.style.display = 'none';
                        // Tắt required cho các field
                        const requiredFields = newAddressForm.querySelectorAll('[required]');
                        requiredFields.forEach(field => field.required = false);
                    }
                }
            }
        });
    }

    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            let isLoggedIn=localStorage.getItem('phonestore_currentUser')
            if (!isLoggedIn) {
                alert('Vui lòng đăng nhập để tiếp tục thanh toán.');
                return;
            }
            let userInfoContainer = document.getElementById('user-info-container');
            let backgroundUserInfo = document.getElementsByClassName('background-user-info')[0];
            
            if (userInfoContainer) userInfoContainer.style.display = 'block';
            if (backgroundUserInfo) backgroundUserInfo.style.display = 'block';
            
            let currentUser = JSON.parse(localStorage.getItem('phonestore_currentUser'))
            
            // Refresh dropdown tỉnh/thành khi mở modal (nếu cần)
            populateProvinces();
            
            // Đảm bảo dropdown quận/huyện được enable và reset
            const districtSelect = document.getElementById('quan-huyen');
            if (districtSelect) {
                districtSelect.disabled = false;
                districtSelect.innerHTML = '<option value="">-- Chọn Quận/Huyện --</option>';
                districtSelect.style.pointerEvents = 'auto';
                districtSelect.style.cursor = 'pointer';
            }
            
            // Nếu đã có tỉnh được chọn, populate quận/huyện
            const provinceSelect = document.getElementById('tinh-thanh');
            if (provinceSelect && provinceSelect.value) {
                populateDistricts(provinceSelect.value);
            }
            
            // Render danh sách địa chỉ đã lưu
            renderSavedAddresses(currentUser.id);
            
            // Cập nhật tóm tắt đơn hàng
            updateOrderSummary();
            
            let name=document.getElementById('name')
            let phone=document.getElementById('phone')
            let email=document.getElementById('email')
            let notes=document.getElementById('notes')
            let paymentOptions=document.getElementsByName('payment_method')
            
            // Điền thông tin user
            if (name) name.value = currentUser.name || '';
            if (phone) phone.value = currentUser.phone || '';
            if (email) email.value = currentUser.email || '';
            
            // Ẩn form nhập địa chỉ mới mặc định (vì đã chọn địa chỉ từ danh sách)
            const newAddressForm = document.getElementById('new-address-form');
            if (newAddressForm) {
                newAddressForm.style.display = 'none';
            }
        });
    }

    // Hàm cập nhật tóm tắt đơn hàng
    function updateOrderSummary() {
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        let totalAmount = 0;
        
        cartItems.forEach(item => {
            const price = parseFloat(item.price) || 0;
            const quantity = parseInt(item.quantity) || 1;
            totalAmount += price * quantity;
        });
        
        // Format tiền Việt Nam
        function formatPrice(price) {
            return new Intl.NumberFormat('vi-VN').format(price) + '₫';
        }
        
        const tamTinhEl = document.querySelector('.tam-tinh-price');
        const totalPriceEl = document.querySelector('.checkout-right .total-price');
        
        if (tamTinhEl) tamTinhEl.textContent = formatPrice(totalAmount);
        if (totalPriceEl) totalPriceEl.textContent = formatPrice(totalAmount);
    }

    // Nút Hủy
    const cancelCheckoutBtn = document.getElementById('cancel-checkout-btn');
    if (cancelCheckoutBtn) {
        cancelCheckoutBtn.addEventListener('click', () => {
            const backgroundUserInfo = document.getElementById('background-user-info');
            const userInfoContainer = document.getElementById('user-info-container');
            if (backgroundUserInfo) backgroundUserInfo.style.display = 'none';
            if (userInfoContainer) userInfoContainer.style.display = 'none';
        });
    }

    // Nút Tiếp tục
    const continueCheckoutBtn = document.getElementById('continue-checkout-btn');
    if (continueCheckoutBtn) {
        continueCheckoutBtn.addEventListener('click', () => {
            // Validate form trước khi tiếp tục
            const form = document.getElementById('checkout-form');
            if (!form) return;
            
            // Kiểm tra địa chỉ
            const selectedRadio = document.querySelector('input[name="saved_address"]:checked');
            if (!selectedRadio) {
                alert('Vui lòng chọn địa chỉ giao hàng.');
                return;
            }
            
            if (selectedRadio.value === 'new') {
                // Validate form địa chỉ mới
                const tinhThanh = document.getElementById('tinh-thanh')?.value;
                const quanHuyen = document.getElementById('quan-huyen')?.value;
                const phuongXa = document.getElementById('phuong-xa')?.value.trim();
                const addressDetail = document.getElementById('address-detail')?.value.trim();
                
                if (!tinhThanh || !quanHuyen || !phuongXa || !addressDetail) {
                    alert('Vui lòng điền đầy đủ thông tin địa chỉ giao hàng.');
                    return;
                }
            }
            
            // Validate thông tin cá nhân
            const name = document.getElementById('name')?.value.trim();
            const phone = document.getElementById('phone')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            
            if (!name || !phone || !email) {
                alert('Vui lòng điền đầy đủ thông tin cá nhân.');
                return;
            }
            
            // Nếu đã validate xong, gọi submitCheckout
            submitCheckout();
        });
    }
    function submitCheckout(e){
        if (e) e.preventDefault();
        
        // Validation: Kiểm tra giỏ hàng
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
        if (cartItems.length === 0) {
            alert('Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi thanh toán.');
            return;
        }

        // Validation: Kiểm tra đăng nhập
        const currentUser = JSON.parse(localStorage.getItem('phonestore_currentUser') || 'null');
        if (!currentUser || !currentUser.id) {
            alert('Vui lòng đăng nhập để tiếp tục thanh toán.');
            return;
        }

        // Lấy địa chỉ từ form
        let address = '';
        const selectedRadio = document.querySelector('input[name="saved_address"]:checked');
        
        if (!selectedRadio) {
            alert('Vui lòng chọn địa chỉ giao hàng.');
            return;
        }

        if (selectedRadio.value === 'new') {
            // Lấy địa chỉ từ form nhập mới
            let tinhThanhEl = document.getElementById('tinh-thanh');
            let quanHuyenEl = document.getElementById('quan-huyen');
            let phuongXaEl = document.getElementById('phuong-xa');
            let addressDetailEl = document.getElementById('address-detail');
            
            let tinhThanh = tinhThanhEl ? tinhThanhEl.value : '';
            let quanHuyen = quanHuyenEl ? quanHuyenEl.value : '';
            let phuongXa = phuongXaEl ? phuongXaEl.value.trim() : '';
            let addressDetail = addressDetailEl ? addressDetailEl.value.trim() : '';

            // Validation địa chỉ mới
            if (!tinhThanh || !quanHuyen || !phuongXa || !addressDetail) {
                alert('Vui lòng điền đầy đủ thông tin địa chỉ giao hàng.');
                return;
            }

            // Xây dựng địa chỉ đầy đủ theo format: "Số nhà, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
            let addressParts = [];
            if (addressDetail) addressParts.push(addressDetail);
            if (phuongXa) addressParts.push(phuongXa);
            if (quanHuyen) addressParts.push(quanHuyen);
            if (tinhThanh) addressParts.push(tinhThanh);
            
            address = addressParts.join(', ');

            // Nếu user chọn lưu địa chỉ này
            const saveAddressCheckbox = document.getElementById('save-address-checkbox');
            if (saveAddressCheckbox && saveAddressCheckbox.checked) {
                const addressName = document.getElementById('address-name')?.value.trim() || 'Địa chỉ mới';
                addUserAddress(currentUser.id, {
                    name: addressName,
                    fullAddress: address,
                    province: tinhThanh,
                    district: quanHuyen,
                    ward: phuongXa,
                    detail: addressDetail
                });
            }
        } else {
            // Lấy địa chỉ từ danh sách đã lưu
            address = getSelectedAddress(currentUser.id);
            if (!address) {
                alert('Không tìm thấy địa chỉ đã chọn.');
                return;
            }
        }

        // Lấy thông tin user và payment
        const customer_id = currentUser.id;
        const paymentOptions = document.getElementsByName('payment_method');
        const notesElement = document.getElementById('notes');
        const paymentMethodValue = Array.from(paymentOptions).find(option => option.checked)?.value || 'cod';
        const notes = notesElement ? notesElement.value : '';
        
        // Map payment method sang tiếng Việt
        const paymentMethodMap = {
            'cod': 'Tiền mặt khi giao hàng',
            'momo': 'Ví điện tử',
            'card': 'Chuyển khoản ngân hàng',
            'bank': 'Chuyển khoản ngân hàng'
        };
        const paymentMethod = paymentMethodMap[paymentMethodValue] || paymentMethodValue;
        
        // Tính tổng tiền từ cart
        let totalAmount = 0;
        cartItems.forEach(item => {
            const price = parseFloat(item.price) || 0;
            const quantity = parseInt(item.quantity) || 1;
            totalAmount += price * quantity;
        });
        let product_list = [];
        cartItems.forEach(item => {
            let product_id = null;
            JSON.parse(localStorage.getItem('phonestore_products') || '[]').forEach(product => {
                if (product.tensanpham === item.name) {
                    // Lấy ID sản phẩm
                    product_id = product.id;
                }
            });
            product_list.push([
                product_id,
                item.quantity
            ]);
        });
        // Format date sang định dạng dd/mm/yyyy HH:mm
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
        
        // Tạo orderId TRƯỚC khi tạo đơn hàng
        let orderId;
        if (typeof window.generateOrderId === 'function') {
            orderId = window.generateOrderId();
        } else {
            // Fallback: tạo orderId tạm
            orderId = `ORD${Date.now()}`;
            localStorage.setItem('lastCreatedOrderId', orderId);
        }
        
        // Xóa giỏ hàng sau khi đặt hàng thành công
        let orderItem = {
            date: formattedDate,
            address: address,
            customer_id: customer_id, 
            amount: totalAmount,
            purchase: paymentMethod,
            product_list: product_list,
            order_id: orderId
        }
        
        // Gọi hàm addOrder để thêm đơn hàng vào hệ thống
        if (typeof window.addOrder === 'function') {
            window.addOrder(
                orderItem.date,
                orderItem.address,
                orderItem.customer_id,
                orderItem.amount,
                orderItem.purchase,
                orderItem.product_list
            );
        } else if (typeof orderLocal !== 'undefined' && typeof orderLocal.addOrder === 'function') {
            orderLocal.addOrder(
                orderItem.date,
                orderItem.address,
                orderItem.customer_id,
                orderItem.amount,
                orderItem.purchase,
                orderItem.product_list
            );
        }

        
        // Lưu giỏ hàng hiện tại trước khi xóa (để hiển thị trong modal)
        const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
        localStorage.setItem('lastOrderCart', JSON.stringify(currentCart));
        
        localStorage.removeItem('cart');

        // Lưu đơn hàng cuối cùng để hiển thị ở trang xác nhận
        localStorage.setItem('lastOrder', JSON.stringify(orderItem));
        
        let userInfoContainer = document.getElementById('user-info-container');
        let backgroundUserInfo = document.getElementsByClassName('background-user-info')[0];
        if (userInfoContainer) userInfoContainer.style.display = 'none';
        if (backgroundUserInfo) backgroundUserInfo.style.display = 'none';
        
        // Cập nhật cart count về 0
        window.updateCartCount();
        
        // Render lại cart để hiển thị trống
        renderCartItems();
        
        // Hiển thị modal thông báo thành công (với delay nhỏ để đảm bảo DOM đã render)
        setTimeout(() => {
            if (typeof window.showOrderSuccessModal === 'function') {
                window.showOrderSuccessModal();
            } else {
                console.warn('Hàm showOrderSuccessModal chưa được load');
                // Fallback: reload trang nếu chưa có modal
                location.reload();
            }
        }, 300);
    }
    // Nút đóng checkout
    const closeCheckoutBtn = document.getElementById('close-checkout-btn');
    if (closeCheckoutBtn) {
        closeCheckoutBtn.addEventListener('click', () => {
            let userInfoContainer = document.getElementById('user-info-container');
            let backgroundUserInfo = document.getElementsByClassName('background-user-info')[0];
            
            if (userInfoContainer) userInfoContainer.style.display = 'none';
            if (backgroundUserInfo) backgroundUserInfo.style.display = 'none';
        });
    }

    // Đóng khi click vào background overlay
    const backgroundUserInfo = document.getElementsByClassName('background-user-info')[0];
    if (backgroundUserInfo) {
        backgroundUserInfo.addEventListener('click', (e) => {
            // Chỉ đóng khi click vào background, không phải vào form
            if (e.target === backgroundUserInfo) {
                let userInfoContainer = document.getElementById('user-info-container');
                
                if (userInfoContainer) userInfoContainer.style.display = 'none';
                backgroundUserInfo.style.display = 'none';
            }
        });
    }

    function getDataToAddToCart(card){
        console.log(card);
        let img=card.querySelector('.product-img').src;
        let name=card.querySelector('.product-name').innerText;
        let priceText=card.querySelector('.product-price').innerText;
        let price=parseFloat(priceText.replace('₫','').replace(/\./g,''));
        
        // Lấy giỏ hàng từ localStorage hoặc tạo mới nếu chưa có
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        
        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa (không có color/memory)
        let existingProduct = cart.find(item => 
            item.name === name && 
            !item.color && 
            !item.memory
        );
        
        if (existingProduct) {
            // Nếu sản phẩm đã có, tăng số lượng lên 1
            existingProduct.quantity += 1;
        } else {
            // Nếu sản phẩm chưa có, thêm mới vào giỏ hàng
            cart.push({ img, name, price, quantity: 1 });
        }
        
        // Lưu giỏ hàng vào localStorage
        
        // Cập nhật cart count
        window.updateCartCount();
        
        // Render lại cart items (nếu đang ở trang giỏ hàng)
        renderCartItems();
    }


    function renderCartItems() {
        let cartContainer = document.querySelector('.items-container');
        
        // Kiểm tra nếu không có container (không phải trang giỏ hàng) thì return
        if (!cartContainer) {
            return;
        }
        
        // XÓA TẤT CẢ ITEMS CŨ TRƯỚC KHI RENDER LẠI
        const oldItems = cartContainer.querySelectorAll('.cart-item');
        oldItems.forEach(item => item.remove());
        
        let cartString = localStorage.getItem('cart');
        let carts = JSON.parse(cartString || '[]');
        
        // Chuẩn hóa dữ liệu cart: chỉ đảm bảo price là string và quantity là number
        // KHÔNG thay đổi color/memory để tránh ghi đè dữ liệu
        carts = carts.map(item => ({
            ...item,
            price: typeof item.price === 'number' ? item.price.toString() : item.price,
            quantity: parseInt(item.quantity) || 1
        }));
        
        // Lưu lại cart đã chuẩn hóa
         console.log('🛒 Giỏ hàng đã được chuẩn hóa trước khi render:', carts);
        localStorage.setItem('cart', JSON.stringify(carts));
        
        for(let i=0;i<carts.length;i++){
            let itemCart=document.createElement('div');
            itemCart.classList.add('cart-item');
            
            // Lưu data attributes để dễ lấy khi xóa/update
            itemCart.dataset.productName = carts[i].name;
            itemCart.dataset.productMemory = carts[i].memory || '';
            itemCart.dataset.productColor = carts[i].color || '';
            
            console.log(carts[i]);
            
            // Tạo phần thông tin chi tiết (màu, bộ nhớ)
            let itemDetails = '';
            if (carts[i].color || carts[i].memory) {
                itemDetails = '<div class="item-details-info">';
                if (carts[i].memory) {
                    itemDetails += `<span class="item-memory"><i class="fa-solid fa-microchip"></i> ${carts[i].memory}</span>`;
                }
                if (carts[i].color) {
                    itemDetails += `<span class="item-color"><i class="fa-solid fa-palette"></i> ${carts[i].color}</span>`;
                }
                itemDetails += '</div>';
            }
            
            // Lấy số lượng tồn kho để set max cho input
            const stockQuantity = getProductStock(carts[i].name);
            const maxAttr = stockQuantity > 0 ? `max="${stockQuantity}"` : '';
            
            itemCart.innerHTML=`
                <div class="item-name-container cart-col product">
                    <div class="item-image">
                        <img src="${carts[i].img}" alt="${carts[i].name}">
                    </div>
                    <div class="item-info-wrapper">
                        <div class="item-name">${carts[i].name}</div>
                        ${itemDetails}
                    </div>
                </div>
                <div class="item-price cart-col price">${parseFloat(carts[i].price).toLocaleString('vi-VN')}₫</div>
                <div class="item-quantity-container cart-col quantity">
                    <div style="display: flex;">
                        <span class="decrease">-</span>
                        <input type="number" class="item-quantity" value="${carts[i].quantity}" min="1" ${maxAttr}>
                        <span class="increase">+</span>
                    </div>

                </div>
                <div class="item-total cart-col total">${(parseFloat(carts[i].price) * parseInt(carts[i].quantity)).toLocaleString('vi-VN')}₫</div>
                <div class="item-remove cart-col action">
                    <a href=""><img src="assets/images/icons/recycle-bin.png" alt=""></a>
                </div>`;
            cartContainer.appendChild(itemCart);
            
            // GẮN EVENT LISTENERS CHO ITEM VỪA TẠO
            attachCartItemEvents(itemCart);
        }
        
        // Cập nhật tổng tiền sau khi render tất cả items
        updateCartTotal();
    }

    // Export renderCartItems as global function
    window.renderCartItems = renderCartItems;

    // Biến này đã được khai báo nhưng không được sử dụng trong code gốc của bạn
    // var listItemCart; 

    const productCard = document.getElementsByClassName('product-card');
    if (productCard && productCard.length > 0) {
        Array.from(productCard).forEach((card) => {
            const btnCart = card.querySelector('.btn-cart');
            if (btnCart) {
                btnCart.addEventListener('click', () => {
                    getDataToAddToCart(card);
                });
            }
        });
    }
    let submitCheckoutBtn = document.getElementById('submit-checkout');
    if (submitCheckoutBtn){
        submitCheckoutBtn.addEventListener('click', submitCheckout);
    }
    
    renderCartItems();
    
    // Cập nhật cart count khi trang load
    window.updateCartCount();
    checkLoginStatus();
    
    // Khởi tạo form địa chỉ ngay khi DOM ready (để các event listener được gắn sẵn)
    setTimeout(() => {
        initAddressForm();
    }, 100);
    
    // Lắng nghe sự kiện thay đổi localStorage từ tab khác
    window.addEventListener('storage', function(e) {
        // Xử lý khi có thay đổi trong 'cart'
        if (e.key === 'cart') {
            console.log('Cart đã được cập nhật từ tab khác');
            
            // Render lại cart items
            renderCartItems();
            
            // Cập nhật cart count
            window.updateCartCount();
        }
        
        // Xử lý khi user logout (currentUser bị xóa)
        if (e.key === 'phonestore_currentUser' && e.newValue === null) {
            console.log('User đã đăng xuất');
            
            // Gọi hàm xử lý logout
            if (window.handleCartLogout) {
                window.handleCartLogout();
            }
            
            // Render lại cart (sẽ rỗng)
            renderCartItems();
        }
    });
    
    // Lắng nghe sự kiện logout trong cùng tab
    const originalRemoveItem = localStorage.removeItem;
    localStorage.removeItem = function(key) {
        if (key === 'phonestore_currentUser') {
            console.log('User đăng xuất trong cùng tab');
            
            // Gọi hàm xử lý logout
            if (window.handleCartLogout) {
                window.handleCartLogout();
            }
            
            // Gọi hàm removeItem gốc
            originalRemoveItem.apply(this, arguments);
            
            // Render lại cart
            setTimeout(() => {
                if (window.renderCartItems) {
                    window.renderCartItems();
                }
            }, 0);
        } else {
            // Gọi hàm removeItem gốc cho các key khác
            originalRemoveItem.apply(this, arguments);
        }
    };
});

