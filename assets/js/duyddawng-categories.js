//lắng nghe sự kiện , DOMContentLoaded(tải xog trình duyệt )
//khởi động trang
document.addEventListener("DOMContentLoaded", () => {
  const saveSection = sessionStorage.getItem("currentAdminSection");
  //== null
  if (!saveSection) navigateTo("dashboard");
  else {
    navigateTo(saveSection);
  }
});
function navigateTo(sectionId, event) {
  if (event) {
    //ngăn chặn a tải lại trang
    event.preventDefault();
  }
  //tất cả set giá trị điều là chuỗi
  sessionStorage.setItem("currentAdminSection", sectionId);
  const sections = document.querySelectorAll(".section-content");
  //duyệt vòng for
  sections.forEach((el) => {
    el.style.display = "none";
  });
  //nội dung được chọn
  const activeSection = document.getElementById(sectionId + "-content");
  if (activeSection) {
    activeSection.style.display = "block";

    // Khởi tạo module pricing khi vào trang
    if (sectionId === "pricing" && typeof initializePricing === "function") {
      console.log("💰 Initializing pricing module from navigateTo...");
      setTimeout(() => {
        initializePricing();
      }, 100);
    }
  } else {
    //thây đổi phần tử ở other-content
    const otherSection = document.getElementById("other-content");
    const sectionTitle = document.getElementById("section-title");
    const sectionDesc = document.getElementById("section-desc");
    // lấy tên của trang
    let linkText = sectionId;
    const linkElement = document.querySelector(
      `.sidebar-menu-item[href="#${sectionId}"] span`
    );

    if (linkElement) {
      linkText = linkElement.textContent;
    }
    if (sectionTitle) sectionTitle.textContent = linkText;
    if (sectionDesc)
      sectionDesc.textContent = `Nội dung cho phần "${linkText}" sẽ được phát triển `;
    if (otherSection) otherSection.style.display = "block";
  }
  const menuItems = document.querySelectorAll(".sidebar-menu-item");
  menuItems.forEach((item) => {
    item.classList.remove("active");
  });
  //có sử kiện xẩy ra
  if (event) {
    event.currentTarget.classList.add("active");
  } else {
    //không có sự kiện xảy ra -> tìm trang hiện tại hiển thị nav
    const defaultActiveItem = document.querySelector(
      `.sidebar-menu-item[href="#${sectionId}"]`
    );
    if (defaultActiveItem) {
      defaultActiveItem.classList.add("active");
    }
  }
}
