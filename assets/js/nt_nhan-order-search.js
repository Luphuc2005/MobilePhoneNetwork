function parseDateTime(dateStr) {
    const [datePart, timePart] = dateStr.split(" "); // ["15/10/2025", "13:30"]
    const [day, month, year] = datePart.split("/").map(Number);
    const [hour, minute] = timePart.split(":").map(Number);

    return new Date(year, month - 1, day, hour, minute);
}

function parseInputDate(dateStr) {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date;
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
        
        const fromDateObj = parseInputDate(fromDate);
        const toDateObj = parseInputDate(toDate);
        
        // Nếu có ngày bắt đầu, set giờ thành 00:00:00
        if (fromDateObj) {
            fromDateObj.setHours(0, 0, 0, 0);
        }
        
        // Nếu có ngày kết thúc, set giờ thành 23:59:59
        if (toDateObj) {
            toDateObj.setHours(23, 59, 59, 999);
        }
        
        const matchFrom = !fromDateObj || orderDate >= fromDateObj;
        const matchTo = !toDateObj || orderDate <= toDateObj;
        
        return matchFrom && matchTo && matchKeyword && matchStatus && matchDistrict;
    });  

    // Reset về trang 1 khi tìm kiếm
    currentPageOrder = 1;
    
    // Tính số trang dựa trên kết quả tìm kiếm
    const totalOrders = result.length;
    const totalPages = calculateTotalPages(totalOrders, numberOrderPerPage);
    
    // Tính vị trí bắt đầu và kết thúc cho trang hiện tại
    const startIndex = (currentPageOrder - 1) * numberOrderPerPage;
    const endIndex = Math.min(startIndex + numberOrderPerPage, totalOrders);
    
    let list = document.getElementsByClassName('order-list')[0];  
    list.innerHTML = ``;
    if (result.length === 0) {
        list.innerHTML = "<li>Không tìm thấy kết quả</li>";
        // Ẩn phân trang khi không có kết quả
        document.getElementsByClassName('pagination')[0].style.display = 'none';
        return;
    } else {
        document.getElementsByClassName('pagination')[0].style.display = 'flex';
        // Chỉ hiển thị các đơn hàng trong trang hiện tại
        const ordersToShow = result.slice(startIndex, endIndex);
        ordersToShow.forEach(order => {
            let customer = customerData.find(cus => order.customer_id === cus.id);
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
    }
    initDropdown();
    initDetail();
});