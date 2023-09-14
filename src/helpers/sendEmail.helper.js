const nodemailer = require("nodemailer");
const env = require("dotenv");
env.config();

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const emailSender = async (user, isForgotPasswordEmail) => {
  try {
    if (isForgotPasswordEmail) {
      const mailOptions = {
        to: user.email,
        from: "Shopit <noreply." + process.env.GMAIL_EMAIL + ">",
        subject: "Shopit - Password Reset",
        text:
          "You are receiving this because you (or someone else)  have requested the reset of the password for your user account on shopit.\n\n" +
          "Please copy the following password reset code, to complete the process:\n\n" +
          "Password reset code: " +
          " " +
          user.resetPasswordToken +
          "\n\n" +
          "If you did not create this, please ignore this email.\n",
      };
      const info = await transporter.sendMail(mailOptions);
      console.log(" Forgot password email sent", info.response);
    } else {
      const mailOptions = {
        to: user.email,
        from: "Shopit <noreply." + process.env.GMAIL_EMAIL + ">",
        subject: "Password Successfully Changed",
        text:
          `Hello ${user.username},\n\n` +
          "This is a confirmation that the password for your user account " +
          user.email +
          " has just been changed.\n",
      };
      const info = await transporter.sendMail(mailOptions);
      console.log("Changed passoword email sent", info.response);
    }
  } catch (err) {
    console.log("Error sending email", err);
  }
};

module.exports = emailSender;
