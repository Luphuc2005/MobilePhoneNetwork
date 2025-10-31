//Điều hướng về index.html nếu chưa đăng nhập
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
if (currentUser == null)
{
    location.href = "index.html";
    throw new Error("Người dùng chưa đăng nhập");
}

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
const formBackground = document.getElementById("update-info-background");
const closeButton = document.querySelector(".close-form");
const updateForm = document.getElementById("update-form");

const newName=document.getElementById("new-name");
const newPhone=document.getElementById("new-phone");
const newEmail=document.getElementById("new-email");
const newCity=document.getElementById("new-city");
const newDistrict=document.getElementById("new-district");
const newWard=document.getElementById("new-ward");
const newAddress=document.getElementById("new-address");

insertUserInfo();
showPassword.onclick = function (event) {
    alert("Form confirm mật khẩu");
};
changePassword.onclick = function (event) {
    alert("Form thay đổi mật khẩu");
};
updateInfo.onclick = function (event) {
    formBackground.style.display="block";
}


closeButton.onclick = function (event) 
{ 
    formBackground.style.display="none";
}

formBackground.onclick = function (event) 
{
    if (event.target == formBackground)
        formBackground.style.display="none";
}

newName.onclick = function (event) {
    newName.select();
}

newName.oninput = function (event) {
    newName.setCustomValidity("");
}


newPhone.onclick = function (event) {
    newPhone.select();
}

newPhone.oninput = function (event) {
    newPhone.setCustomValidity("");
}

newEmail.onclick = function (event) {
    newEmail.select();
}

newEmail.oninput = function (event) {
    newEmail.setCustomValidity("");
}

updateForm.onsubmit = function (e) {
    e.preventDefault();
    if (!/^[A-Za-zÀ-Ỵà-ỿĂăÂâÊêÔôƠơƯưĐđ ]+$/.test(newName.value))
        newName.setCustomValidity("Họ tên không hợp lệ");
    if (!/^[0-9]+$/.test(newPhone.value))
        newPhone.setCustomValidity("Số điện thoại không hợp lệ");
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(newEmail.value))
        newEmail.setCustomValidity("Địa chỉ email không hợp lệ");
    if (newAddress.value != "") {
        if (!/^[A-Za-zÀ-Ỵà-ỿĂăÂâÊêÔôƠơƯưĐđ/,]+$/.test(newAddress.value))
            newAddress.setCustomValidity("Địa chỉ không hợp lệ");
    }
    if (!updateForm.checkValidity())
        updateForm.reportValidity();
    else
        updateUser(newName.value, newPhone.value, newEmail.value, currentUser.address);
}

updateForm.onreset = function (e) {
    e.preventDefault();
    insertFormInfo();
}

function insertUserInfo()
{ 
    userHeader.querySelector("span").textContent = currentUser.name;
    sidebarHeader.textContent = currentUser.name;
    hoTen.textContent = currentUser.name;
    email.textContent = currentUser.email;
    sdt.textContent = currentUser.phone;
    const joinDateVal = currentUser.joinDate;
    joinDate.textContent = joinDateVal;
    address.textContent = currentUser.address;
    address.style.color="";

    insertFormInfo();
}

function insertFormInfo()
{
    newName.value=currentUser.name;
    newPhone.value=currentUser.phone;
    newEmail.value=currentUser.email;
}

function updateUser(newName, newPhone, newEmail, newAddress)
{ 
    let newUser = {
        id: currentUser.id,
        name: newName , 
        email: newEmail,
        phone: newPhone,
        address: newAddress,
        trangthai: currentUser.trangthai,
        joinDate: currentUser.joinDate,
        orders: currentUser.orders,
        password: currentUser.password
    };

    if (JSON.stringify(newUser) == JSON.stringify(currentUser))
        console.log("Khong thay doi");
    else
        console.log("Co thay doi");
    console.log(JSON.stringify(newUser) +"\n" + JSON.stringify(currentUser));
    formBackground.style.display="none";
}