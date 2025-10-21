let currentPageOrder = 1;
let totalOrders = allOrder.length; 
let numberOrderPerPage = 5;

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

function preProcessing(numberOrderPerPage, allOrders, allCustomers, totalOrders) {
    renderOrders(0, numberOrderPerPage, allOrders, allCustomers, totalOrders);   
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

function renderOrders(startOrder, numberOrderPerPage, allOrders, allCustomers, totalOrders) {
    document.getElementsByClassName('order-list')[0].innerHTML = ``;
    document.getElementsByClassName('page-numbers')[0].innerHTML = ``;
    for (let i = startOrder; i <= startOrder + numberOrderPerPage - 1; ++i) {
        let customer = allCustomers.find(customer => customer.id === allOrders[i].customer_id);
        document.getElementsByClassName('order-list')[0].innerHTML += `
            <div class = "order-item">
                <div class = "order-header">
                    <div class = "order-id order-header-item">
                        <p>Mã đơn</p>
                        <p class = "header-value">${allOrders[i].order_id}</p>
                    </div>
                    <div class = "order-date order-header-item">
                        <p>Ngày đặt</p>
                        <p class = "header-value"> ${allOrders[i].date}</p>
                    </div>
                    <div class = "order-address order-header-item">
                        <p>Quận/huyện</p>
                        <p class = "header-value">${allOrders[i].address}</p>
                    </div>
                    <div class = "order-status ${allOrders[i].status}-status">
                        ${processStatus(allOrders[i].status)}
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
                            <div class="info-line info-label">Tổng tiền: <span class="total-price info-value">${allOrders[i].amount}₫</span></div>
                            <div class="info-line info-label">Thanh toán: <span class = "info-value">${allOrders[i].purchase}</span></div>
                            
                            <div class="status-update-section">
                                <label for="status">Cập nhật trạng thái</label>
                                <div class="status-update-form">
                                    <div class="status-select">${processStatus(allOrders[i].status)}</div>
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
                        <button class = "detail-bnt">Chi tiết</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    let maxVisible = 5;
    let currentPageOrder2 = (startOrder/numberOrderPerPage) + 1;
    let totalPages = (totalOrders + numberOrderPerPage - 1)/numberOrderPerPage;
    let start = Math.max(1, currentPageOrder2 - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    for (let i = start; i <= end; i++) {
        addPageButton(i, numberOrderPerPage, allOrders, allCustomers, totalOrders);
    } 
    document.getElementById('now-page').innerHTML = `${startOrder + 1} - ${startOrder + numberOrderPerPage}`;
    document.getElementById('all-page').innerHTML = `${totalOrders}`;
}

document.getElementById('pre-page-btn').addEventListener('click', function () {
    if (currentPageOrder <= 1) return;
    currentPageOrder -= 1;
    renderOrders((currentPageOrder - 1) * numberOrderPerPage, numberOrderPerPage, allOrders, allCustomers, totalOrders)
})
document.getElementById('next-page-btn').addEventListener('click', function () {
    if (currentPageOrder > (totalOrders + numberOrderPerPage - 1)/(numberOrderPerPage)) return;
    currentPageOrder += 1;
    renderOrders((currentPageOrder - 1) * numberOrderPerPage, numberOrderPerPage, allOrders, allCustomers, totalOrders)
})

preProcessing(5, allOrder, customerData, allOrder.length);