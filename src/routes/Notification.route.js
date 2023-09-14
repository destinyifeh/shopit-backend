const express = require("express");
const router = express.Router();
const controller = require("../controllers/Notificiation.controller");
router.post("/add-notification", controller.addNotification);
router.get("/notifications", controller.getNotifications);
router.get("/single-notification", controller.getNotification);
router.delete("/notification/:id", controller.deleteNotification);
router.put("/notification/:id", controller.updateNotification);

module.exports = router;
