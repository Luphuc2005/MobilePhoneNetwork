let allProducts = JSON.parse(localStorage.getItem('product'));

function renderOrderDetail(order) {
    let detailOrderId = document.getElementById('detail-order-id');
    let detailDate = document.getElementById('detail-date');
    let detailAddress = document.getElementById('detail-address');
    let detailStatus = document.getElementById('detail-status');
    let detailProductList = document.getElementById('detail-products');
    let detailPayment = document.getElementById('detail-payment');
    let detailTotal = document.getElementById('detail-total');

    detailOrderId.textContent = order.order_id;
    detailDate.textContent = order.date;
    detailAddress.textContent = order.address;
    detailStatus.textContent = processStatus(order.status);
    detailPayment.textContent = order.purchase;
    detailTotal.textContent = order.amount;

    detailProductList.innerHTML = ``;
    for (let [idProduct, quantity] of order.product_list) {
        let idx = allProducts.findIndex(product => product.di = idProduct);
        detailProductList.innerHTML += `
            <li class = "detail-product-item">
                <div class = "detail-product-img-wrapper"> 
                    <img src="${allProducts[idx].hinhanh}" alt="${allProducts[idx].tensanpham}" align = "center">
                </div>
                <div class = "detail-product-info">
                    <p class = "detail-type-product">${allProducts[idx].danhmuc}</p>
                    <p class = "detail-product-name">${allProducts[idx].tensanpham}</p> 
                    <p class = "detail-product-quantity">x${quantity}</p> 
                </div>
                <div class = "detail-product-price">
                    ${allProducts[idx].gia}đ
                </div>
            </li>
        `
    }
}

function showOrderDetail(order) {
    renderOrderDetail(order)
    document.getElementsByClassName("detail-order-wrapper")[0].classList.remove("hidden");
}

function closeOrderDetail() {
    document.getElementsByClassName("detail-order-wrapper")[0].classList.add("hidden");
    console.log('close');
}

function initDetail() {
    let detailButtons = document.querySelectorAll('.detail-bnt');
    detailButtons.forEach(btn =>  {
        btn.addEventListener('click', () => {
            showOrderDetail(allOrder.find(o => o.order_id == btn.dataset.idOrder));
        });
    }) 
}

let closeDetailBtn = document.getElementsByClassName('detail-close-btn')[0];
closeDetailBtn.addEventListener('click', closeOrderDetail);
console.log(closeDetailBtn);