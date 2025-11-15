let allOrders = [
    {
        order_id: "DH000001",
        date: "15/10/2025 14:30",
        address: "Quận 1",
        customer_id: 1,
        status: "waiting",
        amount: 29990000, 
        purchase: "Tiền mặt khi giao hàng",
        product_list: [[1, 2], [2, 1], [3, 2]]
    }, 
    {
        order_id: "DH000002",
        date: "15/10/2025 14:35",
        address: "Quận 2",
        customer_id: 2,
        status: "accepted",
        amount: 29990000, 
        purchase: "Tiền mặt khi giao hàng",
        product_list: [[2, 1], [4, 2]]
    },
    {
        order_id: "DH000003",
        date: "15/10/2025 14:40",
        address: "Quận 3",
        customer_id: 3,
        status: "done",
        amount: 29990000, 
        purchase: "Tiền mặt khi giao hàng",
        product_list: [[11, 1], [12, 3], [14, 5]]
    },
    {
        order_id: "DH000004",
        date: "15/10/2025 14:50",
        address: "Quận 4",
        customer_id: 4,
        status: "delivery",
        amount: 29990000, 
        purchase: "Tiền mặt khi giao hàng", 
        product_list: [[5, 2], [14, 1]]
    },
    {
        order_id: "DH000005",
        date: "15/10/2025 13:30",
        address: "Quận 7",
        customer_id: 5,
        status: "cancel",
        amount: 29990000, 
        purchase: "Tiền mặt khi giao hàng",
        product_list: [[4, 5], [14, 3], [15, 1]]
    },
    {
        order_id: "DH000006",
        date: "15/10/2025 15:00",
        address: "Quận 5",
        customer_id: 5,
        status: "waiting",
        amount: 15990000, 
        purchase: "Chuyển khoản ngân hàng",
        product_list: [[7, 2], [10, 3], [11, 8]]
    },
    {
        order_id: "DH000007",
        date: "15/10/2025 15:05",
        address: "Quận 6",
        customer_id: 5,
        status: "accepted",
        amount: 25990000, 
        purchase: "Tiền mặt khi giao hàng",
        product_list: [[5, 1], [6, 1], [7, 1], [8, 1]]
    },
    {
        order_id: "DH000008",
        date: "15/10/2025 15:10",
        address: "Quận 8",
        customer_id: 4,
        status: "delivery",
        amount: 18990000, 
        purchase: "Chuyển khoản ngân hàng",
        product_list: [[8, 2], [9, 3], [10, 1]]
    },
    {
        order_id: "DH000009",
        date: "15/10/2025 15:15",
        address: "Quận 9",
        customer_id: 4,
        status: "done",
        amount: 9990000, 
        purchase: "Ví điện tử", 
        product_list: [[2, 1], [4, 1], [6, 1]]
    },
    {
        order_id: "DH000010",
        date: "15/10/2025 15:20",
        address: "Quận 10",
        customer_id: 3,
        status: "cancel",
        amount: 2990000, 
        purchase: "Tiền mặt khi giao hàng",
        product_list: [[8, 1], [9, 1], [10, 1], [11, 1], [12, 1]]
    },
    {
        order_id: "DH000011",
        date: "15/10/2025 15:25",
        address: "Quận 11",
        customer_id: 2,
        status: "waiting",
        amount: 45990000, 
        purchase: "Chuyển khoản ngân hàng",
        product_list: [[4, 1], [2, 1], [11, 1]]
    },
    {
        order_id: "DH000012",
        date: "15/10/2025 15:30",
        address: "Quận 12",
        customer_id: 1,
        status: "accepted",
        amount: 31990000, 
        purchase: "Tiền mặt khi giao hàng",
        product_list: [[1, 1], [3, 1], [14, 1], [15, 1]]
    },
    {
        order_id: "DH000013",
        date: "15/10/2025 15:35",
        address: "TP Thủ Đức",
        customer_id: 1,
        status: "delivery",
        amount: 27990000, 
        purchase: "Ví điện tử", 
        product_list: [[5, 1], [14, 1]]
    },
    {
        order_id: "DH000014",
        date: "15/10/2025 15:40",
        address: "Quận Bình Thạnh",
        customer_id: 4,
        status: "done",
        amount: 19990000, 
        purchase: "Chuyển khoản ngân hàng",
        product_list: [[5, 1], [14, 1], [15, 1]]
    },
    {
        order_id: "DH000015",
        date: "15/10/2025 15:45",
        address: "Quận Gò Vấp",
        customer_id: 5,
        status: "waiting",
        amount: 15990000, 
        purchase: "Tiền mặt khi giao hàng",
        product_list: [[3, 1], [4, 1], [5, 1]]
    }, 
    {
        order_id: "DH000016",
        date: "15/10/2025 15:50",
        address: "Quận Tân Bình",
        customer_id: 2,
        status: "accepted",
        amount: 24990000,
        purchase: "Chuyển khoản ngân hàng",
        product_list: [[4, 1], [7, 1], [8, 1]]
    },
    {
        order_id: "DH000017",
        date: "15/10/2025 15:55",
        address: "Quận Tân Phú",
        customer_id: 3,
        status: "delivery",
        amount: 18990000,
        purchase: "Tiền mặt khi giao hàng",
        product_list: [[9, 1], [10, 1], [11, 1]]
    },
    {
        order_id: "DH000018",
        date: "15/10/2025 16:00",
        address: "Quận Bình Tân",
        customer_id: 4,
        status: "waiting",
        amount: 20990000,
        purchase: "Chuyển khoản ngân hàng",
        product_list: [[2, 1], [14, 1], [12, 1]]
    },
    {
        order_id: "DH000019",
        date: "15/10/2025 16:05",
        address: "Quận Phú Nhuận",
        customer_id: 5,
        status: "done",
        amount: 27990000,
        purchase: "Ví điện tử",
        product_list: [[15, 1], [14, 1]]
    },
    {
        order_id: "DH000020",
        date: "15/10/2025 16:10",
        address: "Quận 1",
        customer_id: 2,
        status: "cancel",
        amount: 9990000,
        purchase: "Tiền mặt khi giao hàng",
        product_list: [[5, 1], [14, 1]]
    },
    {
        order_id: "DH000021",
        date: "15/10/2025 16:15",
        address: "Quận 2",
        customer_id: 1,
        status: "delivery",
        amount: 31990000,
        purchase: "Chuyển khoản ngân hàng", 
        product_list: [[5, 1], [14, 1]]
    },
    {
        order_id: "DH000022",
        date: "15/10/2025 16:20",
        address: "Quận 3",
        customer_id: 3,
        status: "waiting",
        amount: 15990000,
        purchase: "Ví điện tử",
        product_list: [[5, 1], [14, 1]]
    },
    {
        order_id: "DH000023",
        date: "15/10/2025 16:25",
        address: "Quận 4",
        customer_id: 3,
        status: "accepted",
        amount: 25990000,
        purchase: "Chuyển khoản ngân hàng",
        product_list: [[5, 1], [14, 1]]
    },
    {
        order_id: "DH000024",
        date: "15/10/2025 16:30",
        address: "Quận 5",
        customer_id: 4,
        status: "done",
        amount: 29990000,
        purchase: "Tiền mặt khi giao hàng",
        product_list: [[5, 1], [14, 1]]
    },
    {
        order_id: "DH000025",
        date: "15/10/2025 16:35",
        address: "Quận 6",
        customer_id: 5,
        status: "cancel",
        amount: 17990000,
        purchase: "Ví điện tử", 
        product_list: [[5, 1], [14, 1]]
    }
]

