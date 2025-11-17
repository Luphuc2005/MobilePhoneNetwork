# TÀI LIỆU LUỒNG XỬ LÝ
## TRANG QUẢN LÝ GIÁ VÀ QUẢN LÝ KHÁCH HÀNG

**Tác giả:** Hồng Phúc  
**Ngày tạo:** 2025  
**Mục đích:** Tài liệu giải thích chi tiết cách hoạt động của 2 trang quản lý

---

# PHẦN 1: TRANG QUẢN LÝ GIÁ BÁN

## 1. TỔNG QUAN

Trang quản lý giá bán cho phép admin:
- Thiết lập % lợi nhuận theo loại sản phẩm hoặc từng sản phẩm
- Áp dụng % lợi nhuận vào giá bán
- Tra cứu thông tin giá của sản phẩm
- Tính giá từ giá vốn và % lợi nhuận

## 2. KHỞI TẠO (INITIALIZATION)

### 2.1. Khi trang được tải

**File:** `HPhuc-Pricing.js`  
**Hàm:** `initializePricing()` (dòng 2499)

**Bước 1: Load dữ liệu từ localStorage**
```
- products = lấy từ "phonestore_products"
- categoryProfits = lấy từ "phonestore_category_profit" (dạng object: {Iphone: 20, Samsung: 15})
- productProfits = lấy từ "phonestore_products_profit" (dạng object: {tên sản phẩm: % lợi nhuận})
```

**Bước 2: Setup Event Listeners**
- Gắn sự kiện click cho các nút tab
- Gắn sự kiện cho các nút lưu % lợi nhuận
- Gắn sự kiện cho các nút áp dụng giá
- Gắn sự kiện cho ô tìm kiếm
- Gắn sự kiện Enter cho các input

**Bước 3: Load dữ liệu vào dropdown**
- `loadCategories()`: Load các loại sản phẩm vào dropdown
- `loadProducts()`: Load sản phẩm vào dropdown (nhóm theo category)
- `loadProfitTable()`: Load bảng hiển thị % lợi nhuận đã lưu

## 3. CÁC CHỨC NĂNG CHÍNH

### 3.1. LƯU % LỢI NHUẬN THEO LOẠI SẢN PHẨM

**Luồng xử lý:**

```
Bước 1: Người dùng chọn loại sản phẩm và nhập % lợi nhuận
    ↓
Bước 2: Click nút "💾 Lưu %"
    ↓
Bước 3: Hàm saveCategoryProfit() được gọi (dòng 1595)
    ↓
Bước 4: VALIDATION (Kiểm tra dữ liệu)
    - Kiểm tra đã chọn loại sản phẩm chưa?
    - Kiểm tra % lợi nhuận có hợp lệ không (0-100)?
    ↓
Bước 5: Hiển thị modal xác nhận
    - Nếu đã có % lợi nhuận cũ → Hiển thị "Cập nhật"
    - Nếu chưa có → Hiển thị "Thiết lập mới"
    ↓
Bước 6: Người dùng click "Xác nhận"
    ↓
Bước 7: Lưu vào localStorage
    categoryProfits[category] = profit;
    localStorage.setItem("phonestore_category_profit", JSON.stringify(categoryProfits));
    ↓
Bước 8: Reload bảng hiển thị
    loadProfitTable();
    ↓
Bước 9: Hiển thị thông báo thành công
```

**Lưu ý:** 
- % lợi nhuận được lưu theo TÊN loại sản phẩm (ví dụ: "Iphone", "Samsung")
- Dữ liệu lưu trong localStorage key: `phonestore_category_profit`

### 3.2. LƯU % LỢI NHUẬN THEO TỪNG SẢN PHẨM

**Luồng xử lý:**

```
Bước 1: Người dùng chọn sản phẩm từ dropdown
    ↓
Bước 2: Auto-fill % lợi nhuận (nếu có)
    - Nếu sản phẩm đã có % lợi nhuận → tự động điền
    - Nếu chưa có → tính từ giá vốn và giá niêm yết
    ↓
Bước 3: Người dùng nhập % lợi nhuận và click "💾 Lưu %"
    ↓
Bước 4: Hàm saveProductProfit() được gọi (dòng 1729)
    ↓
Bước 5: VALIDATION
    - Kiểm tra đã chọn sản phẩm chưa?
    - Kiểm tra % lợi nhuận hợp lệ không?
    ↓
Bước 6: Lưu vào localStorage
    productProfits[tên sản phẩm] = profit;
    localStorage.setItem("phonestore_products_profit", JSON.stringify(productProfits));
    ↓
Bước 7: Reload bảng và dropdown
    loadProfitTable();
    loadProducts();
```

