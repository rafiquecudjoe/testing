import lodash from "lodash";
import prisma from "../../../prisma";
import { level_up_progress, notifications } from "@prisma/client";
import dayjs from "dayjs";

type levelUpPayload = {
  teamId: string;
  stage?: number;
  activeMembers?: number;
  startAt?: number;
  endAt: number;
};
type checkLevelUpResult = {
  result: boolean;
  stage?: number;
  activeMembers?: number;
};

type processLevelUpResult = {
  levelUp: level_up_progress;
  notification: notifications;
};

export const checkLevelUp: (string) => Promise<checkLevelUpResult> = async (
  teamId
) => {
  // levelup条件を取得
  // teamIdの最新を取る
  const levelStatus = await prisma.level_up_progress.findFirst({
    where: {
      teamId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  // 期間内のteamのpraiseを取得
  const startAt = levelStatus?.startAt
    ? new Date(levelStatus.startAt)
    : new Date();
  const praise = await prisma.praise.findMany({
    select: {
      id: true,
    },
    where: {
      createdAt: {
        gt: startAt, // タイムゾーン大丈夫？
      },
    },
  });
  if (
    !praise ||
    !praise.length ||
    getStage(praise.length) <= Number(levelStatus?.stage)
  ) {
    return {
      result: false,
    };
  }
  const activeMembers = lodash.uniqBy(praise, "userId").length;

  return {
    result: true,
    stage: getStage(praise.length),
    activeMembers: activeMembers || 0,
  };
};

export const processLevelUp: (levelUpPayload) => Promise<processLevelUpResult> =
  async (payload) => {
    // levelUpのレコード作成

    const levelCreated = await prisma.level_up_progress.create({
      data: {
        ...payload,
        createdAt: dayjs().unix(),
        updatedAt: dayjs().unix(),
      },
    });

    const notification = await prisma.notifications.create({
      data: {
        teamId: payload.teamId,
        type: "levelup",
        createdAt: dayjs().unix(),
      },
    });
    return {
      levelUp: levelCreated,
      notification,
    };
    // notificationの追加
  };

// 1000こえたら？
export const getStage = (input: number): number => {
  if (input > 1000) return 4;
  const stageThreshold = [100, 200, 500, 1000];
  return 1 + stageThreshold.findIndex((item) => input < item);
};
