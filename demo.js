window.onload = function init()
{ 
    const formDangKy = document.createElement("div");
    formDangKy.setAttribute("id", "formDangKy");
    document.body.appendChild(formDangKy);
    formDangKy.innerHTML = `
            <div class="form-background" title="form-background">
                <div class="form-container" title="registerContainer">
                    <div class="form-header" title="form-header">
                        <div style="height: 0; width: 70%;"> 
                            <button type="button" class="close">X</button>
                        </div>
                        <img src="./assets/images/icons/auth/reg-icon.svg">
                        <h1> Tạo tài khoản mới </h1>
                        <p>Đăng ký để bắt đầu mua sắm</p>
                    </div>
                    <form class="form" name="regform" autocomplete="on"> 
                        <fieldset>
                            <legend>Họ và tên <span style="color: red">*</span> </legend>
                            <input id="hoVaTenDangKy" required type="text" name="hoVaTen" placeholder="Nguyễn Văn A">
                        </fieldset>
                        <fieldset>
                            <legend>Email <span style="color: red">*</span></legend>
                            <input class="email" required type="email"  name="email" placeholder="example@email.com">
                        </fieldset>
                        <fieldset>
                            <legend>Mật khẩu <span style="color: red">*</span></legend>
                            <input class="matKhau" required type="password" name="password"  placeholder="Ít nhất 8 ký tự">
                            <div style="height: 1em; display: flex; align-items: center; gap: 0.3em">
                                <img src="./assets/images/icons/auth/check.svg">
                                <p name="minLength" style="height: fit-content">Ít nhất 8 ký tự</p>
                            </div>
                            <div style="height: 1em; display: flex; align-items: center; gap: 0.3em">
                                <img src="./assets/images/icons/auth/check.svg">
                                <p name="passwordPattern">Bao gồm chữ hoa và chữ thường</p>
                            </div>
                        </fieldset>
                        <fieldset>
                            <legend>Xác nhận mật khẩu <span style="color: red">*</span></legend>
                            <input class="matKhau" required type="password" name="passwordConfirm" placeholder="Nhập lại mật khẩu">
                        </fieldset>
                        <fieldset style="margin-top: 0; margin-bottom: 3%;">
                            <label style="display: flex; align-items: center; gap: 0.3rem; font-size: small;">
                                <input type="checkbox" required id="agreement">
                                Tôi đồng ý với <a href="" style="color: #16A34A">Điều khoản dịch vụ</a> và <a href="" style="color: #16A34A">Chính sách bảo mật</a>
                            </label>
                        </fieldset>
                        <button type="submit" class="submitButton" name="submit" style="background-color: #16A34A;" value="Đăng ký">Đăng ký</button>
                    </form>
                    <div class="footer" title="footer" style="text-align: center; margin-bottom: 7%; margin-top: 3%;">
                        Đã có tài khoản? <a href ="" style="color: #16A34A; font-weight: bold;"> Đăng nhập ngay </a>
                    </div>
                </div>
            </div>
            `;
    formDangKy.style.display="none";

    const formDangNhap = document.createElement("div");
    formDangNhap.setAttribute("id", "formDangNhap");
    document.body.appendChild(formDangNhap);
    formDangNhap.innerHTML = `
            <div class="form-background" title="form-background">
                <div class="form-container" title="loginContainer">
                    <div class="form-header" title="form-header">
                        <div style="height: 0; width: 100%;"> 
                            <button type="button" class="close">X</button>
                        </div>
                        <img src="./assets/images/icons/auth/log-icon.svg">
                        <h1>Chào mừng trở lại</h1>
                        <p>Đăng nhập để tiếp tục mua sắm</p>
                    </div>
                    <form class="form" name="form" autocomplete="on" style="width: 100%;"> 
                        <fieldset>
                            <legend>Email <span style="color: red">*</span></legend>
                            <input class="email" required type="text" name="email" placeholder="Nhập email hoặc tên đăng nhập">
                        </fieldset>
                        <fieldset>
                            <legend>Mật khẩu <span style="color: red">*</span></legend>
                            <input class="matKhau" required type="password" name="password"  placeholder="Nhập mật khẩu">
                        </fieldset>
                        <fieldset style="margin-top: 3%;margin-bottom: 5%;">
                                <label style="display: flex; align-items: center; gap: 0.3em; font-size: small; width: fit-content; float: left;">
                                    <input type="checkbox" id="rememberMe">
                                    Nhớ đăng nhập
                                </label>
                                <a href="" style="float:right; color: #2563EB; font-size: small">Quên mật khẩu?</a>
                        </fieldset>
                        <button type="submit" class="submitButton" name="submitBtn" value="Đăng ký" style="background-color: #2563EB;">Đăng nhập</button>
                    </form>
                    <div class="footer" title="footer" style="display: flex; flex-direction: column; align-items: center;">
                        <p style="width:fit-content;">Chưa có tài khoản? <a href ="" style="color: #2563EB; font-weight:bold;"> Đăng kí ngay </a></p>
                        <hr style="border: solid 0.1px #E5E7EB; margin: 0; margin-left: 10%; margin-right: 10%; align-self: normal;">
                        <p style="font-size:small; text-align: center; margin: 3% 15% ;">Bằng việc đăng nhập, bạn đồng ý với <a href="" style="color: #2563EB">Điều khoản sử dụng</a> và <a href="" style="color: #2563EB">Chính sách bảo mật</a>
                    </div>
                </div>
            </div>
    `
    formDangNhap.style.display="none"
}

function drawFormDangKy() {
    console.log("Draw form dang ky");
    formDangKy.style.display="";
}

function drawFormDangNhap() {
    console.log("Draw form dang nhap")
    formDangNhap.style.display="";
}

const formBackground=document.getElementsByClassName("form-background");
const closeButton = document.getElementsByClassName("close");
window.onclick = function (event) {
    if (event.target == formBackground[0] || event.target == closeButton[0])
        formDangKy.style.display="none";
    else if (event.target == formBackground[1] || event.target == closeButton[1])
        formDangNhap.style.display="none";
}