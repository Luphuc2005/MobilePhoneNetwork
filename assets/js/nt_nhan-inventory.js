// Lấy dữ liệu sản phẩm và loại sản phẩm
let inventoryProducts = JSON.parse(localStorage.getItem('phonestore_products')) || [];
let productCategories = JSON.parse(localStorage.getItem('phonestore_categories')) || [];

window.addEventListener('storage', function(e) {
    if (e.key === 'phonestore_categories') {
        productCategories = JSON.parse(e.newValue || '[]');
        initializeInventoryForm();
    }
    if (e.key === 'phonestore_products') {
        inventoryProducts = JSON.parse(e.newValue || '[]');
        initializeInventoryForm();
    }
});

function checkForUpdates() {
    const currentTypes = JSON.parse(localStorage.getItem('phonestore_categories') || '[]');
    const currentInventory = JSON.parse(localStorage.getItem('phonestore_products') || '[]');
    
    if (JSON.stringify(currentTypes) !== JSON.stringify(productCategories)) {
        productCategories = currentTypes;
        initializeInventoryForm();
    }
    
    if (JSON.stringify(currentInventory) !== JSON.stringify(inventoryProducts)) {
        inventoryProducts = currentInventory;
        initializeInventoryForm();
    }
}

setInterval(checkForUpdates, 2000);

// Khởi tạo dữ liệu form
function initializeInventoryForm() {
    const productSelect = document.getElementById('inventory-product');
    const typeSelect = document.getElementById('inventory-type');
    
    // Thêm options cho select sản phẩm
    productSelect.innerHTML = '<option value="">-- Chọn sản phẩm --</option>';
    inventoryProducts.forEach(product => {
        productSelect.innerHTML += `
            <option value="${product.id}">${product.tensanpham}</option>
        `;
    });

    // Thêm options cho select loại sản phẩm
    typeSelect.innerHTML = '<option value="">-- Tất cả loại --</option>';
    productCategories.forEach(category => {
        if (category.status === "Hoạt động") {
            typeSelect.innerHTML += `
                <option value="${category.name}">${category.name}</option>
            `;
        }
    });

    // Set ngày mặc định
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    document.getElementById('inventory-start-date').valueAsDate = firstDayOfMonth;
    document.getElementById('inventory-end-date').valueAsDate = today;
}

// Tính toán dữ liệu nhập xuất tồn
function calculateInventory(productId, startDate, endDate) {
    const orders = JSON.parse(localStorage.getItem('phonestore_orders')) || [];
    const imports = JSON.parse(localStorage.getItem('phonestore_imports')) || [];
    
    // Chuyển đổi ngày
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    // Tính số lượng xuất (từ đơn hàng)
    const exported = orders.reduce((total, order) => {
        const orderDate = new Date(order.date);
        if (orderDate >= startDate && orderDate <= endDate) {
            const productInOrder = order.product_list.find(([id]) => id === productId);
            if (productInOrder) {
                return total + productInOrder[1]; // [1] là số lượng
            }
        }
        return total;
    }, 0);

    // Tính số lượng nhập
    const imported = imports.reduce((total, imp) => {
        const importDate = new Date(imp.date);
        if (importDate >= startDate && importDate <= endDate) {
            const productInImport = imp.products.find(p => p.id === productId);
            if (productInImport) {
                return total + productInImport.quantity;
            }
        }
        return total;
    }, 0);

    // Tìm tồn đầu kỳ
    const openingStock = calculateOpeningStock(productId, startDate);
    
    // Tính tồn cuối kỳ
    const closingStock = openingStock + imported - exported;

    return {
        openingStock,
        imported,
        exported,
        closingStock
    };
}

