const cartItems = document.querySelectorAll('.cart-item');
const checkoutButton = document.getElementById('checkout-button');
var listItemCart 

cartItems.forEach(item => {
    const increaseBtn = item.querySelector('.increase');
    const decreaseBtn = item.querySelector('.decrease');
    const quantityInput = item.querySelector('.item-quantity');
    const totalPrice = item.querySelector('.item-total');
    const removeBtn = item.querySelector('.item-remove');

    removeBtn.addEventListener('click', () => {
        item.remove();
        // Optionally, you can add code here to update the cart total
    });

    increaseBtn.addEventListener('click', () => {
        quantityInput.value = parseInt(quantityInput.value) + 1;
        updateTotalPrice();
    });

    decreaseBtn.addEventListener('click', () => {
        if (quantityInput.value > 1) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
            updateTotalPrice();
        }
    });

    

    function updateTotalPrice() {
        const price = parseFloat(item.querySelector('.item-price').textContent.replace('$', ''));
        const quantity = parseInt(quantityInput.value);
        totalPrice.textContent = `$${(price * quantity).toFixed(2)}`;
    }
});

const deleteAllItemsBtn = document.querySelector('.delete-all-item');
deleteAllItemsBtn.addEventListener('click', () => {
    cartItems.forEach(item => item.remove());
    // Optionally, you can add code here to update the cart total
});

//checkout button
checkoutButton.addEventListener('click', () => {
    let userInfoContainer = document.getElementById('user-info-container');
    let backgroundUserInfo = document.getElementsByClassName('background-user-info')[0];
    userInfoContainer.style.display = 'block';
    backgroundUserInfo.style.display = 'block';
});

var btnCart=document.getElementsByClassName('btn-cart');
for(let i=0;i<btnCart.length;i++){
    btnCart[i].addEventListener('click',function(){
        //lay du lieu tu localStorage de hien thi gio hang
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        let listItemCart = '';
        cart.forEach(item => {
            listItemCart += `
            <div class="cart-item">
                <div class="item-info">
                    <img src="${item.hinhanh}" alt="${item.tensanpham}" class="item-img" />
                    <div class="item-details">
                        <h4 class="item-name">${item.tensanpham}</h4>
                        <p class="item-price">$${item.gia}</p>
                    </div>
                </div>
                <div class="item-actions">
                    <div class="quantity-control">
                        <button class="decrease">-</button>
                        <input type="text" class="item-quantity" value="${item.quantity}" readonly />
                        <button class="increase">+</button>
                    </div>
                    <p class="item-total">$${(item.gia * item.quantity).toFixed(2)}</p>
                    <button class="item-remove">Xóa</button>
                </div>
            </div>
            `;      
        let cartContainer = document.getElementsByClassName('cart-container')[0];
        cartContainer.innerHTML = listItemCart; 
    });
}
}


// Re-run cart item event bindings after rendering
// (In a real application, consider using event delegation instead)
