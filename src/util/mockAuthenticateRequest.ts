import request from "supertest";
import jwt from "jsonwebtoken";
import * as process from "process";

const jwtPrivateKey = process.env?.JWT_PRIVATE_KEY || "";
export default async function (
  request: request.Request
): Promise<request.Request> {
  const userData = {
    userId: "userId",
    teamId: "teamId",
  };
  const token = jwt.sign(
    {
      ...userData,
    },
    jwtPrivateKey,
    { expiresIn: "12h" }
  );
  return request.set("Authorization", token);
}
