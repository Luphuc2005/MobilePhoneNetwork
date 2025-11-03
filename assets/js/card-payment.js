// Card Payment Form Logic
document.addEventListener('DOMContentLoaded', function() {
    
    const closeBtn = document.getElementById('close-user-info');
            const backgroundUserInfo = document.querySelector('.background-user-info');
            
            if (closeBtn && backgroundUserInfo) {
                closeBtn.addEventListener('click', function() {
                    backgroundUserInfo.style.display = 'none';
                    // Reset form khi đóng
                    const form = document.getElementById('checkout-form');
                    if (form) {
                        form.reset();
                    }
                    // Ẩn các form phụ
                    const newAddressForm = document.querySelector('.new-address-form');
                    const cardPaymentForm = document.querySelector('.card-payment-form');
                    if (newAddressForm) newAddressForm.style.display = 'none';
                    if (cardPaymentForm) cardPaymentForm.style.display = 'none';
                });
                
                // Đóng khi click vào background (ngoài form)
                backgroundUserInfo.addEventListener('click', function(e) {
                    if (e.target === backgroundUserInfo) {
                        closeBtn.click(); // Trigger nút close
                    }
                });
            }
            
            // ===== XỬ LÝ ẨN/HIỆN FORM ĐỊA CHỈ MỚI =====
            const savedAddressRadios = document.querySelectorAll('input[name="saved_address"]');
            const newAddressForm = document.querySelector('.new-address-form');
            const newAddressInputs = newAddressForm.querySelectorAll('input, select');
            
            savedAddressRadios.forEach(radio => {
                radio.addEventListener('change', function() {
                    if (this.value === 'new') {
                        // Hiển thị form địa chỉ mới
                        newAddressForm.style.display = 'block';
                        // Bật required cho các field
                        newAddressInputs.forEach(input => {
                            if (input.id === 'tinh-thanh' || input.id === 'quan-huyen' || 
                                input.id === 'phuong-xa' || input.id === 'address-detail') {
                                input.required = true;
                            }
                        });
                    } else {
                        // Ẩn form địa chỉ mới
                        newAddressForm.style.display = 'none';
                        // Tắt required cho các field
                        newAddressInputs.forEach(input => {
                            input.required = false;
                        });
                    }
                });
            });

            // ===== XỬ LÝ ẨN/HIỆN FORM THÔNG TIN THẺ =====
            const paymentMethodRadios = document.querySelectorAll('input[name="payment_method"]');
            const cardPaymentForm = document.querySelector('.card-payment-form');
            const cardInputs = cardPaymentForm.querySelectorAll('input');
            
            paymentMethodRadios.forEach(radio => {
                radio.addEventListener('change', function() {
                    if (this.value === 'card') {
                        // Hiển thị form nhập thẻ
                        cardPaymentForm.style.display = 'block';
                        // Bật required cho các field thẻ
                        cardInputs.forEach(input => {
                            input.required = true;
                        });
                    } else {
                        // Ẩn form nhập thẻ
                        cardPaymentForm.style.display = 'none';
                        // Tắt required cho các field thẻ
                        cardInputs.forEach(input => {
                            input.required = false;
                        });
                        // Xóa dữ liệu đã nhập
                        cardInputs.forEach(input => {
                            input.value = '';
                        });
                    }
                });
            });

            // ===== FORMAT SỐ THẺ (tự động thêm khoảng trắng) =====
            const cardNumberInput = document.getElementById('card-number');
            if (cardNumberInput) {
                cardNumberInput.addEventListener('input', function(e) {
                    let value = e.target.value.replace(/\s/g, ''); // Xóa khoảng trắng
                    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value; // Thêm khoảng trắng mỗi 4 số
                    e.target.value = formattedValue;
                });
            }

            // ===== FORMAT NGÀY HẾT HẠN (tự động thêm /) =====
            const cardExpiryInput = document.getElementById('card-expiry');
            if (cardExpiryInput) {
                cardExpiryInput.addEventListener('input', function(e) {
                    let value = e.target.value.replace(/\D/g, ''); // Chỉ giữ số
                    if (value.length >= 2) {
                        value = value.slice(0, 2) + '/' + value.slice(2, 4);
                    }
                    e.target.value = value;
                });
            }

            // ===== CHỈ CHO PHÉP NHẬP SỐ CHO CVV =====
            const cardCvvInput = document.getElementById('card-cvv');
            if (cardCvvInput) {
                cardCvvInput.addEventListener('input', function(e) {
                    e.target.value = e.target.value.replace(/\D/g, ''); // Chỉ giữ số
                });
            }
        });