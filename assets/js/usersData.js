const data = [
    { 
        "hoTen": "Lư Hồng Phúc",
        "email": "phucga150625@email.com",
        "sdt": "0866680197",
        "status": "active",
        "idDonHang": "",
        "ngayThamGia": "01 01 2024",
        "password": "Password1"
    },
    { 
        "hoTen": "Nguyễn Văn An",
        "email": "nguyenvana@gmail.com",
        "sdt": "3173849265",
        "status": "active",
        "idDonHang": "",
        "ngayThamGia": "21 09 2025",
        "password": "Password2"
    },
    { 
        "hoTen": "Hoàng Văn Lâm",
        "email": "hoangvanlam@gmail.com",
        "sdt": "5554103873",
        "status": "active",
        "idDonHang": "",
        "ngayThamGia": "14 08 2024",
        "password": "Password3"
    },
    { 
        "hoTen": "Trương Tuấn Tài",
        "email": "tuantai@email.com",
        "sdt": "8123054412",
        "status": "active",
        "idDonHang": "",
        "ngayThamGia": "25 10 2025",
        "password": "Password4"
    },
    { 
        "hoTen": "Ngô Văn Liêm",
        "email": "ngovanliem@gmail.com",
        "sdt": "5361847112",
        "status": "active",
        "idDonHang": "",
        "ngayThamGia": "28 10 2025",
        "password": "Password5"
    }
]

localStorage.setItem("userAccounts",JSON.stringify(data));