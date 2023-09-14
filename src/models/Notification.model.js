const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  message: String,
  isRead: { type: Boolean, default: false },
  readBy: String,

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("notifications", NotificationSchema);