**Lưu ý:**
- % lợi nhuận được lưu theo TÊN sản phẩm (không phải ID)
- Khi chọn sản phẩm, hệ thống tự động điền % lợi nhuận nếu đã có

### 3.3. ÁP DỤNG % LỢI NHUẬN VÀO GIÁ BÁN (THEO LOẠI)

**Luồng xử lý:**

```
Bước 1: Người dùng chọn loại sản phẩm, nhập % lợi nhuận và % khuyến mãi (tùy chọn)
    ↓
Bước 2: Click nút "⚡ Áp dụng vào giá"
    ↓
Bước 3: Hàm applyCategoryProfitToPrice() được gọi (dòng 760)
    ↓
Bước 4: VALIDATION
    - Kiểm tra đã chọn loại chưa?
    - Kiểm tra % lợi nhuận hợp lệ?
    - Kiểm tra % khuyến mãi hợp lệ?
    ↓
Bước 5: Lấy tất cả sản phẩm thuộc loại đó
    categoryProducts = products.filter(p => p.danhmuc === category)
    ↓
Bước 6: Hiển thị modal xác nhận với:
    - Số lượng sản phẩm sẽ được áp dụng
    - Công thức tính toán
    - Ví dụ cụ thể (giả sử giá vốn 2.000.000₫)
    ↓
Bước 7: Người dùng click "Xác nhận"
    ↓
Bước 8: Duyệt qua từng sản phẩm trong loại
    Với mỗi sản phẩm:
        a. Kiểm tra có giá vốn không?
        b. Tính giá niêm yết = Giá vốn × (1 + % lợi nhuận)
        c. Tính giá bán cuối = Giá niêm yết × (1 - % khuyến mãi)
        d. Cập nhật:
            - product.gia = giá bán cuối
            - product.oldPrice = giá niêm yết
            - product.discount = -% khuyến mãi (số âm)
    ↓
Bước 9: Lưu vào localStorage
    localStorage.setItem("phonestore_products", JSON.stringify(products))
    ↓
Bước 10: Lưu % lợi nhuận vào categoryProfits
    categoryProfits[category] = profit;
    ↓
Bước 11: Broadcast cập nhật
    - Để các tab khác biết có thay đổi
    - Dispatch event "phonestore-sync"
    ↓
Bước 12: Hiển thị thông báo thành công
```

**CÔNG THỨC TÍNH:**
```
1. Giá niêm yết = Giá vốn × (1 + % lợi nhuận)
2. Giá bán cuối = Giá niêm yết × (1 - % khuyến mãi)
3. Lời thực tế = Giá bán cuối - Giá vốn
```

**Ví dụ:**
```
Giá vốn: 2.000.000₫
% Lợi nhuận: 20%
% Khuyến mãi: 5%

Bước 1: Giá niêm yết = 2.000.000 × (1 + 20%) = 2.400.000₫
Bước 2: Giá bán cuối = 2.400.000 × (1 - 5%) = 2.280.000₫
Bước 3: Lời thực tế = 2.280.000 - 2.000.000 = 280.000₫ (14%)
```

### 3.4. ÁP DỤNG % LỢI NHUẬN VÀO GIÁ BÁN (THEO SẢN PHẨM)

**Luồng xử lý:**

Tương tự như áp dụng theo loại, nhưng chỉ áp dụng cho 1 sản phẩm.

**Điểm đặc biệt:**
- Nếu người dùng KHÔNG nhập % khuyến mãi mới (hoặc = 0) nhưng sản phẩm đã có % khuyến mãi cũ
- Hệ thống sẽ **GIỮ LẠI** % khuyến mãi cũ của sản phẩm đó (dòng 1064-1071)

### 3.5. TRA CỨU GIÁ SẢN PHẨM

**Luồng xử lý:**

