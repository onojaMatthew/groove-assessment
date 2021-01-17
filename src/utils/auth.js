import path from "path"
require("dotenv").config({ path: path.resolve(__dirname + "/../../.env")});

import jwt from "jsonwebtoken";

export const requireAuthentication = (req, res, next) => {
  // const SECRET_KEY = "jsdkdjskdjfk"
  const token = req.header("x-auth-token");
  if (!token) return res.status(403).json({ error: "Access denied. No token provided"});
  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decode;
    next();
  }
  catch(err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}