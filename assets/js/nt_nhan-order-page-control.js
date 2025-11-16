let currentPageOrder = 1;
let numberOrderPerPage = 5;
let pageContainer = document.querySelector('.orders-content .content-footer .page-controler .page-numbers')

function calculateTotalPages(totalItems, itemsPerPage) {
    return Math.ceil(totalItems / itemsPerPage);
}

//----------- function---------------------//
function processStatus(status) {
    switch (status) {
        case "waiting": 
            return "Chờ xử lý";
        case "accepted":
            return "Đã xác nhận";
        case "done":
            return "Hoàn thành";
        case "delivery":
            return "Đang giao";
        case "cancel":
            return "Đã hủy";
        default:
            return "No status";
    }
}

function addPageButton(page, numberOrderPerPage, allOrders, allCustomers, totalOrders) {
    const btn = document.createElement('div');
    btn.textContent = page;
    btn.classList.add('page-item');
    if (page === currentPageOrder) btn.classList.add('btn-page-active');
    btn.addEventListener('click', function () {
        currentPageOrder = page;
        renderOrders((page - 1) * numberOrderPerPage, numberOrderPerPage, allOrders, allCustomers, totalOrders, page);
    });
    document.getElementsByClassName('page-numbers')[0].appendChild(btn);
}

function addEllipsis() {
    const span = document.createElement('span');
    span.textContent = '...';
    span.classList.add('ellipsis');
    document.getElementsByClassName('page-numbers')[0].appendChild(span);
}

// function renderOrders(startOrder, numberOrderPerPage, allOrders, allCustomers, totalOrders) {
//     const orderList = document.getElementsByClassName('order-list')[0];
//     const pageNumbers = document.getElementsByClassName('page-numbers')[0];
    
//     orderList.innerHTML = '';
//     pageNumbers.innerHTML = '';

//     // Tính toán chỉ số kết thúc thực tế
//     const endOrder = Math.min(startOrder + numberOrderPerPage, totalOrders);

//     for (let i = startOrder; i < endOrder; i++) {
//         if (i >= totalOrders) break;
//         let customer = allCustomers.find(customer => customer.id === allOrders[i].customer_id);
//         document.getElementsByClassName('order-list')[0].innerHTML += `
//             <div class = "order-item">
//                 <div class = "order-header">
//                     <div class = "order-id order-header-item">
//                         <p>Mã đơn</p>
//                         <p class = "header-value">${allOrders[i].order_id}</p>
//                     </div>
//                     <div class = "order-date order-header-item">
//                         <p>Ngày đặt</p>
//                         <p class = "header-value"> ${allOrders[i].date}</p>
//                     </div>
//                     <div class = "order-address order-header-item">
//                         <p>Quận/huyện</p>
//                         <p class = "header-value">${allOrders[i].address}</p>
//                     </div>
//                     <div class = "order-status ${allOrders[i].status}-status">
//                         ${processStatus(allOrders[i].status)}
//                     </div>
//                 </div>
//                 <div class = "wrapper-order-content"> 
//                     <div class = "order-content">
//                         <div class="customer-info">
//                             <h3>Thông tin khách hàng</h3>
//                             <div class="info-line name info-label">Họ tên: <span class = "info-value">${customer.name}</span></div>
//                             <div class="info-line phone info-label">Số điện thoại: <span class = "info-value">${customer.phone}</span></div>
//                             <div class="info-line address info-label"><span class = "info-value">${customer.address}</span></div>
//                         </div>
//                         <div class = "order-info">
//                             <h3>Thông tin đơn hàng</h3>
//                             <div class="info-line info-label">Tổng tiền: <span class="total-price info-value">${allOrders[i].amount}₫</span></div>
//                             <div class="info-line info-label">Thanh toán: <span class = "info-value">${allOrders[i].purchase}</span></div>
                            
//                             <div class="status-update-section" data-id-order = "${allOrders[i].order_id}">
//                                 <label for="status">Cập nhật trạng thái</label>
//                                 <div class="status-update-form">
//                                     <div class="status-select">${processStatus(allOrders[i].status)}</div>
//                                     <div class="select-list hidden">
//                                         <div class="select-item">Chờ xử lý</div>
//                                         <div class="select-item">Đã xác nhận</div>
//                                         <div class="select-item">Đang giao</div>
//                                         <div class="select-item">Hoàn thành</div>
//                                         <div class="select-item">Đã hủy</div>
//                                     </div>
//                                 </div>
//                                 <button class="update-status-order-btn">Cập nhật</button>
//                             </div>
//                         </div>
//                     </div>
//                     <hr>
//                     <div class = "order-footer">
//                         <button class = "detail-bnt" data-id-order = "${allOrders[i].order_id}">Chi tiết</button>
//                     </div>
//                 </div>
//             </div>
//         `;
//     }
    
//     // const totalPages = calculateTotalPages(totalOrders, numberOrderPerPage);
//     // const maxVisible = 3;
//     // let start = Math.max(1, currentPageOrder - Math.floor(maxVisible / 2));
//     // let end = Math.min(totalPages, start + maxVisible - 1);

