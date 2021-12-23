import { Installation } from "@slack/bolt";
import { installer } from "../../installProvider";
import { RequestHandler } from "../route";
import { Authentication } from "../../service/authentication";
import { boltApp as app } from "../../app";
import { save as saveUserProfile } from "../../infra/userProfile";
import { save as saveTeamProfile } from "../../infra/teamProfile";

// redirect_uriを受け取るエンドポイント
export const callback: RequestHandler<AuthResponse> = async (req, res) => {
  console.log("callback");
  // console.log(req.query);
  const front = req.query.front;
  await installer.handleCallback(req, res, {
    // jwtの作成, DBへの保存 usecase
    success: async (installation, options, req, res) => {
      console.log("success start");
      console.log(installation);

      const userRes = await app.client.users.info({
        token: installation?.bot?.token || "",
        user: installation.user.id,
      });
      // TODO: これ別なのでどこかに動かす
      const teamRes = await app.client.team.info({
        token: installation?.bot?.token || "",
        team: installation.team?.id,
      });

      await Promise.all([
        saveUserProfile({
          teamId: userRes?.user?.team_id || "",
          userId: userRes?.user?.id || "",
          name: userRes?.user?.name || "",
          icon: userRes?.user?.profile?.image_original,
        }),
        saveTeamProfile({
          teamId: teamRes?.team?.id || "",
          name: teamRes?.team?.name || "",
          icon: JSON.stringify(teamRes?.team?.icon),
        }),
      ]);

      // console.log(identification);
      console.log(options);
      const authService = new Authentication();
      const token = await authService.login(installation as Installation<"v2">);
      console.log(token);
      const redirectUrl = `${front}?token=${token}`;
      res.writeHead(302, { Location: redirectUrl });
      res.end();
      console.log("redirect to " + redirectUrl);
    },
    failure: (error, options, req, res) => {
      console.log("failure");
      console.error(error);
      res.end("error");
    },
  });
};
