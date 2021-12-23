import prismaClient from "../../../prisma";
import dayjs from "dayjs";
import { uniqBy } from "lodash";

export type node = {
  id: string;
  teamId: string;
  name: string;
  img: string;
  linkCount?: number;
};

export type link = {
  source: string;
  target: string;
  count: number;
};

export const getCommunications = async (
  teamId: string,
  fromAt: number = dayjs().subtract(1, "month").unix()
) => {
  const rawResult = await prismaClient.communications.groupBy({
    by: ["sourceId", "targetId"],
    where: {
      teamId,
      createdAt: {
        gte: fromAt,
      },
    },
    _count: true,
  });

  const users = await prismaClient.communications.findMany({
    where: {
      teamId,
    },
    select: {
      user: true,
      target: true,
    },
  });

  if (!users || !users.length)
    return {
      nodes: [],
      links: [],
    };

  let nodes: node[] = [];

  users.map((item) => {
    nodes.push({
      id: item.user.userId,
      teamId: item.user.teamId,
      name: item.user.name,
      img: item.user.icon || "",
    });
    nodes.push({
      id: item.target.userId,
      teamId: item.target.teamId,
      name: item.target.name,
      img: item.target.icon || "",
    });
  });

  const links: link[] = rawResult.map((item) => {
    return {
      source: item.sourceId,
      target: item.targetId,
      count: item._count,
    };
  });

  nodes = uniqBy(nodes, "id").map((item) => ({
    ...item,
    linkCount: links.find((link) => link.source === item.id)?.count,
  }));

  return {
    nodes,
    links,
  };
};
