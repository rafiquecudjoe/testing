import { boltApp as app } from "../app";
import { joinBotToChannels, getThread } from "./slackBot";
import { isArray } from "util";

const channelsMock = [
  {
    id: "channel_1",
  },
  {
    id: "channel_2",
  },
  {
    id: "channel_3",
  },
];

jest.spyOn(app.client.conversations, "join").mockImplementation();

describe("bot", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("join bot - available channels", async () => {
    jest.spyOn(app.client.conversations, "list").mockImplementationOnce(() => {
      return Promise.resolve({
        ok: true,
        channels: channelsMock,
      });
    });
    const result = await joinBotToChannels("token", "teamId");
    expect(result.success).toBe(true);
    expect(result.channels).toEqual(channelsMock.map((item) => item.id));
  });

  it("join bot - no channels", async () => {
    jest.spyOn(app.client.conversations, "list").mockImplementationOnce(() => {
      return Promise.resolve({
        ok: true,
        channels: [],
      });
    });
    const result = await joinBotToChannels("token", "teamId");
    expect(result.success).toBe(false);
  });

  it("getThread test", async () => {
    const mockMessages = [
      {
        type: "message",
        user: "U061F7AUR",
        text: "island",
        thread_ts: "1482960137.003543",
        reply_count: 3,
        subscribed: true,
        last_read: "1484678597.521003",
        unread_count: 0,
        ts: "1482960137.003543",
      },
      {
        type: "message",
        user: "U061F7AUR",
        text: "one island",
        thread_ts: "1482960137.003543",
        parent_user_id: "U061F7AUR",
        ts: "1483037603.017503",
      },
      {
        type: "message",
        user: "U061F7AUR",
        text: "two island",
        thread_ts: "1482960137.003543",
        parent_user_id: "U061F7AUR",
        ts: "1483051909.018632",
      },
      {
        type: "message",
        user: "U061F7AUR",
        text: "three for the land",
        thread_ts: "1482960137.003543",
        parent_user_id: "U061F7AUR",
        ts: "1483125339.020269",
      },
    ];

    jest
      .spyOn(app.client.conversations, "replies")
      .mockImplementationOnce(() => {
        return Promise.resolve({
          ok: true,
          messages: mockMessages,
          has_more: false,
        });
      });
    const result = await getThread(
      "token",
      "channelId",
      "1482960137.003543",
      10,
      "",
      []
    );
    expect(isArray(result)).toBe(true);
    expect(result).toEqual(mockMessages);
  });
});
