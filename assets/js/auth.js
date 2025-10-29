//Điều hướng về index.html nếu chưa đăng nhập
let currentUser = JSON.parse(localStorage.getItem("phonestore_currentUser")) || null;
if (currentUser == null)
{
    location.href = "index.html";
}
else
{ 
    const userHeader = document.querySelector(".acount-icon");
    const sidebarHeader = document.getElementById("header-title");
    const hoTen = document.getElementById("hoten");
    const email = document.getElementById("email");
    const sdt = document.getElementById("sdt");
    const joinDate = document.getElementById("joinDateVal");
    const address = document.getElementById("diaChi");
    const password = document.getElementById("userPassword");
    const showPassword = document.getElementById("showPassword")
    const changePassword = document.getElementById("changePassword");
    const updateInfo = document.getElementById("updateInfo");

    userHeader.querySelector("span").textContent = currentUser.hoTen;
    sidebarHeader.textContent = currentUser.hoTen;
    hoTen.textContent = currentUser.hoTen;
    email.textContent = currentUser.email;
    sdt.textContent = currentUser.sdt;
    const joinDateVal = currentUser.ngayThamGia.replaceAll(" ", "/");
    joinDate.textContent = joinDateVal;
    address.textContent = currentUser.diaChi;
    address.style.color="";
    showPassword.onclick = function (event) {
        alert("Form confirm mật khẩu");
    };
    changePassword.onclick = function (event) {
        alert("Form thay đổi mật khẩu");
    };
    updateInfo.onclick = function (event) {
        alert("Form cập nhật thông tin cá nhân");
    }
}