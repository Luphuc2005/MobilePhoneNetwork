```txt
CẤU TRÚC THƯ MỤC DỰ ÁN WEB BÁN ĐIỆN THOẠI
web-ban-dien-thoai/
│
├── index.html                          # Trang chủ/Landing page
│
├── assets/                             # Thư mục chứa tài nguyên
│   ├── css/
│   │   ├── style.css                   # CSS chung cho toàn site
│   │   ├── admin.css                   # CSS riêng cho admin
│   │   └── user.css                    # CSS riêng cho end-user
│   │
│   ├── js/
│   │   ├── main.js                     # JavaScript chung
│   │   ├── admin.js                    # JavaScript cho admin
│   │   ├── cart.js                     # Xử lý giỏ hàng
│   │   └── validation.js               # Validation form
│   │
│   └── images/
│       ├── products/                   # Hình ảnh sản phẩm
│       ├── banners/                    # Banner/Slider
│       └── icons/                      # Icons
│
├── admin/                              # PHẦN ADMIN
│   ├── login.html                      # Đăng nhập admin (Duy Đăng)
│   ├── dashboard.html                  # Trang chủ admin (Duy Đăng)
│   │
│   ├── categories/                     # Quản lý loại sản phẩm (Duy Đăng)
│   │   ├── list.html                   # Danh sách loại
│   │   ├── add.html                    # Thêm loại
│   │   └── edit.html                   # Sửa loại
│   │
│   ├── users/                          # Quản lý người dùng (Hồng Phúc)
│   │   └── list.html                   # DS khách hàng + reset MK + khóa TK
│   │
│   ├── pricing/                        # Quản lý giá bán (Hồng Phúc)
│   │   ├── profit-margin.html          # Nhập % lợi nhuận
│   │   └── price-lookup.html           # Tra cứu giá
│   │
│   ├── products/                       # Quản lý sản phẩm (Huyền Trang)
│   │   ├── list.html                   # Danh sách sản phẩm
│   │   ├── add.html                    # Thêm sản phẩm
│   │   └── edit.html                   # Sửa sản phẩm
│   │
│   ├── imports/                        # Quản lý nhập hàng (Huyền Trang)
│   │   ├── list.html                   # DS phiếu nhập
│   │   ├── add.html                    # Thêm phiếu nhập
│   │   └── edit.html                   # Sửa phiếu nhập
│   │
│   ├── orders/                         # Quản lý đơn hàng (Thanh Nhàn)
│   │   ├── list.html                   # DS đơn hàng + lọc
│   │   └── detail.html                 # Chi tiết + cập nhật trạng thái
│   │
│   └── inventory/                      # Quản lý tồn kho (Thanh Nhàn)
│       ├── lookup.html                 # Tra cứu tồn
│       ├── alert.html                  # Cảnh báo sắp hết
│       └── report.html                 # Báo cáo nhập-xuất-tồn
│
├── user/                               # PHẦN END-USER
│   ├── auth/                           # Xác thực (Tuấn Khôi)
│   │   ├── login.html                  # Đăng nhập
│   │   ├── register.html               # Đăng ký
│   │   └── profile.html                # Thông tin cá nhân + đổi MK
│   │
│   ├── products/                       # Sản phẩm (Quốc Cường)
│   │   ├── category.html               # Danh sách theo loại
│   │   └── detail.html                 # Chi tiết sản phẩm
│   │
│   ├── search/                         # Tìm kiếm (Thanh Nhàn)
│   │   ├── basic.html                  # Tìm kiếm cơ bản
│   │   └── advanced.html               # Tìm kiếm nâng cao
│   │
│   ├── cart/                           # Giỏ hàng (Quốc Cường)
│   │   ├── index.html                  # Giỏ hàng
│   │   ├── checkout.html               # Thanh toán
│   │   └── confirmation.html           # Xác nhận đơn hàng
│   │
│   └── orders/                         # Đơn hàng (Thanh Nhàn)
│       ├── history.html                # Lịch sử đơn hàng
│       └── detail.html                 # Chi tiết đơn đã mua
│
├── components/                         # Template components (Duy Đăng)
│   ├── header.html                     # Header chung
│   ├── footer.html                     # Footer chung
│   ├── navigation.html                 # Menu navigation
│   └── sidebar-admin.html              # Sidebar admin
│
└── data/                               # Dữ liệu mẫu (JSON)
    ├── products.json                   # Dữ liệu sản phẩm
    ├── categories.json                 # Dữ liệu loại SP
    ├── users.json                      # Dữ liệu người dùng
    └── orders.json                     # Dữ liệu đơn hàng
PHÂN CÔNG THEO THÀNH VIÊN
1. DUY ĐĂNG (Trưởng nhóm)
•	index.html - Trang chủ
•	admin/login.html - Đăng nhập admin
•	admin/dashboard.html - Dashboard
•	admin/categories/* - Quản lý loại sản phẩm
•	components/* - Tất cả template chung
•	Điều phối và tích hợp code
2. HỒNG PHÚC
•	admin/users/list.html - Quản lý khách hàng
•	admin/pricing/* - Quản lý giá bán
3. HUYỀN TRANG
•	admin/products/* - Quản lý sản phẩm
•	admin/imports/* - Quản lý nhập hàng
4. THANH NHÀN
•	admin/orders/* - Quản lý đơn hàng
•	admin/inventory/* - Quản lý tồn kho
•	user/search/* - Tìm kiếm
•	user/orders/* - Xem đơn hàng
5. TUẤN KHÔI
•	user/auth/* - Đăng ký/Đăng nhập/Profile
6. QUỐC CƯỜNG
•	user/products/* - Hiển thị sản phẩm
•	user/cart/* - Giỏ hàng & Thanh toán
```