import jwt from "jsonwebtoken";
import { Installation } from "@slack/oauth";

// SlackのOAuth結果を受けて、TeamPlanetのJWTを生成する
export class Authentication {
  jwtPrivateKey: string;

  constructor() {
    this.jwtPrivateKey = process.env.JWT_PRIVATE_KEY || "";
  }

  async login(installation: Installation<"v2">): Promise<string> {
    const token = jwt.sign(
      {
        userId: installation.user.id,
        teamId: installation?.team?.id,
      },
      this.jwtPrivateKey,
      { expiresIn: "30d" }
    );
    console.dir(token);
    return token;
  }

  // async verifyToken(token) {
  //   const payload = jwt.verify(token, this.jwtPrivateKey);
  //   const existedUser = await Prisma.slackToken.findFirst({
  //     where: {
  //       user_id: payload["user_id"],
  //       access_token: payload["access_token"],
  //     },
  //   });
  //   return !!existedUser;
  // }

  // async refreshToken(token) {
  //   const payload = jwt.verify(token, this.jwtPrivateKey);
  //   const slackAuthorize = new SlackAuthorize();
  //   const existedUser = await this.findToken({
  //     user_id: payload["user_id"],
  //     access_token: payload["access_token"],
  //   });
  //   if (!existedUser) throw "User not exist";
  //   const user = await slackAuthorize.refreshToken(
  //     payload["refresh_token"],
  //     existedUser.code
  //   );
  //   await this.updateToken(existedUser.id, {
  //     access_token: user.access_token,
  //     refresh_token: user.refresh_token,
  //     expires_in: user.expires_in,
  //   });
  //   const newToken = jwt.sign(
  //     {
  //       access_token: user.access_token,
  //       refresh_token: user.refresh_token,
  //       user_id: existedUser.user_id,
  //       team_id: existedUser.team_id,
  //     },
  //     this.jwtPrivateKey,
  //     { expiresIn: "12h" }
  //   );
  //   return {
  //     user_id: existedUser.user_id,
  //     token: newToken,
  //   };
  // }

  // logout(token) {
  //   const payload = jwt.verify(token, this.jwtPrivateKey);
  //   return this.removeToken(payload);
  // }
}
