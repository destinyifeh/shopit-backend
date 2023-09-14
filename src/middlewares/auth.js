const env = require("dotenv");
const jwt = require("jsonwebtoken");
env.config();

exports.authenticateUser = (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers.authorization ||
    req.headers["x-access-token"];
  console.log(token, "ttok");
  if (!token) {
    return res.json({ message: "No token provided", code: 401 });
  }

  try {
    // Verify the token using the secret key stored in the environment variable
    const decodedToken = jwt.verify(token, process.env.PRIVATE_KEY);

    // If the token is valid, the payload will be available in the decodedToken object
    // You can access properties from the payload like decodedToken.userId

    if (decodedToken.userId) {
      // If the token contains userId, the user is authenticated
      // You can now proceed with the next middleware or route handler
      return next();
    } else {
      // If the token is invalid or doesn't contain userId
      return res.json({ message: "invalid token", code: 401 });
    }
  } catch (err) {
    // Handle token verification errors
    console.log(err.message, "jjjjerr");
    return res.json({ message: "token expired", code: 500 });
  }
};
