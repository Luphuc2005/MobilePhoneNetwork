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

// ================Product==============