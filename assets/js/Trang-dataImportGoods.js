// ======================= importData.js =======================

// Tên key trong localStorage
const IMPORT_KEY = "phonestore_import_orders";

// Dữ liệu mẫu ban đầu
const defaultImports = [
  {
    id: 1,
    date: "2025-10-23",
    status: "Hoàn thành",
    details: [
      { product: "Iphone 15 ProMax", price: 25000000, qty: 100 },
      { product: "Iphone 14 Pro", price: 22000000, qty: 100 },
      { product: "Iphone 13", price: 17000000, qty: 100 },
      { product: "Iphone SE", price: 11000000, qty: 100 },
      { product: "Samsung Galaxy S24 Ultra", price: 24000000, qty: 100 },
      { product: "Samsung Galaxy Z Fold5", price: 26000000, qty: 100 },
      { product: "Samsung Galaxy A54", price: 10500000, qty: 100 },
      { product: "Xiaomi 13T Pro", price: 13500000, qty: 100 },
      { product: "Xiaomi Redmi Note 12", price: 8500000, qty: 100 },
      { product: "Oppo Find X6 Pro", price: 15500000, qty: 100 },
      { product: "Oppo Reno10", price: 11800000, qty: 100 },
      { product: "Vivo V29", price: 9700000, qty: 100 },
      { product: "Vivo Y36", price: 7600000, qty: 100 },
      { product: "Realme 11 Pro+", price: 8900000, qty: 100 },
      { product: "Nokia G50", price: 6800000, qty: 100 },
      { product: "iPhone 17 Pro Max", price: 50000000, qty: 100 }
    ],
  },
  
];

// Chỉ set dữ liệu mặc định nếu chưa có dữ liệu trong localStorage
const existingImports = localStorage.getItem("phonestore_import_orders");
if (!existingImports || existingImports === '[]' || existingImports === 'null') {
  localStorage.setItem(
    "phonestore_import_orders",
    JSON.stringify(defaultImports)
  );
  console.log('📦 Đã khởi tạo dữ liệu mặc định cho import orders');
} else {
  console.log('📦 Đã có dữ liệu import orders, giữ nguyên dữ liệu hiện có');
}
