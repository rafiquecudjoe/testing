import {
  summarizeByDay,
  summarizeByWeek,
  summarizeByMonth,
  count,
} from "../../infra/praise"; // TODO: aliasがECSでエラーになったため

export const summarize = async ({
  teamId,
  start,
  end,
  summarizedBy,
}: {
  teamId: string;
  start: string;
  end: string;
  summarizedBy: string;
}): Promise<count[]> => {
  console.log(start, end);
  switch (summarizedBy) {
    case "month":
      return await summarizeByMonth({ teamId, start, end });
    case "week":
      return await summarizeByWeek({ teamId, start, end });
    case "day":
    default:
      return await summarizeByDay({ teamId, start, end });
  }
};
