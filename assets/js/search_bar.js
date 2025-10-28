const nameInput = document.getElementById("search-name");
const typeSelect = document.getElementById("search-type");
const minPriceInput = document.getElementById("min-price");
const maxPriceInput = document.getElementById("max-price");
const form = document.querySelector(".advanced-search");

const resultContainer = document.createElement("div");
resultContainer.classList.add("search-results");
document.querySelector(".search-bar").appendChild(resultContainer);

function renderResults(list) {
  resultContainer.innerHTML = "";

  if (list.length === 0) {
    resultContainer.innerHTML = "<p>Không tìm thấy sản phẩm nào</p>";
    return;
  }

  list.forEach(p => {
    const item = document.createElement("div");
    item.classList.add("product-item");
    item.innerHTML = `
      <strong>${p.name}</strong> 
      <span>(${p.type})</span> - 
      <em>${p.price.toLocaleString()}₫</em>
    `;
    resultContainer.appendChild(item);
  });
}

function filterProducts() {
  const nameValue = nameInput.value.trim().toLowerCase();
  const typeValue = typeSelect.value;
  const minPrice = parseInt(minPriceInput.value) || 0;
  const maxPrice = parseInt(maxPriceInput.value) || Infinity;

  const filtered = products.filter(p => {
    const matchName = p.name.toLowerCase().includes(nameValue);
    const matchType = !typeValue || p.type === typeValue;
    const matchPrice = p.price >= minPrice && p.price <= maxPrice;
    return matchName && matchType && matchPrice;
  });

  renderResults(filtered);
}

[nameInput, typeSelect, minPriceInput, maxPriceInput].forEach(el => {
  el.addEventListener("input", filterProducts);
});

form.addEventListener("submit", e => e.preventDefault());

renderResults(products);