// Lưu vào local storage 
function storeOrderInLocalStorage() {
    // Lấy khách hàng hiện có
    const existingOrders = localStorage.getItem('phonestore_orders');
    // Nếu khách hàng chưa tồn tại thì lưu vào local storage
    if (!existingOrders) {
        localStorage.setItem('phonestore_orders', JSON.stringify(allOrders));
    }
}

// Lấy customer trong local storage
function getAllOrders() {
    return JSON.parse(localStorage.getItem('phonestore_orders'));
}

let allOrder = getAllOrders();
let customerData = JSON.parse(localStorage.getItem('phonestore_users'));
let lastId = 25;

//---------------Main---------------------//
storeOrderInLocalStorage();

// thêm: dùng hàm addOrder gồm các tham số:
//      + date: ngày đặt,
//      + address: địa chỉ
//      + customer_id: mã khách hàng
//      + amount: tổng tiền
//      + purchase: hình thức thanh toán
//      + product_list: danh sách sản phẩm, mỗi phần tử gồm [mã sản phẩm, số lượng]
// Chỉ cần gọi hàm và render lại.
// hủy đơn: khách hàng có thể chọn hủy đơn
// khi chọn hủy đơn chỉ cần gọi hàm cancelOrder truyền mã đơn hàng vào là có thể hủy