```
Bước 1: Chuyển sang tab "Tra cứu giá"
    ↓
Bước 2: Người dùng nhập tên sản phẩm vào ô tìm kiếm
    ↓
Bước 3: Hàm searchProductForLookup() được gọi (dòng 2158)
    - Sự kiện: input event (mỗi khi gõ)
    ↓
Bước 4: Tìm kiếm sản phẩm
    matchedProducts = products.filter(p => 
        tên sản phẩm chứa từ khóa HOẶC
        loại sản phẩm chứa từ khóa
    )
    ↓
Bước 5: Hiển thị kết quả
    - Nếu không tìm thấy → Hiển thị "Không tìm thấy"
    - Nếu tìm thấy → Hiển thị danh sách sản phẩm với:
        + Hình ảnh
        + Tên sản phẩm
        + Giá vốn
        + Giá niêm yết
        + % Khuyến mãi (nếu có)
        + Giá bán cuối
        + Lợi nhuận thực tế
    ↓
Bước 6: Người dùng có thể click "Xem chi tiết giá"
    - Mở modal hiển thị đầy đủ thông tin giá
```

### 3.6. TÍNH GIÁ TỪ GIÁ VỐN VÀ % LỢI NHUẬN

**Luồng xử lý:**

```
Bước 1: Người dùng nhập giá vốn và % lợi nhuận
    ↓
Bước 2: Click nút "🧮 Tính giá" HOẶC nhấn Enter
    ↓
Bước 3: Hàm calculatePrice() được gọi (dòng 2067)
    ↓
Bước 4: VALIDATION
    - Kiểm tra giá vốn hợp lệ?
    - Kiểm tra % lợi nhuận hợp lệ?
    ↓
Bước 5: Tính toán
    Giá niêm yết = Giá vốn × (1 + % lợi nhuận)
    Lợi nhuận = Giá niêm yết - Giá vốn
    ↓
Bước 6: Hiển thị kết quả
    - Cập nhật các element: costDisplay, profitDisplay, sellPriceDisplay, profitAmountDisplay
    - Highlight kết quả với animation
```

### 3.7. ÁP DỤNG % LỢI NHUẬN TỪ BẢNG

**Luồng xử lý:**

```
Bước 1: Người dùng xem bảng % lợi nhuận đã lưu
    - Bảng hiển thị: Loại/Sản phẩm | % Lợi nhuận | Nút "Áp dụng"
    ↓
Bước 2: Click nút "Áp dụng"
    ↓
Bước 3: Hàm applyProfitFromTable() được gọi (dòng 1264)
    ↓
Bước 4: Hiển thị modal xác nhận
    ↓
Bước 5: Nếu type = "category":
    - Áp dụng cho TẤT CẢ sản phẩm trong loại
    - Tính theo công thức: Giá niêm yết = Giá vốn × (1 + % lợi nhuận)
    - KHÔNG có khuyến mãi (discount = 0)
    ↓
Bước 6: Nếu type = "product":
    - Áp dụng cho 1 sản phẩm cụ thể
    - Tính tương tự
```

## 4. CẤU TRÚC DỮ LIỆU

### 4.1. Products (Sản phẩm)

```javascript
{
    id: 1,
    tensanpham: "iPhone 15 Pro Max",
    danhmuc: "Iphone",
    gia: 28000000,           // Giá bán cuối (sau khuyến mãi)
    giavon: 23000000,        // Giá vốn
    oldPrice: 30000000,      // Giá niêm yết (trước khuyến mãi)
    discount: -5,            // % Khuyến mãi (số âm, ví dụ -5 = giảm 5%)
    hinhanh: "..."
}
```

### 4.2. Category Profits

```javascript
{
    "Iphone": 20,      // 20% lợi nhuận cho tất cả iPhone
    "Samsung": 15,     // 15% lợi nhuận cho tất cả Samsung
    "Xiaomi": 12
}
```

### 4.3. Product Profits

```javascript
{
    "iPhone 15 Pro Max": 25,     // 25% lợi nhuận riêng cho sản phẩm này
    "Samsung Galaxy S24": 18
}
```

## 5. ĐỒNG BỘ DỮ LIỆU (SYNC)

**File:** `HPhuc-Pricing.js`  
**Hàm:** `setupPricingSync()` (dòng 2565)

Khi có thay đổi giá:
1. Lưu timestamp vào `phonestore_last_update`
2. Dispatch event `phonestore-sync`
3. Các tab khác lắng nghe event `storage` để reload dữ liệu

