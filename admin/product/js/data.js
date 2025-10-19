const data = [
  {
    id: 1,
    tensanpham: "Iphone 15 ProMax",
    danhmuc: "Iphone",
    gia: 29.99,
    trangthai: true,
    soluong: "40",
    hinhanh: "https://example.com/iphone15promax.jpg"
  },
  {
    id: 2,
    tensanpham: "Iphone 14 Pro",
    danhmuc: "Iphone",
    gia: 25.99,
    trangthai: true,
    soluong: "35",
    hinhanh: "https://example.com/iphone14pro.jpg"
  },
  {
    id: 3,
    tensanpham: "Iphone 13",
    danhmuc: "Iphone",
    gia: 19.99,
    trangthai: true,
    soluong: "50",
    hinhanh: "https://example.com/iphone13.jpg"
  },
  {
    id: 4,
    tensanpham: "Iphone SE",
    danhmuc: "Iphone",
    gia: 12.99,
    trangthai: true,
    soluong: "25",
    hinhanh: "https://example.com/iphonese.jpg"
  },
  {
    id: 5,
    tensanpham: "Samsung Galaxy S24 Ultra",
    danhmuc: "Samsung",
    gia: 27.99,
    trangthai: true,
    soluong: "30",
    hinhanh: "https://example.com/s24ultra.jpg"
  },
  {
    id: 6,
    tensanpham: "Samsung Galaxy Z Fold5",
    danhmuc: "Samsung",
    gia: 29.49,
    trangthai: true,
    soluong: "20",
    hinhanh: "https://example.com/zfold5.jpg"
  },
  {
    id: 7,
    tensanpham: "Samsung Galaxy A54",
    danhmuc: "Samsung",
    gia: 12.49,
    trangthai: true,
    soluong: "45",
    hinhanh: "https://example.com/a54.jpg"
  },
  {
    id: 8,
    tensanpham: "Xiaomi 13T Pro",
    danhmuc: "Xiaomi",
    gia: 15.99,
    trangthai: true,
    soluong: "40",
    hinhanh: "https://example.com/13tpro.jpg"
  },
  {
    id: 9,
    tensanpham: "Xiaomi Redmi Note 12",
    danhmuc: "Xiaomi",
    gia: 9.99,
    trangthai: true,
    soluong: "60",
    hinhanh: "https://example.com/redminote12.jpg"
  },
  {
    id: 10,
    tensanpham: "Oppo Find X6 Pro",
    danhmuc: "Oppo",
    gia: 18.49,
    trangthai: true,
    soluong: "25",
    hinhanh: "https://example.com/findx6pro.jpg"
  },
  {
    id: 11,
    tensanpham: "Oppo Reno10",
    danhmuc: "Oppo",
    gia: 13.99,
    trangthai: true,
    soluong: "40",
    hinhanh: "https://example.com/reno10.jpg"
  },
  {
    id: 12,
    tensanpham: "Vivo V29",
    danhmuc: "Vivo",
    gia: 11.49,
    trangthai: true,
    soluong: "30",
    hinhanh: "https://example.com/v29.jpg"
  },
  {
    id: 13,
    tensanpham: "Vivo Y36",
    danhmuc: "Vivo",
    gia: 8.99,
    trangthai: true,
    soluong: "55",
    hinhanh: "https://example.com/y36.jpg"
  },
  {
    id: 14,
    tensanpham: "Realme 11 Pro+",
    danhmuc: "Realme",
    gia: 10.49,
    trangthai: true,
    soluong: "35",
    hinhanh: "https://example.com/realme11pro.jpg"
  },
  {
    id: 15,
    tensanpham: "Nokia G50",
    danhmuc: "Nokia",
    gia: 7.99,
    trangthai: true,
    soluong: "50",
    hinhanh: "https://example.com/nokiag50.jpg"
  }
];

localStorage.setItem("product", JSON.stringify(data));