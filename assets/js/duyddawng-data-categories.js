// ========== DEFAULT DATA ==========
const DEFAULT_CATEGORIES = [
    { 
        id: 1, 
        icon: '📱', 
        name: 'iPhone', 
        description: 'Điện thoại Apple iPhone', 
        productCount: 45, 
        status: 'Hoạt động', 
        iconType: 'emoji' 
    },
    { 
        id: 2, 
        icon: '🤖', 
        name: 'Samsung', 
        description: 'Điện thoại Samsung Galaxy', 
        productCount: 38, 
        status: 'Hoạt động', 
        iconType: 'emoji' 
    },
    { 
        id: 3, 
        icon: '🎯', 
        name: 'Xiaomi', 
        description: 'Điện thoại Xiaomi', 
        productCount: 32, 
        status: 'Hoạt động', 
        iconType: 'emoji' 
    },
    { 
        id: 4, 
        icon: '⚡', 
        name: 'OPPO', 
        description: 'Điện thoại OPPO', 
        productCount: 25, 
        status: 'Hoạt động', 
        iconType: 'emoji' 
    },
    { 
        id: 5, 
        icon: '🔥', 
        name: 'Vivo', 
        description: 'Điện thoại Vivo', 
        productCount: 20, 
        status: 'Hoạt động', 
        iconType: 'emoji' 
    },
    { 
        id: 6, 
        icon: '💎', 
        name: 'Realme', 
        description: 'Điện thoại Realme', 
        productCount: 18, 
        status: 'Ẩn', 
        iconType: 'emoji' 
    },
    { 
        id: 7, 
        icon: '🎨', 
        name: 'Nokia', 
        description: 'Điện thoại Nokia', 
        productCount: 12, 
        status: 'Hoạt động', 
        iconType: 'emoji' 
    },
    { 
        id: 8, 
        icon: '🌟', 
        name: 'Huawei', 
        description: 'Điện thoại Huawei', 
        productCount: 15, 
        status: 'Ẩn', 
        iconType: 'emoji' 
    }
];
//tạo biến toàn cục dùng chung 
window.DEFAULT_CATEGORIES = DEFAULT_CATEGORIES;

console.log('Load dữ liệu Cate thành công!');
console.log('Số lượng phẩn tử:', DEFAULT_CATEGORIES.length, 'items');