// Hàm tạo orderId mới
function generateOrderId() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    const orderId = `ORD${timestamp}${random}`;
    
    // Lưu orderId vào localStorage để addOrder có thể sử dụng
    localStorage.setItem('lastCreatedOrderId', orderId);
    
    return orderId;
}

// Export hàm generateOrderId ra window
window.generateOrderId = generateOrderId;

function addOrder(date, address, customer_id, amount, purchase, product_list) {
    // Lấy dữ liệu mới nhất từ localStorage để tránh mất dữ liệu
    let currentOrders = JSON.parse(localStorage.getItem('phonestore_orders') || '[]');
    
    // Lấy order_id từ localStorage (phải được tạo trước bằng generateOrderId)
    let orderId = localStorage.getItem('lastCreatedOrderId');
    
    // Nếu không có order_id từ localStorage, tự động tạo mới (fallback)
    if (!orderId) {
        orderId = generateOrderId();
    }
    
    let newOrder = {
        order_id: orderId,
        date: date,
        address: address,
        customer_id: customer_id, 
        status: "waiting",
        amount: amount,
        purchase: purchase, 
        product_list: product_list
    }
    currentOrders.push(newOrder);
    localStorage.setItem('phonestore_orders', JSON.stringify(currentOrders));
    
    // Cập nhật biến global allOrder
    allOrder = currentOrders;
    
    // preProcessing chỉ có ở trang admin, kiểm tra trước khi gọi
    if (typeof preProcessing === 'function') {
        // preProcessing(5, allOrder, customerData, allOrder.length);
        renderPageOrder();
    }
    
    // Trả về order_id để có thể sử dụng ngay
    return newOrder.order_id;
}

// Export addOrder ra window để có thể gọi từ mọi nơi
window.addOrder = addOrder;

// Hàm lấy order_id mới nhất được tạo
function getLastCreatedOrderId() {
    return localStorage.getItem('lastCreatedOrderId');
}

// Export hàm getLastCreatedOrderId ra window
window.getLastCreatedOrderId = getLastCreatedOrderId;

// addOrder("20/10/2025 16:35", "Quận 6", 5, 17990000, "Ví điện tử", [[5, 1], [14, 1]]);

function cancelOrder(order_id) {
    let index = allOrders.findIndex(o => o.order_id == order_id);
    if (index != -1) {
        allOrders[index].status = 'cancel';
        localStorage.setItem('phonestore_orders', JSON.stringify(allOrder));
        
        // preProcessing chỉ có ở trang admin, kiểm tra trước khi gọi
        if (typeof preProcessing === 'function') {
            preProcessing(5, allOrder, customerData, allOrder.length);
        }
    }
}

// Export các function cần thiết
// export { addOrder, cancelOrder, getAllOrders, storeOrderInLocalStorage };

function initAddress() {
    const dictrictSearch = document.getElementById('dictrict-select');
    const districts = vietnamAddress["Thành phố Hồ Chí Minh"].districts;
}