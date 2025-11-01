let allProducts = [
  {
    id: 1,
    tensanpham: "Iphone 15 ProMax",
    danhmuc: "Iphone",
    giavon: 25000000, // Giá vốn (giá nhập hàng)
    gia: 29999999,
    oldPrice: 32000000,
    discount: -7,
    rating: 4.6,
    reviews: 72,
    description: "Trả góp 0% - 0đ phụ thu - 0đ trả trước - kỳ hạn đến 12 tháng",
    trangthai: true,
    soluong: "40",
    hinhanh: "./assets/images/products/ip15prm",
  },
  {
    id: 2,
    tensanpham: "Iphone 14 Pro",
    danhmuc: "Iphone",
    giavon: 22000000,
    gia: 25990000,
    oldPrice: 27990000,
    discount: -7,
    rating: 4.5,
    reviews: 50,
    description: "Trả góp 0% - 0đ phụ thu - 0đ trả trước - kỳ hạn đến 12 tháng",
    trangthai: true,
    soluong: "35",
    hinhanh: "./assets/images/products/ip14prm.jpg",
  },
  {
    id: 3,
    tensanpham: "Iphone 13",
    danhmuc: "Iphone",
    giavon: 17000000,
    gia: 19990000,
    oldPrice: 21990000,
    discount: -9,
    rating: 4.4,
    reviews: 40,
    description: "Trả góp 0% - 0đ phụ thu - 0đ trả trước - kỳ hạn đến 12 tháng",
    trangthai: true,
    soluong: "50",
    hinhanh: "./assets/images/products/ip13.jpg",
  },
  {
    id: 4,
    tensanpham: "Iphone SE",
    danhmuc: "Iphone",
    giavon: 11000000,
    gia: 12990000,
    oldPrice: 13990000,
    discount: -7,
    rating: 4.2,
    reviews: 25,
    description: "Trả góp 0% - 0đ phụ thu - 0đ trả trước - kỳ hạn đến 12 tháng",
    trangthai: true,
    soluong: "25",
    hinhanh: "./assets/images/products/ipse.webp",
  },
  {
    id: 5,
    tensanpham: "Samsung Galaxy S24 Ultra",
    danhmuc: "Samsung",
    giavon: 24000000,
    gia: 27990000,
    oldPrice: 29990000,
    discount: -7,
    rating: 4.8,
    reviews: 110,
    description: "Trả góp 0% - 0đ phụ thu - 0đ trả trước - kỳ hạn đến 12 tháng",
    trangthai: true,
    soluong: "30",
    hinhanh: "./assets/images/products/samsung-galaxy-s24-ultra.png",
  },
  {
    id: 6,
    tensanpham: "Samsung Galaxy Z Fold5",
    danhmuc: "Samsung",
    giavon: 26000000,
    gia: 29490000,
    oldPrice: 31490000,
    discount: -6,
    rating: 4.7,
    reviews: 65,
    description: "Trả góp 0% - 0đ phụ thu - 0đ trả trước - kỳ hạn đến 12 tháng",
    trangthai: true,
    soluong: "20",
    hinhanh: "./assets/images/products/samsung-galaxy-z-fold-5.png",
  },
  {
    id: 7,
    tensanpham: "Samsung Galaxy A54",
    danhmuc: "Samsung",
    giavon: 10500000,
    gia: 12490000,
    oldPrice: 13990000,
    discount: -11,
    rating: 4.5,
    reviews: 78,
    description: "Trả góp 0% - 0đ phụ thu - 0đ trả trước - kỳ hạn đến 12 tháng",
    trangthai: true,
    soluong: "45",
    hinhanh: "./assets/images/products/samsung-galaxy-a54.webp",
  },
  {
    id: 8,
    tensanpham: "Xiaomi 13T Pro",
    danhmuc: "Xiaomi",
    giavon: 13500000,
    gia: 15990000,
    oldPrice: 17990000,
    discount: -11,
    rating: 4.6,
    reviews: 88,
    description: "Trả góp 0% - 0đ phụ thu - 0đ trả trước - kỳ hạn đến 12 tháng",
    trangthai: true,
    soluong: "40",
    hinhanh: "./assets/images/products/xiaomi-13t-pro.png",
  },
  {
    id: 9,
    tensanpham: "Xiaomi Redmi Note 12",
    danhmuc: "Xiaomi",
    giavon: 8500000,
    gia: 9990000,
    oldPrice: 10990000,
    discount: -9,
    rating: 4.3,
    reviews: 32,
    description: "Trả góp 0% - 0đ phụ thu - 0đ trả trước - kỳ hạn đến 12 tháng",
    trangthai: true,
    soluong: "60",
    hinhanh: "./assets/images/products/xiaomi-redmi-note-12.jpg",
  },
  {
    id: 10,
    tensanpham: "Oppo Find X6 Pro",
    danhmuc: "Oppo",
    giavon: 15500000,
    gia: 18490000,
    oldPrice: 19990000,
    discount: -8,
    rating: 4.4,
    reviews: 49,
    description: "Trả góp 0% - 0đ phụ thu - 0đ trả trước - kỳ hạn đến 12 tháng",
    trangthai: true,
    soluong: "25",
    hinhanh: "./assets/images/products/oppo-find-x6-pro.webp",
  },
  {
    id: 11,
    tensanpham: "Oppo Reno10",
    danhmuc: "Oppo",
    giavon: 11800000,
    gia: 13990000,
    oldPrice: 14990000,
    discount: -7,
    rating: 4.3,
    reviews: 51,
    description: "Trả góp 0% - 0đ phụ thu - 0đ trả trước - kỳ hạn đến 12 tháng",
    trangthai: true,
    soluong: "40",
    hinhanh: "./assets/images/products/oppo-reno-10.png",
  },
  {
    id: 12,
    tensanpham: "Vivo V29",
    danhmuc: "Vivo",
    giavon: 9700000,
    gia: 11490000,
    oldPrice: 12490000,
    discount: -8,
    rating: 4.2,
    reviews: 33,
    description: "Trả góp 0% - 0đ phụ thu - 0đ trả trước - kỳ hạn đến 12 tháng",
    trangthai: true,
    soluong: "30",
    hinhanh: "./assets/images/products/vivo-v29.webp",
  },
  {
    id: 13,
    tensanpham: "Vivo Y36",
    danhmuc: "Vivo",
    giavon: 7600000,
    gia: 8990000,
    oldPrice: 9990000,
    discount: -10,
    rating: 4.1,
    reviews: 28,
    description: "Trả góp 0% - 0đ phụ thu - 0đ trả trước - kỳ hạn đến 12 tháng",
    trangthai: true,
    soluong: "55",
    hinhanh: "./assets/images/products/vivo-y36.webp",
  },
  {
    id: 14,
    tensanpham: "Realme 11 Pro+",
    danhmuc: "Realme",
    giavon: 8900000,
    gia: 10490000,
    oldPrice: 11490000,
    discount: -9,
    rating: 4.3,
    reviews: 41,
    description: "Trả góp 0% - 0đ phụ thu - 0đ trả trước - kỳ hạn đến 12 tháng",
    trangthai: true,
    soluong: "35",
    hinhanh: "./assets/images/products/realme-11pro.webp",
  },
  {
    id: 15,
    tensanpham: "Nokia G50",
    danhmuc: "Nokia",
    giavon: 6800000,
    gia: 7990000,
    oldPrice: 8990000,
    discount: -11,
    rating: 4.0,
    reviews: 22,
    description: "Trả góp 0% - 0đ phụ thu - 0đ trả trước - kỳ hạn đến 12 tháng",
    trangthai: true,
    soluong: "50",
    hinhanh: "./assets/images/products/Nokia-G50.jpg",
  },
  {
    id: 16,
    tensanpham: "iPhone 17 Pro Max",
    danhmuc: "Iphone",
    giavon: 50000000,
    gia: 59400000,
    oldPrice: 63000000,
    discount: -6,
    rating: 4.6,
    reviews: 72,
    description: "Trả góp 0% - 0đ phụ thu - 0đ trả trước - kỳ hạn đến 12 tháng",
    trangthai: true,
    soluong: "20",
    hinhanh: "./assets/images/products/ip17.png",
  },
];

