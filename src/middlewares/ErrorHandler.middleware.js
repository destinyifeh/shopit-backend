function ErrorHandler(req, res, err, next) {
  const errStatus = err.statusCode || 500;
  const errMessage = err.message || "Oops! Something went wrong";

  if (res.status) {
    res.status(errStatus).json({
      success: false,
      status: errStatus,
      message: errMessage,
      stack: process.env.NODE_ENV === "development" ? err.stack : {},
    });
  } else {
    next(err);
  }
}

module.exports = ErrorHandler;
