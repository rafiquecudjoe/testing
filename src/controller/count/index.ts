import { RequestHandler } from "../route";
import { summarize } from "../../usecase/count";
import dayjs from "dayjs";
type Period = "day" | "week" | "month";
const isPeriod = (summarizedBy: string): summarizedBy is Period => {
  return (
    summarizedBy === "week" ||
    summarizedBy === "month" ||
    summarizedBy === "day"
  );
};

type CountResponse = {
  praise: {
    at: string;
    sum: number;
  }[];
  summarizedBy: Period;
};

export const count: RequestHandler<CountResponse> = async (req, res) => {
  //
  console.log("count api", req.query);
  // TODO: tokenのチェック
  const { teamId } = req["user"];
  // クエリの存在確認
  if (!("query" in req || !req.query)) {
    res
      .status(400)
      .send(
        "Missing required request parameters: [start], [count], [summarizedBy]"
      );
    return;
  }
  const { start, count, summarizedBy } = req.query;
  if (!(start && count && summarizedBy)) {
    res.status(400).send("Missing required request parameters: [start], [end]");
    return;
  }
  // startの確認
  if (typeof start !== "string") {
    res.status(400).send("Missing required request parameters: [start], [end]");
    return;
  }

  // count
  if (typeof count !== "string") {
    res.status(400).send("Missing required request parameters: [start], [end]");
    return;
  }
  const numCount = parseInt(count);

  if (!isPeriod(summarizedBy as string)) {
    res
      .status(400)
      .send(`Parameter summarizedBy must be 'day' 'week', 'month''`);
    return;
  }

  const counts = await summarize({
    teamId,
    start: dayjs(start).format("YYYY-MM-DD"),
    end: dayjs(start)
      .add(numCount - 1, summarizedBy as string)
      .format("YYYY-MM-DD"),
    summarizedBy: summarizedBy as string,
  });

  res.send({ praise: counts, summarizedBy: summarizedBy as Period });
  return;
};