---

# PHẦN 2: TRANG QUẢN LÝ KHÁCH HÀNG

## 1. TỔNG QUAN

Trang quản lý khách hàng cho phép admin:
- Xem danh sách khách hàng
- Thêm khách hàng mới
- Sửa thông tin khách hàng
- Xem chi tiết khách hàng
- Khóa/Mở khóa tài khoản
- Xóa khách hàng
- Tìm kiếm, lọc, sắp xếp

## 2. KHỞI TẠO (INITIALIZATION)

### 2.1. Khi trang được tải

**File:** `HPhuc-UserManagement.js`  
**Sự kiện:** `DOMContentLoaded` (dòng 1397)

**Bước 1: Lấy DOM Elements**
```
- modal, editModal (không dùng nữa)
- btnAdd = nút "Thêm khách hàng"
- userTableBody = tbody của bảng
- searchInput = ô tìm kiếm
- filterStatusSelect = dropdown lọc trạng thái
- sortBySelect = dropdown sắp xếp
```

**Bước 2: Load dữ liệu từ localStorage**
```
users = JSON.parse(localStorage.getItem("phonestore_users")) || []
```

**Bước 3: Khởi tạo dữ liệu mẫu (nếu chưa có)**
- Nếu `users.length === 0` → Tạo 5 khách hàng mẫu
- Lưu vào localStorage

**Bước 4: Migration dữ liệu**
- Đảm bảo tất cả users có `trangthai` đúng format: "active" hoặc "locked"
- Chuyển đổi nếu cần: "Hoạt động" → "active", "Đã khóa" → "locked"

**Bước 5: Render bảng**
```
renderUsers();
```

**Bước 6: Setup Event Listeners**
```
setupEventListeners();
```

## 3. CÁC CHỨC NĂNG CHÍNH

### 3.1. HIỂN THỊ DANH SÁCH KHÁCH HÀNG

**Luồng xử lý:**

```
Bước 1: Hàm renderUsers() được gọi (dòng 164)
    ↓
Bước 2: Lọc dữ liệu theo từ khóa tìm kiếm
    filteredUsers = users.filter(u =>
        tên chứa từ khóa HOẶC
        email chứa từ khóa HOẶC
        SĐT chứa từ khóa HOẶC
        địa chỉ chứa từ khóa HOẶC
        ID chứa từ khóa
    )
    ↓
Bước 3: Lọc theo trạng thái
    Nếu statusFilter !== "all":
        filteredUsers = filteredUsers.filter(u => u.trangthai === statusFilter)
    ↓
Bước 4: Sắp xếp
    - Theo tên (a-z)
    - Theo ngày tham gia (mới nhất trước)
    - Theo số đơn hàng (nhiều nhất trước)
    - Theo ID (mặc định)
    ↓
Bước 5: Phân trang
    - Tính tổng số trang: Math.ceil(filteredUsers.length / usersPerPage)
    - Lấy dữ liệu cho trang hiện tại: filteredUsers.slice(start, end)
    ↓
Bước 6: Render từng dòng
    Với mỗi user:
        - Tạo element <div> với grid layout
        - Điền thông tin: ID, Tên, Email, SĐT, Địa chỉ, Trạng thái, Số đơn, Ngày tham gia
        - Thêm 4 nút: Xem, Sửa, Khóa/Mở, Xóa
    ↓
Bước 7: Render phân trang
    renderPagination(totalFilteredUsers)
    ↓
Bước 8: Cập nhật thống kê
    updateStatistics()
```

**Cấu trúc 1 dòng trong bảng:**
```
[ID] [Tên] [Email] [SĐT] [Địa chỉ] [Trạng thái] [Số đơn] [Ngày tham gia] [4 nút hành động]
```

### 3.2. TÌM KIẾM

**Luồng xử lý:**

```
Bước 1: Người dùng gõ vào ô tìm kiếm (#userSearchInput)
    ↓
Bước 2: Event listener "input" được kích hoạt
    searchQuery = e.target.value.trim().toLowerCase()
    currentPage = 1  // Về trang đầu
    ↓
Bước 3: Gọi renderUsers()
    - Hàm renderUsers() sẽ tự động lọc theo searchQuery
    ↓
Bước 4: Hiển thị kết quả mới
```

