//Điều hướng về index.html nếu chưa đăng nhập
let currentUser =
  JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) || null;
if (currentUser == null) {
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
const changePassword = document.getElementById("changePassword");
const updateInfo = document.getElementById("updateInfo");
const formBackground = document.querySelectorAll(".modal-background");
const closeButton = document.querySelectorAll(".close-form");
const updateForm = document.getElementById("update-form");
const passwordResetForm = document.getElementById("reset-password-form");
const logout = document.getElementById("logout");
const userInfoButton = document.getElementById("user-info-button");

const newName = document.getElementById("new-name");
const newPhone = document.getElementById("new-phone");
const newEmail = document.getElementById("new-email");
const newCity = document.getElementById("new-city");
const newDistrict = document.getElementById("new-district");
const newWard = document.getElementById("new-ward");
const newAddress = document.getElementById("new-address");

const currentPassword = document.getElementById("current-password");
const newPassword = document.getElementById("new-password");
const confirmNewPassword = document.getElementById("confirm-new-password");
const resetPasswordButton = document.getElementById("reset-password-button");
const showPassword = document.querySelectorAll(".showPassword");

insertUserInfo();

userInfoButton.onclick = function (event) {
  document.getElementById("user-info").style.display = "";
  document.getElementById("user-order").style.display = "none";
}

window.addEventListener("storage", (event) => {
  const userList = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS));
  console.log(userList);
  const updatedUser = userList.find((user) => user.id == currentUser.id);
  console.log(updatedUser.name);
  console.log(currentUser.name);

  currentUser = updatedUser;
  insertUserInfo();
});

changePassword.onclick = function (event) {
  formBackground[2].style.display = "block";
  setTimeout(() => {
    passwordResetForm.classList.add("open");
  }, 100);
};

updateInfo.onclick = function (event) {
  formBackground[1].style.display = "block";
  setTimeout(() => {
    updateForm.classList.add("open");
  }, 100);
};

showPassword[0].onclick = function (event) {
  if (password.type == "password") password.type = "text";
  else password.type = "password";
};

showPassword[1].onclick = function (event) {
  if (currentPassword.type == "password") currentPassword.type = "text";
  else currentPassword.type = "password";
};

showPassword[2].onclick = function (event) {
  if (newPassword.type == "password") newPassword.type = "text";
  else newPassword.type = "password";
};

showPassword[3].onclick = function (event) {
  if (confirmNewPassword.type == "password") confirmNewPassword.type = "text";
  else confirmNewPassword.type = "password";
};

closeButton.forEach((button) => {
  button.onclick = function (e) {
    updateForm.classList.remove("open");
    passwordResetForm.classList.remove("open");
    insertFormInfo();
    setTimeout(() => {
      formBackground[1].style.display = "none";
      formBackground[2].style.display = "none";
    }, 1000);
  };
});

formBackground.forEach((background) => {
  background.onclick = function (event) {
    if (event.target == background) {
      updateForm.classList.remove("open");
      passwordResetForm.classList.remove("open");
      insertFormInfo();
      passwordResetForm.reset();
      setTimeout(() => {
        background.style.display = "none";
      }, 1000);
    }
  };
});

newName.onclick = function (event) {
  newName.select();
};

newName.oninput = function (event) {
  newName.setCustomValidity("");
};

newPhone.onclick = function (event) {
  newPhone.select();
};

newPhone.oninput = function (event) {
  newPhone.setCustomValidity("");
};

newEmail.onclick = function (event) {
  newEmail.select();
};

newEmail.oninput = function (event) {
  newEmail.setCustomValidity("");
};

newAddress.oninput = function (event) {
  newAddress.setCustomValidity("");
};

logout.onclick = function (event) {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  location.href = "index.html";
};

currentPassword.onchange = function (event) {
  if (
    currentPassword.value.trim() != "" &&
    newPassword.value.trim() != "" &&
    confirmNewPassword.value.trim() != ""
  )
    resetPasswordButton.disabled = false;
};

newPassword.onchange = function (event) {
  if (
    currentPassword.value.trim() != "" &&
    newPassword.value.trim() != "" &&
    confirmNewPassword.value.trim() != ""
  )
    resetPasswordButton.disabled = false;
};

confirmNewPassword.onchange = function (event) {
  if (
    currentPassword.value.trim() != "" &&
    newPassword.value.trim() != "" &&
    confirmNewPassword.value.trim() != ""
  )
    resetPasswordButton.disabled = false;
};

currentPassword.oninput = function (event) {
  currentPassword.setCustomValidity("");
  if (currentPassword.value != "") showPassword[1].style.visibility = "visible";
  else showPassword[1].style.visibility = "hidden";
};

newPassword.oninput = function (event) {
  newPassword.setCustomValidity("");
  if (newPassword.value != "") showPassword[2].style.visibility = "visible";
  else showPassword[2].style.visibility = "hidden";
};

confirmNewPassword.oninput = function (event) {
  confirmNewPassword.setCustomValidity("");
  if (confirmNewPassword.value != "")
    showPassword[3].style.visibility = "visible";
  else showPassword[3].style.visibility = "hidden";
};

