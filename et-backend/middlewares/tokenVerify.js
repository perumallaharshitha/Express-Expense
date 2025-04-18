const jwt = require("jsonwebtoken");

const tokenVerify = (req, res, next) => {
  const bearerToken = req.headers.authorization;

  if (!bearerToken) {
    return res.status(401).send({ message: "Unauthorized access" });
  }

  const token = bearerToken.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send({ message: "Token expired or invalid. Please relogin." });
  }
};

module.exports = tokenVerify;
