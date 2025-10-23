const jwt = require("jsonwebtoken");
require('dotenv').config();

const jwtAuthMiddleware = (req, res, next) => {
  // first check if the authorization header is present
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "token not found" });

  //extract the jwt token from the request headers
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "unauthorized" });

  try {
    //verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach the decoded user info to the request object
    next(); // proceed to the next middleware or route handler
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

//function to generate a jwt token for a user
const generateToken = (userData) => {
  return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "1h" });
};

module.exports = { jwtAuthMiddleware, generateToken };