updateForm.onsubmit = function (e) {
  e.preventDefault();
  if (!/^[A-Za-zÀ-Ỵà-ỿĂăÂâÊêÔôƠơƯưĐđ ]+$/.test(newName.value))
    newName.setCustomValidity("Họ tên không hợp lệ");
  if (!/^[0-9]+$/.test(newPhone.value) && newPhone.value != "")
    newPhone.setCustomValidity("Số điện thoại không hợp lệ");
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(newEmail.value))
    newEmail.setCustomValidity("Địa chỉ email không hợp lệ");
  if (newAddress.value != "") {
    if (!/^[0-9A-Za-zÀ-Ỵà-ỿĂăÂâÊêÔôƠơƯưĐđ/, ]+$/.test(newAddress.value))
      newAddress.setCustomValidity("Địa chỉ không hợp lệ");
    else if (
      newCity.value == "default" ||
      newWard.value == "default" ||
      newDistrict == "default"
    ) {
      newAddress.setCustomValidity("Thiếu một trong các trường trên");
    } else newAddress.setCustomValidity("");
  }

  if (!updateForm.checkValidity()) updateForm.reportValidity();
  else {
    let combinedAddress =
      newAddress.value +
      ", " +
      newWard.value +
      ", " +
      newDistrict.value +
      ", " +
      newCity.value;
    if (
      newCity.value == "default" ||
      newWard.value == "default" ||
      newDistrict == "default"
    ) {
      combinedAddress = currentUser.address;
    }
    updateUser(newName.value, newPhone.value, newEmail.value, combinedAddress);
    alert("Cập nhật thành công");
  }
};

updateForm.onreset = function (e) {
  e.preventDefault();
  insertFormInfo();
};

passwordResetForm.onsubmit = function (e) {
  e.preventDefault();
  //Check mật khẩu hiện tại
  if (currentPassword.value != currentUser.password) {
    currentPassword.setCustomValidity(
      "Mật khẩu không trùng với mật khẩu hiện tại"
    );
  }
  //Check mật khẩu mới
  if (
    !/^.{8,}$/.test(newPassword.value) ||
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).+$/.test(newPassword.value)
  ) {
    newPassword.setCustomValidity(
      "Mật khẩu phải chứa ít nhất 8 kí tự, cả chữ hai và chữ thường"
    );
  } else if (newPassword.value == currentPassword.value) {
    newPassword.setCustomValidity(
      "Mật khẩu mới không được trùng với mật khẩu cũ"
    );
  }
  //Check nhập lại mật khẩu
  if (confirmNewPassword.value != newPassword.value) {
    confirmNewPassword.setCustomValidity(
      "Mật khẩu không trùng với mật khẩu mới"
    );
  }

  if (!passwordResetForm.checkValidity()) passwordResetForm.reportValidity();
  else {
    let userList = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS));
    let findUser = userList.find((user) => user.id == currentUser.id);
    let userIndex = userList.indexOf(findUser);
    currentUser.password = confirmNewPassword.value;
    userList[userIndex].password = confirmNewPassword.value;
    localStorage.setItem(
      STORAGE_KEYS.CURRENT_USER,
      JSON.stringify(currentUser)
    );
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(userList));
    formBackground[2].style.display = "none";
    alert("Thay đổi mật khẩu thành công");
    passwordResetForm.reset();
    resetPasswordButton.disabled = true;
    insertUserInfo();
  }
};

function insertUserInfo() {
  userHeader.querySelector("span").textContent = currentUser.name;
  sidebarHeader.textContent = currentUser.name;
  hoTen.textContent = currentUser.name;
  email.textContent = currentUser.email;
  password.value = currentUser.password;
  if (currentUser.phone != "") {
    sdt.textContent = currentUser.phone;
    sdt.style.color = "black";
  } else sdt.textContent = "Chưa lưu số điện thoại";
  const joinDateVal = currentUser.joinDate;
  joinDate.textContent = joinDateVal;
  if (currentUser.address != "") {
    address.textContent = currentUser.address;
    address.style.color = "black";
  } else address.textContent = "Chưa lưu thông tin địa chỉ";
  insertFormInfo();
}

function insertFormInfo() {
  newName.value = currentUser.name;
  newPhone.value = currentUser.phone;
  newEmail.value = currentUser.email;

  newCity.value = "default";
  newDistrict.value = "default";
  newWard.value = "default";
  newAddress.value = "";
}

function updateUser(newName, newPhone, newEmail, newAddress) {
  let newUser = {
    id: currentUser.id,
    name: newName,
    email: newEmail,
    phone: newPhone,
    address: newAddress,
    trangthai: currentUser.trangthai,
    joinDate: currentUser.joinDate,
    orders: currentUser.orders,
    password: currentUser.password,
  };

  let newUserString = JSON.stringify(newUser);
  let currentUserString = JSON.stringify(currentUser);
  if (newUserString != currentUserString) {
    let userList = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS));
    let findUser = userList.find((user) => user.id == currentUser.id);
    let userIndex = userList.indexOf(findUser);
    userList[userIndex] = newUser;
    currentUser = newUser;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(userList));
    insertUserInfo();
    insertFormInfo();
  }
  formBackground[1].style.display = "none";
}
