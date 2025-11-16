// Lấy dữ liệu sản phẩm và loại sản phẩm
let inventoryProducts = JSON.parse(localStorage.getItem('phonestore_products')) || [];
let productCategories = JSON.parse(localStorage.getItem('phonestore_categories')) || [];
let ordersInventory = JSON.parse(localStorage.getItem('phonestore_orders')) || [];
let inventoryItemsPerPage = 10;
let inventoryCurrentPage = 1;
let inventoryLastResults = [];

window.addEventListener('storage', function(e) {
    if (e.key === 'phonestore_categories') {
        productCategories = JSON.parse(e.newValue || '[]');
        initializeInventoryForm();
    }
    if (e.key === 'phonestore_products') {
        inventoryProducts = JSON.parse(e.newValue || '[]');
        initializeInventoryForm();
    }
    if (e.key === 'phonestore_import_orders') {
        // Cập nhật lại khi có thay đổi import orders (không cần reload data vì chỉ dùng để tính toán)
        // Có thể trigger lại search nếu đang có kết quả hiển thị
    }
    if (e.key === 'phonestore_orders') {
        ordersInventory = JSON.parse(e.newValue || '[]');
        initializeInventoryForm();
    }
});

function checkForUpdates() {
    const currentTypes = JSON.parse(localStorage.getItem('phonestore_categories') || '[]');
    const currentInventory = JSON.parse(localStorage.getItem('phonestore_products') || '[]');
    const currentOrders = JSON.parse(localStorage.getItem('phonestore_orders') || '[]');
    
    if (JSON.stringify(currentTypes) !== JSON.stringify(productCategories)) {
        productCategories = currentTypes;
        initializeInventoryForm();
    }
    
    if (JSON.stringify(currentInventory) !== JSON.stringify(inventoryProducts)) {
        inventoryProducts = currentInventory;
        initializeInventoryForm();
    }
    
    if (JSON.stringify(currentOrders) !== JSON.stringify(ordersInventory)) {
        ordersInventory = currentOrders;
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

    const productId = document.getElementById('inventory-product').value;
    const productType = document.getElementById('inventory-type').value;
    const startDate = document.getElementById('inventory-start-date').value;
    const endDate = document.getElementById('inventory-end-date').value;

    let productsToSearch = inventoryProducts;
    
    // Lọc theo loại sản phẩm nếu có
    if (productType != "") {
        productsToSearch = productsToSearch.filter(p => p.danhmuc === productType);
    }
    
    // Lọc theo sản phẩm cụ thể nếu có
    if (productId != "") {
        productsToSearch = productsToSearch.filter(p => p.id === parseInt(productId, 10));
    }

    // Tính toán inventory cho từng sản phẩm
    // Nếu không có ngày, truyền null để lấy tất cả
    const results = productsToSearch.map(product => ({
        productId: product.id,
        inventory: calculateInventory(product.id, startDate || null, endDate || null)
    }));

    inventoryCurrentPage = 1;
    renderInventoryResults(results);
}

// Hàm parse date từ định dạng dd/mm/yyyy hoặc dd/mm/yyyy HH:mm
function parseDateTime(dateStr) {
    if (!dateStr) return null;
    
    // Nếu là string có chứa "/" thì parse theo định dạng dd/mm/yyyy
    if (typeof dateStr === 'string' && dateStr.includes('/')) {
        const parts = dateStr.split(' ');
        const datePart = parts[0]; // "dd/mm/yyyy"
        const timePart = parts[1] || "00:00"; // "HH:mm" hoặc mặc định "00:00"
        
        const [day, month, year] = datePart.split('/').map(Number);
        const [hour, minute] = timePart.split(':').map(Number);
        
        return new Date(year, month - 1, day, hour || 0, minute || 0);
    }
    
    // Nếu không phải định dạng dd/mm/yyyy thì dùng Date constructor bình thường
    return new Date(dateStr);
}

// Tính toán dữ liệu nhập xuất tồn
function calculateInventory(productId, startDate, endDate) {
    const orders = JSON.parse(localStorage.getItem('phonestore_orders')) || [];
    const importOrders = JSON.parse(localStorage.getItem('phonestore_import_orders')) || [];
    
    // Chuyển đổi productId sang number để so sánh đúng với ID trong product_list
    const productIdNum = typeof productId === 'string' ? parseInt(productId, 10) : productId;
    
    // Lấy thông tin sản phẩm để so sánh tên
    const product = inventoryProducts.find(p => p.id === productIdNum);
    if (!product) {
        return {
            openingStock: 0,
            imported: 0,
            exported: 0,
            closingStock: 0
        };
    }
    
    // Kiểm tra nếu không có ngày thì lấy tất cả
    const hasDateFilter = startDate && endDate;
    
    let startDateObj = null;
    let endDateObj = null;
    
    if (hasDateFilter) {
        // Chuyển đổi ngày
        startDateObj = new Date(startDate);
        endDateObj = new Date(endDate);
        startDateObj.setHours(0, 0, 0, 0);
        endDateObj.setHours(23, 59, 59, 999);
    }

    // Tính số lượng xuất (từ đơn hàng)
    const exported = orders.reduce((total, order) => {
        if (!hasDateFilter) {
            if (order.status === 'waiting' || order.status === 'cancel') return total;
            const productInOrder = order.product_list.find(([id]) => id == productIdNum);
            if (productInOrder) {
                return total + productInOrder[1];
            }
            return total;
        }
        const orderDate = parseDateTime(order.date);
        if (orderDate && orderDate >= startDateObj && orderDate <= endDateObj) {
            if (order.status === 'waiting' || order.status === 'cancel') return total;
            const productInOrder = order.product_list.find(([id]) => id == productIdNum);
            if (productInOrder) {
                return total + productInOrder[1];
            }
        }
        return total;
    }, 0);
    console.log(exported);

    // Tính số lượng nhập từ import orders (chỉ tính các phiếu đã hoàn thành)
    const imported = importOrders.reduce((total, impOrder) => {
        // Chỉ tính các phiếu nhập đã hoàn thành
        if (impOrder.status !== 'Hoàn thành') return total;
        
        // Nếu không có filter ngày, lấy tất cả
        if (!hasDateFilter) {
            // Tìm sản phẩm trong details bằng cách so sánh tên
            const productInImport = impOrder.details?.find(d => 
                d.product && d.product.trim() === product.tensanpham.trim()
            );
            if (productInImport) {
                return total + (productInImport.qty || 0);
            }
            return total;
        }
        
        // Có filter ngày thì kiểm tra ngày
        const importDate = parseDateTime(impOrder.date);
        if (importDate && importDate >= startDateObj && importDate <= endDateObj) {
            // Tìm sản phẩm trong details bằng cách so sánh tên
            const productInImport = impOrder.details?.find(d => 
                d.product && d.product.trim() === product.tensanpham.trim()
            );
            if (productInImport) {
                return total + (productInImport.qty || 0);
            }
        }
        return total;
    }, 0);

    // Tìm tồn đầu kỳ (chỉ tính nếu có filter ngày)
    const openingStock = hasDateFilter ? calculateOpeningStock(productId, startDateObj) : 0;
    
    // Tính tồn cuối kỳ
    // Nếu không có filter ngày, tồn cuối kỳ = tổng nhập - tổng xuất
    // Nếu có filter ngày, tồn cuối kỳ = tồn đầu kỳ + nhập - xuất
    const closingStock = hasDateFilter 
        ? openingStock + imported - exported
        : imported - exported;

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
    const importOrders = JSON.parse(localStorage.getItem('phonestore_import_orders')) || [];
    
    // Chuyển đổi productId sang number để so sánh đúng với ID trong product_list
    const productIdNum = typeof productId === 'string' ? parseInt(productId, 10) : productId;
    
    // Lấy thông tin sản phẩm để so sánh tên
    const product = inventoryProducts.find(p => p.id === productIdNum);
    if (!product) return 0;
    
    // Tính tổng nhập trước ngày bắt đầu (chỉ tính các phiếu đã hoàn thành)
    const totalImported = importOrders.reduce((total, impOrder) => {
        // Chỉ tính các phiếu nhập đã hoàn thành
        if (impOrder.status !== 'Hoàn thành') return total;
        
        const importDate = parseDateTime(impOrder.date);
        if (importDate && importDate < startDate) {
            // Tìm sản phẩm trong details bằng cách so sánh tên
            const productInImport = impOrder.details?.find(d => 
                d.product && d.product.trim() === product.tensanpham.trim()
            );
            if (productInImport) {
                return total + (productInImport.qty || 0);
            }
        }
        return total;
    }, 0);

    // Tính tổng xuất trước ngày bắt đầu
    const totalExported = orders.reduce((total, order) => {
        const orderDate = parseDateTime(order.date);
        if (orderDate && orderDate < startDate) {
            const productInOrder = order.product_list.find(([id]) => id == productIdNum);
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
    inventoryLastResults = results;

    const totalStock = results.reduce((s, r) => s + r.inventory.closingStock, 0);
    const totalValue = results.reduce((s, r) => {
        const p = inventoryProducts.find(p => p.id === r.productId);
        return s + (p ? r.inventory.closingStock * p.gia : 0);
    }, 0);
    const lowStockCount = results.reduce((s, r) => s + (r.inventory.closingStock <= 5 ? 1 : 0), 0);

    const totalPages = Math.ceil(results.length / inventoryItemsPerPage) || 1;
    const startIdx = (inventoryCurrentPage - 1) * inventoryItemsPerPage;
    const pageResults = results.slice(startIdx, startIdx + inventoryItemsPerPage);

    tbody.innerHTML = ``;
    pageResults.forEach(result => {
        const product = inventoryProducts.find(p => p.id === result.productId);
        if (!product) return;
        const stockValue = result.inventory.closingStock * product.gia;
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

    document.getElementById('total-inventory').textContent = totalStock;
    document.getElementById('total-value').textContent = formatCurrency(totalValue) + '₫';
    document.getElementById('low-stock').textContent = lowStockCount;
    renderInventoryPagination(Math.ceil(inventoryLastResults.length / inventoryItemsPerPage) || 1);
}

function renderInventoryPagination(totalPages) {
    const container = document.getElementById('inventory-pagination');
    if (!container) return;
    container.innerHTML = '';

    const prev = document.createElement('button');
    prev.textContent = '‹';
    prev.disabled = inventoryCurrentPage === 1;
    prev.addEventListener('click', () => goToInventoryPage(inventoryCurrentPage - 1));
    container.appendChild(prev);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = String(i);
        if (i === inventoryCurrentPage) btn.classList.add('active');
        btn.addEventListener('click', () => goToInventoryPage(i));
        container.appendChild(btn);
    }

    const next = document.createElement('button');
    next.textContent = '›';
    next.disabled = inventoryCurrentPage >= totalPages;
    next.addEventListener('click', () => goToInventoryPage(inventoryCurrentPage + 1));
    container.appendChild(next);
}

function goToInventoryPage(page) {
    const totalPages = Math.ceil(inventoryLastResults.length / inventoryItemsPerPage) || 1;
    if (page < 1 || page > totalPages) return;
    inventoryCurrentPage = page;
    renderInventoryResults(inventoryLastResults);
    renderInventoryPagination(totalPages);
}

// Xử lý sự kiện tìm kiếm
document.getElementById('btn-search-inventory').addEventListener('click', function() {
    const productId = document.getElementById('inventory-product').value;
    const productType = document.getElementById('inventory-type').value;
    const startDate = document.getElementById('inventory-start-date').value;
    const endDate = document.getElementById('inventory-end-date').value;

    let productsToSearch = inventoryProducts;
    
    // Lọc theo loại sản phẩm nếu có
    if (productType != "") {
        productsToSearch = productsToSearch.filter(p => p.danhmuc === productType);
    }
    
    // Lọc theo sản phẩm cụ thể nếu có
    if (productId != "") {
        productsToSearch = productsToSearch.filter(p => p.id === parseInt(productId, 10));
    }
    // Tính toán inventory cho từng sản phẩm
    // Nếu không có ngày, truyền null để lấy tất cả
    const results = productsToSearch.map(product => ({
        productId: product.id,
        inventory: calculateInventory(product.id, startDate || null, endDate || null)
    }));

    inventoryCurrentPage = 1;
    renderInventoryResults(results);
});

// Khởi tạo form khi trang được load
document.addEventListener('DOMContentLoaded', initializeInventoryForm);