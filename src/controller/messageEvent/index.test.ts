import { messageEventController } from "./index";
describe("message eventのテスト", () => {
  describe("正常系のeventの処理ができる", () => {
    it("褒め言葉のケース", async () => {
      jest.fn();
      const action = messageEventController({
        event: {
          client_msg_id: "0b8f85be-46d1-4453-83a8-271bfc3b59d0",
          type: "message",
          text: "すばらしいです！",
          user: "U025MHVA4TC",
          ts: "1633484729.000500",
          team: "T0256S1JFLP",
          blocks: [{ type: "rich_text", block_id: "N+wk", elements: [Array] }],
          channel: "C025MPV3143",
          event_ts: "1633484729.000500",
          channel_type: "channel",
        },
        client: {},
      });
      await expect(action).resolves.not.toThrow();
    });
    it.todo("褒め言葉ではないとき");
  });

  describe("when MessageEventUserCaseError happens", () => {
    const consoleWarnMock = jest.spyOn(console, "warn").mockImplementation();

    it("when post a message not praise", async () => {
      jest.fn();
      const action = messageEventController({
        event: {
          client_msg_id: "0b8f85be-46d1-4453-83a8-271bfc3b59d0",
          type: "message",
          text: "hi",
          user: "U025MHVA4TC",
          ts: "1633484729.000500",
          team: "T0256S1JFLP",
          blocks: [{ type: "rich_text", block_id: "N+wk", elements: [Array] }],
          channel: "C025MPV3143",
          event_ts: "1633484729.000500",
          channel_type: "channel",
        },
        client: {},
      });
      await expect(action).resolves.not.toThrow();
      expect(console.warn).toHaveBeenCalled();
    });
  });
  describe("when other Error happens", () => {
    it("褒め言葉のケース", async () => {
      jest.fn();
      const action = messageEventController({
        event: {
          client_msg_id: "0b8f85be-46d1-4453-83a8-271bfc3b59d0",
          type: "message",
          // text: "hi",
          user: "U025MHVA4TC",
          ts: "1633484729.000500",
          team: "T0256S1JFLP",
          blocks: [{ type: "rich_text", block_id: "N+wk", elements: [Array] }],
          channel: "C025MPV3143",
          event_ts: "1633484729.000500",
          channel_type: "channel",
        },
        client: {},
      });
      await expect(action).rejects.toThrow();
    });
  });
});
