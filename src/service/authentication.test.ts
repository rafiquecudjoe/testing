import { Installation } from "@slack/bolt";
import jwt from "jsonwebtoken";
import { Authentication } from "./authentication";
const jwtPrivateKey = process.env.JWT_PRIVATE_KEY || "";

describe("Add token", () => {
  const authentication = new Authentication();
  it("JWTトークンを生成する", async () => {
    const installation: Installation<"v2", false> = {
      user: {
        id: "testuser",
        token: undefined,
        scopes: undefined,
      },
      bot: {
        id: "botId",
        userId: "botUserId",
        token: "acc_xxx",
        scopes: ["scope"],
        expiresAt: 12345,
        refreshToken: "rf_xxx",
      },
      appId: "app_987s6789",
      team: {
        id: "team_id",
        name: "team name",
      },
      isEnterpriseInstall: false,
      enterprise: undefined,
      tokenType: "bot",
    };
    const token = await authentication.login(installation);
    const payload = jwt.verify(token, jwtPrivateKey);
    expect(payload).toEqual({
      teamId: "team_id",
      userId: "testuser",
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
  });

  it.todo("既存トークンを更新する");
});
