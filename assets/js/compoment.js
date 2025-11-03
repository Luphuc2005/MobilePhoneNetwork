// Slider functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.slider-dot');
let autoSlideInterval;

// Hiển thị slide
function showSlide(n) {
    // Xóa active
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Không cho vượt quá tổng slide
    currentSlide = (n + slides.length) % slides.length;
    
    // Cho hiển thị (active)
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

// Thay đổi theo hướng
function changeSlide(direction) {
    showSlide(currentSlide + direction);
    resetAutoSlide();
}

// Auto tiến lên 1
function autoSlide() {
    changeSlide(1);
}

// Nút set Slide
function setSlide(n) {
    showSlide(n);
    resetAutoSlide();
}

// Khởi động auto slide
function startAutoSlide() {
    autoSlideInterval = setInterval(autoSlide, 3600);
}

// Reset auto slide
function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(autoSlide, 3600);
}

// THÊM DẤU CHẤM VÀ KIỂM TRA NULL
const sliderContainer = document.querySelector('.slider-container');


if (sliderContainer) {
    // Dừng auto slide khi hover
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });

    // Tiếp tục auto slide khi rời chuột
    sliderContainer.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(autoSlide, 3600);
    });
    
    // Khởi động auto slide
    startAutoSlide();
} else {
    console.warn('Không tìm thấy .slider-container');
}


// ================Account==============
// Dropdown menu cho tài khoản khi trỏ chuột vào ô Tài khoản
const account = document.querySelector('.acount-icon');
const usernameHeader = account.querySelector("span");
let dropdownMenu = document.createElement("div");
dropdownMenu.setAttribute("class", "dropdown-menu")
dropdownMenu.style.visibility="hidden";
drawDropdownMenu();
function drawDropdownMenu() 
{      
    let currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) || null;
    if (currentUser != null)
    {
        dropdownMenu.innerHTML = `
                    <ul>
                        <li><button id="profile">Thông tin cá nhân</button></li>
                        <li><button id="sign-out">Đăng xuất</button></li>
                    </ul>`;
        let list = dropdownMenu.querySelector("ul");
        let listItems = dropdownMenu.querySelectorAll("li");
        listItems.forEach((li) => {
            li.style.minWidth="fit-content";
            li.style.justifyContent="flex-end"; 
        });
        let buttons = list.querySelectorAll("button");
        buttons.forEach((button) => {
            button.style.textAlign="end";
        })
        list.style.flexDirection="column";
        list.style.alignItems="flex-end";
        list.style.width="fit-content";
        dropdownMenu.style.width="120%";
        dropdownMenu.style.display="flex";
        dropdownMenu.style.justifyContent="center";
        account.appendChild(dropdownMenu);

        let currentUsername = currentUser.name;
        usernameHeader.textContent = currentUsername;

        //Thông tin cá nhân
        const profile = document.getElementById("profile");
        if (profile != null)
        { 
            profile.addEventListener("click", (event) => {
                location.href="auth.html";
            })

            profile.onmouseenter = function ()
            { 
                localStorage.setItem("navigating", true);
            }

            profile.onmouseleave = function ()
            { 
                localStorage.removeItem("navigating");
            }
        }
        //Đăng xuất
        const signout = document.getElementById("sign-out");
        if (signout != null)
        {
            signout.addEventListener("click", (event) => {
            console.log("sign out");
            localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
            localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
            //Đưa dropdown menu về lúc chưa đăng nhập
            listItems.forEach((li) => {
                li.style.minWidth="fit-content";
                li.style.justifyContent="flex-end"; 
            });
            let buttons = list.querySelectorAll("button");
            buttons.forEach((button) => {
                button.style.textAlign="";
            })
            list.style.flexDirection="";
            list.style.alignItems="";
            list.style.width="";
            dropdownMenu.style.width="";
            dropdownMenu.style.display="";
            dropdownMenu.style.justifyContent="";
                drawDropdownMenu();
                });
        }
    }
    else
    {
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
                drawFormDangNhap();
            });
        }

        //Đăng ký
        const signup = document.getElementById("sign-up");
        if (signup != null)
        {
            signup.addEventListener("click", (event) => {
                console.log("sign up");
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