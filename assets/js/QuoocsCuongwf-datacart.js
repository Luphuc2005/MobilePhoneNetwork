
const data=[
    {
        user_id:'1',
        product:[[1, 2, '128GB', 'Titan Tự Nhiên'], [2, 1, '256GB', 'Tím Đậm'], [3, 2, '128GB', 'Xanh Lá']]
    },
    {
        user_id:'2',
        product:[[2, 1, '512GB', 'Vàng'], [4, 2, '256GB', 'Đen']]
    },
    {
        user_id:'3',
        product:[[11, 1, '16GB', 'xanh'], [12, 3, '32GB', 'titan tim'], [14, 5, '64GB', 'đen']]
    }
]
let products=[];

// Sửa key đúng: dùng STORAGE_KEYS nếu có, hoặc key đúng phonestore_currentUser
let currentUser = null;
try {
    const currentUserKey = window.STORAGE_KEYS ? window.STORAGE_KEYS.CURRENT_USER : 'phonestore_currentUser';
    const currentUserData = localStorage.getItem(currentUserKey);
    currentUser = currentUserData ? JSON.parse(currentUserData) : null;
    
    if (currentUser && currentUser.id) {
        let currentUserCart = data.find(item => item.user_id === String(currentUser.id));
        if (currentUserCart) {
            const productsData = localStorage.getItem('phonestore_products');
            if (productsData) {
                const allProducts = JSON.parse(productsData);
                currentUserCart.product.forEach(item => {
                    let productDetail = allProducts.find(p => p.id === item[0]);
                    if (productDetail) {
                        products.push({
                            img: productDetail.hinhanh,
                            name: productDetail.tensanpham,
                            color: item[3] || '',
                            memory: item[2] || '',
                            price: productDetail.gia,
                            quantity: item[1],
                        });
                    }
                });
                localStorage.removeItem('phonestore_cart');
                localStorage.setItem('phonestore_cart', JSON.stringify(products));
                console.log('✅ Đã load cart cho user:', currentUser.id, 'Số sản phẩm:', products.length);
            }
        } else {
            console.log('ℹ️ User không có cart data mẫu');
        }
    } else {
        console.log('ℹ️ Chưa đăng nhập, không load cart data');
    }
} catch (error) {
    console.error('❌ Lỗi khi load cart data:', error);
    products = [];
}







