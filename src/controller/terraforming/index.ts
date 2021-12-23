import { RequestHandler } from "../route";
import { Terraforming } from "../../usecase/terraforming";

type TerraformingResponse = {
  count: number;
  complete: number;
  currentPhase: number;
};

export const terraforming: RequestHandler<TerraformingResponse> = async (
  req,
  res
) => {
  try {
    const terraform = new Terraforming();
    const result = await terraform.countAtCurrentStage(req["user"].teamId);
    res.status(200).json(result);
    return;
  } catch (e) {
    res.status(400).json(e);
  }
};
