import { getTimeline } from "./index";
import { prismaMock } from "../../../singleton";
import dayjs from "dayjs";

describe("timeline", () => {
  it("get by valid teamId", async () => {
    const now = new Date();
    const raw = [
      {
        id: 1,
        teamId: "team_1",
        text: "@user_2 @user_3 天才",
        channelId: "",
        userId: "user_1",
        sentimentId: 1,
        createdAt: now,
        updatedAt: now,
      },
    ];

    const mockUserFindUnique = {
      userId: "user_1",
      teamId: "team_1",
      icon: "icon_mock",
      name: "user_1",
      createdAt: dayjs().unix(),
      updatedAt: dayjs().unix(),
    };

    const mockUsersFindMany = [
      {
        userId: "user_2",
        teamId: "team_1",
        icon: "icon_mock",
        name: "user_2",
        createdAt: dayjs().unix(),
        updatedAt: dayjs().unix(),
      },
      {
        userId: "user_3",
        teamId: "team_1",
        icon: "icon_mock",
        name: "user_3",
        createdAt: dayjs().unix(),
        updatedAt: dayjs().unix(),
      },
    ];
    prismaMock.praise.findMany.mockResolvedValue(raw);
    prismaMock.userProfile.findUnique.mockResolvedValue(mockUserFindUnique);
    prismaMock.userProfile.findMany.mockResolvedValue(mockUsersFindMany);

    const expectRes = [
      {
        teamId: "team_1",
        text: "@user_2 @user_3 天才",
        createdAt: now,
        fromUser: mockUserFindUnique,
        toUsers: mockUsersFindMany,
      },
    ];
    const res = await getTimeline("team_1");
    expect(res["timeline"]).toEqual(expectRes);
  });
});
