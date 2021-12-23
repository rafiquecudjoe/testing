import Prisma from "../../../prisma";
import { getMessageFromText, getUserIdList } from "../../util/getUserIdList";

export const getTimeline = async (teamId, paging = 1) => {
  const offset = 5;
  const raw = await Prisma.praise.findMany({
    where: { teamId },
    select: {
      teamId: true,
      userId: true,
      text: true,
      createdAt: true,
    },
    skip: paging * offset,
    take: offset,
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });
  if (!raw) return [];
  const result = await Promise.all(
    raw.map(async (item) => {
      const fromUser = await Prisma.userProfile.findUnique({
        where: {
          userId_teamId: {
            userId: item.userId,
            teamId: item.teamId,
          },
        },
        select: {
          icon: true,
          name: true,
        },
      });
      const userIds = getUserIdList(item.text || "");
      console.log({ userIds });
      const users = await Prisma.userProfile.findMany({
        where: {
          userId: {
            in: userIds,
          },
        },
        select: {
          icon: true,
          name: true,
        },
      });
      return {
        teamId: item.teamId,
        fromUser: fromUser,
        text: getMessageFromText(item.text),
        createdAt: item.createdAt,
        toUsers: users,
      };
    })
  );
  return {
    timeline: result,
    hasMore: raw.length === offset,
  };
};
