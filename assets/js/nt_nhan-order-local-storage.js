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
let customerData = getAllCustomer();
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

function addOrder(date, address, customer_id, amount, purchase, product_list) {
    lastId ++;
    let newOrder = {
        order_id: `DH${String(lastId).padStart(6, '0')}`,
        date: date,
        address: address,
        customer_id: customer_id, 
        status: "waiting",
        amount: amount,
        purchase: purchase, 
        product_list: product_list
    }
    allOrder.push(newOrder);
    localStorage.setItem('phonestore_orders', JSON.stringify(allOrder));
    preProcessing(5, allOrder, customerData, allOrder.length);
}

// addOrder("20/10/2025 16:35", "Quận 6", 5, 17990000, "Ví điện tử", [[5, 1], [14, 1]]);

function cancelOrder(order_id) {
    let index = allOrders.findIndex(o => o.order_id == order_id);
    if (index != -1) {
        allOrders[index].status = 'cancel';
        localStorage.setItem('phonestore_orders', JSON.stringify(allOrder));
        preProcessing(5, allOrder, customerData, allOrder.length);
    }
}