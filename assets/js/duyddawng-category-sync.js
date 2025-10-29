//STORAGE_KEYS
const STORAGE_KEY = STORAGE_KEYS.CATEGORIES; 

// Dữ liệu mẫu (CHỈ dùng khi localStorage HOÀN TOÀN TRỐNG)
const fallbackCategories = [
    { id: 1, icon: '📱', name: 'iPhone', description: 'Điện thoại Apple iPhone', productCount: 45, status: 'Hoạt động', iconType: 'emoji' },
    { id: 2, icon: '🤖', name: 'Samsung', description: 'Điện thoại Samsung Galaxy', productCount: 38, status: 'Hoạt động', iconType: 'emoji' },
    { id: 3, icon: '💫', name: 'Oppo', description: 'Điện thoại OPPO', productCount: 25, status: 'Hoạt động', iconType: 'emoji' },
    { id: 4, icon: '🎯', name: 'Xiaomi', description: 'Điện thoại Xiaomi', productCount: 32, status: 'Hoạt động', iconType: 'emoji' },
    { id: 5, icon: '⚡', name: 'Vivo', description: 'Điện thoại Vivo', productCount: 20, status: 'Hoạt động', iconType: 'emoji' },
    { id: 6, icon: '🎨', name: 'Realme', description: 'Điện thoại Realme', productCount: 18, status: 'Hoạt động', iconType: 'emoji' }
];
// write
function getCategoriesFromStorage() {
    return StorageHelper.load(STORAGE_KEY, fallbackCategories); 
}

// Hàm render 
function renderCategorySection() {
    try {
        const categoryFlex = document.querySelector('.category-flex');
        
        if (!categoryFlex) {
            console.warn(' Không tìm thấy .category-flex, thử lại sau 500ms...');
            setTimeout(renderCategorySection, 500);
            return;
        }

        console.log('Đã tìm thấy .category-flex');

        const categories = getCategoriesFromStorage();
        const activeCategories = categories.filter(cat => cat && cat.status === 'Hoạt động');
        
        console.log('Đang render', activeCategories.length, 'danh mục hoạt động');

        if (activeCategories.length === 0) {
            categoryFlex.innerHTML = `
                <div style="width: 100%; text-align: center; padding: 40px; color: #999;">
                    <p style="font-size: 16px;">Chưa có danh mục nào được hiển thị</p>
                    <p style="font-size: 14px; margin-top: 10px;">Vui lòng thêm danh mục từ trang Admin</p>
                </div>
            `;
            return;
        }

        const html = activeCategories.map(cat => {
            let iconHtml = '';

            if (cat.iconType === 'image' && cat.icon) {
                iconHtml = `<img src="${cat.icon}" alt="${cat.name}" style="width: 48px; height: 48px; object-fit: contain; border-radius: 8px;">`;
            } else if (cat.icon) {
                iconHtml = cat.icon;
            } else {
                iconHtml = '📦';
            }

            return `
                <a href="#${cat.name.toLowerCase()}" class="category-card">
                    <div class="category-icon">${iconHtml}</div>
                    <span>${cat.name}</span>
                </a>
            `;
        }).join('');

        categoryFlex.innerHTML = html;
        console.log('[Index] Đã render', activeCategories.length, 'danh mục');

    } catch (error) {
        console.error('Lỗi render category:', error);
    }
}

// kiểm tra định kỳ
// lưu lại lần kiểm tra trước
let lastData = null;
//số lần update 
let updateCount = 0;

function checkAndUpdate() {
    try {
        const currentData = localStorage.getItem(STORAGE_KEY);
        if (currentData !== lastData) {
            lastData = currentData;
            updateCount++;
            console.log('[Index] Phát hiện thay đổi lần', updateCount);
            renderCategorySection();
        }
    } catch (error) {
        console.error('Lỗi kiểm tra cập nhật:', error);
    }
}

// ==================== KHỞI ĐỘNG ====================

console.log('[Index] Khởi động Category Sync (Read-Only Mode)...');

function startCategorySync() {
    console.log(' [Index] Category Sync đang khởi động...');
    
    renderCategorySection();
    
    // Lắng nghe thay đổi từ tab khác (Admin)
    //thây đổi localStorage
    window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
            console.log(' [Index] Nhận cập nhật từ Admin (tab khác)!');
            renderCategorySection();
        }
    });

    // Lắng nghe trong cùng tab
    //sự kiện trigger 
    window.addEventListener('phonestore-sync', (e) => {
        if (e.detail.key === STORAGE_KEY) {
            console.log(' [Index] Nhận cập nhật từ Admin (cùng tab)!');
            renderCategorySection();
        }
    });

    // Kiểm tra định kỳ (2s)
    setInterval(checkAndUpdate, 2000);
    
    console.log(' [Index] Category Sync sẵn sàng (Read-Only)');
}

// Khởi động khi DOM sẵn sàng
// đợi tải xog -> starCategorySync
if (document.readyState === 'loading') {
    //đợi html sẵn sàng 
    document.addEventListener('DOMContentLoaded', startCategorySync);
} else {
    // interactive || complete 
    startCategorySync();
}
// truy cập bất cứ đâu 
// sử dụng cho console 
window.categorySync = {
    render: renderCategorySection,
    getCategories: getCategoriesFromStorage,
    debug: () => {
        console.log('=== [Index] DEBUG INFO ===');
        console.log('Flex element:', document.querySelector('.category-flex'));
        console.log('Categories:', getCategoriesFromStorage());
        console.log('Storage key:', STORAGE_KEY);
        console.log('Update count:', updateCount);
        console.log('Last data length:', lastData ? lastData.length : 0);
    }
};

console.log(' Gõ: categorySync.debug() để xem thông tin');
