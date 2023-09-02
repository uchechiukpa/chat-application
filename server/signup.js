const http = require("http");
const nodemailer = require("nodemailer");
const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const jwt = require("jsonwebtoken");
const db = require("./database");
require("dotenv").config();

const app = express();
app.use(bodyparser.json());

app.use(cors({ origin: "http://127.0.0.1:5501" }));

let validFor = 60; // OTP validity in seconds
let isValid = false;
let otp = "";
let secretKey = process.env.SECRET_KEY;

app.post("/signup", async (req, res) => {
  console.log(req.body);
  let email = req.body.email;
  if (!email) {
    res.status(400).send({ message: "Email is required" });
    return;
  }

  try {
    const user = await db.getOne(email);
    if (user) {
      res.status(400).send({ message: "user with this email exist" });
      return;
    }

    await db.create(email);
    sendOtptoUserEmail(email, res);

    res.status(201).send({
      status: 201,
      message: "users have been created and otp has been sent to users email",
      data: email,
    });
  } catch (error) {
    console.log("error occurred signing user up", error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

app.post("/verifyOtp", async (req, res) => {
  const userOtp = req.body.otp;
  const email = req.body.email;
  const rememberMe = req.body.rememberMe;
  if (!userOtp) {
    res.status(400).send({ message: "Please provide an OTP" });
    return;
  }

  if (!email) {
    res
      .status(500)
      .send({ message: "users email is needed for authentication" });
    return;
  }

  if (!rememberMe) {
    res
      .status(500)
      .send({ message: "remember me is needed for authentication" });
    return;
  }

  if (!userOtp == otp && !isValid) {
    res.status(400).send({ message: "OTP is not valid, ask for another OTP" });
    return;
  }
  const expiresIn = rememberMe ? "30d" : "1d";
  const token = jwt.sign(
    { data: email },
    secretKey,
    { algorithm: "RS256", expiresIn },
    function (error, token) {
      if (error) {
        console.log(error.message);
        return res.status(500).send({ message: "Internal Server Error" });
      }
      return token;
    }
  );

  res.cookie("jwt", token, { httpOnly: true });
  res.status(200).send({ message: "OTP is valid" });
});

app.post("/resendOtp", async (req, res) => {
  const email = req.body.email;
  if (!email) {
    res
      .status(500)
      .send({ message: "users email is needed for authentication" });
    return;
  }
  try {
    sendOtptoUserEmail(email, res);

    res.status(200).send({
      status: 200,
      message: "users have been created and otp has been sent to users email",
      data: email,
    });
  } catch (error) {
    console.log("error occurred signing user up", error.message);
    res.status(500).send({ message: "Internal Server Error" });
  }

  // jwt.verify(token, 'wrong-secret', function(err, decoded) {
  //   // err
  //   // decoded undefined
  // });
});

function checkUserExist(email) {
  try {
    db.getOne(email);
  } catch (error) {}
}

const server = http.createServer((req, res) => {
  // Set CORS headers to allow requests from any origin
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    res.writeHead(204); // No content needed for OPTIONS response
    res.end();
    return;
  }

  // Handle your POST request here
  // if (req.method === "POST") {
  //   switch (req.url) {
  //     case "/signup":
  //       signUp(req, res);
  //       break;
  //     case "/verifyotp":
  //       verifyOtp(req, res);
  //       break;
  //   }
  // }
});

function signUp(req, res) {
  let payload = "";
  req.on("data", (chunk) => {
    payload += chunk;
  });

  req.on("end", async () => {
    // console.log(JSON.parse(payload));
    const client = await db.get(JSON.parse(payload));
    console.log(client);
    if (client.length) {
      res.writeHead(200, { "Content-Type": "application/json" });
      const response = JSON.stringify({ message: "This email exist" });
      res.end(response);
    }

    db.create(JSON.parse(payload));
    sendOtptoUserEmail();

    otpCountDown();

    res.writeHead(200, { "Content-Type": "application/json" });
    const response = JSON.stringify({ message: "OTP sent to users email" });
    res.end(response);
  });
}

function sendOtptoUserEmail(email) {
  for (let i = 0; i < 4; i++) {
    otp += Math.floor(Math.random() * 10);
  }

  // Replace these with your actual email configuration
  const emailConfig = {
    service: "gmail",
    auth: {
      user: "ukpauchechi1@gmail.com",
      pass: "fueknrjiokiprfsk",
    },
  };

  // Create a nodemailer transporter
  const transporter = nodemailer.createTransport(emailConfig);

  // Email options
  const mailOptions = {
    from: "ukpauchechi1@gmail.com",
    to: `${email}`,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
      res
        .status(500)
        .send({ message: "could not send email to use, please try again" });
    } else {
      console.log("response", info.response);
      otpCountDown();
    }
  });
}

function verifyOtp(req, res) {
  let userOtp = "";
  req.on("data", (chunk) => {
    userOtp += chunk;
    console.log(chunk);
  });

  req.on("end", () => {
    if (userOtp === otp && isValid) {
      res.writeHead(200, { "Content-Type": "application/json" });
      const response = JSON.stringify({ message: "Otp is valid" });
      res.end(response);
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      const response = JSON.stringify({
        message: "Otp is not valid, try again",
      });
      res.end(response);
    }
  });
}

function otpCountDown() {
  const countdownInterval = setInterval(function () {
    isValid = true;

    if (validFor <= 0) {
      console.log("OTP expired");
      isValid = false;
      clearInterval(countdownInterval); // Clear the interval when the countdown reaches 0

      validFor = 60;
      otp = "";
      isValid= false;
    }

    console.log(`Time left: ${validFor} seconds`);
    validFor--;
  }, 1000);
}
app.listen(3000, () => {
  console.log(`server is running on 3000`);
});
