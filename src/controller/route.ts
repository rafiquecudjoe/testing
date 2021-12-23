import { receiver } from "../app";
// import * as OpenApiValidator from "express-openapi-validator";
import cors from "cors";
// import path from "path";
import * as dotenv from "dotenv";
import { count } from "./count";
import { terraforming } from "./terraforming";
import { AccessUser } from "../middlewares";
import { timeline } from "./timeline";
import { getCommunication } from "./communication";
import { getNotifications, markAsRead } from "./notifications";
import { me } from "./me";
import { Request, Response, json } from "express";
// import { refreshToken, logout } from "./authentication";
import { login } from "./login";
import { healthCheck } from "./healthCheck";
import { callback } from "./callback";
import { analysis } from "./analysis";
dotenv.config();

// Middlewareの設定
const whiteList = [
  "https://www.teamplanet.net",
  "https://app.teamplanet.net",
  "https://teamplanet.net",
  "https://www.teamplanet.jp",
  "https://app.teamplanet.jp",
  "https://teamplanet.jp",
  "http://localhost:3000",
  "https://dev.app.teamplanet.net",
]; // TODO: 本番環境での設定
receiver.router.use(
  cors({
    origin: whiteList,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// receiver.router.use(
//   OpenApiValidator.middleware({
//     apiSpec: path.resolve(__dirname, "../../api.yml"),
//   })
// );
// receiver.router.use((err, req, res, next) => {
//   // format error
//   console.log(req.query, err);
//   res.status(err.status || 500).json({
//     message: err.message,
//     errors: err.errors,
//   });
// });
receiver.router.use(json());

// それ以外の Web リクエストの処理は receiver.router のメソッドで定義

receiver.router.get("/analysis", AccessUser, analysis);
receiver.router.get("/count", AccessUser, count);
receiver.router.get("/terraforming", AccessUser, terraforming);
receiver.router.get("/timeline", AccessUser, timeline);
receiver.router.get("/notifications", AccessUser, getNotifications);
receiver.router.post("/notifications/:id/mark-as-read", AccessUser, markAsRead);
receiver.router.get("/me", AccessUser, me);
receiver.router.get("/healthCheck", healthCheck);
receiver.router.get("/communication", AccessUser, getCommunication);
// Authentication
receiver.router.get("/login", login);
receiver.router.get("/slack/callback", callback);
// receiver.router.get("/refreshToken", refreshToken);
// receiver.router.post("/logout", logout);

type ErrorResponse = string;

export type RequestHandler<T> = (
  req: Request,
  res: Response<T | ErrorResponse>
) => void;
