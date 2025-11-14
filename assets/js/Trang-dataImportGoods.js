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
      { product: "iPhone 16", price: 25000000, qty: 2 },
      { product: "iPad Pro", price: 18000000, qty: 1 },
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
