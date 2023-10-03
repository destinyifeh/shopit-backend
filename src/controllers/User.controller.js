const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const env = require("dotenv");
const User = require("../models/User.model");
const generateToken = require("../helpers/generate-token.helper");
const emailSender = require("../helpers/sendEmail.helper");
env.config();

exports.registerUser = async (req, res) => {
  const { username, email, password, password2 } = req.body;
  try {
    let existingUser = await User.findOne({
      $or: [
        { username: username.toLowerCase().trim() },
        { email: email.toLowerCase().trim() },
      ],
    });
    if (existingUser) {
      return res.status(400).send("username or email already exist");
    } else if (password.trim() !== password2.trim()) {
      return res.status(401).json({ message: "Password is incorrect" });
    }
    const securePassword = await bcrypt.hash(password.trim(), 10);
    let newUser = new User();
    newUser.username = username.toLowerCase().trim();
    newUser.email = email.toLowerCase().trim();
    newUser.password = securePassword;
    username.toLowerCase().trim() === process.env.isAdmin
      ? (newUser.isAdmin = true)
      : (newUser.isAdmin = false);
    await newUser.save();
    const token = jwt.sign({ userId: newUser._id }, process.env.PRIVATE_KEY, {
      expiresIn: "10m",
    });
    res.status(200).json({ user: newUser, token: token });
    return true;
  } catch (err) {
    console.log(err.mesage);
  }
};

exports.loginUser = async (req, res) => {
  const { user, password } = req.body;
  try {
    let existingUser = await User.findOne({
      $or: [
        { username: user.toLowerCase().trim() },
        { email: user.toLowerCase().trim() },
      ],
    });
    if (!existingUser) {
      return res.json({ message: "user does not exist", code: 401 });
    }
    const isMatch = await bcrypt.compare(
      password.trim(),
      existingUser.password
    );
    console.log(isMatch, "real");
    if (!isMatch) {
      return res.json({ message: "Invalid password", code: 401 });
    }

    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.PRIVATE_KEY,
      {
        expiresIn: "10m",
      }
    );
    return res.status(200).json({ user: existingUser, token: token });
  } catch (err) {
    console.log(err);
  }
};

exports.getUser = async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).send("User not found");
    }
    return res.status(200).send(user);
  } catch (err) {
    console.log(err.message);
  }
};

exports.getUsers = async (req, res) => {
  try {
    let users = await User.find({});
    if (!users) {
      return res.status(404).send("Users not found");
    }
    return res.status(200).send(users);
  } catch (err) {
    console.log(err.message);
  }
};

exports.UpdateUser = async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).send("User not found");
    }
    user.email = req.body.email;
    await user.save();
    return res.status(200).send(user);
  } catch (err) {
    console.log(err.message);
    return res.json({ code: 500, error: err });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).send("Email does not exist");
    }
    let isForgotPassWordEmail = true;
    let token = Math.random().toString().substring(2, 8);
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; //1 hour
    await emailSender(user, isForgotPassWordEmail);
    await user.save();
    return res
      .status(200)
      .json({ message: "email sent successfully", user: user });
  } catch (err) {
    console.log(err.message);
  }
};

exports.verifyToken = async (req, res) => {
  const { token } = req.body;
  try {
    let user = await User.findOne({
      _id: req.params.id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (user) {
      let resetPasswordToken = token;
      console.log(resetPasswordToken);
      return res
        .status(200)
        .json({ message: "Token is valid", user: user, code: 200 });
    } else {
      console.log("Password reset token is invalid or has expired");
      return res.json({
        message: "Password reset token is invalid or has expired",
        code: 401,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ code: 500, message: "Server error" + error });
  }
};

exports.newPassword = async (req, res) => {
  try {
    console.log(req.body);
    console.log("query", req.id);
    let user = await User.findOne({
      _id: req.params.id,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (user) {
      let securePassword = await bcrypt.hash(req.body.password, 10);

      user.password = securePassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      await emailSender(user);
      const token = jwt.sign({ userId: user._id }, process.env.PRIVATE_KEY, {
        expiresIn: "10m",
      });
      res.status(200).json({
        user: user,
        token: token,
        code: 200,
        message: "Password changed ",
      });
    }
  } catch (err) {
    console.log(err, "new pass err");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    let user = await User.findOneAndDelete({ _id: req.params.id });
    if (!user) {
      return res.status(404).send("No user found");
    }
    console.log("delted....");
    return res.status(200).send("User deleted");
  } catch (err) {
    console.log(err);
  }
};
