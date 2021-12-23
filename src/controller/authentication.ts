import { RequestHandler } from "./route";
import { Authentication } from "../service/authentication";

export const refreshToken: RequestHandler<AuthResponse> = async (req, res) => {
  try {
    // TODO: moving to auth middleware
    const token = req.headers["authorization"]?.replace("Bearer ", "");
    if (token === undefined) {
      res.status(400).send("No authorization header found");
      return;
    }

    const payload = "";
    // const authService = new Authentication();
    // const payload = await authService.refreshToken(token);

    res.send(payload);
  } catch (e) {
    res.status(404).send(e.message);
  }
};

export const logout: RequestHandler<string> = async (req, res) => {
  try {
    // TODO: moving to auth middleware
    const token = req.headers["authorization"]?.replace("Bearer ", "");
    if (token === undefined) {
      res.status(400).send("No authorization header found");
      return;
    }

    // const authService = new Authentication();
    // await authService.logout(token);

    res.send("SUCCESS");
  } catch (e) {
    res.status(404).send(e.message);
  }
};