**Tìm kiếm theo:**
- Tên khách hàng
- Email
- Số điện thoại
- Địa chỉ
- ID

### 3.3. LỌC THEO TRẠNG THÁI

**Luồng xử lý:**

```
Bước 1: Người dùng chọn trạng thái từ dropdown (#filterStatus)
    - "all" = Tất cả
    - "active" = Đang hoạt động
    - "locked" = Đã khóa
    ↓
Bước 2: Event listener "change" được kích hoạt
    statusFilter = e.target.value
    currentPage = 1
    ↓
Bước 3: Gọi renderUsers()
    - Tự động lọc theo statusFilter
```

### 3.4. SẮP XẾP

**Luồng xử lý:**

```
Bước 1: Người dùng chọn cách sắp xếp (#sortBy)
    - "id" = Theo ID (mặc định)
    - "name" = Theo tên (a-z)
    - "joinDate" = Theo ngày tham gia (mới nhất trước)
    - "orders" = Theo số đơn hàng (nhiều nhất trước)
    ↓
Bước 2: Event listener "change" được kích hoạt
    sortBy = e.target.value
    ↓
Bước 3: Gọi renderUsers()
    - Tự động sắp xếp theo sortBy
```

### 3.5. THÊM KHÁCH HÀNG MỚI

**Luồng xử lý:**

```
Bước 1: Click nút "➕ Thêm khách hàng"
    ↓
Bước 2: Hàm showAddUserModal() được gọi (dòng 443)
    - Tạo modal động (không dùng HTML tĩnh)
    - Modal chứa form với các trường:
        + Họ tên (bắt buộc)
        + Email (bắt buộc)
        + Số điện thoại
        + Trạng thái (active/locked)
        + Tỉnh/Thành phố
        + Quận/Huyện (phụ thuộc Tỉnh)
        + Xã/Phường/Đường
        + Mật khẩu (bắt buộc, min 6 ký tự)
    ↓
Bước 3: Load danh sách Tỉnh/Thành phố
    - Sử dụng hàm getProvinces() từ file vietnam-address.js
    ↓
Bước 4: Người dùng điền form và click "💾 Lưu khách hàng"
    ↓
Bước 5: Hàm handleAddUser() được gọi (dòng 674)
    ↓
Bước 6: VALIDATION
    - Kiểm tra các trường bắt buộc
    - Kiểm tra email hợp lệ (regex)
    - Kiểm tra email không trùng
    - Kiểm tra mật khẩu >= 6 ký tự
    ↓
Bước 7: Tạo địa chỉ đầy đủ
    address = ward + ", " + district + ", " + province
    ↓
Bước 8: Tạo user mới
    {
        id: Math.max(...users.map(u => u.id)) + 1,  // ID tự tăng
        name,
        email,
        phone,
        address,
        trangthai,
        joinDate: new Date().toLocaleDateString("vi-VN"),
        orders: 0,
        password
    }
    ↓
Bước 9: Thêm vào mảng users
    users.push(newUser)
    ↓
Bước 10: Lưu vào localStorage
    localStorage.setItem("phonestore_users", JSON.stringify(users))
    ↓
Bước 11: Đóng modal và render lại bảng
    document.getElementById("addUserOverlay").remove()
    renderUsers()
    ↓
Bước 12: Hiển thị thông báo thành công
```

### 3.6. XEM CHI TIẾT KHÁCH HÀNG

**Luồng xử lý:**

```
Bước 1: Click nút "👁️ Xem" trên 1 dòng khách hàng
    ↓
Bước 2: Hàm viewUser(index) được gọi (dòng 760)
    - index = vị trí trong mảng users (không phải ID)
    ↓
Bước 3: Tạo modal hiển thị
    - Header: Tên khách hàng, email, trạng thái
    - Thống kê: ID, Số đơn hàng, Ngày tham gia
    - Chi tiết: SĐT, Địa chỉ, Mật khẩu (có thể toggle ẩn/hiện)
    ↓
Bước 4: Người dùng có thể:
    - Click "❌ Đóng" để đóng modal
    - Click "✏️ Chỉnh sửa" để chuyển sang chức năng sửa
```

### 3.7. SỬA THÔNG TIN KHÁCH HÀNG

**Luồng xử lý:**

