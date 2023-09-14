const mongoose = require("mongoose");
const env = require("dotenv");
env.config();
mongoose.Promise = global.Promise;

exports.DBConfiguration = () => {
  mongoose
    .connect(process.env.MONGOOSE_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => console.log("DB connected"))
    .catch((err) => console.log(err.message, "DB error"));
};
