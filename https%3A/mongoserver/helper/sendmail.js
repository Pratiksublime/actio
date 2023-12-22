// emailHelper.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    port: 465,
  auth: {
    user: 'contactus@actiosport.com',
    pass: 'ntmwwnxsqaygxfzl',
  },
});

function sendEmail(to, subject, text) {
  const mailOptions = {
    from: 'contactus@actiosport.com',
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email: ', error);
    } else {
      console.log('Email sent: ', info.response);
    }
  });
}

module.exports = { sendEmail };
