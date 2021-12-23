import { prismaMock } from "../../../singleton";
import { getNotification, readNotification } from "./index";

describe("notification", () => {
  it("get un-read notification", async () => {
    const raw = [
      {
        id: 1,
        teamId: "team_1",
        type: null,
        body: "hello",
        createdAt: 1600992812,
      },
    ];
    prismaMock.notifications.findMany.mockResolvedValue(raw);

    const result = await getNotification("team_1", "user_1");
    expect(result).toEqual(raw);
  });

  it("mark as read", async () => {
    const rawNoti = {
      id: 3,
      teamId: "team_1",
      type: null,
      body: "hello",
      createdAt: 1600992812,
    };
    prismaMock.notifications.findUnique.mockResolvedValue(rawNoti);
    const rawRead = {
      id: 2,
      notificationId: 3,
      userId: "dev",
      readAt: 1600992812,
    };
    prismaMock.reads.create.mockResolvedValue(rawRead);

    const result = await readNotification(
      rawRead.notificationId,
      rawNoti.teamId,
      rawRead.userId
    );
    expect(result).toEqual(rawRead);
  });
});
