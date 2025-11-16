//Vẽ form đăng kí, đăng nhập vào body
//Vẽ form đăng ký

const formDangKy = document.createElement("div");
formDangKy.setAttribute("id", "formDangKy");
document.body.appendChild(formDangKy);
formDangKy.innerHTML = `
        <div class="form-background" title="form-background">
            <div class="form-container" title="registerContainer">
                <button type="button" class="close-form">X</button>
                <div class="form-header" title="form-header">
                    <img src="./assets/images/icons/auth/reg-icon.svg">
                    <h1> Tạo tài khoản mới </h1>
                    <p>Đăng ký để bắt đầu mua sắm</p>
                </div>
                <form class="form" name="regform" autocomplete="on" novalidate> 
                    <fieldset>
                        <legend>Họ và tên <span style="color: red">*</span> </legend>
                        <input id="hoVaTenDangKy" required type="text" placeholder="Nguyễn Văn A">
                    </fieldset>
                    <fieldset>
                        <legend>Email <span style="color: red">*</span></legend>
                        <input class="email" required type="text" placeholder="example@email.com">
                    </fieldset>
                    <fieldset>
                        <legend>Mật khẩu <span style="color: red">*</span></legend>
                        <div>
                            <input class="matKhau" required type="password" placeholder="Ít nhất 8 ký tự">
                            <input type="checkbox" class="showPassword">
                        </div>
                        <div style="height: 1em; display: flex; align-items: center; gap: 0.3em">
                            <img src="./assets/images/icons/auth/check.svg">
                            <p name="password-req" style="height: fit-content">Ít nhất 8 ký tự</p>
                        </div>
                        <div style="height: 1em; display: flex; align-items: center; gap: 0.3em">
                            <img src="./assets/images/icons/auth/check.svg">
                            <p name="password-req">Bao gồm chữ số, chữ hoa và chữ thường</p>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>Xác nhận mật khẩu <span style="color: red">*</span></legend>
                        <div>
                            <input class="matKhau" required type="password" name="passwordConfirm" placeholder="Nhập lại mật khẩu">
                            <input type="checkbox" class="showPassword">
                        </div>
                    </fieldset>
                    <fieldset style="margin-top: 0; margin-bottom: 3%;">
                        <label style="display: flex; align-items: center; gap: 0.3rem; font-size: small;">
                            <input type="checkbox" required id="agreement" name="agreement">
                            Tôi đồng ý với <a href="" style="color: #16A34A">Điều khoản dịch vụ</a> và <a href="" style="color: #16A34A">Chính sách bảo mật</a>
                        </label>
                    </fieldset>
                    <button type="submit" class="submitButton" style="background-color: #16A34A;">Đăng ký</button>
                </form>
                <div class="footer" title="footer" style="text-align: center; margin-bottom: 7%; margin-top: 3%;">
                    Đã có tài khoản? <a style="color: #16A34A; font-weight: bold;"> Đăng nhập ngay </a>
                </div>
            </div>
        </div>
        `;

const formDangNhap = document.createElement("div");
formDangNhap.setAttribute("id", "formDangNhap");
document.body.appendChild(formDangNhap);
formDangNhap.innerHTML = `
        <div class="form-background" title="form-background">
            <div class="form-container" title="loginContainer">
            <button type="button" class="close-form">X</button>
                <div class="form-header" title="form-header">
                    <img src="./assets/images/icons/auth/log-icon.svg">
                    <h1>Chào mừng trở lại</h1>
                    <p>Đăng nhập để tiếp tục mua sắm</p>
                </div>
                <form class="form" name="form" autocomplete="on" novalidate style="width: 100%;"> 
                    <fieldset>
                        <legend>Email <span style="color: red">*</span></legend>
                        <input class="email" required type="text" placeholder="Nhập email tài khoản">
                    </fieldset>
                    <fieldset>
                        <legend>Mật khẩu <span style="color: red">*</span></legend>
                        <div>
                            <input class="matKhau" required type="password" placeholder="Nhập mật khẩu">
                            <input type="checkbox" class="showPassword">
                        <div>
                    </fieldset>
                    <fieldset style="margin-top: 3%;margin-bottom: 5%;">
                            <label for="rememberMe" style="display: flex; align-items: center; gap: 0.3em; font-size: small; width: fit-content; float: left;">
                                <input type="checkbox" id="rememberMe">
                                Nhớ đăng nhập
                            </label>
                            <a style="float:right; color: #2563EB; font-size: small">Quên mật khẩu?</a>
                    </fieldset>
                    <button type="submit" class="submitButton" name="submitBtn" style="background-color: #2563EB;">Đăng nhập</button>
                </form>
                <div class="footer" title="footer" style="display: flex; flex-direction: column; align-items: center; margin-top: 3%">
                    <p style="width:fit-content; font-size: 1em">Chưa có tài khoản? <a style="color: #2563EB; font-weight:bold;"> Đăng kí ngay </a></p>
                    <hr style="border: solid 0.1px #E5E7EB; margin: 0; margin-left: 10%; margin-right: 10%; align-self: normal;">
                    <p style="font-size:small; text-align: center; margin: 3% 15% ;">Bằng việc đăng nhập, bạn đồng ý với <a href="" style="color: #2563EB">Điều khoản sử dụng</a> và <a href="" style="color: #2563EB">Chính sách bảo mật</a>
                </div>
            </div>
        </div>
`;

