import { teamProfile } from "@prisma/client";
import prismaClient from "../../../prisma";

export const findById = async (teamId: string): Promise<teamProfile | null> => {
  try {
    const teamProfile = await prismaClient.teamProfile.findUnique({
      where: {
        teamId,
      },
    });
    return teamProfile;
  } catch (e) {
    console.log("Repository Error: " + e);
    throw e;
  }
};

export const save = async (input: {
  teamId: string;
  name: string;
  icon?: string;
}): Promise<teamProfile> => {
  try {
    const teamProfile = await prismaClient.teamProfile.upsert({
      where: {
        teamId: input.teamId,
      },
      create: {
        teamId: input.teamId,
        name: input.name,
        icon: input.icon,
      },
      update: {
        name: input.name,
        icon: input.icon,
      },
    });
    return teamProfile;
  } catch (e) {
    console.log("Repository Error: " + e);
    throw e;
  }
};
