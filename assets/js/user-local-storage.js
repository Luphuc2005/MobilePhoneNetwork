const userData = [
    {
        "id": 1,
        "name": "Lư Hồng Phúc",
        "email": "phucga150625@email.com",
        "phone": "0866680197",
        "address": "123 ABC, Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
        "trangthai": "active",
        "joinDate": "01/01/2024",
        "orders": 0,
        "password": "Password1"
    },
    { 
        "id": 2,
        "name": "Nguyễn Văn An",
        "email": "nguyenvana@gmail.com",
        "phone": "3173849265",
        "address": "23 DEF, Phường 4, Quận 5, Thành phố Hồ Chí Minh",
        "trangthai": "active",
        "joinDate": "21/09/2025",
        "orders": 5,
        "password": "Password2"
    },
    { 
        "id": 3,
        "name": "Hoàng Văn Lâm",
        "email": "hoangvanlam@gmail.com",
        "phone": "5554103873",
        "address": "621 GHS, Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh",
        "trangthai": "active",
        "joinDate": "14/08/2024",
        "orders": 6,
        "password": "Password3"
    },
    { 
        "id": 4,
        "name": "Trương Tuấn Tài",
        "email": "tuantai@email.com",
        "phone": "8123054412",
        "address": "106 AMC, Phường 1, Quận 4, Thành phố Hồ Chí Minh",
        "trangthai": "active",
        "joinDate": "25/10/2025",
        "orders": 12,
        "password": "Password4"
    },
    { 
        "id": 5,
        "name": "Ngô Văn Liêm",
        "email": "ngovanliem@gmail.com",
        "phone": "5361847112",
        "address": "402 AMC, Phường 3, Quận 7, Thành phố Hồ Chí Minh",
        "trangthai": "active",
        "joinDate": "28/10/2025",
        "orders": 3,
        "password": "Password5"
    }
]

//Khởi tạo local storage
//Check xem local storage có danh sách khách hàng chưa
function initStorage() {
    let localUsers = localStorage.getItem("users");
    if (localUsers == null)
    { 
        localStorage.setItem("users", JSON.stringify(userData));
    }
}

initStorage();