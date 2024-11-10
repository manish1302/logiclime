const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.cookies.logiclimetoken

  if (!token) {
    return res.status(401).json({ error: "Authorization token missing or invalid" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

module.exports = authenticate;
