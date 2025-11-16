/**
 * Script hiển thị thông tin đơn hàng sau khi đặt hàng thành công
 * Đọc dữ liệu từ localStorage 'lastOrder' và hiển thị modal
 */

// Hàm format giá tiền
function formatPrice(price) {
    if (typeof price === 'string') {
        price = parseFloat(price.replace(/\./g, ''));
    }
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Hàm format ngày tháng
function formatDate(dateString) {
    // Kiểm tra nếu dateString không tồn tại hoặc rỗng
    if (!dateString) {
        return '--';
    }
    
    // Kiểm tra nếu dateString đã ở định dạng dd/mm/yyyy HH:mm
    // Ví dụ: "25/12/2024 14:30"
    const dateTimePattern = /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})$/;
    const match = dateString.match(dateTimePattern);
    
    if (match) {
        // Đã ở định dạng đúng, chỉ cần thay đổi format hiển thị
        const [, day, month, year, hours, minutes] = match;
        return `${day}/${month}/${year} lúc ${hours}:${minutes}`;
    }
    
    // Nếu không phải định dạng trên, thử parse như Date object hoặc ISO string
    const date = new Date(dateString);
    
    // Kiểm tra nếu date hợp lệ
    if (isNaN(date.getTime())) {
        // Nếu không parse được, trả về chuỗi gốc hoặc '--'
        return dateString || '--';
    }
    
    // Format từ Date object
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}/${month}/${year} lúc ${hours}:${minutes}`;
}

// Hàm tạo Order ID ngẫu nhiên
function generateOrderId() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD${timestamp}${random}`;
}

// Hàm chuyển đổi tên phương thức thanh toán
function getPaymentMethodName(method) {
    const methods = {
        'cod': 'Thanh toán khi nhận hàng (COD)',
        'momo': 'Ví điện tử MoMo',
        'card': 'Thẻ tín dụng/Ghi nợ',
        'bank': 'Chuyển khoản ngân hàng'
    };
    return methods[method] || method;
}

// Hàm render danh sách sản phẩm
function renderProducts(cart) {
    const productsList = document.getElementById('products-list');
    if (!productsList || !cart || cart.length === 0) {
        productsList.innerHTML = '<p style="text-align: center; color: #6B7280; padding: 20px;">Không có sản phẩm</p>';
        return;
    }
    
    let html = '';
    cart.forEach(item => {
        const itemTotal = (parseFloat(item.price) * parseInt(item.quantity));
        
        // Hiển thị thông tin chi tiết (màu, bộ nhớ) nếu có
        let detailsHtml = '';
        if (item.color || item.memory) {
            const details = [];
            if (item.memory) details.push(item.memory);
            if (item.color) details.push(item.color);
            detailsHtml = `<div class="product-item-details">${details.join(' • ')}</div>`;
        }
        
        html += `
            <div class="product-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="product-item-info">
                    <div class="product-item-name">${item.name}</div>
                    ${detailsHtml}
                </div>
                <div class="product-item-quantity">x${item.quantity}</div>
                <div class="product-item-price">${formatPrice(itemTotal)}</div>
            </div>
        `;
    });
    
    productsList.innerHTML = html;
}

