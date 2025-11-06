function parseDateTime(dateStr) {
    const [datePart, timePart] = dateStr.split(" "); // ["15/10/2025", "13:30"]
    const [day, month, year] = datePart.split("/").map(Number);
    const [hour, minute] = timePart.split(":").map(Number);

    return new Date(year, month - 1, day, hour, minute);
}

function parseInputDate(dateStr) {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date;
}

function calculateTotalPages(totalItems, itemsPerPage) {
    return Math.ceil(totalItems / itemsPerPage);
}

document.getElementById('search-orders-form').addEventListener("submit", function(e) {
    e.preventDefault();
    let idOrName = document.getElementById("search-id-name").value.toLowerCase();
    let status = document.getElementById('status-select').value;
    let district = document.getElementById('dictrict-select').value;
    let fromDate = document.getElementById('start-date').value;
    let toDate = document.getElementById('end-date').value;
    
    filteredOrder = allOrder.filter(order => {
        const matchKeyword = idOrName === "" || order.order_id.toLowerCase().includes(idOrName) || order.address.toLowerCase().includes(idOrName);
        const matchStatus = status === "all" || order.status === status;
        const matchDistrict = district === "all" || order.address == district;
        const orderDate = parseDateTime(order.date);
        
        const fromDateObj = parseInputDate(fromDate);
        const toDateObj = parseInputDate(toDate);
        
        // Nếu có ngày bắt đầu, set giờ thành 00:00:00
        if (fromDateObj) {
            fromDateObj.setHours(0, 0, 0, 0);
        }
        
        // Nếu có ngày kết thúc, set giờ thành 23:59:59
        if (toDateObj) {
            toDateObj.setHours(23, 59, 59, 999);
        }
        
        const matchFrom = !fromDateObj || orderDate >= fromDateObj;
        const matchTo = !toDateObj || orderDate <= toDateObj;
        
        return matchFrom && matchTo && matchKeyword && matchStatus && matchDistrict;
    });  

    // Reset về trang 1 khi tìm kiếm
    currentPageOrder = 1;
    
    renderPageOrder();
});