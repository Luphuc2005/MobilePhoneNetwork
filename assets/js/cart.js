const cartItems = document.querySelectorAll('.cart-item');
const checkoutButton = document.getElementById('checkout-button');

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