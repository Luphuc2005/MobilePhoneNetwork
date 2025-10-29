const thumbnails = document.querySelectorAll('.thumbnail');
        
        // 2. Lấy ảnh chính
        const mainImage = document.querySelector('.main-image img');

        // 3. Thêm sự kiện 'click' cho TỪNG ảnh thumbnail
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                // 'this' chính là cái thumbnail vừa được click

                // 3a. Lấy thumbnail đang "active" (đang được chọn)
                const currentActive = document.querySelector('.thumbnail.active');
                
                // 3b. Xóa class 'active' khỏi thumbnail đó
                if (currentActive) {
                    currentActive.classList.remove('active');
                }

                // 3c. Thêm class 'active' cho thumbnail vừa được click
                this.classList.add('active');

                // 3d. Lấy đường dẫn (src) của ảnh BÊN TRONG thumbnail
                const newImageSrc = this.querySelector('img').src;

                // 3e. Cập nhật đường dẫn cho ảnh chính
                mainImage.src = newImageSrc;
            });
        });