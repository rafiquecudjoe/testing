import { RequestHandler } from "../route";
import { installer } from "../../installProvider";

// 必要なパラメータを持ってslackのoauth/authorizeへリダイレクトするエンドポイント
export const login: RequestHandler<void> = async (req, res) => {
  const hostname = req.headers.host;
  // console.log(req.headers);
  const front = req.headers.referer || "http://localhost:3000/"; // MEMO: refererは末尾スラッシュついている
  const url = await installer.generateInstallUrl({
    scopes: [
      "channels:history", // channelのメッセージを読む。eventも
      "chat:write", // 書き込み
      // "groups:history",
      // "im:history",
      // "mpim:history",
      "channels:join",
      "channels:read",
      "groups:read",
      "mpim:read",
      "im:read",
      "users.profile:read",
      "users:read", // profileにいる
      "team:read", // teamにいる
    ],
    redirectUri: `https://${hostname}/slack/callback?front=${front}callback`,
  });
  res.redirect(url);
};
