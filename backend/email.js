const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send activation email
const sendActivationEmail = async (email, activationLink) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Activate your account',
    text: `Welcome to the Company Rota Management System. Click the link to activate your account: ${activationLink}`,
  });
};

module.exports = { sendActivationEmail };
