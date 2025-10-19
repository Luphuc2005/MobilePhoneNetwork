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
const sliderContainer = document.querySelector('slider-container');
//addEventListener(kiểu nghe, người nghe , option)
sliderContainer.addEventListener('mouseenter',() => {
    clearInterval(autoSlideInterval);
});
// bỏ chuột ra quay lại mặt định 
sliderContainer.addEventListener('moveleave',()=>{
    autoSlideInterval = setInterval(autoSlide,3600);
})

// ================Product==============