//     // if (end - start < maxVisible - 1) {
//     //     start = Math.max(1, end - maxVisible + 1);
//     // }

//     // // Luôn hiển thị trang đầu
//     // if (start > 1) {
//     //     addPageButton(1, numberOrderPerPage, allOrders, allCustomers, totalOrders);
//     //     if (start > 2) addEllipsis();
//     // }

//     // // Hiển thị các trang ở giữa
//     // for (let i = start; i <= end; i++) {
//     //     addPageButton(i, numberOrderPerPage, allOrders, allCustomers, totalOrders);
//     // } 

//     // // Luôn hiển thị trang cuối
//     // if (end < totalPages) {
//     //     if (end < totalPages - 1) addEllipsis();
//     //     addPageButton(totalPages, numberOrderPerPage, allOrders, allCustomers, totalOrders);
//     // }

//     // // Cập nhật thông tin phân trang
//     // document.getElementById('now-page').innerHTML = `${startOrder + 1} - ${endOrder}`;
//     // document.getElementById('all-page').innerHTML = `${totalOrders}`;
//     pageRender(startOrder, numberOrderPerPage, allOrders, allCustomers, totalOrders, currentPageOrder)
//     initDropdown();
//     initDetail();
// }

// function pageRender(startOrder, numberOrderPerPage, allOrders, allCustomers, totalOrders, currentPageOrder) {
//     const totalPages = calculateTotalPages(totalOrders, numberOrderPerPage);
//     const maxVisible = 3;
//     let start = Math.max(1, currentPageOrder - Math.floor(maxVisible / 2));
//     let end = Math.min(totalPages, start + maxVisible - 1);
//     const endOrder = Math.min(startOrder + numberOrderPerPage, totalOrders);

//     if (end - start < maxVisible - 1) {
//         start = Math.max(1, end - maxVisible + 1);
//     }

//     // Luôn hiển thị trang đầu
//     if (start > 1) {
//         addPageButton(1, numberOrderPerPage, allOrders, allCustomers, totalOrders);
//         if (start > 2) addEllipsis();
//     }

//     // Hiển thị các trang ở giữa
//     for (let i = start; i <= end; i++) {
//         addPageButton(i, numberOrderPerPage, allOrders, allCustomers, totalOrders);
//     } 

//     // Luôn hiển thị trang cuối
//     if (end < totalPages) {
//         if (end < totalPages - 1) addEllipsis();
//         addPageButton(totalPages, numberOrderPerPage, allOrders, allCustomers, totalOrders);
//     }

//     // Cập nhật thông tin phân trang
//     document.getElementById('now-page').innerHTML = `${startOrder + 1} - ${endOrder}`;
//     document.getElementById('all-page').innerHTML = `${totalOrders}`;
// }

// document.getElementById('pre-page-btn').addEventListener('click', function () {
//     if (currentPageOrder > 1) {
//         currentPageOrder -= 1;
//         renderOrders((currentPageOrder - 1) * numberOrderPerPage, numberOrderPerPage, allOrder, customerData, allOrder.length);
//     }
// });

// document.getElementById('next-page-btn').addEventListener('click', function () {
//     const totalPages = calculateTotalPages(allOrder.length, numberOrderPerPage);
//     if (currentPageOrder < totalPages) {
//         currentPageOrder += 1;
//         renderOrders((currentPageOrder - 1) * numberOrderPerPage, numberOrderPerPage, allOrder, customerData, allOrder.length);
//     }
// });

