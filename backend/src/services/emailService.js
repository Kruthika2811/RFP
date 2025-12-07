// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: parseInt(process.env.SMTP_PORT || "587"),
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS
//   }
// });

// async function sendRFPEmail({ to, subject, text, html }) {
//   const from = process.env.FROM_EMAIL || process.env.SMTP_USER;
//   const info = await transporter.sendMail({
//     from,
//     to,
//     subject,
//     text,
//     html
//   });
//   return info;
// }

// module.exports = {
//   sendRFPEmail
// };


const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: true,  // Gmail requires secure SSL
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Send RFP email to vendors
async function sendRFPEmail({ to, subject, text, html }) {
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html
    });

    console.log("Email sent:", info.messageId);
    return info;

  } catch (err) {
    console.error("Email sending failed:", err);
    throw err;
  }
}

module.exports = {
  sendRFPEmail
};
