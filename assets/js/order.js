let allOrders = [
    {
        order_id: "DH001234",
        date: "15/10/2025 14:30",
        address: "Quận 1",
        customer_id: 1,
        status: "waiting",
        amount: 29990000, 
        purchase: "Tiền mặt khi giao hàng"
    }, 
    {
        order_id: "DH001235",
        date: "15/10/2025 14:35",
        address: "Quận 2",
        customer_id: 2,
        status: "accepted",
        amount: 29990000, 
        purchase: "Tiền mặt khi giao hàng"
    },
    {
        order_id: "DH001236",
        date: "15/10/2025 14:40",
        address: "Quận 3",
        customer_id: 3,
        status: "done",
        amount: 29990000, 
        purchase: "Tiền mặt khi giao hàng"
    },
    {
        order_id: "DH001237",
        date: "15/10/2025 14:50",
        address: "Quận 4",
        customer_id: 4,
        status: "delivery",
        amount: 29990000, 
        purchase: "Tiền mặt khi giao hàng"
    },
    {
        order_id: "DH001239",
        date: "15/10/2025 13:30",
        address: "Quận 7",
        customer_id: 5,
        status: "cancel",
        amount: 29990000, 
        purchase: "Tiền mặt khi giao hàng"
    },
    {
        order_id: "DH001240",
        date: "15/10/2025 15:00",
        address: "Quận 5",
        customer_id: 5,
        status: "waiting",
        amount: 15990000, 
        purchase: "Chuyển khoản ngân hàng"
    },
    {
        order_id: "DH001241",
        date: "15/10/2025 15:05",
        address: "Quận 6",
        customer_id: 5,
        status: "accepted",
        amount: 25990000, 
        purchase: "Tiền mặt khi giao hàng"
    },
    {
        order_id: "DH001242",
        date: "15/10/2025 15:10",
        address: "Quận 8",
        customer_id: 4,
        status: "delivery",
        amount: 18990000, 
        purchase: "Chuyển khoản ngân hàng"
    },
    {
        order_id: "DH001243",
        date: "15/10/2025 15:15",
        address: "Quận 9",
        customer_id: 4,
        status: "done",
        amount: 9990000, 
        purchase: "Ví điện tử"
    },
    {
        order_id: "DH001244",
        date: "15/10/2025 15:20",
        address: "Quận 10",
        customer_id: 3,
        status: "cancel",
        amount: 2990000, 
        purchase: "Tiền mặt khi giao hàng"
    },
    {
        order_id: "DH001245",
        date: "15/10/2025 15:25",
        address: "Quận 11",
        customer_id: 2,
        status: "waiting",
        amount: 45990000, 
        purchase: "Chuyển khoản ngân hàng"
    },
    {
        order_id: "DH001246",
        date: "15/10/2025 15:30",
        address: "Quận 12",
        customer_id: 1,
        status: "accepted",
        amount: 31990000, 
        purchase: "Tiền mặt khi giao hàng"
    },
    {
        order_id: "DH001247",
        date: "15/10/2025 15:35",
        address: "TP Thủ Đức",
        customer_id: 1,
        status: "delivery",
        amount: 27990000, 
        purchase: "Ví điện tử"
    },
    {
        order_id: "DH001248",
        date: "15/10/2025 15:40",
        address: "Quận Bình Thạnh",
        customer_id: 4,
        status: "done",
        amount: 19990000, 
        purchase: "Chuyển khoản ngân hàng"
    },
    {
        order_id: "DH001249",
        date: "15/10/2025 15:45",
        address: "Quận Gò Vấp",
        customer_id: 5,
        status: "waiting",
        amount: 15990000, 
        purchase: "Tiền mặt khi giao hàng"
    }, 
    {
        order_id: "DH001250",
        date: "15/10/2025 15:50",
        address: "Quận Tân Bình",
        customer_id: 2,
        status: "accepted",
        amount: 24990000,
        purchase: "Chuyển khoản ngân hàng"
    },
    {
        order_id: "DH001251",
        date: "15/10/2025 15:55",
        address: "Quận Tân Phú",
        customer_id: 3,
        status: "delivery",
        amount: 18990000,
        purchase: "Tiền mặt khi giao hàng"
    },
    {
        order_id: "DH001252",
        date: "15/10/2025 16:00",
        address: "Quận Bình Tân",
        customer_id: 4,
        status: "waiting",
        amount: 20990000,
        purchase: "Chuyển khoản ngân hàng"
    },
    {
        order_id: "DH001253",
        date: "15/10/2025 16:05",
        address: "Quận Phú Nhuận",
        customer_id: 5,
        status: "done",
        amount: 27990000,
        purchase: "Ví điện tử"
    },
    {
        order_id: "DH001254",
        date: "15/10/2025 16:10",
        address: "Quận 1",
        customer_id: 2,
        status: "cancel",
        amount: 9990000,
        purchase: "Tiền mặt khi giao hàng"
    },
    {
        order_id: "DH001255",
        date: "15/10/2025 16:15",
        address: "Quận 2",
        customer_id: 1,
        status: "delivery",
        amount: 31990000,
        purchase: "Chuyển khoản ngân hàng"
    },
    {
        order_id: "DH001256",
        date: "15/10/2025 16:20",
        address: "Quận 3",
        customer_id: 3,
        status: "waiting",
        amount: 15990000,
        purchase: "Ví điện tử"
    },
    {
        order_id: "DH001257",
        date: "15/10/2025 16:25",
        address: "Quận 4",
        customer_id: 3,
        status: "accepted",
        amount: 25990000,
        purchase: "Chuyển khoản ngân hàng"
    },
    {
        order_id: "DH001258",
        date: "15/10/2025 16:30",
        address: "Quận 5",
        customer_id: 4,
        status: "done",
        amount: 29990000,
        purchase: "Tiền mặt khi giao hàng"
    },
    {
        order_id: "DH001259",
        date: "15/10/2025 16:35",
        address: "Quận 6",
        customer_id: 5,
        status: "cancel",
        amount: 17990000,
        purchase: "Ví điện tử"
    }
]

