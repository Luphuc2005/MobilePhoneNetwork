let currentUserOrderHistory = JSON.parse(localStorage.getItem('phonestore_currentUser'));
let allOrderHistory =  JSON.parse(localStorage.getItem('phonestore_orders'));
let orderHistory = allOrderHistory.filter(order => {
    return order.customer_id == currentUserOrderHistory.id;
});
let allProductOrderHistory = JSON.parse(localStorage.getItem('phonestore_products'));

function formatCurrency(vnđ) {
  return vnđ.toLocaleString("vi-VN") + "₫";
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

function renderOrderHistory() {
  const tbody = document.getElementById("order-list");
  tbody.innerHTML = "";

  if (orderHistory.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Chưa có đơn hàng nào</td></tr>`;
    return;
  }

  orderHistory.forEach(order => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${order.order_id}</td>
      <td>${order.date}</td>
      <td>${formatCurrency(order.amount)}</td>
      <td>${processStatus(order.status)}</td>
      <td><button class="view-detail" data-id="${order.order_id}">Xem</button></td>
    `;
    tbody.appendChild(row);
  });
}

// Gọi khi user nhấn “Lịch sử đơn hàng”
document.getElementById("order-history").addEventListener("click", () => {
  document.getElementById("user-info").style.display = "none";
  document.getElementById("user-order").style.display = "block";
  renderOrderHistory();
});

document.addEventListener("click", e => {
  if (e.target.classList.contains("view-detail")) {
    const id = e.target.dataset.id;
    const order = orderHistory.find(o => o.order_id === id);
    const content = document.getElementById("order-detail-content");
    const order_id = document.querySelector('.order_id');
    const order_status = document.querySelector('.order_detail_status');
    const order_total = document.querySelector('.order_total');
    
    order_id.innerHTML = `${id}`;
    order_status.innerHTML = `${processStatus(order.status)}`;
    order_total.innerHTML = `${formatCurrency(order.amount)}`;

    for (let [idProduct, quantity] of order.product_list) {
        let idx = allProductOrderHistory.findIndex(product => product.id == idProduct);
        console.log(idx);
        content.innerHTML += `
            <li class = "detail-product-item">
                <div class = "detail-product-img-wrapper"> 
                    <img src="${allProductOrderHistory[idx].hinhanh}" alt="${allProductOrderHistory[idx].tensanpham}" align = "center">
                </div>
                <div class = "detail-product-info">
                    <p class = "detail-type-product">${allProductOrderHistory[idx].danhmuc}</p>
                    <p class = "detail-product-name">${allProductOrderHistory[idx].tensanpham}</p> 
                    <p class = "detail-product-quantity">x${quantity}</p> 
                </div>
                <div class = "detail-product-price">
                    ${allProductOrderHistory[idx].gia}đ
                </div>
            </li>
        `;
    }
    document.body.style.overflow = 'hidden';

    // content.innerHTML = order.product_list.map(item => `
    //   <p>${item.name} - SL: ${item.quantity} - Giá: ${formatCurrency(item.price)}</p>
    // `).join("");
    document.getElementById("order-detail-modal").style.display = "flex";
  }
});

document.getElementById("close-order-detail").addEventListener("click", () => {
  document.getElementById("order-detail-modal").style.display = "none";
  document.body.style.overflow = '';
});

window.addEventListener('storage', function(e) {
    if (e.key === 'phonestore_orders') {
        allOrderHistory = JSON.parse(e.newValue || '[]');
        orderHistory = allOrderHistory.filter(order => {
            return order.customer_id == currentUserOrderHistory.id;
        });
        renderOrderHistory();
    }
    if (e.key === 'phonestore_products') {
        allProductOrderHistory = JSON.parse(e.newValue || '[]');
        renderOrderHistory();
    }
});

function checkForUpdates() {
    const currentOrder = JSON.parse(localStorage.getItem('phonestore_orders') || '[]');
    const currentInventory = JSON.parse(localStorage.getItem('phonestore_products') || '[]');
    
    if (JSON.stringify(currentOrder) !== JSON.stringify(allProductOrderHistory)) {
        allProductOrderHistory = currentOrder;
        renderOrderHistory();
    }
    
    if (JSON.stringify(currentInventory) !== JSON.stringify(allProductOrderHistory)) {
        allProductOrderHistory = currentInventory;
        renderOrderHistory();
    }
}

setInterval(2000, checkForUpdates);