```
Bước 1: Click nút "✏️ Sửa" HOẶC click "Chỉnh sửa" trong modal xem chi tiết
    ↓
Bước 2: Hàm editUser(index) được gọi (dòng 914)
    ↓
Bước 3: Parse địa chỉ hiện tại
    - Địa chỉ được lưu dạng: "Ward, District, Province"
    - Tách thành 3 phần: ward, district, province
    ↓
Bước 4: Tạo modal chỉnh sửa
    - Tự động điền dữ liệu hiện tại vào các ô
    - Load và chọn đúng Tỉnh/Quận
    ↓
Bước 5: Người dùng chỉnh sửa và click "💾 Lưu thay đổi"
    ↓
Bước 6: Hàm handleEditUser(index) được gọi (dòng 1211)
    ↓
Bước 7: VALIDATION
    - Kiểm tra các trường bắt buộc
    - Kiểm tra email hợp lệ
    - Kiểm tra SĐT hợp lệ (10-11 số)
    - Kiểm tra email không trùng (trừ user hiện tại)
    - Kiểm tra mật khẩu >= 6 ký tự
    ↓
Bước 8: Cập nhật user
    users[index] = {
        ...users[index],  // Giữ lại các thuộc tính cũ
        name,
        email,
        phone,
        address,
        password,
        trangthai
    }
    ↓
Bước 9: Lưu vào localStorage
    localStorage.setItem("phonestore_users", JSON.stringify(users))
    ↓
Bước 10: Đóng modal và render lại
    renderUsers()
```

**Lưu ý:**
- Mật khẩu có thể để trống → không đổi mật khẩu
- Có nút "🔄 Reset về 123123" để reset nhanh

### 3.8. KHÓA/MỞ KHÓA TÀI KHOẢN

**Luồng xử lý:**

```
Bước 1: Click nút "🔒 Khóa" hoặc "🔓 Mở khóa"
    ↓
Bước 2: Hàm toggleLockUser(index) được gọi (dòng 1303)
    ↓
Bước 3: Hiển thị dialog xác nhận
    showConfirmDialog(title, message, onConfirm)
    ↓
Bước 4: Người dùng click "Xác nhận"
    ↓
Bước 5: Đảo ngược trạng thái
    Nếu đang "locked" → Đổi thành "active"
    Nếu đang "active" → Đổi thành "locked"
    ↓
Bước 6: Lưu vào localStorage
    localStorage.setItem("phonestore_users", JSON.stringify(users))
    ↓
Bước 7: Render lại bảng
    renderUsers()
    ↓
Bước 8: Hiển thị thông báo
```

### 3.9. XÓA KHÁCH HÀNG

**Luồng xử lý:**

```
Bước 1: Click nút "🗑️ Xóa"
    ↓
Bước 2: Hàm deleteUser(index) được gọi (dòng 1328)
    ↓
Bước 3: Hiển thị dialog xác nhận
    - Cảnh báo: "Xóa vĩnh viễn", "Không thể hoàn tác"
    ↓
Bước 4: Người dùng click "Xác nhận"
    ↓
Bước 5: Xóa khỏi mảng
    users.splice(index, 1)  // Xóa 1 phần tử tại vị trí index
    ↓
Bước 6: Lưu vào localStorage
    localStorage.setItem("phonestore_users", JSON.stringify(users))
    ↓
Bước 7: Render lại bảng
    renderUsers()
    ↓
Bước 8: Hiển thị thông báo
```

### 3.10. PHÂN TRANG

**Luồng xử lý:**

```
Bước 1: Hàm renderPagination(totalCount) được gọi (dòng 315)
    ↓
Bước 2: Tính tổng số trang
    totalPages = Math.ceil(totalCount / usersPerPage)
    ↓
Bước 3: Render các nút số trang
    - Với mỗi trang từ 1 đến totalPages
    - Trang hiện tại được highlight
    ↓
Bước 4: Cập nhật nút Previous/Next
    - Previous: Disable nếu đang ở trang đầu
    - Next: Disable nếu đang ở trang cuối
    ↓
Bước 5: Gắn event listeners
    - Click số trang → currentPage = số trang đó → renderUsers()
    - Click Previous → currentPage-- → renderUsers()
    - Click Next → currentPage++ → renderUsers()
```

**Lưu ý:**
- Nếu số lượng <= usersPerPage (5) → Làm mờ và vô hiệu hóa phân trang
- Thông tin hiển thị: "Hiển thị X-Y trong tổng số Z khách hàng"

