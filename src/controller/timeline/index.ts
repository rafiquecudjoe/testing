import { getTimeline } from "../../usecase/timeline";

export const timeline = async (req, res) => {
  try {
    const { page } = req.query;
    const result = await getTimeline(req["user"].teamId, Number(page));
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json(e);
  }
};
