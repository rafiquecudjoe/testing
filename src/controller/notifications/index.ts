import { getNotification, readNotification } from "../../usecase/notifications";

export const getNotifications = async (req, res) => {
  try {
    const { team_id, user_id } = req["user"];
    const result = await getNotification(team_id, user_id);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json(e);
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { team_id, user_id } = req["user"];
    if (!req.params.id) {
      res
        .status(200)
        .json("Missing required request parameters: [notification_id]");
      return;
    }
    const result = await readNotification(
      Number(req.params.id),
      team_id,
      user_id
    );
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json(e);
  }
};
