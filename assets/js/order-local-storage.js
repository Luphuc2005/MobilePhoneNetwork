const allOrders = [
    {
        order_id: "DH001234",
        date: "15/10/2025 14:30",
        address: "Quận 1",
        customer_id: 1,
        status: "waiting",
        amount: 29990000, 
        purchase: "Tiền mặt khi giao hàng",
        product_list: [[1, 2], [2, 1], [3, 2]]
    }, 
    {
        order_id: "DH001235",
        date: "15/10/2025 14:35",
        address: "Quận 2",
        customer_id: 2,
        status: "accepted",
        amount: 29990000, 
        purchase: "Tiền mặt khi giao hàng",
        product_list: [[2, 1], [4, 2]]
    },
    {
        order_id: "DH001236",
        date: "15/10/2025 14:40",
        address: "Quận 3",
        customer_id: 3,
        status: "done",
        amount: 29990000, 
        purchase: "Tiền mặt khi giao hàng",
        product_list: [[11, 1], [12, 3], [14, 5]]
    },
    {
        order_id: "DH001237",
        date: "15/10/2025 14:50",
        address: "Quận 4",
        customer_id: 4,
        status: "delivery",
        amount: 29990000, 
        purchase: "Tiền mặt khi giao hàng", 
        product_list: [[5, 2], [14, 1]]
    },
    {
        order_id: "DH001239",
        date: "15/10/2025 13:30",
        address: "Quận 7",
        customer_id: 5,
        status: "cancel",
        amount: 29990000, 
        purchase: "Tiền mặt khi giao hàng",
        product_list: [[4, 5], [14, 3], [15, 1]]
    },
    {
        order_id: "DH001240",
        date: "15/10/2025 15:00",
        address: "Quận 5",
        customer_id: 5,
        status: "waiting",
        amount: 15990000, 
        purchase: "Chuyển khoản ngân hàng",
        product_list: [[7, 2], [10, 3], [11, 8]]
    },
    {
        order_id: "DH001241",
        date: "15/10/2025 15:05",
        address: "Quận 6",
        customer_id: 5,
        status: "accepted",
        amount: 25990000, 
        purchase: "Tiền mặt khi giao hàng",
        product_list: [[5, 1], [6, 1], [7, 1], [8, 1]]
    },
    {
        order_id: "DH001242",
        date: "15/10/2025 15:10",
        address: "Quận 8",
        customer_id: 4,
        status: "delivery",
        amount: 18990000, 
        purchase: "Chuyển khoản ngân hàng",
        product_list: [[8, 2], [9, 3], [10, 1]]
    },
    {
        order_id: "DH001243",
        date: "15/10/2025 15:15",
        address: "Quận 9",
        customer_id: 4,
        status: "done",
        amount: 9990000, 
        purchase: "Ví điện tử", 
        product_list: [[2, 1], [4, 1], [6, 1]]
    },
    {
        order_id: "DH001244",
        date: "15/10/2025 15:20",
        address: "Quận 10",
        customer_id: 3,
        status: "cancel",
        amount: 2990000, 
        purchase: "Tiền mặt khi giao hàng",
        product_list: [[8, 1], [9, 1], [10, 1], [11, 1], [12, 1]]
    },
    {
        order_id: "DH001245",
        date: "15/10/2025 15:25",
        address: "Quận 11",
        customer_id: 2,
        status: "waiting",
        amount: 45990000, 
        purchase: "Chuyển khoản ngân hàng",
        product_list: [[4, 1], [2, 1], [11, 1]]
    },
    {
        order_id: "DH001246",
        date: "15/10/2025 15:30",
        address: "Quận 12",
        customer_id: 1,
        status: "accepted",
        amount: 31990000, 
        purchase: "Tiền mặt khi giao hàng",
        product_list: [[1, 1], [3, 1], [14, 1], [15, 1]]
    },
    {
        order_id: "DH001247",
        date: "15/10/2025 15:35",
        address: "TP Thủ Đức",
        customer_id: 1,
        status: "delivery",
        amount: 27990000, 
        purchase: "Ví điện tử", 
        product_list: [[5, 1], [14, 1]]
    },
    {
        order_id: "DH001248",
        date: "15/10/2025 15:40",
        address: "Quận Bình Thạnh",
        customer_id: 4,
        status: "done",
        amount: 19990000, 
        purchase: "Chuyển khoản ngân hàng",
        product_list: [[5, 1], [14, 1], [15, 1]]
    },
    {
        order_id: "DH001249",
        date: "15/10/2025 15:45",
        address: "Quận Gò Vấp",
        customer_id: 5,
        status: "waiting",
        amount: 15990000, 
        purchase: "Tiền mặt khi giao hàng",
        product_list: [[3, 1], [4, 1], [5, 1]]
    }, 
    {
        order_id: "DH001250",
        date: "15/10/2025 15:50",
        address: "Quận Tân Bình",
        customer_id: 2,
        status: "accepted",
        amount: 24990000,
        purchase: "Chuyển khoản ngân hàng",
        product_list: [[4, 1], [7, 1], [8, 1]]
    },
    {
        order_id: "DH001251",
        date: "15/10/2025 15:55",
        address: "Quận Tân Phú",
        customer_id: 3,
        status: "delivery",
        amount: 18990000,
        purchase: "Tiền mặt khi giao hàng",
        product_list: [[9, 1], [10, 1], [11, 1]]
    },
    {
        order_id: "DH001252",
        date: "15/10/2025 16:00",
        address: "Quận Bình Tân",
        customer_id: 4,
        status: "waiting",
        amount: 20990000,
        purchase: "Chuyển khoản ngân hàng",
        product_list: [[2, 1], [14, 1], [12, 1]]
    },
    {
        order_id: "DH001253",
        date: "15/10/2025 16:05",
        address: "Quận Phú Nhuận",
        customer_id: 5,
        status: "done",
        amount: 27990000,
        purchase: "Ví điện tử",
        product_list: [[15, 1], [14, 1]]
    },
    {
        order_id: "DH001254",
        date: "15/10/2025 16:10",
        address: "Quận 1",
        customer_id: 2,
        status: "cancel",
        amount: 9990000,
        purchase: "Tiền mặt khi giao hàng",
        product_list: [[5, 1], [14, 1]]
    },
    {
        order_id: "DH001255",
        date: "15/10/2025 16:15",
        address: "Quận 2",
        customer_id: 1,
        status: "delivery",
        amount: 31990000,
        purchase: "Chuyển khoản ngân hàng", 
        product_list: [[5, 1], [14, 1]]
    },
    {
        order_id: "DH001256",
        date: "15/10/2025 16:20",
        address: "Quận 3",
        customer_id: 3,
        status: "waiting",
        amount: 15990000,
        purchase: "Ví điện tử",
        product_list: [[5, 1], [14, 1]]
    },
    {
        order_id: "DH001257",
        date: "15/10/2025 16:25",
        address: "Quận 4",
        customer_id: 3,
        status: "accepted",
        amount: 25990000,
        purchase: "Chuyển khoản ngân hàng",
        product_list: [[5, 1], [14, 1]]
    },
    {
        order_id: "DH001258",
        date: "15/10/2025 16:30",
        address: "Quận 5",
        customer_id: 4,
        status: "done",
        amount: 29990000,
        purchase: "Tiền mặt khi giao hàng",
        product_list: [[5, 1], [14, 1]]
    },
    {
        order_id: "DH001259",
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

let allOrder = getAllOrders();
let customerData = getAllCustomer();

//---------------Main---------------------//
storeOrderInLocalStorage();