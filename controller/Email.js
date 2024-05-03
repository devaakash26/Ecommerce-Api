const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const sendEmail = asyncHandler(async (data,req, res) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.EMAIL,
            pass: process.env.MP,
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Hey 👻" <abc@gmail.com>',
        to: data.to,
        subject: data.subject,
        text: data.text,
        html: data.html,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Previous URL: %s", nodemailer.getTestMessageUrl(info));
});

module.exports = sendEmail;
