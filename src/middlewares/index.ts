import jwt from "jsonwebtoken";
// import {Authentication} from "../service/authentication";

const jwtPrivateKey = process.env.JWT_PRIVATE_KEY || "";

export const AccessUser = async (req, res, next) => {
  const token = req.headers?.authorization?.replace("Bearer ", "");
  if (!token || !token.length) {
    res.status(401).send("Missing required access token");
    return;
  }

  try {
    const payload = jwt.verify(token, jwtPrivateKey);
    req.user = payload;
    next();
  } catch (e) {
    console.log(e);
    res.status(403).send("invalid token");
    return;
  }
};
