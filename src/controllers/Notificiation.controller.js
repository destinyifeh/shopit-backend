const Notification = require("../models/Notification.model");
exports.addNotification = async (req, res, next) => {
  try {
    const postDocument = {
      message: req.body.message,
    };
    let data = await Notification.create(postDocument);
    res.send(data);
  } catch (err) {
    console.log("Add-notification error:" + err);
    res.send(err);
  }
};

exports.getNotifications = async (req, res) => {
  try {
    let notifications = await Notification.find({}).sort({ createdAt: -1 });
    res.status(200).send(notifications);
  } catch (err) {
    console.log(err.message, "get notifications error");

    res.status(500).send(err);
  }
};

exports.getNotification = async (req, res) => {
  try {
    let notification = await Notification.findOne({ _id: req.params.id });
    if (notification) {
      res.status(200).send(notification);
    } else {
      return res.status(404).send("notification not found");
    }
  } catch (err) {
    console.log(err.message, "get notification error");

    res.status(500).send(err);
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    let notification = await Notification.findOneAndDelete({
      _id: req.params.id,
    });
    if (notification) {
      res.status(200).json({
        message: "notification deleted",
        notificationId: notification._id,
      });
    } else {
      res.status(404).json({ message: "notification not found" });
    }
  } catch (err) {
    //console.log(err.message, "delete error");
    res.status(500).json({ err: err });
  }
};

exports.updateNotification = async (req, res) => {
  try {
    let notification = await Notification.findOne({ _id: req.params.id });
    console.log(notification, "found");
    if (notification) {
      notification.message = req.body.message;
      notification.isRead = true;
      notification.readBy = req.body.readBy;

      await notification.save();
      res.status(200).send(notification);
    } else {
      return res.status(404).send("notification not found");
    }
  } catch (err) {
    console.log(err.message);
    res.send(err);
  }
};
