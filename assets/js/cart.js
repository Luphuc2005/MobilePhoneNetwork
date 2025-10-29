// --- Chờ cho DOM sẵn sàng ---
document.addEventListener('DOMContentLoaded', () => {

    // --- Các hàm hỗ trợ ---

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
            increaseBtn.addEventListener('click', () => {
                const quantityInput = item.querySelector('.item-quantity');
                const itemName = item.querySelector('.item-name')?.textContent.trim();
                
                quantityInput.value = parseInt(quantityInput.value) + 1;
                updateItemTotal(item);
                
                // Cập nhật localStorage
                if (itemName) {
                    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
                    const product = cart.find(p => p.name === itemName);
                    if (product) {
                        product.quantity = parseInt(quantityInput.value);
                        localStorage.setItem('cart', JSON.stringify(cart));
                        
                        // Cập nhật cart count
                        const cartCount = document.querySelector('.cart-count');
                        if (cartCount) {
                            const total = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
                            cartCount.textContent = total;
                        }
                    }
                }
            });
        }

        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', () => {
                const quantityInput = item.querySelector('.item-quantity');
                const itemName = item.querySelector('.item-name')?.textContent.trim();
                
                if (quantityInput.value > 1) {
                    quantityInput.value = parseInt(quantityInput.value) - 1;
                    updateItemTotal(item);
                    
                    // Cập nhật localStorage
                    if (itemName) {
                        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
                        const product = cart.find(p => p.name === itemName);
                        if (product) {
                            product.quantity = parseInt(quantityInput.value);
                            localStorage.setItem('cart', JSON.stringify(cart));
                            
                            // Cập nhật cart count
                            const cartCount = document.querySelector('.cart-count');
                            if (cartCount) {
                                const total = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
                                cartCount.textContent = total;
                            }
                        }
                    }
                }
            });
        }

        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Ngăn link reload trang
                
                // Lấy tên sản phẩm từ item để xóa khỏi localStorage
                const itemName = item.querySelector('.item-name')?.textContent.trim();
                
                if (itemName) {
                    // Lấy giỏ hàng từ localStorage
                    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
                    
                    // Lọc bỏ sản phẩm cần xóa
                    cart = cart.filter(product => product.name !== itemName);
                    
                    // Lưu lại vào localStorage
                    localStorage.setItem('cart', JSON.stringify(cart));
                    
                    // Cập nhật cart count nếu có
                    const cartCount = document.querySelector('.cart-count');
                    if (cartCount) {
                        const total = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
                        cartCount.textContent = total;
                    }
                }
                
                // Xóa khỏi DOM
                item.remove();
                
                // Cập nhật tổng tiền sau khi xóa
                updateCartTotal();
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
                const cartCount = document.querySelector('.cart-count');
                if (cartCount) {
                    cartCount.textContent = '0';
                }
                
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
            let userInfoContainer = document.getElementById('user-info-container');
            let backgroundUserInfo = document.getElementsByClassName('background-user-info')[0];
            
            if (userInfoContainer) userInfoContainer.style.display = 'block';
            if (backgroundUserInfo) backgroundUserInfo.style.display = 'block';
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
        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        let existingProduct = cart.find(item => item.name === name);
        if (existingProduct) {
            // Nếu sản phẩm đã có, tăng số lượng lên 1
            existingProduct.quantity += 1;
        } else {
            // Nếu sản phẩm chưa có, thêm mới vào giỏ hàng
            cart.push({ img, name, price, quantity: 1 });
        }
        // Lưu giỏ hàng vào localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    //render product detail from product card
    function renderProductDetail() {
        let cartString=localStorage.getItem('cart');
        let carts=JSON.parse(cartString || '[]');
        for(let i=0;i<carts.length;i++){
            let cartContainer=document.querySelector('.items-container');
            let itemCart=document.createElement('div');
            itemCart.classList.add('cart-item');
            console.log(carts[i]);
            itemCart.innerHTML=`
                <div class="item-name-container cart-col product">
                    <div class="item-image">
                        <img src="${carts[i].img}" alt="${carts[i].name}">
                    </div>
                    <div class="item-name">${carts[i].name}</div>
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

    // Biến này đã được khai báo nhưng không được sử dụng trong code gốc của bạn
    // var listItemCart; 

    const productCard=document.getElementsByClassName('product-card');
    Array.from(productCard).forEach((card) => {
        const btnCart=card.querySelector('.btn-cart');
        btnCart.addEventListener('click', () => {
            getDataToAddToCart(card);
        });
    });
    renderProductDetail();
});

