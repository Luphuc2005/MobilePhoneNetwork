
// ========== STORAGE KEYS ==========
const STORAGE_KEYS = {
    /**
     * DUY ĐĂNG (Quản lý CRUD)
     * HUYỀN TRANG (Đọc để chọn loại khi thêm/sửa SP)
     * THANH NHÀN (Đọc để lọc tồn kho & tìm kiếm)
     * QUỐC CƯỜNG (Đọc để lọc SP phía End-User)
     */
    CATEGORIES: 'phonestore_categories',

    /**
     * HUYỀN TRANG (Quản lý CRUD)
     * DUY ĐĂNG (Đọc để hiển thị SP nổi bật trang chủ)
     * QUỐC CƯỜNG (Đọc để hiển thị danh sách & chi tiết SP)
     * HỒNG PHÚC (Đọc để cài đặt % lợi nhuận)
     * THANH NHÀN (Đọc để tìm kiếm & tra cứu tồn kho)
     */
    PRODUCTS: 'phonestore_products',

    /**
     * HỒNG PHÚC (Quản lý CRUD phía Admin: Khóa/Mở, Reset MK)
     * TUẤN KHÔI (Quản lý CRUD phía End-User: Đăng ký, Sửa TT, Đổi MK)
     * THANH NHÀN (Đọc để hiển thị TT khách hàng trong đơn hàng)
     */
    USERS: 'phonestore_users',

    /**
     * QUỐC CƯỜNG (Ghi khi End-User đặt hàng)
     * THANH NHÀN (Đọc/Ghi phía Admin: Quản lý, Cập nhật trạng thái)
     * THANH NHÀN (Đọc phía End-User: Hiển thị lịch sử đơn hàng)
     */
    ORDERS: 'phonestore_orders',

    /**
     * THANH NHÀN (Quản lý & Tra cứu N-X-T)
     * Dữ liệu này được GHI (cập nhật) bởi:
     * - HUYỀN TRANG (Khi hoàn thành phiếu nhập)
     * - QUỐC CƯỜNG (Khi End-User đặt hàng thành công)
     */
    INVENTORY: 'phonestore_inventory',

    /**
     * HUYỀN TRANG (Quản lý CRUD phiếu nhập hàng)
     * THANH NHÀN (Đọc để tra cứu Nhập - Xuất - Tồn)
     */
    IMPORT_ORDERS: 'phonestore_import_orders',

    /**
     * HỒNG PHÚC (Quản lý CRUD: Thêm/Sửa % lợi nhuận, Tra cứu giá)
     */
    PRICING_RULES: 'phonestore_pricing_rules',

    /**
     * TUẤN KHÔI (Ghi khi đăng nhập, Xóa khi đăng xuất)
     * DUY ĐĂNG (Đọc để hiển thị tên Admin)
     * TUẤN KHÔI (Đọc để hiển thị tên End-User)
     * QUỐC CƯỜNG (Đọc để kiểm tra đăng nhập trước khi thêm vào giỏ)
     */
    CURRENT_USER: 'phonestore_currentUser',

    /**
     * TUẤN KHÔI (Quản lý Ghi/Xóa khi check/uncheck box)
     */
    REMEMBER_ME: 'phonestore_rememberMe',

    /**
     * QUỐC CƯỜNG (Quản lý CRUD giỏ hàng: Thêm, Xóa, Cập nhật SL)
     */
    CART_PREFIX: 'phonestore_cart_'
};
// ========== STORAGE HELPER ==========
const StorageHelper = {
    save(key, data, source) {
        try {
            // Lưu dữ liệu (String)
            localStorage.setItem(key, JSON.stringify(data));
            console.log(`[Storage] Đã lưu ${key}:`, Array.isArray(data) ? `${data.length} items` : 'object');
            
            // Trigger custom event để sync trong cùng tab
            this.triggerSync(key, source);
            return true;
        } catch (e) {
            console.error(`[Storage] Lỗi lưu ${key}:`, e);
            // Dung lượng vượt quá mức
            if (e.name === 'QuotaExceededError') {
                alert('Dung lượng lưu trữ đã đầy! Vui lòng xóa dữ liệu cũ.');
            }
            return false;
        }
    },
    


    /**
     * Đọc dữ liệu từ localStorage
     * @param {string} key - Storage key
     * @param {any} defaultValue - Giá trị mặc định nếu không tìm thấy
     * @returns {any} - Dữ liệu đã parse hoặc defaultValue
     */
    load(key, defaultValue = []) {
        try {
            //lấy dữ liệu
            const stored = localStorage.getItem(key);
            
            if (stored !== null) {
                //trở lại dữ liệu ban đầu
                const data = JSON.parse(stored);
                console.log(`[Storage] Đã tải ${key}:`, Array.isArray(data) ? `${data.length} items` : 'object');
                return data;
            }
            
            console.warn(` [Storage] ${key} trống, dùng defaultValue`);
            return defaultValue;
        } catch (e) {
            //parse thất bại 
            console.error(`[Storage] Lỗi đọc ${key}:`, e);
            return defaultValue;
        }
    },

    /**
     * Xóa dữ liệu
     * @param {string} key - Storage key
     */
    remove(key) {
        //tìm đúng tên key và xóa
        localStorage.removeItem(key);
        console.log(`[Storage] Đã xóa ${key}`);
        this.triggerSync(key);
    },

    /**
     * Xóa toàn bộ dữ liệu PhoneStore
     */
    clearAll() {
        //STORAGE_KEY -> mảng 
        Object.values(STORAGE_KEYS).forEach(key => {
            if (!key.includes('_PREFIX')) {
                localStorage.removeItem(key);
            }
        });
        console.log('[Storage] Đã xóa toàn bộ dữ liệu PhoneStore');
    },

    /**
     * Trigger custom event để đồng bộ trong cùng tab
        Phát đi thông báo cho toàn bộ trang Web
        Bất kể dữ liệu nào thôi , chỉ cần lắng nghe sự kiện này . 
        Đọc gói detail -> cập nhật giao diện(không cần tải lại trang) 
     */
    triggerSync(key,customSource) {
        window.dispatchEvent(new CustomEvent('phonestore-sync', {
            detail: { 
                key, 
                timestamp: Date.now(),
                //hạn chế sự lặp lại 
                // customSource = key+'-page'
                source: customSource
            }
        }));
    }
};

// ========== EXPORT GLOBAL ==========
window.STORAGE_KEYS = STORAGE_KEYS;
window.StorageHelper = StorageHelper;

console.log('[Storage Config] Loaded successfully!');
console.log('Sử dụng: StorageHelper.save(STORAGE_KEYS.CATEGORIES, data)');