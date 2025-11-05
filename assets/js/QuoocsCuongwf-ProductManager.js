// ==================== QUẢN LÝ SẢN PHẨM - QUỐC CƯỜNG ====================

(function() {
    'use strict';

    class ProductManager {
        constructor() {
            this.products = [];
            this.currentPage = 1;
            this.itemsPerPage = 10;
            this.editingId = null;
            this.searchText = '';
            this.filterCategory = '';
            this.filterStatus = '';
            this.uploadedImages = []; // Lưu danh sách hình ảnh đã upload
            
            this.loadProducts();
            this.init();
        }

        // Load sản phẩm từ localStorage
        loadProducts() {
            const productsData = localStorage.getItem('phonestore_products');
            this.products = productsData ? JSON.parse(productsData) : [];
        }

        // Khởi tạo
        init() {
            this.render();
            this.attachEvents();
        }

        // Render toàn bộ giao diện
        render() {
            const container = document.getElementById('product-manager-container');
            if (!container) return;

            container.innerHTML = `
                <div class="quocscuong-product-manager">
                    ${this.renderHeader()}
                    ${this.renderToolbar()}
                    ${this.renderTable()}
                    ${this.renderPagination()}
                    ${this.renderModal()}
                </div>
            `;

            this.renderTableData();
        }

        // Render header
        renderHeader() {
            return `
                <div class="quocscuong-pm-header">
                    <div class="quocscuong-pm-title">
                        <h2><i class="fa-solid fa-mobile-screen-button"></i> Quản Lý Sản Phẩm</h2>
                        <p>Quản lý thông tin sản phẩm điện thoại</p>
                    </div>
                    <button class="btn btn-primary" id="quocscuong-btn-add">
                        <i class="fa-solid fa-plus"></i> Thêm Sản Phẩm
                    </button>
                </div>
            `;
        }

        // Render toolbar (search & filter)
        renderToolbar() {
            return `
                <div class="quocscuong-pm-toolbar">
                    <div class="quocscuong-pm-search">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <input type="text" id="quocscuong-search" placeholder="Tìm kiếm sản phẩm...">
                    </div>
                    <div class="quocscuong-pm-filter">
                        <select id="quocscuong-filter-category">
                            <option value="">Tất cả danh mục</option>
                            <option value="Iphone">iPhone</option>
                            <option value="Samsung">Samsung</option>
                            <option value="Oppo">Oppo</option>
                            <option value="Xiaomi">Xiaomi</option>
                            <option value="Vivo">Vivo</option>
                        </select>
                    </div>
                    <div class="quocscuong-pm-filter">
                        <select id="quocscuong-filter-status">
                            <option value="">Tất cả trạng thái</option>
                            <option value="true">Còn hàng</option>
                            <option value="false">Hết hàng</option>
                        </select>
                    </div>
                </div>
            `;
        }

        // Render table structure
        renderTable() {
            return `
                <div class="quocscuong-pm-table-container">
                    <table class="quocscuong-pm-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Hình ảnh</th>
                                <th>Tên sản phẩm</th>
                                <th>Danh mục</th>
                                <th>Giá bán</th>
                                <th>Số lượng</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody id="quocscuong-table-body">
                        </tbody>
                    </table>
                </div>
            `;
        }

        // Render table data
        renderTableData() {
            const tbody = document.getElementById('quocscuong-table-body');
            if (!tbody) return;

            const filtered = this.getFilteredProducts();
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            const paginated = filtered.slice(start, end);

            if (paginated.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="8" class="quocscuong-pm-no-data">
                            <i class="fa-solid fa-box-open"></i>
                            <p>Không tìm thấy sản phẩm</p>
                        </td>
                    </tr>
                `;
            } else {
                tbody.innerHTML = paginated.map(p => `
                    <tr>
                        <td>#${p.id}</td>
                        <td><img src="${p.hinhanh}" class="quocscuong-pm-thumbnail" onerror="this.src='/assets/images/placeholder.png'"></td>
                        <td><strong>${p.tensanpham}</strong></td>
                        <td>${p.danhmuc}</td>
                        <td>${this.formatPrice(p.gia)}</td>
                        <td>${p.soluong}</td>
                        <td>
                            <span class="quocscuong-pm-badge ${p.trangthai ? 'success' : 'danger'}">
                                ${p.trangthai ? 'Còn hàng' : 'Hết hàng'}
                            </span>
                        </td>
                        <td class="quocscuong-pm-actions">
                            <button class="quocscuong-pm-btn-icon quocscuong-pm-btn-edit" data-id="${p.id}">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button class="quocscuong-pm-btn-icon quocscuong-pm-btn-delete" data-id="${p.id}">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
            }

            this.updatePagination(filtered.length);
            this.attachTableEvents();
        }

        // Render pagination
        renderPagination() {
            return `<div id="quocscuong-pagination" class="quocscuong-pm-pagination"></div>`;
        }

        // Update pagination
        updatePagination(total) {
            const container = document.getElementById('quocscuong-pagination');
            if (!container) return;

            const totalPages = Math.ceil(total / this.itemsPerPage);
            if (totalPages <= 1) {
                container.innerHTML = '';
                return;
            }

            let html = `
                <button class="quocscuong-pm-page-btn ${this.currentPage === 1 ? 'disabled' : ''}" data-page="${this.currentPage - 1}">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
            `;

            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
                    html += `
                        <button class="quocscuong-pm-page-btn ${this.currentPage === i ? 'active' : ''}" data-page="${i}">
                            ${i}
                        </button>
                    `;
                } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
                    html += `<span>...</span>`;
                }
            }

            html += `
                <button class="quocscuong-pm-page-btn ${this.currentPage === totalPages ? 'disabled' : ''}" data-page="${this.currentPage + 1}">
                    <i class="fa-solid fa-chevron-right"></i>
                </button>
            `;

            container.innerHTML = html;
        }

        // Render modal
        renderModal() {
            return `
                <div id="quocscuong-modal" class="quocscuong-pm-modal">
                    <div class="quocscuong-pm-modal-content">
                        <div class="quocscuong-pm-modal-header">
                            <h3 id="quocscuong-modal-title">Thêm Sản Phẩm</h3>
                            <button class="quocscuong-pm-modal-close" id="quocscuong-modal-close">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                        <div class="quocscuong-pm-modal-body">
                            <form id="quocscuong-product-form">
                                <div class="quocscuong-pm-form-group">
                                    <label>Tên sản phẩm <span style="color:red">*</span></label>
                                    <input type="text" id="quocscuong-tensanpham" required>
                                </div>
                                
                                <div class="quocscuong-pm-form-row">
                                    <div class="quocscuong-pm-form-group">
                                        <label>Danh mục <span style="color:red">*</span></label>
                                        <select id="quocscuong-danhmuc" required>
                                            <option value="">Chọn danh mục</option>
                                            <option value="Iphone">iPhone</option>
                                            <option value="Samsung">Samsung</option>
                                            <option value="Oppo">Oppo</option>
                                            <option value="Xiaomi">Xiaomi</option>
                                            <option value="Vivo">Vivo</option>
                                        </select>
                                    </div>
                                    <div class="quocscuong-pm-form-group">
                                        <label>Số lượng <span style="color:red">*</span></label>
                                        <input type="number" id="quocscuong-soluong" min="0" required>
                                    </div>
                                </div>

                                <div class="quocscuong-pm-form-row">
                                    <div class="quocscuong-pm-form-group">
                                        <label>Giá vốn (VNĐ) <span style="color:red">*</span></label>
                                        <input type="number" id="quocscuong-giavon" min="0" required>
                                    </div>
                                    <div class="quocscuong-pm-form-group">
                                        <label>Giá bán (VNĐ) <span style="color:red">*</span></label>
                                        <input type="number" id="quocscuong-gia" min="0" required>
                                    </div>
                                </div>

                                <div class="quocscuong-pm-form-row">
                                    <div class="quocscuong-pm-form-group">
                                        <label>Giá cũ (VNĐ)</label>
                                        <input type="number" id="quocscuong-oldprice" min="0">
                                    </div>
                                    <div class="quocscuong-pm-form-group">
                                        <label>Lượt đánh giá</label>
                                        <input type="number" id="quocscuong-reviews" min="0" readonly style="background: #f5f5f5; cursor: not-allowed;">
                                    </div>
                                </div>

                                <div class="quocscuong-pm-form-group">
                                    <label>Màu sắc (ngăn cách bởi dấu phẩy)</label>
                                    <input type="text" id="quocscuong-color" placeholder="Đen, Trắng, Xanh">
                                </div>

                                <div class="quocscuong-pm-form-group">
                                    <label>Dung lượng (ngăn cách bởi dấu phẩy)</label>
                                    <input type="text" id="quocscuong-memory" placeholder="128GB, 256GB, 512GB">
                                </div>

                                <div class="quocscuong-pm-form-group">
                                    <label>Hình ảnh sản phẩm <span style="color:red">*</span></label>
                                    <div style="margin-bottom: 10px;">
                                        <button type="button" class="btn btn-secondary" id="quocscuong-btn-upload" style="width: 100%;">
                                            <i class="fa-solid fa-upload"></i> Chọn hình ảnh từ máy tính
                                        </button>
                                        <input type="file" id="quocscuong-file-input" accept="image/*" multiple style="display: none;">
                                        <small style="color: #666;">Có thể chọn nhiều hình ảnh (Ctrl + Click)</small>
                                    </div>
                                    <div id="quocscuong-image-preview" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; margin-top: 10px;">
                                        <!-- Image previews will be here -->
                                    </div>
                                    <input type="hidden" id="quocscuong-hinhanh" required>
                                </div>

                                <div class="quocscuong-pm-form-group">
                                    <label>Mô tả</label>
                                    <textarea id="quocscuong-description" rows="3"></textarea>
                                </div>

                                <div class="quocscuong-pm-form-group">
                                    <label>
                                        <input type="checkbox" id="quocscuong-trangthai" checked>
                                        Còn hàng
                                    </label>
                                </div>
                            </form>
                        </div>
                        <div class="quocscuong-pm-modal-footer">
                            <button type="button" class="btn btn-secondary" id="quocscuong-btn-cancel">Hủy</button>
                            <button type="submit" class="btn btn-primary" id="quocscuong-btn-save">Lưu</button>
                        </div>
                    </div>
                </div>
            `;
        }

        // Get filtered products
        getFilteredProducts() {
            return this.products.filter(p => {
                const matchSearch = !this.searchText || 
                    p.tensanpham.toLowerCase().includes(this.searchText.toLowerCase()) ||
                    p.id.toString().includes(this.searchText);
                const matchCategory = !this.filterCategory || p.danhmuc === this.filterCategory;
                const matchStatus = !this.filterStatus || p.trangthai.toString() === this.filterStatus;
                
                return matchSearch && matchCategory && matchStatus;
            });
        }

        // Attach events
        attachEvents() {
            // Add button
            document.addEventListener('click', (e) => {
                if (e.target.closest('#quocscuong-btn-add')) {
                    this.openModal();
                }
                
                // Upload button
                if (e.target.closest('#quocscuong-btn-upload')) {
                    document.getElementById('quocscuong-file-input').click();
                }
                
                // Remove image
                if (e.target.closest('.quocscuong-remove-img')) {
                    const index = parseInt(e.target.closest('.quocscuong-remove-img').dataset.index);
                    this.removeImage(index);
                }
                
                // Close modal
                if (e.target.closest('#quocscuong-modal-close') || e.target.closest('#quocscuong-btn-cancel')) {
                    this.closeModal();
                }
                
                // Save button
                if (e.target.closest('#quocscuong-btn-save')) {
                    e.preventDefault();
                    this.saveProduct();
                }

                // Pagination
                const pageBtn = e.target.closest('.quocscuong-pm-page-btn');
                if (pageBtn && !pageBtn.classList.contains('disabled')) {
                    const page = parseInt(pageBtn.dataset.page);
                    if (page) {
                        this.currentPage = page;
                        this.renderTableData();
                    }
                }
            });

            // File input change
            document.addEventListener('change', (e) => {
                if (e.target.id === 'quocscuong-file-input') {
                    this.handleFileUpload(e.target.files);
                }
            });

            // Search
            document.addEventListener('input', (e) => {
                if (e.target.id === 'quocscuong-search') {
                    this.searchText = e.target.value;
                    this.currentPage = 1;
                    this.renderTableData();
                }
            });

            // Filters
            document.addEventListener('change', (e) => {
                if (e.target.id === 'quocscuong-filter-category') {
                    this.filterCategory = e.target.value;
                    this.currentPage = 1;
                    this.renderTableData();
                }
                if (e.target.id === 'quocscuong-filter-status') {
                    this.filterStatus = e.target.value;
                    this.currentPage = 1;
                    this.renderTableData();
                }
            });
        }

        // Attach table events
        attachTableEvents() {
            // Edit buttons
            document.querySelectorAll('.quocscuong-pm-btn-edit').forEach(btn => {
                btn.onclick = () => {
                    const id = parseInt(btn.dataset.id);
                    this.editProduct(id);
                };
            });

            // Delete buttons
            document.querySelectorAll('.quocscuong-pm-btn-delete').forEach(btn => {
                btn.onclick = () => {
                    const id = parseInt(btn.dataset.id);
                    this.deleteProduct(id);
                };
            });
        }

        // Open modal
        openModal(product = null) {
            const modal = document.getElementById('quocscuong-modal');
            const title = document.getElementById('quocscuong-modal-title');
            
            if (product) {
                title.textContent = 'Sửa Sản Phẩm';
                this.fillForm(product);
                this.editingId = product.id;
            } else {
                title.textContent = 'Thêm Sản Phẩm';
                this.clearForm();
                this.editingId = null;
            }
            
            modal.classList.add('show');
        }

        // Close modal
        closeModal() {
            const modal = document.getElementById('quocscuong-modal');
            modal.classList.remove('show');
            this.clearForm();
            this.uploadedImages = [];
        }

        // Handle file upload
        handleFileUpload(files) {
            if (!files || files.length === 0) return;

            Array.from(files).forEach(file => {
                if (!file.type.startsWith('image/')) {
                    alert('Vui lòng chỉ chọn file hình ảnh!');
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    this.uploadedImages.push(e.target.result);
                    this.renderImagePreviews();
                    this.updateHiddenInput();
                };
                reader.readAsDataURL(file);
            });
        }

        // Render image previews
        renderImagePreviews() {
            const container = document.getElementById('quocscuong-image-preview');
            if (!container) return;

            container.innerHTML = this.uploadedImages.map((src, index) => `
                <div style="position: relative; border: 2px solid #ddd; border-radius: 8px; overflow: hidden; aspect-ratio: 1;">
                    <img src="${src}" style="width: 100%; height: 100%; object-fit: cover;">
                    <button type="button" class="quocscuong-remove-img" data-index="${index}" 
                            style="position: absolute; top: 5px; right: 5px; width: 25px; height: 25px; 
                                   background: #dc3545; color: white; border: none; border-radius: 50%; 
                                   cursor: pointer; display: flex; align-items: center; justify-content: center; 
                                   font-size: 16px; font-weight: bold;">
                        ×
                    </button>
                    ${index === 0 ? '<div style="position: absolute; bottom: 5px; left: 5px; background: #28a745; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px;">Chính</div>' : ''}
                </div>
            `).join('');
        }

        // Remove image
        removeImage(index) {
            this.uploadedImages.splice(index, 1);
            this.renderImagePreviews();
            this.updateHiddenInput();
        }

        // Update hidden input
        updateHiddenInput() {
            const input = document.getElementById('quocscuong-hinhanh');
            if (input) {
                // Lưu tất cả hình ảnh dưới dạng JSON array
                input.value = JSON.stringify(this.uploadedImages);
            }
        }

        // Fill form
        fillForm(product) {
            document.getElementById('quocscuong-tensanpham').value = product.tensanpham || '';
            document.getElementById('quocscuong-danhmuc').value = product.danhmuc || '';
            document.getElementById('quocscuong-soluong').value = product.soluong || '';
            document.getElementById('quocscuong-giavon').value = product.giavon || '';
            document.getElementById('quocscuong-gia').value = product.gia || '';
            document.getElementById('quocscuong-oldprice').value = product.oldPrice || '';
            document.getElementById('quocscuong-reviews').value = product.reviews || 0;
            document.getElementById('quocscuong-color').value = product.color ? product.color.join(', ') : '';
            document.getElementById('quocscuong-memory').value = product.memory ? product.memory.join(', ') : '';
            document.getElementById('quocscuong-description').value = product.description || '';
            document.getElementById('quocscuong-trangthai').checked = product.trangthai;
            
            // Load hình ảnh
            if (product.images && Array.isArray(product.images) && product.images.length > 0) {
                // Nếu có mảng images (format mới)
                this.uploadedImages = [...product.images];
            } else if (product.hinhanh) {
                // Backward compatible: nếu chỉ có hinhanh
                try {
                    // Nếu hinhanh là JSON array
                    if (product.hinhanh.startsWith('[')) {
                        this.uploadedImages = JSON.parse(product.hinhanh);
                    } else {
                        // Nếu là string đơn
                        this.uploadedImages = [product.hinhanh];
                    }
                } catch (e) {
                    // Nếu không parse được, coi như string đơn
                    this.uploadedImages = [product.hinhanh];
                }
            } else {
                this.uploadedImages = [];
            }
            
            if (this.uploadedImages.length > 0) {
                this.renderImagePreviews();
                this.updateHiddenInput();
            }
        }

        // Clear form
        clearForm() {
            document.getElementById('quocscuong-product-form').reset();
            this.editingId = null;
            this.uploadedImages = [];
            this.renderImagePreviews();
        }

        // Save product
        saveProduct() {
            // Parse hinhanh từ hidden input (là JSON array)
            let hinhanhValue = document.getElementById('quocscuong-hinhanh').value.trim();
            let hinhanhArray = [];
            
            try {
                if (hinhanhValue.startsWith('[')) {
                    hinhanhArray = JSON.parse(hinhanhValue);
                } else if (hinhanhValue) {
                    hinhanhArray = [hinhanhValue];
                }
            } catch (e) {
                hinhanhArray = hinhanhValue ? [hinhanhValue] : [];
            }

            const data = {
                tensanpham: document.getElementById('quocscuong-tensanpham').value.trim(),
                danhmuc: document.getElementById('quocscuong-danhmuc').value,
                soluong: document.getElementById('quocscuong-soluong').value,
                giavon: parseInt(document.getElementById('quocscuong-giavon').value) || 0,
                gia: parseInt(document.getElementById('quocscuong-gia').value) || 0,
                oldPrice: parseInt(document.getElementById('quocscuong-oldprice').value) || 0,
                rating: parseFloat(document.getElementById('quocscuong-reviews').value) || 0,
                reviews: 0,
                color: document.getElementById('quocscuong-color').value.split(',').map(c => c.trim()).filter(c => c),
                memory: document.getElementById('quocscuong-memory').value.split(',').map(m => m.trim()).filter(m => m),
                hinhanh: hinhanhArray.length > 0 ? hinhanhArray[0] : '', // Ảnh chính (ảnh đầu tiên)
                images: hinhanhArray, // Toàn bộ mảng ảnh
                description: document.getElementById('quocscuong-description').value.trim(),
                trangthai: document.getElementById('quocscuong-trangthai').checked
            };

            // Tính discount
            if (data.oldPrice > data.gia) {
                data.discount = Math.round(((data.oldPrice - data.gia) / data.oldPrice) * -100);
            } else {
                data.discount = 0;
            }

            if (this.editingId) {
                // Update
                const index = this.products.findIndex(p => p.id === this.editingId);
                if (index !== -1) {
                    this.products[index] = { ...this.products[index], ...data };
                    alert('Cập nhật sản phẩm thành công!');
                }
            } else {
                // Add new
                const newId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
                this.products.push({ id: newId, ...data });
                alert('Thêm sản phẩm thành công!');
            }

            this.saveToLocalStorage();
            this.renderTableData();
            this.closeModal();
        }

        // Edit product
        editProduct(id) {
            const product = this.products.find(p => p.id === id);
            if (product) {
                this.openModal(product);
            }
        }

        // Delete product
        deleteProduct(id) {
            const product = this.products.find(p => p.id === id);
            if (!product) return;

            if (confirm(`Bạn có chắc muốn xóa "${product.tensanpham}"?`)) {
                this.products = this.products.filter(p => p.id !== id);
                this.saveToLocalStorage();
                this.renderTableData();
                alert('Xóa sản phẩm thành công!');
            }
        }

        // Save to localStorage
        saveToLocalStorage() {
            localStorage.setItem('phonestore_products', JSON.stringify(this.products));
            // Gọi hàm render lại từ quoocscuongwf-index.js
            if (typeof window.reloadProductsFromStorage === 'function') {
                window.reloadProductsFromStorage();
            }
        }

        // Format price
        formatPrice(price) {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
        }
    }

    // Biến global để lưu instance
    let productManagerInstance = null;

    // Hàm khởi tạo Product Manager
    function initProductManager() {
        const container = document.getElementById('product-manager-container');
        if (container && !productManagerInstance) {
            productManagerInstance = new ProductManager();
        } else if (container && productManagerInstance) {
            // Nếu đã có instance, chỉ cần render lại
            productManagerInstance.render();
        }
    }

    // Init when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initProductManager);
    } else {
        initProductManager();
    }

    // Theo dõi khi products-content được hiển thị
    const observer = new MutationObserver(() => {
        const productsContent = document.getElementById('products-content');
        if (productsContent && productsContent.style.display !== 'none') {
            initProductManager();
        }
    });

    // Bắt đầu observe khi DOM ready
    const startObserver = () => {
        const productsContent = document.getElementById('products-content');
        if (productsContent) {
            observer.observe(productsContent, {
                attributes: true,
                attributeFilter: ['style']
            });
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startObserver);
    } else {
        startObserver();
    }

    // Lắng nghe sự kiện khi section products được hiển thị (nếu có)
    document.addEventListener('sectionChanged', (e) => {
        if (e.detail && e.detail.sectionId === 'products') {
            initProductManager();
        }
    });

    // Expose hàm init ra ngoài để có thể gọi từ bên ngoài
    window.initProductManager = initProductManager;
})();
