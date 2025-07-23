const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    service:"Gmail",
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

const LoginNotification = async(toEmail, userName, loginTime) =>{
    const mailOptions = {
        from: `"Mijory" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: "Mijory Login Alert",
            html: `
            <div style="font-family: Arial; padding: 20px;">
                <h2 style="color: #e91e63;">Hi ${userName},</h2>
                <p>A login attempt was just made to your Mijory account.</p>
                <p><strong>Time:</strong> ${loginTime}</p>
                <p>If this was you, you can ignore this message.</p>
                <p>If not, we recommend changing your password immediately.</p>
                <br>
                <p style="font-size: 14px; color: #888;">-Team Mijory</p>
            </div>
            `,
    }

    await transporter.sendMail(mailOptions);
}

module.exports = LoginNotification

