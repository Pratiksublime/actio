// emailHelper.js
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const client = new twilio('AC7a5bfc85fa41d7a8d54419f3c1ea9aad', '7b79b0ea6e41aac36e7e21077f86e162');


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


const sendSMS = async (data) => {
  try {
    //const client = require('twilio')(accountSid, authToken);
    client.messages
      .create({
        body: data.message,
        from: '+14097109182',
        to: data.mobileNumber
      })
      .then(message => console.log('message.sid---'));
  }
  catch (err) {
    console.log(err);
  }
}

module.exports = { sendEmail, sendSMS };
