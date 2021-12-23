import prismaClient from "../../../client";
import { RequestHandler } from "../route";

// DB接続を確認する
export const healthCheck: RequestHandler<string> = async (req, res) => {
  try {
    const result = prismaClient.slackToken.count();
    console.log(result + " test ok");
    res.status(200).send("ok");
  } catch (e) {
    console.log(e);
    res.status(500).send("ng");
  }
};
