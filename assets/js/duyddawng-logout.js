const ADMIN_ACCOUT = [
    {username : 'admin', password : '3636' ,name :'Duy Đăng'},
    {username : 'duyddawng', password : '3636' ,name:'Duy Đăng'}

]

// =============ELEMENT===========
const loginPage = document.getElementById('loginPage');
const adminPage = document.getElementById('adminPage');
const loginForm = document.getElementById('login-form');
const userAdmin = document.getElementById('username');
const passwordAdmin = document.getElementById('password');
const messageBox = document.getElementById('message');
const rememberAdmin = document.getElementById('remember-me');
const nameAdminElement = document.getElementById('admin-name');
const logoutAdmin = document.getElementById('logoutButton');

//Check hiển thị 
function checkAdmin(){
    const isLogin = sessionStorage.getItem('login');
    const rememberMe = localStorage.getItem('remember-me');
    // đã đăng nhập or đã ghi nhớ đăng nhập
    if(isLogin === 'true' || rememberMe === 'true'){
        showAdmin();
    }
    else{
        showLogin();
    }
}
function showAdmin(){
    loginPage.style.display = "none";
    adminPage.style.display = 'block';
    console.log('Đăng nhập Admin ');
    message.style.display = 'none'
    const name = sessionStorage.getItem('nameAdmin') || localStorage.getItem('nameAdmin') ||'admin';
    //tên sau khi đăng nhập
    if(nameAdminElement){
        nameAdminElement.textContent = name;
    }
}
function showLogin(){
    loginPage.style.display = "flex";
    adminPage.style.display = 'none';
    console.log('Trang login');

}
function showMess(text,type){
    message.textContent = text;
    message.style.display = 'block';
        if(messageBox){
            if(type === 'err'){
            messageBox.style.background = '#fee';
            messageBox.style.color = '#c33';
            messageBox.style.border = '1px solid #fcc';
            setTimeout(()=>{
                message.style.display = 'none';
            },360);
        }
        else if (type === 'success'){
            messageBox.style.background = '#efe';
            messageBox.style.color = '#3c3';
            messageBox.style.border = '1px solid #cfc';
        }
    }
}
loginForm.addEventListener('submit',e =>{
    //dừng lại tất cả
    e.preventDefault();
    const username = userAdmin.value.trim();
    const password = passwordAdmin.value.trim();
    const check = rememberAdmin.checked;
    if(!username || !password){
        showMess('Vui lòng nhập đầy đủ thông tin ','err');
        return;
    }
    const account = ADMIN_ACCOUT.find(e =>
        e.username === username && e.password === password  
    );
    console.log('acc :',!!account);
    if(account){
        sessionStorage.setItem('isLogin','true');
        sessionStorage.setItem('nameAdmin',account.name);
        if(check){
            console.log('Ghi nhớ đăng nhập')
            localStorage.setItem('remember-me','true');
            localStorage.setItem('nameAdmin',account.name);
        }
        showMess('Đăng nhập thành công !!!','success');
        setTimeout(()=>{
            showAdmin();
            loginForm.reset();
        },360);
    }
    else{
        showMess('Tên đăng nhập hoặc mật khẩu không đúng !!!','err');
        passwordAdmin.value ='';
        //duy chuyển con trỏ chuột về mật khẩu
        passwordAdmin.focus();
    }
});
logoutButton.addEventListener('click',()=>{
    if(confirm('Bạn chắc chắn muốn đăng xuất !!!')){
        console.log('Logout thành công');
        //xóa tất cả 
        sessionStorage.clear();
        //xóa từ cái
        localStorage.removeItem('remember-me');
        localStorage.removeItem('nameAdmin');
        showLogin();
    }
});
//xóa mess khi nhập 
userAdmin.addEventListener('click',()=>{
    if(message) message.style.display='none';
});
userAdmin.addEventListener('click',()=>{
    if(message) message.style.display = 'none';
});
//===========KHỞI ĐỘNG =============
window.addEventListener('DOMContentLoaded',()=>{
    if(loginPage){
        checkAdmin();
    }

});
