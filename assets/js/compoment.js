// Slider functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.slider-dot');
let autoSlideInterval;
//hiển thị sile 
function showSlide(n){
    //xóa active
    slides.forEach(slides => slides.classList.remove('active'));
    dots.forEach(dots => dots.classList.remove('active'));
    //không cho vượt qua tổng sile
    currentSlide = (n + slides.length) % slides.length;
    //cho hiển thị (active)
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}
//thây đổi theo hướng
function changeSlide(direction){
    showSlide(currentSlide+direction);
    resetAutoSilde();
}
//auto tiến lên 1 
function autoSlide(){
    changeSlide(1);
}
//nút set Sile
function setSlide(n){
    showSlide(n);
    resetAutoSilde();
}
// tạo vé giữ đồ 
autoSlideInterval = setInterval(autoSlide);
function resetAutoSilde(){
    // trả lại vé 
    clearInterval(autoSlideInterval);
    // lấy vé mới
    autoSlideInterval =setInterval(autoSlide,3600);
}
// không cần ALL vì chỉ có 1 
const sliderContainer = document.querySelector('.slider-container');
//addEventListener(kiểu nghe, người nghe , option)
sliderContainer.addEventListener('mouseenter',() => {
    clearInterval(autoSlideInterval);
});
// bỏ chuột ra quay lại mặt định 
sliderContainer.addEventListener('moveleave',()=>{
    autoSlideInterval = setInterval(autoSlide,3600);
})

// Dropdown menu cho tài khoản khi trỏ chuột vào ô Tài khoản
const account = document.querySelector('.acount-icon');
const usernameHeader = account.querySelector("span");
let dropdownMenu = document.createElement("div");
dropdownMenu.setAttribute("class", "dropdown-menu")
dropdownMenu.style.visibility="hidden";
drawDropdownMenu();
function drawDropdownMenu() 
{                     
    if (sessionStorage.getItem("login-status") != null)
    {
        dropdownMenu.innerHTML = `
                    <ul>
                        <li><button id="profile">Thông tin cá nhân</button></li>
                        <li><button>Đổi mật khẩu</button></li>
                        <li><button id="sign-out">Đăng xuất</button></li>
                    </ul>`;
        let list = dropdownMenu.querySelector("ul");
        let listItems = dropdownMenu.querySelectorAll("li");
        let authLink = dropdownMenu.querySelector("a");
        listItems.forEach((li) => {
            li.style.width="fit-content";
        });
        list.style.flexDirection="column";
        list.style.alignItems="flex-end";
        dropdownMenu.style.minWidth="fit-content";
        dropdownMenu.style.width="150%";
        account.appendChild(dropdownMenu);
        usernameHeader.textContent = "Nguyễn Văn A";

        //Thông tin cá nhân
        const profile = document.getElementById("profile");
        if (profile != null)
        { 
            profile.addEventListener("click", (event) => {
                location.href="auth.html";
            })
        }
        //Đăng xuất
        const signout = document.getElementById("sign-out");
        if (signout != null)
        {
            signout.addEventListener("click", (event) => {
            console.log("sign out");
            sessionStorage.removeItem("login-status");
            console.log(sessionStorage.getItem("login-status"));
            drawDropdownMenu();
            });
        }
    }
    else
    {
        console.log("get in");
        dropdownMenu.innerHTML=`
                        <ul>
                            <li><button id="sign-in">Đăng nhập</button></li>
                            <li><button id="sign-up">Đăng ký</button></li>
                        </ul>
                        `;
        account.appendChild(dropdownMenu);
        usernameHeader.textContent = "Tài khoản";

        //Đăng nhập
        const signin = document.getElementById("sign-in");
        if (signin != null)
        {
            signin.addEventListener("click", (event) => {
                console.log("sign in");
                sessionStorage.setItem("login-status", "true"); 
                drawFormDangNhap();
                drawDropdownMenu();
            });
        }

        //Đăng ký
        const signup = document.getElementById("sign-up");
        if (signup != null)
        {
            signup.addEventListener("click", (event) => {
                console.log("sign up");
                // sessionStorage.setItem("login-status", "true"); 
                drawFormDangKy();
                drawDropdownMenu();
            });
        }
    }
}

account.addEventListener("mouseover", (event) => {
    dropdownMenu.style.visibility="visible";
});

account.addEventListener("mouseout", (event) => {
    dropdownMenu.style.visibility="hidden";
});
// ================Product==============