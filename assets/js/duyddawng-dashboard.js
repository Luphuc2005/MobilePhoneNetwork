
function UpdateDashboard(){
    try {
        const user = StorageHelper.load(STORAGE_KEYS.USERS,[]);
        const product = StorageHelper.load(STORAGE_KEYS.PRODUCTS,[]);
        const orders = StorageHelper.load(STORAGE_KEYS.ORDERS,[]);

        const totalUsers = user.length;
        const totalProducts = product.length;
        const totalOrders = orders.length;
        const totalProfit = orders.filter(e => e.status =='done')
        .reduce((sum,e) => sum+ ( e.amount ||0.0),0) 
        changeData(totalUsers,'Khách hàng');
        changeData(totalProducts,'Sản phẩm');
        changeData(totalOrders,'Đơn hàng');
        changeData(formatCurrency(totalProfit),'Doanh thu');
        console.log(totalProducts+'==='+formatCurrency(totalProfit)+
        '==='+totalUsers+'==='+totalOrders)
    } catch (error) {
        console.log('Lỗi dashboard :'+error)
    }
}
function changeData(data,type){
    const statCard = document.querySelectorAll('.stat-card');
    if(statCard){
        statCard.forEach(e =>{
            const title = e.querySelector('h3');
            if(title && title.textContent.trim() === type ){
                const content = e.querySelector('p');
                content.textContent = data;
            }
        });
    }
}
function setupSync(){
    window.addEventListener('phonestore-sync', (e) => {
        //nếu trang web vừa mới lưu thì bỏ qua 
        if ([STORAGE_KEYS.USERS,STORAGE_KEYS.PRODUCTS,STORAGE_KEYS.ORDERS]
            .includes(e.detail.key)) {
            UpdateDashboard();
        }
    });
    
}
function innitDashboard(){
    UpdateDashboard();
    setupSync();
       setInterval(() => {
        if (document.getElementById('dashboard-content').style.display !== 'none') {
            updateDashboard();
        }
    }, 30000);

}

function formatCurrency(amount) {
    if (amount >= 1000000000) {
        // Tỷ đồng
        return (amount / 1000000000).toFixed(1) + 'B đ';
    } else if (amount >= 1000000) {
        // Triệu đồng
        return (amount / 1000000).toFixed(1) + 'M đ';
    } else if (amount >= 1000) {
        // Nghìn đồng
        return (amount / 1000).toFixed(0) + 'K đ';
    }
    return amount ;
}
if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded',innitDashboard);
}
else{
    innitDashboard();
}