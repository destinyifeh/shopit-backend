const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  title: String,
  desc: String,
  price: String,
  image: String,
  imageId: String,
  label: String,
  likedBy: String,
  qty: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("items", ItemSchema);