// Tính tồn đầu kỳ
function calculateOpeningStock(productId, startDate) {
    const orders = JSON.parse(localStorage.getItem('phonestore_orders')) || [];
    const imports = JSON.parse(localStorage.getItem('phonestore_imports')) || [];
    
    // Tính tổng nhập trước ngày bắt đầu
    const totalImported = imports.reduce((total, imp) => {
        const importDate = new Date(imp.date);
        if (importDate < startDate) {
            const productInImport = imp.products.find(p => p.id === productId);
            if (productInImport) {
                return total + productInImport.quantity;
            }
        }
        return total;
    }, 0);

    // Tính tổng xuất trước ngày bắt đầu
    const totalExported = orders.reduce((total, order) => {
        const orderDate = new Date(order.date);
        if (orderDate < startDate) {
            const productInOrder = order.product_list.find(([id]) => id === productId);
            if (productInOrder) {
                return total + productInOrder[1];
            }
        }
        return total;
    }, 0);

    return totalImported - totalExported;
}

// Format tiền tệ
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN').format(amount);
}

// Xác định trạng thái tồn kho
function getStockStatus(closingStock) {
    if (closingStock <= 0) {
        return ['Hết hàng', 'status-low'];
    } else if (closingStock <= 5) {
        return ['Sắp hết', 'status-warning'];
    } else {
        return ['Bình thường', 'status-normal'];
    }
}

// Hiển thị kết quả tìm kiếm
function renderInventoryResults(results) {
    const tbody = document.getElementById('inventory-list');
    tbody.innerHTML = '';
    
    let totalStock = 0;
    let totalValue = 0;
    let lowStockCount = 0;

    results.forEach(result => {
        const product = inventoryProducts.find(p => p.id === result.productId);
        if (!product) return;

        const stockValue = result.inventory.closingStock * product.gia;
        totalStock += result.inventory.closingStock;
        totalValue += stockValue;
        
        if (result.inventory.closingStock <= 5) {
            lowStockCount++;
        }

        const [statusText, statusClass] = getStockStatus(result.inventory.closingStock);
        
        tbody.innerHTML += `
            <tr>
                <td>${product.tensanpham}</td>
                <td>${product.danhmuc}</td>
                <td>${result.inventory.openingStock}</td>
                <td>${result.inventory.imported}</td>
                <td>${result.inventory.exported}</td>
                <td>${result.inventory.closingStock}</td>
                <td>${formatCurrency(product.gia)}₫</td>
                <td>${formatCurrency(stockValue)}₫</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            </tr>
        `;
    });

    // Cập nhật summary
    document.getElementById('total-inventory').textContent = totalStock;
    document.getElementById('total-value').textContent = formatCurrency(totalValue) + '₫';
    document.getElementById('low-stock').textContent = lowStockCount;
}

// Xử lý sự kiện tìm kiếm
document.getElementById('btn-search-inventory').addEventListener('click', function() {
    const productId = document.getElementById('inventory-product').value;
    const productType = document.getElementById('inventory-type').value;
    const startDate = document.getElementById('inventory-start-date').value;
    const endDate = document.getElementById('inventory-end-date').value;

    let productsToSearch = inventoryProducts;
    
    // Lọc theo loại sản phẩm nếu có
    if (productType) {
        productsToSearch = productsToSearch.filter(p => p.danhmuc === productType);
    }
    
    // Lọc theo sản phẩm cụ thể nếu có
    if (productId) {
        productsToSearch = productsToSearch.filter(p => p.id === productId);
    }

    // Tính toán inventory cho từng sản phẩm
    const results = productsToSearch.map(product => ({
        productId: product.id,
        inventory: calculateInventory(product.id, startDate, endDate)
    }));

    renderInventoryResults(results);
});

// Khởi tạo form khi trang được load
document.addEventListener('DOMContentLoaded', initializeInventoryForm);

// Cập nhật khi có thay đổi trong localStorage
window.addEventListener('storage', function(e) {
    if (e.key === 'phonestore_products' || e.key === 'phonestore_categories') {
        inventoryProducts = JSON.parse(localStorage.getItem('phonestore_products')) || [];
        productCategories = JSON.parse(localStorage.getItem('phonestore_categories')) || [];
        initializeInventoryForm();
    }
});