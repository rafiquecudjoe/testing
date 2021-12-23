import prisma from "../../../prisma";
import dayjs from "dayjs";

export const phases = [
  { index: 1, threshold: 100 },
  { index: 2, threshold: 200 },
  { index: 3, threshold: 500 },
  { index: 4, threshold: 1000 },
];
export class Terraforming {
  async countAtCurrentStage(teamId: string): Promise<{
    count: number;
    complete: number;
    currentPhase: number;
  }> {
    const progress = await prisma.level_up_progress.findFirst({
      where: {
        teamId,
      },
      orderBy: [
        {
          startAt: "desc",
        },
      ],
    });
    if (progress) {
      const praiseCount = await prisma.praise.count({
        where: {
          teamId,
          createdAt: {
            gte: dayjs.unix(Number(progress.endAt)).toDate(),
          },
        },
      });
      return {
        count: praiseCount,
        complete: phases[progress.stage].threshold,
        currentPhase: progress.stage + 1,
      };
    }

    // レベル1のとき
    const praiseCount = await prisma.praise.count({
      where: {
        teamId,
      },
    });

    return {
      count: praiseCount,
      complete: phases[0].threshold,
      currentPhase: 1,
    };
  }
}
