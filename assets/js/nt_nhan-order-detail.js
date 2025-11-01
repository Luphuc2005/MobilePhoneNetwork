let allProductsDetail = JSON.parse(localStorage.getItem('phonestore_products'));

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
        let idx = allProductsDetail.findIndex(product => product.id == idProduct);
        console.log(idx);
        detailProductList.innerHTML += `
            <li class = "detail-product-item">
                <div class = "detail-product-img-wrapper"> 
                    <img src="${allProductsDetail[idx].hinhanh}" alt="${allProductsDetail[idx].tensanpham}" align = "center">
                </div>
                <div class = "detail-product-info">
                    <p class = "detail-type-product">${allProductsDetail[idx].danhmuc}</p>
                    <p class = "detail-product-name">${allProductsDetail[idx].tensanpham}</p> 
                    <p class = "detail-product-quantity">x${quantity}</p> 
                </div>
                <div class = "detail-product-price">
                    ${allProductsDetail[idx].gia}đ
                </div>
            </li>
        `;
    }
}

function showOrderDetail(order) {
    renderOrderDetail(order)
    document.getElementsByClassName("detail-order-wrapper")[0].classList.remove("hidden");
}

function closeOrderDetail() {
    document.getElementsByClassName("detail-order-wrapper")[0].classList.add("hidden");
}

function initDetail() {
    let detailButtons = document.querySelectorAll('.detail-bnt');
    detailButtons.forEach(btn =>  {
        btn.addEventListener('click', () => {
            showOrderDetail(allOrder.find(o => o.order_id == btn.dataset.idOrder));
            console.log("hihihihihihi");
        });
    }) 
}

let closeDetailBtn = document.getElementsByClassName('detail-close-btn')[0];
closeDetailBtn.addEventListener('click', closeOrderDetail);

function openDetail(html) {
  const detailWrapper = document.querySelector('.detail-order-wrapper');
  const detailContent = detailWrapper?.querySelector('.detail-content');
  if (!detailWrapper || !detailContent) return;
  detailContent.innerHTML = html;
  detailWrapper.classList.remove('hidden');
  // khóa scroll trang phía sau
  document.body.style.overflow = 'hidden';
}

function closeDetail() {
  const detailWrapper = document.querySelector('.detail-order-wrapper');
  if (!detailWrapper) return;
  detailWrapper.classList.add('hidden');
  document.body.style.overflow = '';
}