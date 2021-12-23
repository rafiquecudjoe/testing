import dayjs from "dayjs";
import { getStage, checkLevelUp, processLevelUp } from "./index";
import { prismaMock } from "../../../singleton";

describe("checkLevelUp", () => {
  it("when levelUp", async () => {
    const mockLevelStatus = {
      id: 1234,
      stage: 0,
      activeMembers: 1,
      teamId: "team_xxx",
      startAt: dayjs().unix(),
      endAt: dayjs().unix(),
      createdAt: dayjs().unix(),
      updatedAt: dayjs().unix(),
    };
    prismaMock.level_up_progress.findFirst.mockResolvedValue(mockLevelStatus);
    const praise = [
      {
        id: 1234,
        teamId: "team_xxx",
        channelId: "channel_xxx",
        userId: "user_xxx",
        text: "message",
        sentimentId: 1234,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    prismaMock.praise.findMany.mockResolvedValue(praise);

    const result = await checkLevelUp(new Date());
    expect(result.result).toEqual(true);
  });

  it("when not levelUp", async () => {
    const mockLevelStatus = {
      id: 1234,
      stage: 1,
      activeMembers: 1,
      teamId: "team_xxx",
      startAt: dayjs().unix(),
      endAt: dayjs().unix(),
      createdAt: dayjs().unix(),
      updatedAt: dayjs().unix(),
    };
    prismaMock.level_up_progress.findFirst.mockResolvedValue(mockLevelStatus);
    const praise = [
      {
        id: 1234,
        teamId: "team_xxx",
        channelId: "channel_xxx",
        userId: "user_xxx",
        text: "message",
        sentimentId: 1234,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    prismaMock.praise.findMany.mockResolvedValue(praise);

    const result = await checkLevelUp(new Date());
    expect(result.result).toEqual(false);
  });
});

describe("processlevelupのテスト", () => {
  it("create levelUp, notification", async () => {
    const payload = {
      stage: 1,
      activeMembers: 1,
      teamId: "team_xxx",
      startAt: dayjs().unix(),
      endAt: dayjs().unix(),
    };

    const mockLevelUp = {
      id: 1,
      stage: 0,
      activeMembers: 1,
      teamId: "team_xxx",
      startAt: dayjs().unix(),
      endAt: dayjs().unix(),
      createdAt: dayjs().unix(),
      updatedAt: dayjs().unix(),
    };
    const mockNotification = {
      id: 1,
      teamId: "team_xxx",
      type: "levelup",
      body: null,
      createdAt: dayjs().unix(),
    };
    prismaMock.level_up_progress.create.mockResolvedValue(mockLevelUp);
    prismaMock.notifications.create.mockResolvedValue(mockNotification);
    const result = await processLevelUp(payload);

    expect(result.levelUp).toEqual(mockLevelUp);
    expect(result.notification).toEqual(mockNotification);
  });
});

describe("getStage", () => {
  it("0だとstage1", () => {
    expect(getStage(0)).toBe(1);
  });
  it("101だとstage2", () => {
    expect(getStage(101)).toBe(2);
  });

  it("1001だと0", () => {
    // こうなる前にループするのでありえないはず
    expect(getStage(1001)).toBe(4);
  });
});
