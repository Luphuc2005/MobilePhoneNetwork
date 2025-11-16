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

/**
 * Lấy các trạng thái có thể chuyển tiếp từ trạng thái hiện tại
 * Chỉ cho phép tiến, không cho phép lùi
 * @param {string} currentStatus - Trạng thái hiện tại (waiting, accepted, delivery, done, cancel)
 * @returns {Array} - Mảng các trạng thái có thể chuyển tiếp
 */
function getNextAllowedStatuses(currentStatus) {
    const statusMap = {
        'waiting': ['accepted', 'cancel'], // Chờ xử lý -> Đã xác nhận hoặc Đã hủy
        'accepted': ['delivery', 'cancel'], // Đã xác nhận -> Đang giao hoặc Đã hủy
        'delivery': ['done', 'cancel'], // Đang giao -> Hoàn thành hoặc Đã hủy
        'done': [], // Hoàn thành -> không thể thay đổi
        'cancel': [] // Đã hủy -> không thể thay đổi
    };
    return statusMap[currentStatus] || [];
}

/**
 * Chuyển đổi status code sang tên tiếng Việt
 * @param {string} status - Status code (waiting, accepted, delivery, done, cancel)
 * @returns {string} - Tên tiếng Việt
 */
function statusToVietnamese(status) {
    const statusMap = {
        'waiting': 'Chờ xử lý',
        'accepted': 'Đã xác nhận',
        'delivery': 'Đang giao',
        'done': 'Hoàn thành',
        'cancel': 'Đã hủy'
    };
    return statusMap[status] || status;
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

        // Lọc và chỉ hiển thị các trạng thái có thể chuyển tiếp
        const allowedStatuses = getNextAllowedStatuses(currentStatus);
        const currentStatusVietnamese = statusToVietnamese(currentStatus);
        
        select_item.forEach(item => {
            const itemStatus = preProcessStatus(item.textContent);
            // Hiển thị: trạng thái hiện tại + các trạng thái có thể chuyển tiếp
            // Ẩn: các trạng thái không được phép (trừ trạng thái hiện tại)
            if (itemStatus === currentStatus) {
                // Luôn hiển thị trạng thái hiện tại
                item.style.display = 'block';
                item.style.opacity = '0.6'; // Làm mờ để cho biết đây là trạng thái hiện tại
                item.style.cursor = 'default';
            } else if (allowedStatuses.includes(itemStatus)) {
                // Hiển thị các trạng thái có thể chuyển tiếp
                item.style.display = 'block';
                item.style.opacity = '1';
                item.style.cursor = 'pointer';
            } else {
                // Ẩn các trạng thái không được phép
                item.style.display = 'none';
            }
            
            item.addEventListener('click', function () {
                if (isLocked) return;
                
                // Kiểm tra xem trạng thái được chọn có hợp lệ không
                const selectedStatus = preProcessStatus(item.textContent);
                
                // Không cho phép chọn lại trạng thái hiện tại
                if (selectedStatus === currentStatus) {
                    alert('Đây là trạng thái hiện tại. Vui lòng chọn trạng thái khác!');
                    return;
                }
                
                if (!allowedStatuses.includes(selectedStatus)) {
                    alert('Không thể chuyển về trạng thái này. Chỉ có thể chuyển tiến!');
                    return;
                }
                
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
                
                const selectedStatus = preProcessStatus(select.textContent);
                const allowedStatuses = getNextAllowedStatuses(currentStatus);
                
                // Không cho phép chọn lại trạng thái hiện tại
                if (selectedStatus === currentStatus) {
                    alert('Vui lòng chọn trạng thái khác với trạng thái hiện tại!');
                    return;
                }
                
                // Kiểm tra xem trạng thái được chọn có hợp lệ không
                if (!allowedStatuses.includes(selectedStatus)) {
                    alert('Không thể chuyển về trạng thái này. Chỉ có thể chuyển tiến theo luồng:\n' +
                          'Chờ xử lý → Đã xác nhận → Đang giao → Hoàn thành\n' +
                          'Hoặc có thể hủy ở bất kỳ giai đoạn nào trước khi hoàn thành.');
                    return;
                }
                
                allOrder[index].status = selectedStatus;
                localStorage.setItem('phonestore_orders', JSON.stringify(allOrder));
                console.log(`Đơn ${orderId} đổi trạng thái từ ${statusToVietnamese(currentStatus)} sang ${select.textContent}`);
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