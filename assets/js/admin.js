document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Ngăn form gửi đi theo cách mặc định

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Xóa thông báo lỗi cũ
    errorMessage.textContent = '';

    // Validation đơn giản
    if (username.trim() === '' || password.trim() === '') {
        errorMessage.textContent = 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.';
        return;
    }

    // Giả lập kiểm tra đăng nhập
    // Trong thực tế, bạn sẽ gửi yêu cầu đến server ở đây
    if (username === 'admin' && password === '123456') {
        alert('Đăng nhập thành công!');
        // Chuyển hướng đến trang dashboard
        // window.location.href = 'dashboard.html'; 
    } else {
        errorMessage.textContent = 'Tên đăng nhập hoặc mật khẩu không đúng.';
    }
});