### 3.11. CẬP NHẬT THỐNG KÊ

**Luồng xử lý:**

```
Bước 1: Hàm updateStatistics() được gọi (dòng 146)
    ↓
Bước 2: Tính toán
    - Tổng số khách hàng = users.length
    - Số khách hàng đang hoạt động = users.filter(u => u.trangthai === "active").length
    - Số khách hàng đã khóa = users.filter(u => u.trangthai === "locked").length
    - Tổng số đơn hàng = tổng orders của tất cả users
    ↓
Bước 3: Cập nhật UI
    - totalUsersCount.textContent = ...
    - activeUsersCount.textContent = ...
    - lockedUsersCount.textContent = ...
    - totalOrdersCount.textContent = ...
```

## 4. CẤU TRÚC DỮ LIỆU

### 4.1. User Object

```javascript
{
    id: 1,                              // ID duy nhất
    name: "Nguyễn Văn A",               // Họ tên
    email: "nguyenvana@gmail.com",      // Email (dùng để đăng nhập)
    phone: "0123456789",                // Số điện thoại
    address: "123 ABC, Quận 1, TP.HCM", // Địa chỉ đầy đủ
    trangthai: "active",                // "active" hoặc "locked"
    joinDate: "01/01/2024",             // Ngày tham gia (dd/mm/yyyy)
    orders: 5,                          // Số đơn hàng đã mua
    password: "123456"                  // Mật khẩu (plain text - không an toàn cho production)
}
```

### 4.2. LocalStorage Key

```
phonestore_users = JSON.stringify([...users])
```

## 5. VALIDATION RULES

### 5.1. Email
- Format hợp lệ: `regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Không được trùng với user khác

### 5.2. Số điện thoại
- Format: 10-11 chữ số (regex: `/^[0-9]{10,11}$/`)
- Chỉ kiểm tra khi SỬA (không bắt buộc khi thêm)

### 5.3. Mật khẩu
- Tối thiểu 6 ký tự
- Bắt buộc khi thêm mới
- Có thể để trống khi sửa (giữ nguyên mật khẩu cũ)

### 5.4. Họ tên
- Bắt buộc
- Không có validation đặc biệt

## 6. ĐỊA CHỈ (ADDRESS)

### 6.1. Cấu trúc
Địa chỉ được tạo từ 3 phần:
```
address = ward + ", " + district + ", " + province
```

### 6.2. Dropdown Tỉnh/Quận
- Sử dụng file `vietnam-address.js`
- Hàm `getProvinces()` → Trả về mảng các tỉnh
- Hàm `getDistricts(province)` → Trả về mảng các quận/huyện của tỉnh đó

### 6.3. Parse địa chỉ khi sửa
- Tách địa chỉ cũ thành 3 phần
- Điền vào 3 dropdown tương ứng

---

# KẾT LUẬN

## Điểm chung của 2 trang

1. **Lưu trữ dữ liệu:**
   - Cả 2 đều dùng localStorage
   - Key riêng biệt cho từng loại dữ liệu

2. **Khởi tạo:**
   - Đều có hàm initialize
   - Đều load dữ liệu từ localStorage khi trang load
   - Đều có dữ liệu mẫu nếu chưa có

3. **Event Listeners:**
   - Setup sau khi DOM load xong
   - Dùng addEventListener thay vì onclick trong HTML

4. **Validation:**
   - Kiểm tra dữ liệu trước khi lưu
   - Hiển thị thông báo lỗi rõ ràng

5. **UI:**
   - Dùng modal động (tạo bằng JavaScript)
   - Có animation và transition
   - Responsive design

## Lưu ý khi phát triển

1. **Quản lý giá:**
   - Luôn tính từ GIÁ VỐN
   - % lợi nhuận và % khuyến mãi là 2 bước riêng biệt
   - Lưu cả `gia` (giá bán) và `oldPrice` (giá niêm yết)

2. **Quản lý khách hàng:**
   - ID tự tăng
   - Email là unique (không trùng)
   - Mật khẩu lưu plain text (nên mã hóa trong production)

---

**Tài liệu này giải thích chi tiết luồng xử lý của 2 trang. Nếu có thắc mắc, hãy tham khảo code trong các file JavaScript tương ứng.**