//Lấy các element trong form để gắn EventListener
const regname = document.getElementById("hoVaTenDangKy");
const email = document.getElementsByClassName("email");
const password = document.getElementsByClassName("matKhau");
const form = document.getElementsByClassName("form");
const passreq = document.getElementsByName("password-req");
const agreement = document.getElementById("agreement");
const rememberMe = document.getElementById("rememberMe");
const showPassword = document.querySelectorAll(".showPassword");

const signinFormFooter = formDangNhap.querySelector(".footer");
const signUpRedirect = signinFormFooter.querySelector("a");

const signupFormFooter = formDangKy.querySelector(".footer");
const signInRedirect = signupFormFooter.querySelector("a");

showPassword.keys().forEach((key) => {
    showPassword[key].onclick = function (event) {
        if (password[key].type == "password")
            password[key].type = "text";
        else
            password[key].type = "password";
    }

    password[key].oninput = function (event) {
            password[key].setCustomValidity("");
            if (password[key].value != "")
            {
                showPassword[key].style.visibility="visible";
            }
            else
            { 
                showPassword[key].style.visibility="hidden";
            }
        }

    password[key].onclick = function e() {
        password[key].select();
    }
});

signUpRedirect.onclick = function (event) { 
    formBackground[1].classList.toggle("open");
    setTimeout(() => {
        formDangNhap.style.visibility="hidden";
        formDangKy.style.visibility="visible";
        formBackground[0].classList.toggle("open");
    }, 250);
}

signInRedirect.onclick = function (event) {
    formBackground[0].classList.toggle("open");
    setTimeout(() => {
            formDangKy.style.visibility="hidden";
            formDangNhap.style.visibility="visible";
            formBackground[1].classList.toggle("open");
        }, 250);
}
//Tắt thông báo kiểm tra hợp lệ khi người dùng input
regname.oninput = function e() {
    regname.setCustomValidity("");
};

Array.from(email).forEach(address => {
    address.oninput = function e() {
        address.setCustomValidity("");
    }
});

agreement.oninput = function e() {
    agreement.setCustomValidity("");
};

//Check form dang ky
form[0].addEventListener("submit", (e) => {
    e.preventDefault();

    /* Check họ và tên */
    if (regname.value=="")
        regname.setCustomValidity("Vui lòng nhập họ tên");
    else if (/[0-9]/.test(regname.value)) {
        regname.setCustomValidity("Họ tên không được kèm số");
    }

    /* Check email */
    if (email[0].value=="")
        email[0].setCustomValidity("Vui lòng nhập địa chỉ email");
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email[0].value))
        email[0].setCustomValidity("Địa chỉ email không hợp lệ");

    /* Check password */
    //Mật khẫu trống
    if (password[0].value==""){
        password[0].setCustomValidity("Vui lòng nhập mật khẩu");
        passreq[0].style.color="red";
        passreq[1].style.color="red";
    }
    //Mật khẩu không đủ 8 kí tự hoặc chữ thường, chữ hoa và chữ số
    else if (!/^.{8,}$/.test(password[0].value) || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).+$/.test(password[0].value)) {
        //Không đủ 8 kí tự    
        if (!/^.{8,}$/.test(password[0].value)) {
                password[0].setCustomValidity("Mật khẩu phải chứa ít nhất 8 kí tự");
                passreq[0].style.color="red";
            }
            else passreq[0].style.color="green";

        //Không đủ chữ thường, chữ hoa và chữ số
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).+$/.test(password[0].value)){
            password[0].setCustomValidity("Mật khẩu phải bao gồm chữ số, chữ hoa và chữ thường");
            passreq[1].style.color="red";
        }
        else passreq[1].style.color="green";
    }
    else {
        passreq[0].style.color="green";
        passreq[1].style.color="green";
    }

    /* Check nhap lai password */
    if (password[1].value=="")
        password[1].setCustomValidity("Vui lòng nhập lại mật khẩu");
    else if (password[1].value !== password[0].value) { 
        password[1].setCustomValidity("Mật khẩu không trùng khớp");
    }

    /* Check dieu khoan dich vu */
    if (!agreement.checked) {
        agreement.setCustomValidity("Bạn phải đồng ý với Điều khoản dịch vụ và Chính sách bảo mật để tiếp tục");
    }

    if (!form[0].checkValidity())
        form[0].reportValidity();
    else
    {
        let registerStatus = registerUser(regname.value, email[0].value, password[0].value);
        if (registerStatus)
        {
            alert("Đăng ký thành công, vui lòng đăng nhập lại");
            formBackground[0].classList.remove("open");
            formDangKy.style.visibility="hidden";
        }
        else
        { 
            email[0].setCustomValidity("Tài khoản đã tồn tại");
            form[0].reportValidity();
        }
    }
});

