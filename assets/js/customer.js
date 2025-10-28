let allCustomers = [
    {
        id: 1,
        name: "Nguyễn Văn A",
        phone: "0912345678",
        address: "123 Đường ABC, Phường Bến Nghé, Quận 1, TP.HCM"
    },
    {
        id: 2,
        name: "Nguyễn Văn B",
        phone: "0912345678",
        address: "123 Đường ABC, Phường Bến Nghé, Quận 1, TP.HCM"
    },
    {
        id: 3,
        name: "Nguyễn Văn C",
        phone: "0912345678",
        address: "123 Đường ABC, Phường Bến Nghé, Quận 1, TP.HCM"
    },
    {
        id: 4,
        name: "Nguyễn Văn D",
        phone: "0912345678",
        address: "123 Đường ABC, Phường Bến Nghé, Quận 1, TP.HCM"
    },
    {
        id: 5,
        name: "Nguyễn Văn E",
        phone: "0912345678",
        address: "123 Đường ABC, Phường Bến Nghé, Quận 1, TP.HCM"
    }
]

//----------------------FUNCTION-----------------------//

// Lưu vào local storage 
function storeCustomerInLocalStorage() {
    // Lấy khách hàng hiện có
    const existingCustomer = localStorage.getItem('allCustomers');
    // Nếu khách hàng chưa tồn tại thì lưu vào local storage
    if (!existingCustomer) {
        localStorage.setItem('allCustomer', JSON.stringify(allCustomers));
    }
}

// Lấy customer trong local storage
function getAllCustomer() {
    return JSON.parse(localStorage.getItem('allCustomer'));
}

//--------------------MAIN--------------------------//
storeCustomerInLocalStorage()
