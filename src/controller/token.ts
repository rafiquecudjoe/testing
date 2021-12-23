import jwt from "jsonwebtoken";
export const getUserFromAuthHeader = (auth: string) => {
  const token = auth.replace("Bearer ", "");

  const jwtPrivateKey = process.env.JWT_PRIVATE_KEY || "";
  const user = jwt.verify(token, jwtPrivateKey);
  return user as { userId: string; teamId: string };
};
