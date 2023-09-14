const express = require("express");
const router = express.Router();
const controller = require("../controllers/User.controller");
const { authenticateUser } = require("../middlewares/auth");
router.post("/register-user", controller.registerUser);
router.post("/login-user", controller.loginUser);
router.post("/single-user/:id", authenticateUser, controller.getUser);
router.post("/user/forgot-pass", controller.forgotPassword);
router.post("/user-token/:id", controller.verifyToken);
router.patch("/user/reset-password/:id", controller.newPassword);
router.get("/users", controller.getUsers);
router.patch("/user/:id", controller.UpdateUser);
router.delete("/user/:id", controller.deleteUser);

module.exports = router;
