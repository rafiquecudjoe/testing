import { Installation } from "@slack/bolt";
import { InstallProvider, InstallationQuery } from "@slack/oauth";
import { fetchInstallation, save } from "./infra/slackToken";
import * as dotenv from "dotenv";

dotenv.config();
console.log(process.env.SLACK_CLIENT_ID, process.env.SLACK_CLIENT_SECRET);
export const installer = new InstallProvider({
  clientId: process.env.SLACK_CLIENT_ID || "",
  clientSecret: process.env.SLACK_CLIENT_SECRET || "",
  stateSecret: "my-state-secret",
  installationStore: {
    fetchInstallation: async (
      query: InstallationQuery<boolean>
    ): Promise<Installation<"v1" | "v2", boolean>> => {
      console.log("query: ", query);
      const result = await fetchInstallation(query.teamId || "");
      console.log("slack token: ", result);
      const installation = {
        ...result,
        team: {
          id: query.teamId || "",
        },
        enterprise: undefined,
        user: {
          id: "",
          token: undefined,
          scopes: undefined,
        },
      };
      console.log("fetchInstallation return: ", installation);

      return installation;
    },
    storeInstallation: async (installation) => {
      console.log("STORE INSTALLATION");
      console.log(installation);
      if (
        installation.team?.id &&
        installation.bot?.token &&
        installation.bot?.refreshToken &&
        installation.bot.id &&
        installation.bot?.userId &&
        installation.bot.expiresAt
      ) {
        await save({
          teamId: installation.team.id,
          accessToken: installation.bot.token,
          refreshToken: installation.bot.refreshToken,
          botId: installation.bot.id,
          botUserId: installation.bot.userId,
          expiresAt: installation.bot.expiresAt,
        });
      }
    },
  },
});
