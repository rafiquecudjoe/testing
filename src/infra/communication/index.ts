import prisma from "../../../prisma";
import { Prisma } from ".prisma/client";
import client from "../../../prisma";

export const saveCommunications = async (
  payload: Prisma.communicationsCreateManyInput[]
) => {
  const res = await client.communications.createMany({
    data: payload,
  });
  console.log(res);
  return res;
};
