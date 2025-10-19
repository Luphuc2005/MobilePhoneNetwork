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

let allOrder = getAllOrders();
let customerData = getAllCustomer();

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

function preProcessing(numberOrderPerPage, allOrders, allCustomers, totalOrders) {
    renderOrders(0, numberOrderPerPage, allOrders, allCustomers, totalOrders, 1);   
}

function addPageButton(page, numberOrderPerPage, allOrders, allCustomers, totalOrders, currentPage) {
    const btn = document.createElement('div');
    btn.textContent = page;
    btn.classList.add('page-item');
    if (page === currentPage) btn.classList.add('btn-page-active');
    btn.addEventListener('click', function () {
        renderOrders((page - 1) * numberOrderPerPage, numberOrderPerPage, allOrders, allCustomers, totalOrders, page);
    });
    document.getElementsByClassName('page-numbers')[0].appendChild(btn);
}

function renderOrders(startOrder, numberOrderPerPage, allOrders, allCustomers, totalOrders, currentPage) {
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
    
    let maxVisible = 5;
    let currentPage2 = (startOrder/numberOrderPerPage) + 1;
    let totalPages = (totalOrders + numberOrderPerPage - 1)/numberOrderPerPage;
    let start = Math.max(1, currentPage2 - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    for (let i = start; i <= end; i++) {
        addPageButton(i, numberOrderPerPage, allOrders, allCustomers, totalOrders, currentPage);
    } 
    document.getElementById('now-page').innerHTML = `${startOrder + 1} - ${startOrder + numberOrderPerPage}`;
    document.getElementById('all-page').innerHTML = `${totalOrders}`;
    document.getElementById('pre-page-btn').addEventListener('click', function () {
        if (currentPage <= 1) return;
        currentPage -= 1;
        renderOrders((currentPage - 1) * numberOrderPerPage, numberOrderPerPage, allOrders, allCustomers, totalOrders, currentPage)
    })
    document.getElementById('next-page-btn').addEventListener('click', function () {
        if (currentPage > (totalOrders + numberOrderPerPage - 1)/(numberOrderPerPage)) return;
        currentPage += 1;
        renderOrders((currentPage - 1) * numberOrderPerPage, numberOrderPerPage, allOrders, allCustomers, totalOrders, currentPage)
    })
}

//---------------Search-------------------//

function parseDateTime(dateStr) {
  const [datePart, timePart] = dateStr.split(" "); // ["15/10/2025", "13:30"]
  const [day, month, year] = datePart.split("/").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  return new Date(year, month - 1, day, hour, minute);
}

document.getElementById('search-orders-form').addEventListener("submit", function(e) {
    e.preventDefault();
    let idOrName = document.getElementById("search-id-name").value.toLowerCase();
    let status = document.getElementById('status-select').value;
    let district = document.getElementById('dictrict-select').value;
    let fromDate = document.getElementById('start-date').value;
    let toDate = document.getElementById('end-date').value;
    
    let result = allOrder.filter(order => {
        const matchKeyword = idOrName === "" || order.order_id.toLowerCase().includes(idOrName) || order.address.toLowerCase().includes(idOrName);
        const matchStatus = status === "all" || order.status === status;
        const matchDistrict = district === "all" || order.address == district;
        const orderDate = parseDateTime(order.date);
        const matchFrom = fromDate === "" || orderDate >= new Date(fromDate);
        const matchTo = toDate === "" || orderDate <= new Date(toDate);
        return matchFrom && matchTo && matchKeyword && matchStatus && matchDistrict;
    });  

    let list = document.getElementsByClassName('order-list')[0];  
    list.innerHTML = ``;
    if (result.length === 0) {
        list.innerHTML = "<li>Không tìm thấy kết quả</li>";
    } else {
        result.forEach(order => {
        let customer = customerData.filter(cus => {return order.customer_id === cus.id})[0];
        list.innerHTML += `
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
                            <div class="info-line info-label">Tổng tiền: <span class="total-price info-value">${order.amount}₫</span></div>
                            <div class="info-line info-label">Thanh toán: <span class = "info-value">${order.purchase}</span></div>
                            
                            <div class="status-update-section">
                                <label for="status">Cập nhật trạng thái</label>
                                <div class="status-update-form">
                                    <div class="status-select">${processStatus(order.status)}</div>
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
        });
    }
});


//---------------Main---------------------//
window.addEventListener('DOMContentLoaded', () =>  {
    storeOrderInLocalStorage();
    preProcessing(5, allOrder, customerData, allOrder.length);
});