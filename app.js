const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const ItemRoutes = require("./src/routes/Item.route");
const UserRoutes = require("./src/routes/User.route");
const NotificationRoutes = require("./src/routes/Notification.route");

const ErrorHandler = require("./src/middlewares/ErrorHandler.middleware");
require("./src/configs/db.config").DBConfiguration();
const app = express();

app.use(helmet());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());

app.use("/api", ItemRoutes);
app.use("/api", UserRoutes);
app.use("/api", NotificationRoutes);

//app.use(ErrorHandler);

app.use((err, req, res, next) => {
  console.error(err, "error handling");
  if (res.status && res.status === "500") {
    res.json({ error: "Internal Server Error" });
  }
  console.log(err.message);
  res.json({ message: "Something went wrong", error: err.message });
});

app.set("port", process.env.PORT || 5000);
app.listen(app.get("port"), () =>
  console.log("App is running on port" + "" + " " + app.get("port"))
);
