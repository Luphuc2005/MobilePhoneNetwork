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
     * Cập nhật tổng tiền cho một hàng sản phẩm.
     * @param {HTMLElement} item - Phần tử .cart-item.
     */
    function updateItemTotal(item) {
        // Tìm các phần tử *bên trong* item cụ thể đó
        const priceElement = item.querySelector('.item-price');
        const quantityInput = item.querySelector('.item-quantity');
        const totalElement = item.querySelector('.item-total');

        if (!priceElement || !quantityInput || !totalElement) return;

        // Xử lý cả định dạng $ và ₫
        let priceText = priceElement.textContent.replace(/[$₫,.]/g, '').trim();
        const price = parseFloat(priceText);
        const quantity = parseInt(quantityInput.value) || 1;
        
        // Format theo VNĐ
        totalElement.textContent = `${(price * quantity).toLocaleString('vi-VN')}₫`;

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
            // Xử lý cả định dạng $ và ₫
            let totalText = totalElement.textContent.replace(/[$₫,.]/g, '').trim();
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
                
                quantityInput.value = parseInt(quantityInput.value) + 1;
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
            
            let name=document.getElementById('name')
            let phone=document.getElementById('phone')
            let email=document.getElementById('email')
            let savedAddress=document.getElementById('address1-detail')
            let notes=document.getElementById('notes')
            let paymentOptions=document.getElementsByName('payment-options')
            let currentUser=JSON.parse(localStorage.getItem('phonestore_currentUser'))
            name.value=currentUser.name
            phone.value=currentUser.phone
            email.value=currentUser.email
            savedAddress.innerText=currentUser.address

        });
    }
    function submitCheckout(){
        alert("Đơn hàng của bạn đã được đặt thành công! Cảm ơn bạn đã mua hàng.");
        let lastOrder=localStorage.getItem('lastOrder')
        if (lastOrder){
            localStorage.removeItem('lastOrder')
        }
        let paymentOptions=document.getElementsByName('payment_method') // Sửa name cho đúng
        let notesElement=document.getElementById('notes')
        let address='';     
        let address1=document.getElementById('address1')
        if (address1.checked){
            address=document.getElementById('address1-detail').innerText
        } else {    
            let tinhThanh=document.getElementById('tinh-thanh').value
            let quanHuyen=document.getElementById('quan-huyen').value
            let phuongXa=document.getElementById('phuong-xa').value
            let addressDetail=document.getElementById('address-detail').value

            address=`${addressDetail}, ${phuongXa}, ${quanHuyen}, ${tinhThanh}`
        }

        // Lấy thông tin user hiện tại
        const customer_id = JSON.parse(localStorage.getItem('phonestore_currentUser')).id;
        const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
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
                        <span class="increase">+</span>
                        <input type="number" class="item-quantity" value="${carts[i].quantity}" min="1">
                        <span class="decrease">-</span>
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

