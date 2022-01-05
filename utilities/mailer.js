const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.NOTIFICATION_EMAIL,
        pass: process.env.NOTIFICATION_PASS
    },
    tls: {
        ciphers: "SSLv3"
    }
})

function SendMail(to, subject, body) {
    let result = true;

    const mailOptions = {
        from: process.env.NOTIFICATION_EMAIL,
        to: to,
        subject: subject,
        text: body
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Failed to send email!");
            result = false;
        }
    })

    return result;
}

exports.SendMail = SendMail;