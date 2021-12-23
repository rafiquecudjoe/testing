import {
  messageEvent,
  handleCommunication,
  getTargetFromText,
  getTargetFromThread,
} from "./index";
import * as Communication from "../../infra/communication";
import { prismaMock } from "../../../singleton";
import dayjs from "dayjs";
import { analyzeSentiment } from "../../infra/sentiment";
import * as slackBolt from "../../service/slackBot";

describe("messageEvent", () => {
  describe("invalid cases", () => {
    it("when not text praise", async () => {
      const mockPayload = {
        client_msg_id: "97b5942a-c3a6-4223-b6f2-xxxxx",
        type: "message",
        text: "hello world",
        user: "U025TU0_xxx",
        ts: "1632735702.000000",
        team: "team_idddd",
        blocks: [{ type: "rich_text", block_id: "s24", elements: [Array] }],
        channel: "channel_xxxx",
        event_ts: "1632735702.000000",
        channel_type: "channel",
      };
      await expect(messageEvent(mockPayload, "token")).rejects.toThrow(
        "do nothing"
      );
    });
  });

  describe("valid case", () => {
    const saveCommunicationsMock = jest.spyOn(
      Communication,
      "saveCommunications"
    );
    const getThreadMock = jest.spyOn(slackBolt, "getThread").mockReturnValue(
      Promise.resolve([
        {
          reply_users: ["U025TU0_xxx", "U025TU1_xxx"],
        },
      ])
    );

    const mockPayload = {
      client_msg_id: "97b5942a-c3a6-4223-b6f2-xxxxx",
      type: "message",
      text: "good job",
      user: "U025TU0_xxx",
      ts: "1632735702.000000",
      team: "team_1234",
      blocks: [{ type: "rich_text", block_id: "s24", elements: [Array] }],
      channel: "channel_xxxx",
      event_ts: "1632735702.000000",
      channel_type: "channel",
    };
    let sentiment;
    beforeEach(async () => {
      sentiment = await analyzeSentiment(mockPayload.text);
      prismaMock.sentiment.create.mockResolvedValue({
        id: 1,
        text: mockPayload.text,
        magnitude: Number(sentiment?.magnitude),
        score: Number(sentiment?.score),
      });
      prismaMock.praise.create.mockResolvedValue({
        id: 1,
        teamId: mockPayload.team,
        channelId: mockPayload.channel,
        userId: mockPayload.user,
        text: "text",
        sentimentId: 1,
        createdAt: dayjs().subtract(6, "days").toDate(),
        updatedAt: dayjs().toDate(),
      });
      prismaMock.level_up_progress.findFirst.mockResolvedValue({
        id: 1,
        teamId: mockPayload.team,
        stage: 0,
        activeMembers: 1,
        endAt: dayjs().unix(),
        startAt: dayjs().subtract(1, "week").unix(),
        updatedAt: dayjs().unix(),
        createdAt: dayjs().unix(),
      });
      prismaMock.praise.findMany.mockResolvedValue([
        {
          id: 1,
          teamId: mockPayload.team,
          channelId: mockPayload.channel,
          userId: mockPayload.user,
          text: "text",
          sentimentId: 1,
          createdAt: dayjs().subtract(6, "days").toDate(),
          updatedAt: dayjs().toDate(),
        },
      ]);
      prismaMock.level_up_progress.create.mockResolvedValue({
        id: 2,
        teamId: mockPayload.team,
        stage: 1,
        activeMembers: 1,
        endAt: dayjs().unix(),
        startAt: dayjs().unix(),
        updatedAt: dayjs().unix(),
        createdAt: dayjs().unix(),
      });
      prismaMock.notifications.create.mockResolvedValue({
        id: 1,
        teamId: mockPayload.team,
        type: "levelup",
        body: "",
        createdAt: dayjs().unix(),
      });
    });
    it("text praise and levelUp", async () => {
      await expect(messageEvent(mockPayload, "token")).resolves.toBeTruthy();
    });

    it("post with a mentioned user", async () => {
      const mockData = {
        ...mockPayload,
        text: "<@U025TU1_xxx> good job",
      };
      prismaMock.communications.createMany.mockResolvedValue({
        count: 1,
      });
      await expect(messageEvent(mockData, "token")).resolves.toBeTruthy();
      expect(saveCommunicationsMock).toHaveBeenCalled();
    });

    it("post with multiple users mentioned", async () => {
      const mockData = {
        ...mockPayload,
        text: "<@U025TU1_xxx> <@U025TU2_xxx> good job",
      };
      prismaMock.communications.createMany.mockResolvedValue({
        count: 2,
      });
      await expect(messageEvent(mockData, "token")).resolves.toBeTruthy();
      expect(saveCommunicationsMock).toHaveBeenCalled();
    });

    it("save communication in thread", async () => {
      const mockData = {
        ...mockPayload,
        user: "U025TU1_xxx",
        text: "good job",
        thread_ts: "1633944428.006400",
        parent_user_id: "U025TU0_xxx",
      };
      prismaMock.communications.createMany.mockResolvedValue({
        count: 2,
      });
      await expect(messageEvent(mockData, "token")).resolves.toBeTruthy();
      expect(getThreadMock).toHaveBeenCalled();
      expect(saveCommunicationsMock).toHaveBeenCalled();
    });
  });
});
describe("communicationの保存", () => {
  it("communicationではないつぶやき", async () => {
    // when
    const testInput = {
      token: "token",
      user: "user",
      text: "text",
      team: "teamId",
      channel: "channel",
      thread_ts: undefined,
    };
    await expect(handleCommunication(testInput)).rejects.toThrow(
      "no communication"
    );
  });
  it("threadではないメンションのとき", async () => {
    const saveCommunicationsMock = jest.spyOn(
      Communication,
      "saveCommunications"
    );
    // when
    const target = "TARGET";
    const testInput = {
      token: "token",
      user: "user",
      text: `<@${target}> text`,
      team: "teamId",
      channel: "channel",
      thread_ts: undefined,
    };
    const res = await handleCommunication(testInput);
    expect(saveCommunicationsMock).toHaveBeenCalledWith([
      {
        createdAt: expect.anything(),
        sourceId: "user",
        targetId: target,
        teamId: "teamId",
      },
    ]);
    // expect(res).toBe(1);
  });
  it.todo("threadのとき");
});

describe("getTargetFromText", () => {
  it("senderと同じIDは除く", () => {
    expect(getTargetFromText("<@USER1> <@USER2> <@USER3>", "USER1")).toEqual([
      "USER2",
      "USER3",
    ]);
  });
});

describe("getTargetFromThread", () => {
  it("空なら空", () => {
    expect(getTargetFromThread([], "USER1")).toEqual([]);
  });
  it("自分以外のreplyUsersを取得", () => {
    expect(
      getTargetFromThread(
        [
          {
            reply_users: ["USER1", "USER2", "USER3"],
          },
        ],
        "USER1"
      )
    ).toEqual(["USER2", "USER3"]);
  });
  it("親スレッドの投稿者", () => {
    expect(
      getTargetFromThread(
        [
          {
            user: "USER2",
          },
        ],
        "USER1"
      )
    ).toEqual(["USER2"]);
  });
  it("各投稿のmention", () => {
    expect(
      getTargetFromThread(
        [
          {
            text: "<@USER2> aa",
          },
          { text: "<@USER3>" },
        ],
        "USER1"
      )
    ).toEqual(["USER2", "USER3"]);
  });
});
