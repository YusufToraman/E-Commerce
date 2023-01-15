const nodemailer = require("nodemailer");

const sendEmail = async(mailOptions) => {

    let transporter = nodemailer.createTransport({

        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
 
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        
        tls: {
            ciphers:'SSLv3'
        }
    }); 
};

module.exports = sendEmail;