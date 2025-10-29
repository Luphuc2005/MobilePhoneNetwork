

//read json file and save to local storage
let data=fetch('/assets/Product.json')
  .then(response => response.json())
  .then(json => {
    localStorage.setItem("products", JSON.stringify(json));
  });
function addNewProductToFileJson(newProduct) {
  // Lấy dữ liệu hiện tại từ localStorage
  let products = JSON.parse(localStorage.getItem("products")) || [];  
  // Thêm sản phẩm mới vào mảng
  products.push(newProduct);
  // Cập nhật lại localStorage
  localStorage.setItem("products", JSON.stringify(products));
  data=products;
  const fs = require('fs'); // Thư viện tích hợp sẵn để thao tác với file

// Ghi dữ liệu ra file JSON
fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf8');

console.log('✅ File data.json đã được tạo thành công!');
}
// Example usage:
console.log(data);
 addNewProductToFileJson({id: 4, name: "New Product", price: 99.99, description: "This is a new product."});

 //save data to json file
 function saveDataToJsonFile(data, filename) {
  const fs = require('fs'); // Thư viện tích hợp sẵn để thao tác với file
  fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✅ File ${filename} đã được tạo thành công!`);
}