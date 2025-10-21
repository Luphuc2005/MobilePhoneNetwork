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