function formatCurrency(value) {
    return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

function initAddress() {
    const dictrictSearch = document.getElementById('dictrict-select');
    const districts = vietnamAddress["Thành phố Hồ Chí Minh"].districts;
    districts.forEach(dictrict => {
        dictrictSearch.innerHTML += `
            <option value="${dictrict}">${dictrict}</option>;
        `
    })
}

window.addEventListener('storage', function(e) {
    if (e.key === 'phonestore_users') {
        customerData = JSON.parse(e.newValue || '[]');
        renderPageOrder();
        // preProcessing(numberOrderPerPage, allOrder, customerData, allOrder.length);
    }
    if (e.key === 'phonestore_orders') {
        allOrder = JSON.parse(e.newValue || '[]');
        filteredOrder = allOrder;
        renderPageOrder();
    }
});

function checkForUpdates() {
    const currentUser = JSON.parse(localStorage.getItem('phonestore_users') || '[]');
    
    if (JSON.stringify(currentUser) !== JSON.stringify(customerData)) {
        customerData = currentUser;
        renderPageOrder();
        // preProcessing(numberOrderPerPage, allOrder, customerData, allOrder.length);
    }
}

setInterval(2000, checkForUpdates);

//=================================//\

let filteredOrder = allOrder;
// let currentPageOrder = 1;

function renderPageOrder() {
    function formatCurrency(value) {
        return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
    }
    document.querySelector('.order-search-bar')?.scrollIntoView({ behavior: 'smooth' });
    let start = (currentPageOrder - 1) * numberOrderPerPage;
    let end = start + numberOrderPerPage;
    let orderToShow = filteredOrder.slice(start, end);
    let totalPages = Math.ceil(filteredOrder.length / numberOrderPerPage);
    document.getElementsByClassName('order-list')[0].innerHTML = ``;
    if (orderToShow.length == 0) {
        document.getElementsByClassName('order-list')[0].innerHTML = `
            <div class="no-results">
                Không tìm thấy sản phẩm nào phù hợp với bộ lọc
            </div>
        `;
        pageContainer.innerHTML = ``;
        document.getElementById('now-page').innerHTML = `${start} - ${Math.min(end, filteredOrder.length)}`;
        document.getElementById('all-page').innerHTML = `${filteredOrder.length}`;
        return;
    }
    orderToShow.forEach(order => {
        let customer = customerData.find(customer => customer.id === order.customer_id);
        document.getElementsByClassName('order-list')[0].innerHTML += `
            <div class = "order-item">
                <div class = "order-header">
                    <div class = "order-id order-header-item">
                        <p>Mã đơn</p>
                        <p class = "header-value">${order.order_id}</p>
                    </div>
                    <div class = "order-date order-header-item">
                        <p>Ngày đặt</p>
                        <p class = "header-value"> ${order.date}</p>
                    </div>
                    <div class = "order-address order-header-item">
                        <p>Quận/huyện</p>
                        <p class = "header-value">${order.address}</p>
                    </div>
                    <div class = "order-status ${order.status}-status">
                        ${processStatus(order.status)}
                    </div>
                </div>
                <div class = "wrapper-order-content"> 
                    <div class = "order-content">
                        <div class="customer-info">
                            <h3>Thông tin khách hàng</h3>
                            <div class="info-line name info-label">Họ tên: <span class = "info-value">${customer.name}</span></div>
                            <div class="info-line phone info-label">Số điện thoại: <span class = "info-value">${customer.phone}</span></div>
                            <div class="info-line address info-label"><span class = "info-value">${customer.address}</span></div>
                        </div>
                        <div class = "order-info">
                            <h3>Thông tin đơn hàng</h3>
                            <div class="info-line info-label">Tổng tiền: <span class="total-price info-value">${formatCurrency(order.amount)}</span></div>
                            <div class="info-line info-label">Thanh toán: <span class = "info-value">${order.purchase}</span></div>
                            
                            <div class="status-update-section" data-id-order = "${order.order_id}">
                                <label for="status">Cập nhật trạng thái</label>
                                <div class="status-update-form">
                                    <div class="status-select">${processStatus(order.status)}</div>
                                    <div class="select-list hidden">
                                        <div class="select-item">Chờ xử lý</div>
                                        <div class="select-item">Đã xác nhận</div>
                                        <div class="select-item">Đang giao</div>
                                        <div class="select-item">Hoàn thành</div>
                                        <div class="select-item">Đã hủy</div>
                                    </div>
                                </div>
                                <button class="update-status-order-btn">Cập nhật</button>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class = "order-footer">
                        <button class = "detail-bnt" data-id-order = "${order.order_id}">Chi tiết</button>
                    </div>
                </div>
            </div>
        `;
    });

    document.getElementById('now-page').innerHTML = `${start + 1} - ${Math.min(end, filteredOrder.length)}`;
    document.getElementById('all-page').innerHTML = `${filteredOrder.length}`;

    initDropdown();
    initDetail();

    if (filteredOrder.length > numberOrderPerPage) {
        renderOrderPagination(totalPages);
    } else {
        pageContainer.innerHTML = ``;
    }
}

function renderOrderPagination(totalPages) {
    pageContainer.innerHTML = `
        <button class="page-item" 
                onclick="changePageOrder(${currentPageOrder - 1})"
                ${currentPageOrder <= 1 ? 'disabled' : ''}>
            ‹ Trước
        </button>
    `;
    for (let i = 1; i <= totalPages; i ++) {
        if (totalPages <= 4) {
            pageContainer.innerHTML += `
                <button class = "page-item ${i === currentPageOrder ? 'btn-page-active' : ''}" onclick = "changePageOrder(${i})">
                    ${i}
                </button>
            `;
        } else {
            if (i === 1 || i === totalPages || i >= currentPageOrder - 1 && i <= currentPageOrder + 1) {
                pageContainer.innerHTML += `
                    <button class = "page-item ${i === currentPageOrder ? 'btn-page-active' : ''}" onclick = "changePageOrder(${i})">
                        ${i}
                    </button>
                `;
            } else if (i == currentPageOrder + 2 || i == currentPageOrder - 2) {
                pageContainer.innerHTML += `
                    <span>...</span>
                `;
            } 
        }
    }

    pageContainer.innerHTML += `
        <button class="page-item" 
                onclick="changePageOrder(${currentPageOrder + 1})"
                ${currentPageOrder >= totalPages ? 'disabled' : ''}>
            Sau ›
        </button>
    `
}

window.changePageOrder = function(page) {
    if (page < 1 || page > Math.ceil(filteredOrder.length / numberOrderPerPage)) return;
    currentPageOrder = page;
    renderPageOrder();
    document.querySelector('.order-search-bar')?.scrollIntoView({ behavior: 'smooth' });
};

//=================================//

// Khởi tạo ban đầu
initAddress();
renderPageOrder();