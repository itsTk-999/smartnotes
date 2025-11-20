// FILE: server/utils/sendEmail.js

const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create the transporter (Connect to Brevo)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, 
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    // --- CRITICAL FIX FOR CERTIFICATE ERROR ---
    tls: {
      rejectUnauthorized: false // This bypasses the self-signed certificate check
    }
    // ------------------------------------------
  });

  // 2. Define the email options
  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  await transporter.sendMail(message);
};

module.exports = sendEmail;