let password = document.getElementsByName("password");
let minLength = document.getElementsByName("minLength");
let pattern = document.getElementsByName("passwordPattern");
let submitBtn = document.getElementsByName("submitBtn");

function passwordValid() {
    console.log('func called');
    if (password[0].value.length < 8) {
        minLength[0].style.color="red";
    }
    else {
        minLength[0].style.color="green";
    }

    if (patternValid(password[0]) == false)
    {
        pattern[0].style.color="red";
    }
    else
    {
        pattern[0].style.color="green";
    }
}

function patternValid() {
    let capCount = 0;
    let normCount = 0;
    console.log(password[0].value);
    if (!isNaN(password[0].value))
        return false;
    for (let i = 0; i < password[0].value.length; i++)
    { 
        console.log(password[0].value.charAt(i) +  password[0].value.charAt(i).toUpperCase());
        if (password[0].value.charAt(i) == password[0].value.charAt(i).toUpperCase())
        { 
            capCount++;
        }
        if (password[0].value.charAt(i) == password[0].value.charAt(i).toLowerCase())
        {
            normCount++;
        }
    }
    
    console.log(capCount);
    console.log(normCount);
    if (capCount == 0 || normCount == 0)
    { 
        return false;
    }
    else
        return true;
}