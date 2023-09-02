import {users, messages} from "./chat.js"




const outerButton = document.querySelector(".outer-button");
const innerButton = document.querySelector(".inner-button");
let clicked = false;

function toggleActive() {
  clicked = !clicked;
  outerButton.classList.toggle("active", clicked);
  innerButton.classList.toggle("active", clicked);
}

outerButton.addEventListener("click", toggleActive);


const signupButton = document.querySelector(".signup-button");
signupButton.addEventListener("click", signUp);

const signupSection = document.querySelector(".signup-section");
const otpDetails = document.querySelector(".otp-details");
const signupContainer = document.querySelector('.signup-container');
const otpSection = document.querySelector(".otp-section")

let id = 0
function signUp(event) {
  event.preventDefault();
  console.log("email clicked");
  const email = document.forms["signup"]["email"].value;

  if (email.trim() == "") {
    alert("Email cannot be empty");
    return;
  }

  fetch("http://127.0.0.1:3000/signup", {
    method: "POST",
    body: JSON.stringify({ email }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      console.log({ response });
      return response.json();
    })
    .then((data) => {

      if(data.status == 201){
        signupSection.classList.remove("active");
        otpDetails.classList.add("active");
        otpSection.classList.add("active");
        signupContainer.classList.add("active");
        document.querySelector(".email-text").innerText = `A code has been sent to ${email}`


        document.forms["otp"]["email"].value = email;
        document.forms["otp"]["rememberMe"].value = clicked;

      }
      console.log({ data });
    })
    .catch((error) => {
      console.log({ error });
    });


}



// function verifyOtpInput(){
//     console.log('in input')
//     const firstDigit = document.querySelector("#firstDigit");
//     const secondDigit = document.querySelector('#secondDigit').innerText;
//     const thridDigit = document.querySelector("#thridDigit").innerText;
//     const fourthDigit = document.querySelector("#fourthDigit").innerText;

//     console.log(firstDigit)

//     if(
//         typeof(firstDigit) != 'number'  ||
//         typeof(secondDigit) != 'number' ||
//         typeof(thridDigit) != 'number'  ||
//         typeof(fourthDigit) != 'number'
//     ){
//         alert('Otp can only be a number')
//     }

//     if(
//         typeof(firstDigit) != ''  ||
//         typeof(secondDigit) != '' ||
//         typeof(thridDigit) != ''  ||
//         typeof(fourthDigit) != ''
//     ){

//         const otp = firstDigit + secondDigit + thridDigit + fourthDigit;
//         verifyOtp(otp)
//     }
// }

// function verifyOtp(otp){
//     fetch('http://127.0.0.1:3000/verifyOtp', {
//         method: "POST",
//         body: JSON.stringify({otp}),
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         })
//         .then(response => {
//             console.log({response})
//             return response.json();
//         })
//         .then(data => {
//             console.log({data});
//         })
//         .catch(error => {
//             console.log({error});
//         })
// }

// verifyOtpInput()

// Get references to all input fields
const firstDigitInput = document.querySelector("#firstDigit");
const secondDigitInput = document.querySelector("#secondDigit");
const thirdDigitInput = document.querySelector("#thirdDigit");
const fourthDigitInput = document.querySelector("#fourthDigit");

console.log("firstDigitInput", firstDigitInput);
// Listen for input changes on each input field
// firstDigitInput.addEventListener("input", verifyOtpInput);
// firstDigitInput.addEventListener("keydown", blockInput);

// secondDigitInput.addEventListener("input", verifyOtpInput);
// secondDigitInput.addEventListener("keydown", blockInput);

// thirdDigitInput.addEventListener("input", verifyOtpInput);
// thirdDigitInput.addEventListener("keydown", blockInput);

// fourthDigitInput.addEventListener("input", verifyOtpInput);
// fourthDigitInput.addEventListener("keydown", blockInput);

const digitInputs = document.querySelectorAll(".digit-input");
let otp = "";
digitInputs.forEach((input, index) => {
  input.addEventListener("input", (event) => {
    otp += input.value;
    if (index < digitInputs.length - 1) {
      digitInputs[index + 1].focus();
    } else {
      verifyOtp(otp);
    }
  });

  input.addEventListener("keydown", (event) => {
    if (input.value.length >= 1) {
      event.preventDefault();
    }
    if(event.key == "Backspace"){
        input.value = '';
    }
  });


});

const resendLink = document.getElementById('resend-link');

resendLink.addEventListener('click', (event) => {
  event.preventDefault(); // Prevent the default link behavior (navigating to a new page)
  const email = document.forms["otp"]["email"].value;

  fetch('http://127.0.0.1:3000/resendOtp', {
      method: "POST",
      body: JSON.stringify({ 
        email, 
      }),
      headers: {
          'Content-Type': 'application/json'
      }
  })
  .then(response => response.json())
  .then(data => {

    if(data.status == 200){
      document.querySelector(".email-text").innerText = `A code has been resent to ${email}`
    }
      console.log(data);
  })
  .catch(error => {
      console.log(error);
  });
});


firstDigitInput.addEventListener('keydown', removeInput);


function removeInput(event){

    console.log('key', event.key)
    if(event.key == "Backspace"){
        firstDigitInput.value = '';
    }

}

function verifyOtpInput() {
  const firstDigit = firstDigitInput.value;
  const secondDigit = secondDigitInput.value;
  const thirdDigit = thirdDigitInput.value;
  const fourthDigit = fourthDigitInput.value;

  // console.log("firstDigit", firstDigit);
  // console.log("secondDigit", secondDigit);

  //     // If all input fields have values, proceed to verify the OTP
  if (firstDigit && secondDigit && thirdDigit && fourthDigit) {
    const otp = firstDigit + secondDigit + thirdDigit + fourthDigit;
    verifyOtp(otp);
  }
}



function verifyOtp(otp) {
  console.log("otp here", otp);
  const email = document.forms["otp"]["email"].value;
  const rememberMe = document.forms["otp"]["rememberMe"].value;

  fetch('http://127.0.0.1:3000/verifyOtp', {
      method: "POST",
      body: JSON.stringify({ 
        otp, 
        email, 
        rememberMe
      }),
      headers: {
          'Content-Type': 'application/json'
      }
  })
  .then(response => response.json())
  .then(data => {

    if(data.status == 200){
      window.location.href("chat.html")
    }
      console.log(data);
  })
  .catch(error => {
      console.log(error);
  });
}

// function blockInput(event){
//     inputValue = event.target.value;
//     if(inputValue.length >= 1){
//         event.preventDefault();
//     }

// }