// Lưu vào local storage
function storeProductsInLocalStorage() {
  // Lấy sản phẩm hiện có
  const existingProducts = localStorage.getItem("phonestore_products");
  // Nếu sản phẩm chưa tồn tại thì lưu vào local storage
  if (!existingProducts) {
    localStorage.setItem("phonestore_products", JSON.stringify(allProducts));
    console.log("✅ Đã khởi tạo dữ liệu mẫu cho sản phẩm");
  } else {
    console.log("✅ Đã có dữ liệu sản phẩm trong localStorage");
  }
}

// Lấy sản phẩm trong local storage
function getAllProducts() {
  return JSON.parse(localStorage.getItem("phonestore_products"));
}

// Fix đường dẫn ảnh cũ trong localStorage (nếu có)
function fixImagePaths() {
  let products = getAllProducts() || [];
  let needsUpdate = false;

  products = products.map((product) => {
    if (product.hinhanh && product.hinhanh.startsWith("/assets/")) {
      product.hinhanh = "." + product.hinhanh;
      needsUpdate = true;
    }
    return product;
  });

  if (needsUpdate) {
    localStorage.setItem("phonestore_products", JSON.stringify(products));
    console.log("✅ Đã cập nhật đường dẫn ảnh sản phẩm");
  }
}

//---------------Main---------------------//
storeProductsInLocalStorage();
fixImagePaths();