// Lưu vào local storage 
function storeOrderInLocalStorage() {
    // Lấy khách hàng hiện có
    const existingOrders = localStorage.getItem('allOrders');
    // Nếu khách hàng chưa tồn tại thì lưu vào local storage
    if (!existingOrders) {
        localStorage.setItem('allOrders', JSON.stringify(allOrders));
    }
}

// Lấy customer trong local storage
function getAllOrders() {
    return JSON.parse(localStorage.getItem('allOrders'));
}

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

function preProcessing(numberOrderPerPage, totalOrder, orderList, pageControler, allOrders, allCustomers) {
    for (let i = 0; i < numberOrderPerPage; ++i) {
        let customer = allCustomers.find(customer => customer.id === allOrders[i].customer_id);
        orderList[0].innerHTML += `
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
                                    <button class="update-btn">Cập nhật</button>
                                </div>
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
    let numberOfPage = (totalOrder + numberOrderPerPage - 1) /numberOrderPerPage;
    for (let i = 1; i <= Math.min(numberOfPage, 5); ++i) {
        pageControler[0].innerHTML += `
            <div class = "page-item">
                ${i}
            </div>
        `; 
    } 
    console.log(numberOfPage);
    if (parseInt(numberOfPage) > 5) {
        pageControler[0].innerHTML += `
            <div class = "page-item">
                <span>...</span>
            </div>
        `;
    }
    pageControler[0].innerHTML += `
        <div class = "page-item">
            <span>></span>
        </div>
    `;
}

function loadOrder(numberOrderPerPage, curentPage, totalOrder, orderList, pageControler, allOrders, allCustomers) {
    orderList[0].innerHTML = ``;
    for (let i = (curentPage - 1)*numberOrderPerPage; i < Math.min(totalOrder - 1, (curentPage)*numberOrderPerPage) - 1; ++i) {
        let customer = allCustomers.find(customer => customer.id === allOrders[i].customer_id);
        orderList[0].innerHTML += `
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
                                    <button class="update-btn">Cập nhật</button>
                                </div>
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
    pageControler.innerHTML = ``;
    let numberOfPage = (totalOrder + numberOrderPerPage - 1) /numberOrderPerPage;
    if (numberOfPage > 5) {
        if (curentPage <= numberOfPage - 2 && curentPage >= 3) { 
            for (let j = curentPage - 2; j <= curentPage + 2; ++j) {
                pageControler.innerHTML += `
                    <div class = "page-item">
                        ${j}
                    </div>
                `;
            }
        } else if (curentPage > numberOfPage - 2) {
            for (let j = curentPage - 4; j <= curentPage; ++j) {
                pageControler.innerHTML += `
                    <div class = "page-item">
                        ${j}
                    </div>
                `;
            }
        } else {
            for (let j = 1; j <= curentPage; ++j) {
                pageControler.innerHTML += `
                    <div class = "page-item">
                        ${j}
                    </div>
                `;
            }
        }
    } else {
        for (let i = 1; i <= numberOfPage; ++i) {
            pageControler[0].innerHTML += `
                <div class = "page-item">
                    ${i}
                </div>
            `; 
        } 
    }
    let pages = document.getElementsByClassName('page-item');
    for (let i = 1; i <= pages.length - 2; ++i) {
        pages[i].addEventListener('click', function () {
            loadOrder(numberOrderPerPage, i, totalOrder, orderList, pageControler, allOrders, allCustomers);
        });
    }
}

function pageControl(numberOrderPerPage, totalOrder, orderList, pageControler, allOrders, allCustomers) {
    let pages = document.getElementsByClassName('page-item');
    for (let i = 1; i <= pages.length - 2; ++i) {
        pages[i].addEventListener('click', function () {
            loadOrder(numberOrderPerPage, i, totalOrder, orderList, pageControler, allOrders, allCustomers);
        });
    }
}

//---------------Main---------------------//
window.addEventListener('DOMContentLoaded', () =>  {
    storeOrderInLocalStorage();
    let allOrder = getAllOrders();
    preProcessing(5, allOrder.length, document.getElementsByClassName('order-list'), document.getElementsByClassName('page-controler'), allOrder, customerData);
    pageControl(5, allOrder.length, document.getElementsByClassName('order-list'), document.getElementsByClassName('page-controler'), allOrder, customerData);
});