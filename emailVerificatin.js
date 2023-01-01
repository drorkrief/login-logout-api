const nodemailer = require("nodemailer");

// let transporter = nodemailer.createTransport({
//   service: "Outlook365",
//   host: "smtp.office365.com",
//   port: "587",
//   tls: {
//     ciphers: "SSLv3",
//     rejectUnauthorized: false,
//   },
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.EMAIL_PASS,
//   },
// });

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
exports.newfunction = async function (reciver, hash) {
  const htmlContent = `<h2>Here is a reset token.</h2><div>click here: <a href="http://localhost:3000/verification?code=${hash}">link</a><p>name: ${reciver.name}, email: ${reciver.email}</p></div>`;
  const options = {
    from: process.env.EMAIL,
    to: reciver.email,
    subject: "Reset password",
    html: htmlContent,
  };
  transporter.sendMail(options, (error, info) => {
    if (error) console.log(error);
    else console.log("email status : ", info.accepted);
  });
};