// Hàm hiển thị modal thông tin đơn hàng
function showOrderSuccessModal() {
    console.log('🎉 showOrderSuccessModal() được gọi');
    
    // Lấy dữ liệu đơn hàng từ localStorage
    const lastOrderString = localStorage.getItem('lastOrder');
    
    if (!lastOrderString) {
        console.log('❌ Không có đơn hàng mới (lastOrder = null)');
        return;
    }
    
    console.log('✅ Tìm thấy lastOrder:', lastOrderString);
    
    try {
        const orderData = JSON.parse(lastOrderString);
        console.log('📦 Order Data:', orderData);
        
        // Lấy thông tin giỏ hàng từ lastOrderCart (đã lưu trước khi xóa cart)
        let cart = JSON.parse(localStorage.getItem('lastOrderCart') || '[]');
        
        // Fallback: nếu không có lastOrderCart, thử lấy từ cart
        if (cart.length === 0) {
            cart = JSON.parse(localStorage.getItem('cart') || '[]');
        }
        
        // Lấy thông tin user
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        
        // Lấy Order ID từ localStorage (đã được tạo trước khi gọi addOrder)
        let orderId = localStorage.getItem('lastCreatedOrderId');
        
        // Nếu không có orderId, tạo ID tạm để hiển thị (không lưu vào hệ thống)
        if (!orderId) {
            orderId = generateOrderId();
        }
        
        // Cập nhật thông tin vào modal
        document.getElementById('order-id').textContent = orderId;
        
        // Thông tin người nhận (ưu tiên từ orderData, fallback sang currentUser)
        document.getElementById('customer-name').textContent = currentUser.hoten || 'Khách hàng';
        document.getElementById('customer-phone').textContent = currentUser.sodienthoai || '--';
        document.getElementById('customer-email').textContent = currentUser.email || '--';
        
        // Địa chỉ giao hàng
        document.getElementById('delivery-address').textContent = orderData.address || '--';
        
        // Phương thức thanh toán
        document.getElementById('payment-method').textContent = getPaymentMethodName(orderData.purchase);
        
        // Ngày đặt hàng
        document.getElementById('order-date').textContent = formatDate(orderData.date);
        
        // Render danh sách sản phẩm
        renderProducts(cart);
        
        // Tính tổng tiền
        const totalAmount = parseFloat(orderData.amount) || 0;
        document.getElementById('subtotal-amount').textContent = formatPrice(totalAmount);
        document.getElementById('total-amount').textContent = formatPrice(totalAmount);
        
        // Hiển thị modal
        const modal = document.getElementById('order-success-modal');
        if (modal) {
            console.log('✅ Tìm thấy modal, đang hiển thị...');
            modal.style.display = 'flex';
            console.log('🎊 Modal đã được hiển thị!');
            
            // Xóa lastOrder và lastOrderCart sau khi hiển thị (tránh hiển thị lại khi reload)
            // localStorage.removeItem('lastOrder');
            // localStorage.removeItem('lastOrderCart');
        } else {
            console.error('❌ Không tìm thấy element #order-success-modal');
        }
        
    } catch (error) {
        console.error('Lỗi khi hiển thị thông tin đơn hàng:', error);
    }
}

// Hàm đóng modal
function closeOrderModal() {
    const modal = document.getElementById('order-success-modal');
    if (modal) {
        modal.style.display = 'none';
        
        // Xóa lastOrder và lastOrderCart khi đóng modal
        localStorage.removeItem('lastOrder');
        localStorage.removeItem('lastOrderCart');
        
        // Render lại cart (đã trống)
        if (typeof renderCartItems === 'function') {
            renderCartItems();
        }
    }
}

function continueShopping() {
    console.log('🛒 Tiếp tục mua hàng được nhấn');
    closeOrderModal();
    window.location.href = 'index.html'; // Chuyển hướng về trang chủ hoặc trang sản phẩm
}

// Hàm in đơn hàng
function printOrder() {
    // Lưu trạng thái scroll hiện tại
    const scrollPos = window.scrollY;
    
    // Thực hiện in
    window.print();
    
    // Khôi phục vị trí scroll sau khi in (nếu người dùng hủy in)
    setTimeout(() => {
        window.scrollTo(0, scrollPos);
    }, 100);
}

// Click overlay để đóng modal
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('order-success-overlay')) {
        closeOrderModal();
    }
});

// Kiểm tra và hiển thị modal khi trang load
window.addEventListener('load', function() {
    console.log('📄 Trang user-account đã load xong');
    
    // Chỉ hiển thị modal nếu có lastOrder trong localStorage
    const lastOrder = localStorage.getItem('lastOrder');
    console.log('🔍 Kiểm tra lastOrder:', lastOrder ? 'Có' : 'Không');
    
    if (lastOrder) {
        // Delay một chút để đảm bảo trang đã load xong
        console.log('⏳ Đợi 500ms trước khi hiển thị modal...');
        setTimeout(() => {
            showOrderSuccessModal();
        }, 500);
    }
});

// Export hàm để có thể gọi từ nơi khác
if (typeof window !== 'undefined') {
    window.showOrderSuccessModal = showOrderSuccessModal;
    window.closeOrderModal = closeOrderModal;
    window.printOrder = printOrder;
    console.log('✅ Các hàm order success đã được export vào window');
}
