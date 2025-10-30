// Card Payment Form Logic
document.addEventListener('DOMContentLoaded', function() {
    
    // Lấy các phần tử
    const cardRadio = document.getElementById('card');
    const codRadio = document.getElementById('cod');
    const momoRadio = document.getElementById('momo');
    const cardPaymentForm = document.getElementById('card-payment-form');
    
    // Lấy các input trong form thẻ
    const cardNumberInput = document.getElementById('card-number');
    const cardHolderInput = document.getElementById('card-holder');
    const expiryDateInput = document.getElementById('expiry-date');
    const cvvInput = document.getElementById('cvv');
    
    // Hàm hiển thị/ẩn form thẻ
    function toggleCardForm() {
        if (cardRadio && cardRadio.checked) {
            cardPaymentForm.style.display = 'block';
            // Đặt required cho các trường
            setCardFieldsRequired(true);
        } else {
            cardPaymentForm.style.display = 'none';
            // Bỏ required khi không chọn thẻ
            setCardFieldsRequired(false);
        }
    }
    
    // Hàm set required cho các trường thẻ
    function setCardFieldsRequired(isRequired) {
        if (cardNumberInput) cardNumberInput.required = isRequired;
        if (cardHolderInput) cardHolderInput.required = isRequired;
        if (expiryDateInput) expiryDateInput.required = isRequired;
        if (cvvInput) cvvInput.required = isRequired;
    }
    
    // Lắng nghe sự kiện thay đổi phương thức thanh toán
    if (cardRadio) cardRadio.addEventListener('change', toggleCardForm);
    if (codRadio) codRadio.addEventListener('change', toggleCardForm);
    if (momoRadio) momoRadio.addEventListener('change', toggleCardForm);
    
    // Format số thẻ (thêm khoảng trắng mỗi 4 số)
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, ''); // Xóa khoảng trắng
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value; // Thêm khoảng trắng mỗi 4 ký tự
            e.target.value = formattedValue;
            
            // Validate chỉ nhập số
            if (!/^\d*\s*$/.test(e.target.value)) {
                e.target.value = e.target.value.slice(0, -1);
            }
        });
    }
    
    // Format tên chủ thẻ (chỉ chữ cái và khoảng trắng, viết hoa)
    if (cardHolderInput) {
        cardHolderInput.addEventListener('input', function(e) {
            // Chỉ cho phép chữ cái và khoảng trắng
            let value = e.target.value.toUpperCase();
            e.target.value = value.replace(/[^A-Z\s]/g, '');
        });
    }
    
    // Format ngày hết hạn (MM/YY)
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Chỉ giữ số
            
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            
            e.target.value = value;
            
            // Validate tháng (01-12)
            if (value.length >= 2) {
                let month = parseInt(value.slice(0, 2));
                if (month > 12 || month < 1) {
                    e.target.value = '';
                }
            }
        });
        
        // Tự động thêm dấu / khi nhập đủ 2 số
        expiryDateInput.addEventListener('keyup', function(e) {
            if (e.target.value.length === 2 && e.key !== 'Backspace') {
                e.target.value += '/';
            }
        });
    }
    
    // Format CVV (chỉ số, 3-4 ký tự)
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            // Chỉ cho phép số
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
    
    // Validate form khi submit
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            if (cardRadio && cardRadio.checked) {
                // Kiểm tra số thẻ (16 số)
                const cardNumber = cardNumberInput.value.replace(/\s/g, '');
                if (cardNumber.length !== 16) {
                    e.preventDefault();
                    alert('Số thẻ phải có 16 chữ số!');
                    cardNumberInput.focus();
                    return false;
                }
                
                // Kiểm tra tên chủ thẻ
                if (cardHolderInput.value.trim().length < 3) {
                    e.preventDefault();
                    alert('Vui lòng nhập tên chủ thẻ!');
                    cardHolderInput.focus();
                    return false;
                }
                
                // Kiểm tra ngày hết hạn
                const expiry = expiryDateInput.value;
                if (!/^\d{2}\/\d{2}$/.test(expiry)) {
                    e.preventDefault();
                    alert('Ngày hết hạn không đúng định dạng MM/YY!');
                    expiryDateInput.focus();
                    return false;
                }
                
                // Kiểm tra ngày hết hạn có hợp lệ không
                const [month, year] = expiry.split('/').map(Number);
                const currentDate = new Date();
                const currentYear = currentDate.getFullYear() % 100; // 2 chữ số cuối
                const currentMonth = currentDate.getMonth() + 1;
                
                if (year < currentYear || (year === currentYear && month < currentMonth)) {
                    e.preventDefault();
                    alert('Thẻ đã hết hạn!');
                    expiryDateInput.focus();
                    return false;
                }
                
                // Kiểm tra CVV
                const cvv = cvvInput.value;
                if (cvv.length < 3 || cvv.length > 4) {
                    e.preventDefault();
                    alert('CVV phải có 3-4 chữ số!');
                    cvvInput.focus();
                    return false;
                }
            }
        });
    }
    
    // Khởi tạo: ẩn form thẻ ban đầu
    toggleCardForm();
});