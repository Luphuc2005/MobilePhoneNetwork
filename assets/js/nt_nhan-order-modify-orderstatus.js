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

        const orderId = dropdown.dataset.idOrder;
        let index = typeof allOrder !== 'undefined' ? allOrder.findIndex(o => o.order_id == orderId) : -1;
        if (index === -1) {
            const cached = JSON.parse(localStorage.getItem('phonestore_orders') || '[]');
            index = cached.findIndex(o => o.order_id == orderId);
        }
        const currentStatus = index !== -1 && typeof allOrder !== 'undefined' ? allOrder[index].status : (index !== -1 ? JSON.parse(localStorage.getItem('phonestore_orders') || '[]')[index].status : 'unknown');
        const isLocked = currentStatus === 'done' || currentStatus === 'cancel';
        if (isLocked) {
            update_status_btn.disabled = true;
            select.style.pointerEvents = 'none';
        }

        select.addEventListener('click', (event) => {
            if (isLocked) {
                event.stopPropagation();
                return;
            }
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
                if (isLocked) return;
                select.textContent = item.textContent;
                select_list.classList.toggle('hidden');
            })
        });
        
        update_status_btn.addEventListener('click', function () {
            let orderId = dropdown.dataset.idOrder;
            let index = allOrder.findIndex(o => o.order_id == orderId);
            if (index != -1) {
                const currentStatus = allOrder[index].status;
                if (currentStatus === 'done' || currentStatus === 'cancel') {
                    alert('Đơn hàng đã hoàn thành hoặc đã hủy, không thể thay đổi trạng thái');
                    return;
                }
                allOrder[index].status = preProcessStatus(select.textContent);
                localStorage.setItem('phonestore_orders', JSON.stringify(allOrder));
                console.log(`Đơn ${orderId} đổi trạng thái thành ${select.textContent}`);
                renderPageOrder();
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