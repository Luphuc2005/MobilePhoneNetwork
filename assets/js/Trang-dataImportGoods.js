// ======================= importData.js =======================

// Tên key trong localStorage
const IMPORT_KEY = "phonestore_import_orders";

// Dữ liệu mẫu ban đầu
const defaultImports = [
  {
    id: 1,
    date: "2025-10-1",
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
  {
    id: 2,
    date: "2025-10-25",
    status: "Chưa hoàn thành",
    details: [
      { product: "MacBook Air M3", price: 30000000, qty: 1 },
      { product: "AirPods Pro 3", price: 6000000, qty: 2 },
    ],
  },
  {
    id: 3,
    date: "2025-10-27",
    status: "Hoàn thành",
    details: [
      { product: "Apple Watch Series 10", price: 12000000, qty: 3 },
      { product: "iPhone 15 Pro", price: 22000000, qty: 1 },
    ],
  },
  {
    id: 4,
    date: "2025-10-29",
    status: "Chưa hoàn thành",
    details: [
      { product: "iPad Air M2", price: 16000000, qty: 2 },
      { product: "Apple Pencil 3", price: 3500000, qty: 3 },
    ],
  },
  {
    id: 5,
    date: "2025-11-01",
    status: "Hoàn thành",
    details: [
      { product: "MacBook Pro M3 Max", price: 52000000, qty: 1 },
      { product: "Magic Mouse 2", price: 2500000, qty: 2 },
    ],
  },
  {
    id: 6,
    date: "2025-11-02",
    status: "Chưa hoàn thành",
    details: [
      { product: "iPhone 14", price: 19000000, qty: 4 },
      { product: "iPad mini 6", price: 15000000, qty: 2 },
    ],
  },
  {
    id: 7,
    date: "2025-11-03",
    status: "Hoàn thành",
    details: [
      { product: "AirPods 4", price: 5000000, qty: 5 },
      { product: "Apple TV 4K", price: 4500000, qty: 1 },
    ],
  },
  {
    id: 8,
    date: "2025-11-04",
    status: "Chưa hoàn thành",
    details: [
      { product: "HomePod mini", price: 3200000, qty: 4 },
      { product: "iPhone 16 Pro Max", price: 30000000, qty: 1 },
    ],
  },
];

localStorage.setItem(
  "phonestore_import_orders",
  JSON.stringify(defaultImports)
);
