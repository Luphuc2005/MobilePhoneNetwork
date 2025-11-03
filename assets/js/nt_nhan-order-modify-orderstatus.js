function preProcessStatus(status) {
    switch (status) {
        case "Chờ xử lý": 
            return "waiting";
        case "Đã xác nhận":
            return "accepted";
        case "Hoàn thành":
            return "done";
        case "Đang giao":
            return "delivery";
        case "Đã hủy":
            return "cancel";
        default:
            return "unknown";
    }
}

function initDropdown() {
    const selectDropdown = document.querySelectorAll('.status-update-section');
    selectDropdown.forEach(dropdown => {
        let select = dropdown.querySelector('.status-select');
        let select_list = dropdown.querySelector('.select-list');
        let select_item = dropdown.querySelectorAll('.select-item');
        let update_status_btn = dropdown.querySelector('.update-status-order-btn');

        select.addEventListener('click', (event) => {
            selectDropdown.forEach(d => {
            if (d !== dropdown) {
                d.querySelector('.select-list').classList.add('hidden');
            }
            });
            select_list.classList.toggle('hidden');
            event.stopPropagation();
        });

        select_item.forEach(item => {
            item.addEventListener('click', function () {
                select.textContent = item.textContent;
                select_list.classList.toggle('hidden');
            })
        });
        
        update_status_btn.addEventListener('click', function () {
            let orderId = dropdown.dataset.idOrder;
            let index = allOrder.findIndex(o => o.order_id == orderId);
            if (index != -1) {
                allOrder[index].status = preProcessStatus(select.textContent);
                localStorage.setItem('allOrders', JSON.stringify(allOrder));
                console.log(`Đơn ${orderId} đổi trạng thái thành ${select.textContent}`);
            }
        });
    })

    document.addEventListener('click', () => {
        selectDropdown.forEach(d => {
            d.querySelector('.select-list').classList.add('hidden');
        });
    });

    document.addEventListener('scroll', () => {
        selectDropdown.forEach(d => {
            d.querySelector('.select-list').classList.add('hidden');
        });
    });
}
initDropdown();