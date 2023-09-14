const { rateLimit } = require("express-rate-limit");

const apiRequestLimiter = rateLimit({
  // windowMs: 15 * 60 * 1000, // 15 minutes
  windowMs: 1 * 60 * 1000, // 1 minute

  limit: 2, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: "draft-7", // Set `RateLimit` and `RateLimit-Policy` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // store: ... , // Use an external store for more precise rate limiting

  handler: function (req, res /*next*/) {
    return res.json({
      message: "too many requests",
      description:
        "You sent too many requests. Please wait a while then try again",
    });
  },
  keyGenerator: (req, res) => console.log("request from:", req.ip),
});

module.exports = apiRequestLimiter;
