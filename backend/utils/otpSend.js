const nodemailer = require('nodemailer');
require('dotenv').config();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendOtp(email, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'OTP verification - Signup to MIJORY - Bouquets for your loved ones',
    html: `<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0;">
  <head>
    <meta charset="UTF-8" />
    <title>Mijory OTP</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #fff0f5;
        margin: 0;
        padding: 0;
        color: #333;
      }
      .container {
        max-width: 500px;
        margin: 40px auto;
        background-color: #ffffff;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        border: 2px solid #f8d1df;
      }
      .header {
        text-align: center;
        font-size: 28px;
        color: #e91e63;
        font-weight: bold;
        margin-bottom: 20px;
      }
      .otp-box {
        font-size: 24px;
        text-align: center;
        background-color: #fce4ec;
        padding: 15px;
        border-radius: 8px;
        font-weight: bold;
        letter-spacing: 2px;
        color: #c2185b;
      }
      .message {
        font-size: 16px;
        text-align: center;
        margin: 25px 0;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #999;
        margin-top: 30px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">Mijory Verification</div>
      <div class="message">
        Your One-Time Password (OTP) is:
      </div>
      <div class="otp-box">${otp}</div>
      <div class="message">
        Please enter this code on the website to verify your identity. This OTP is valid for 5 minutes.
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Mijory. All rights reserved.
      </div>
    </div>
  </body>
</html>
`
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendOtp;
