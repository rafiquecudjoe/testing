import prismaClient from "../../../prisma";
import dayjs from "dayjs";

export const getNotification = (teamId: string, userId: string) => {
  return prismaClient.notifications.findMany({
    where: {
      teamId,
      reads: {
        every: {
          NOT: { userId },
        },
      },
    },
  });
};

export const readNotification = async (
  notificationId: number,
  teamId: string,
  userId: string
) => {
  const notification = await prismaClient.notifications.findUnique({
    where: {
      id: notificationId,
    },
  });

  if (!notification) throw `Can't find notification`;

  const read = await prismaClient.reads.findFirst({
    where: {
      id: notificationId,
    },
  });
  if (read) return read;

  return prismaClient.reads.create({
    data: {
      notificationId,
      userId,
      readAt: dayjs().unix(),
    },
  });
};