//Check form dang nhap
form[1].addEventListener("submit", (e) => {
    console.log("dang nhap");
    e.preventDefault();

    if (email[1].value=="")
        email[1].setCustomValidity("Vui lòng nhập địa chỉ email");
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email[1].value))
        email[1].setCustomValidity("Địa chỉ email không hợp lệ");

    if (!form[1].checkValidity())
        form[1].reportValidity();
    else
    {       
        let agree = rememberMe.checked;
        let loginStatus = loginUser(email[1].value, password[2].value);
        console.log(loginStatus);
        //Dang nhap khong thanh cong
        if (loginStatus == 2)
        {
            password[2].setCustomValidity("Mật khẩu không chính xác");
            form[1].reportValidity();
            console.log("Wrong password");
        }
        //Dang nhap thanh cong
        else if (loginStatus == 1)
        {
            //Thông báo tài khoản bị khóa
            alert("Tài khoản bị khóa");
            formBackground[1].classList.remove("open");
            formDangNhap.style.visibility="hidden";
        }
        else
        {
            console.log(agree);
            drawDropdownMenu();
            location.reload();
            formBackground[1].classList.remove("open");
        }
    }
});

function drawFormDangKy() {
    console.log("Draw form dang ky");
    formDangKy.style.visibility="visible";
    formBackground[0].classList.add("open");
}

function drawFormDangNhap() {
    console.log("Draw form dang nhap")
    formDangNhap.style.visibility="visible";
    formBackground[1].classList.add("open");
}

//Thoát form khi ấn ra ngoài
const formBackground=document.getElementsByClassName("form-background");
const closeButton = document.getElementsByClassName("close-form");
window.onclick = function (event) {
    if (event.target == formBackground[0] || event.target == closeButton[0])
    {
        form[0].reset();
        showPassword.forEach((button) => button.style.visibility="hidden");
        passreq[0].style.color="black";
        passreq[1].style.color="black";
        formBackground[0].classList.remove("open");
        this.setTimeout(() => {
            formDangKy.style.visibility="hidden";
        }, 250);
    }
    else if (event.target == formBackground[1] || event.target == closeButton[1])
    {
        form[1].reset();
        showPassword.forEach((button) => button.style.visibility="hidden");
        formBackground[1].classList.remove("open");
        this.setTimeout(() => {
            formDangNhap.style.visibility="hidden";
        }, 250);
    }
}

function fetchUsersData() {
    let userList = [];
    let userFetch = localStorage.getItem(STORAGE_KEYS.USERS) || [];
    userList = JSON.parse(userFetch);
    return userList;
}
// ===================Xử lý đăng nhập đăng xuất=================

//Xử lý đăng ký
function registerUser(regName, regMail, regPass)
{
    const userList = fetchUsersData(); 
    //Tài khoản tồn tại hay chưa
    let existAccount = userList.find((user) => user.email == regMail) || false;
    console.log(existAccount);
    if (existAccount != false)
    { 
        email[0].setCustomValidity("Tài khoản đã tồn tại");
        form[0].reportValidity();
        return;
    }
    let date = new Date().getDate();
    let month = new Date().getMonth();
    let year = new Date().getFullYear();
    let joinDateVal = date + "/" + month + "/" + year;
    let userId = userList.at(-1).id + 1; //Lấy id của người dùng gần đây nhất +1;
    let account = {
        id: userId,
        name: regName, 
        email: regMail,
        phone: "",
        address: "",
        trangthai: "active",
        joinDate: joinDateVal,
        orders: 0,
        password: regPass
    };

    userList.push(account);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(userList));
    formDangKy.getElementsByClassName("form")[0].reset();
    Array.from(passreq).forEach(req => {
        req.style.color="initial";
    });
    formDangKy.style.visibility="hidden";
    return true;
}

//Xử lý đăng nhập
function loginUser(logEmail, logPass)
{
    const userList=fetchUsersData();
    for (let i = 0; i < userList.length; i++)
    { 
        console.log(userList[i].email + userList[i].password);
        if (logEmail == userList[i].email && logPass == userList[i].password)
        { 
            if (userList[i].trangthai != "locked") {
                formDangNhap.getElementsByClassName("form")[0].reset();
                localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userList[i]));
                formDangNhap.style.visibility="hidden";
                return 0;
            }
            else{
                //Tài khoản bị khóa
                return 1;
            }
        }
    }
    //Sai mật khẩu
    return 2;
}