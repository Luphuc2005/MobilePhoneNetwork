document.addEventListener("DOMContentLoaded", () => {
    const categoryTableBody = document.getElementById('categoryTableBody');
    if (!categoryTableBody) {
        return;
    }

    console.log("Khởi tạo module Quản lý Loại Sản Phẩm...");

    const STORAGE_KEY = STORAGE_KEYS.CATEGORIES ;
        const SOURCE = STORAGE_KEY+'-page';
        // --- Hàm quản lý localStorage ---
        function saveCategoriestoStorage() {
            return StorageHelper.save(STORAGE_KEY, categories,SOURCE);
        }

    function loadCategoriesFromStorage() {
        return StorageHelper.load(STORAGE_KEY, null); 
    }

    // --- Khởi tạo dữ liệu ---
    let categories = [];
    const loadedData = loadCategoriesFromStorage();
    // dữ liệu đã tồn tại lấy dữ liệu đó 
    if (loadedData && loadedData.length > 0) {
        categories = loadedData;
        console.log('Sử dụng dữ liệu từ localStorage');
    } else {
        //gán dữ liệu mặc định 
        categories = [...DEFAULT_CATEGORIES];
        saveCategoriestoStorage();
        console.log('Khởi tạo dữ liệu mặc định');
    }

    // các biến quản lý 
    let currentPage = 1;
    const itemsPerPage = 5;
    let filteredCategories = [...categories];
    let editingId = null;
    let uploadedImageData = null;

    //DOM Elements 
    const getElementByIdOrWarn = (id) => {
        const element = document.getElementById(id);
        if (!element) console.error(`Không tìm thấy element: ${id}`);
        return element;
    };
    //====QUẢN LÝ BẢNG && TÌM KIẾM ========
    //ô tiifm kiếm 
    const searchInput = getElementByIdOrWarn('searchInput');
    //thân bản
    const tableBody = categoryTableBody;
    //thông tin bảng
    const paginationInfo = getElementByIdOrWarn('paginationInfo');
    //container chứa nút trang
    const paginationContainer = getElementByIdOrWarn('paginationContainer');
    //========== MODAL =======
    //thêm loại sản phẩm
    const btnAddCategory = getElementByIdOrWarn('btnAddCategory');
    //container modal
    const modal = getElementByIdOrWarn('categoryModal');
    //tiêu đề
    const modalTitle = getElementByIdOrWarn('modalTitle');
    //đóng
    const modalClose = getElementByIdOrWarn('modalClose');
    //lưu 
    const saveBtn = getElementByIdOrWarn('saveBtn');
    //thoát
    const cancelBtn = getElementByIdOrWarn('cancelBtn');
    //======ICON====
    //input chọn ảnh
    const categoryIconUpload = getElementByIdOrWarn('categoryIconUpload');
   //ảnh xem trước(ẩn khu vực xem trước)
    const imagePreview = getElementByIdOrWarn('imagePreview');
    //thẻ img  
    const previewImg = getElementByIdOrWarn('previewImg');
    // xóa ảnh
    const removeImage = getElementByIdOrWarn('removeImage');
    //=======TRƯỜNG DỮ LIỆU =====
    //tên loại
    const categoryName = getElementByIdOrWarn('categoryName');
    // mô tả
    const categoryDescription = getElementByIdOrWarn('categoryDescription');
    //container trạng thái
    const statusContainer = getElementByIdOrWarn('statusContainer');
    //trạng thái (drop/select)
    const categoryStatus = getElementByIdOrWarn('categoryStatus');
    //========TOAST========
    //container
    const toast = getElementByIdOrWarn('toast');
    //nội dung 
    const toastMessage = getElementByIdOrWarn('toastMessage');

    // --- Hàm Toast ---
    function showToast(message, type = 'success') {
        if (!toast || !toastMessage) {
            alert(message);
            return;
        }
        toastMessage.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // --- Hàm Modal ---
    function openModal() {
        if (modal) modal.style.display = 'block';
    }

    function closeModal() {
        if (modal) modal.style.display = 'none';
        editingId = null;
        uploadedImageData = null;
        if (categoryName) categoryName.value = '';
        if (categoryDescription) categoryDescription.value = '';
        if (statusContainer) statusContainer.style.display = 'none';
        if (imagePreview) imagePreview.style.display = 'none';
        if (categoryIconUpload) categoryIconUpload.value = '';
        if (previewImg) previewImg.src = '';
    }

    // --- Render Bảng ---
    function renderTable() {
        if (!tableBody) return;

        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const currentCategories = filteredCategories.slice(start, end);

        if (currentCategories.length === 0 && filteredCategories.length === 0) {
            tableBody.innerHTML = `
                <div class="empty-state" style="text-align:center; padding:40px;">
                    <p style="color:#777; margin-top:15px;">Không tìm thấy loại sản phẩm nào</p>
                </div>`;
        } else if (currentCategories.length === 0) {
            currentPage = 1;
            renderTable();
            return;
        } else {
            tableBody.innerHTML = currentCategories.map(cat => {
                const iconHtml = cat.iconType === 'image'
                    ? `<img src="${cat.icon}" alt="${cat.name}" />`
                    : `<span>${cat.icon}</span>`;
                const toggleText = cat.status === 'Hoạt động' ? 'Ẩn' : 'Hiện';
                const toggleClass = cat.status === 'Hoạt động' ? 'btn-delete' : 'btn-show';
                const toggleIcon = cat.status === 'Hoạt động' ? 'fa-eye-slash' : 'fa-eye';

                return `
                    <div class="table-row-cate">
                        <div data-label="ID">${cat.id}</div>
                        <div data-label="Icon" class="category-icon">${iconHtml}</div>
                        <div data-label="Tên loại" style="font-weight:600;">${cat.name}</div>
                        <div data-label="Số SP">${cat.productCount} sản phẩm</div>
                        <div data-label="Trạng thái">
                            <span class="status-badge ${cat.status === 'Hoạt động' ? 'status-active' : 'status-hidden'}">${cat.status}</span>
                        </div>
                        <div data-label="Hành động" class="action-buttons">
                            <button class="btn-action btn-edit" title="Sửa" onclick="editCategory(${cat.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-action ${toggleClass}" title="${toggleText}" onclick="toggleCategory(${cat.id})">
                                <i class="fas ${toggleIcon}"></i>
                            </button>
                            <button class="btn-action btn-danger" title="Xóa" onclick="deleteCategory(${cat.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>`;
            }).join('');
        }
        //update phân trang
        updatePaginationInfo();
        //khởi tạo
        renderPagination();
    }

    //phân trang 
    function updatePaginationInfo() {
        if (!paginationInfo) return;
        //(số trang trôi qua *item)
        const start = (currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(currentPage * itemsPerPage, filteredCategories.length);

        if (filteredCategories.length === 0) {
            paginationInfo.textContent = 'Không có loại sản phẩm nào';
        } else {
            paginationInfo.textContent = `Hiển thị ${start}-${end} trong tổng số ${filteredCategories.length} loại sản phẩm`;
        }
    }

    function renderPagination() {
        if (!paginationContainer) return;
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
        //1 trang thì không cần hiện
        if (totalPages <= 1) return;

        let html = `<button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <i class="fas fa-chevron-left"></i>
        </button>`;
        // >= 1
        let startPage = Math.max(1, currentPage - 1);
        // <= totalPages
        let endPage = Math.min(totalPages, currentPage + 1);
        //trang đầu tiên không có gì để hiển thị 
        if (currentPage === 1) endPage = Math.min(totalPages, 3);
        //trang cuối ko có trang nào hiển thị 
        if (currentPage === totalPages) startPage = Math.max(1, totalPages - 2);

        if (startPage > 1) {
            html += `<span class="page-number" onclick="changePage(1)">1</span>`;
            if (startPage > 2) html += `<span class="pagination-ellipsis">...</span>`;
        }

        for (let i = startPage; i <= endPage; i++) {
            html += `<span class="page-number ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</span>`;
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) html += `<span class="pagination-ellipsis">...</span>`;
            html += `<span class="page-number" onclick="changePage(${totalPages})">${totalPages}</span>`;
        }

        html += `<button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            <i class="fas fa-chevron-right"></i>
        </button>`;

        paginationContainer.innerHTML = html;
    }
    //hàm dùng chung tất cả 
    //thây đổi trang nếu nó hợp lệ 
    window.changePage = function (page) {
        const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
        if (page < 1 || page > totalPages) return;
        currentPage = page;
        renderTable();
    };

    // --- Các thao tác quản lý ---
    window.editCategory = function (id) {
        const category = categories.find(c => c.id === id);
        if (!category) return;
        //flag(edit)
        editingId = id;
        //xóa ảnh ở modal != 
        uploadedImageData = null;
        
        if (modalTitle) modalTitle.textContent = 'Sửa loại sản phẩm';
        
        if (category.iconType === 'image') {
            //hiển thị trong modal 
            uploadedImageData = category.icon;
            //ẩn xem trước != image
            if (previewImg) previewImg.src = category.icon;
            if (imagePreview) imagePreview.style.display = 'block';
        } else {
            if (imagePreview) imagePreview.style.display = 'none';
        }
        
        if (categoryName) categoryName.value = category.name;
        if (categoryDescription) categoryDescription.value = category.description;
        if (categoryStatus) categoryStatus.value = category.status === 'Hoạt động' ? 'hoat-dong' : 'an';
        if (statusContainer) statusContainer.style.display = 'block';
        //mở modal 
        openModal();
    };

    window.toggleCategory = function (id) {
        const category = categories.find(c => c.id === id);
        if (!category) return;
        
        const newStatus = category.status === 'Hoạt động' ? 'Ẩn' : 'Hoạt động';
        const action = newStatus === 'Ẩn' ? 'ẩn' : 'hiển thị';
        
        if (confirm(`Bạn có chắc muốn ${action} loại sản phẩm "${category.name}"?`)) {
            category.status = newStatus;
            
            const filteredIndex = filteredCategories.findIndex(c => c.id === id);
            if (filteredIndex > -1) filteredCategories[filteredIndex].status = newStatus;
            
            saveCategoriestoStorage();
            renderTable();
            showToast(`Đã ${action} loại sản phẩm thành công!`, 'success');
        }
    };

    window.deleteCategory = function (id) {
        const category = categories.find(c => c.id === id);
        if (!category) return;
        
        if (confirm(`Bạn có chắc chắn muốn XÓA VĨNH VIỄN loại sản phẩm "${category.name}"?`)) {
            categories = categories.filter(c => c.id !== id);
            filteredCategories = filteredCategories.filter(c => c.id !== id);
            
            saveCategoriestoStorage();
            
            const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
            if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;
            
            renderTable();
            showToast('Đã xóa vĩnh viễn loại sản phẩm!', 'success');
        }
    };

    // --- Gắn sự kiện ---
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            filteredCategories = categories.filter(c =>
                c.name.toLowerCase().includes(term) ||
                (c.description && c.description.toLowerCase().includes(term))
            );
            currentPage = 1;
            renderTable();
        });
    }

    if (btnAddCategory) {
        btnAddCategory.addEventListener('click', () => {
            editingId = null;
            uploadedImageData = null;
            if (modalTitle) modalTitle.textContent = 'Thêm loại sản phẩm mới';
            if (statusContainer) statusContainer.style.display = 'none';
            if (imagePreview) imagePreview.style.display = 'none';
            openModal();
        });
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Upload ảnh
    if (categoryIconUpload) {
        categoryIconUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            if (!file.type.startsWith('image/')) {
                showToast('Vui lòng chọn file ảnh!', 'error');
                return;
            }
            
            if (file.size > 2 * 1024 * 1024) {
                showToast('Kích thước ảnh không được vượt quá 2MB!', 'error');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (event) => {
                uploadedImageData = event.target.result;
                if (previewImg) previewImg.src = uploadedImageData;
                if (imagePreview) imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        });
    }

    // Xóa ảnh
    if (removeImage) {
        removeImage.addEventListener('click', () => {
            uploadedImageData = null;
            if (imagePreview) imagePreview.style.display = 'none';
            if (categoryIconUpload) categoryIconUpload.value = '';
            if (previewImg) previewImg.src = '';
        });
    }

    // Lưu category
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const name = categoryName ? categoryName.value.trim() : '';
            const description = categoryDescription ? categoryDescription.value.trim() : '';
            const status = (categoryStatus ? categoryStatus.value : 'hoat-dong') === 'hoat-dong' ? 'Hoạt động' : 'Ẩn';

            if (!name) {
                showToast('Vui lòng nhập tên loại sản phẩm!', 'error');
                return;
            }

            if (!uploadedImageData) {
                showToast('Vui lòng tải lên một ảnh icon!', 'error');
                return;
            }
            //ảnh mới khi sửa
            const finalIcon = uploadedImageData;
            //kiểu ảnh != icon df
            const iconType = 'image';

            if (editingId) {
                // Chế độ sửa
                const index = categories.findIndex(c => c.id === editingId);
                const filteredIndex = filteredCategories.findIndex(c => c.id === editingId);
                
                if (index === -1) return;
                
                const updatedCategory = {
                    ...categories[index],
                    icon: finalIcon,
                    iconType,
                    name,
                    description,
                    status
                };
                
                categories[index] = updatedCategory;
                if (filteredIndex > -1) filteredCategories[filteredIndex] = updatedCategory;
                
                saveCategoriestoStorage();
                showToast('Cập nhật loại sản phẩm thành công!', 'success');
            } else {
                // Chế độ thêm mới
                const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
                const newCategory = {
                    id: newId,
                    icon: finalIcon,
                    iconType,
                    name,
                    description,
                    productCount: 0,
                    status: 'Hoạt động'
                };
                
                categories.push(newCategory);
                
                if (searchInput) searchInput.value = '';
                filteredCategories = [...categories];
                
                saveCategoriestoStorage();
                
                currentPage = Math.ceil(filteredCategories.length / itemsPerPage);
                showToast('Thêm loại sản phẩm mới thành công!', 'success');
            }
            
            closeModal();
            renderTable();
        });
    }

    // --- Render lần đầu ---
    if (categories.length === 0) {
        categories = [...DEFAULT_CATEGORIES];
        filteredCategories = [...categories];
        saveCategoriestoStorage();
    }

    setTimeout(() => {
        renderTable();
        console.log('Module Categories đã sẵn sàng!');
    }, 100);

    // --- Đồng bộ đa tab ---
    window.addEventListener('phonestore-sync', (e) => {
        //nếu trang web vừa mới lưu thì bỏ qua 
        if (e.detail.key === STORAGE_KEY && e.detail.source !== 'SOURCE') {
            console.log('Categories cập nhật từ nguồn khác');
            categories = loadCategoriesFromStorage() || categories;
            filteredCategories = [...categories];
            renderTable();
        }
    });

    // --- Debug helper ---
    window.categoriesDebug = {
        getAll: () => categories,
        getFiltered: () => filteredCategories,
        save: saveCategoriestoStorage,
        load: loadCategoriesFromStorage,
        render: renderTable,
        reset: () => {
            categories = [...DEFAULT_CATEGORIES];
            filteredCategories = [...categories];
            saveCategoriestoStorage();
            renderTable();
            console.log(' Đã reset về dữ liệu mặc định');
        }
    };

    console.log('Debug: Gõ categoriesDebug.getAll() để xem dữ liệu');
});