import { slackToken } from "@prisma/client";
import dayjs from "dayjs";
import prismaClient from "../../../prisma";
import { AuthorizeResult } from "@slack/bolt";

export const fetchInstallation: (teamId: string) => AuthorizeResult = async (
  teamId: string
) => {
  // なければundefinedが戻ってくる
  const res = await prismaClient.slackToken.findFirst({
    where: {
      teamId,
    },
    orderBy: {
      expiresAt: "desc", // 最新を使いたい
    },
  });
  console.log(res);
  // TODO botId, botUserIdいる？ちがいわからん
  if (res) {
    return { teamId, botId: res.botId, botToken: res.accessToken };
  }
  console.log("not found token");
  return {
    // errorを返さなくていいのかは不明。
    teamId,
  };
};

export const save = async (data: {
  teamId: string;
  botId: string;
  botUserId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}): Promise<slackToken> => {
  const updateDate = {
    botId: data.botId,
    botUserId: data.botUserId,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    expiresAt: data.expiresAt,
  };
  return prismaClient.slackToken.upsert({
    where: {
      teamId: data.teamId,
    },
    create: {
      ...data,
    },
    update: { ...updateDate },
  });
};
