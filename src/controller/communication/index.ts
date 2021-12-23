import { RequestHandler } from "../route";
import { getCommunications, link, node } from "../../usecase/communications";

type communication = {
  nodes: node[];
  links: link[];
};
export const getCommunication: RequestHandler<communication> = async (
  req,
  res
) => {
  try {
    const { teamId } = req["user"];
    const query = req.query;
    if (!query?.fromAt) {
      return res
        .status(400)
        .send("Missing required request parameters: [fromAt]");
    }

    const result = await getCommunications(teamId, Number(query.fromAt));
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).send("ng");
  }
};
