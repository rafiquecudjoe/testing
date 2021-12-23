import { userProfile } from ".prisma/client";
import prismaClient from "../../../prisma";

export const findByIds = async (input: {
  teamId: string;
  userId: string;
}): Promise<userProfile | null> => {
  try {
    const userProfile = await prismaClient.userProfile.findUnique({
      where: {
        userId_teamId: {
          userId: input.userId,
          teamId: input.teamId,
        },
      },
    });
    return userProfile;
  } catch (e) {
    console.log("Repository Error: " + e);
    throw e;
  }
};

export const save = async (input: {
  teamId: string;
  userId: string;
  name: string;
  icon?: string;
}): Promise<userProfile> => {
  try {
    const userProfile = await prismaClient.userProfile.upsert({
      where: {
        userId_teamId: {
          teamId: input.teamId,
          userId: input.userId,
        },
      },
      create: {
        teamId: input.teamId,
        userId: input.userId,
        name: input.name,
        icon: input.icon,
      },
      update: {
        name: input.name,
        icon: input.icon,
      },
    });
    return userProfile;
  } catch (e) {
    console.log("Repository Error: " + e);
    throw e;
  }
};
