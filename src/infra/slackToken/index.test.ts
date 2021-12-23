import { fetchInstallation, save } from ".";
import prismaClient from "../../../prisma";
import dayjs from "dayjs";

jest.unmock("../../../prisma");

describe("slackToken", () => {
  beforeAll(async () => {
    await prismaClient.slackToken.deleteMany();
  });
  afterAll(async () => {
    await prismaClient.$disconnect();
  });
  it("get by teamId", async () => {
    const input = {
      teamId: "dummy_team_id_123",
      botUserId: "bot_u_xxx",
      botId: "bot_xxx",
      accessToken: "acc_xxx",
      refreshToken: "rf_xxx",
      expiresAt: 12345,
      createdAt: dayjs().toDate(),
      updatedAt: dayjs().toDate(),
    };
    await prismaClient.slackToken.create({
      data: input,
    });
    const result = await fetchInstallation(input.teamId);
    const output = {
      teamId: input.teamId,
      botId: input.botId,
      botToken: input.accessToken,
    };
    expect(result).toEqual(output);
  });
  it("save", async () => {
    const input = {
      accessToken: "acc_xxx",
      botUserId: "bot_u_xxx",
      botId: "bot_xxx",
      expiresAt: 12345,
      teamId: "dummy_team_id",
      refreshToken: "rf_xxx",
    };
    const mockReturn = {
      ...input,
      createdAt: expect.anything(),
      updatedAt: expect.anything(),
    };
    const res = await save(input);

    //dbにトークンを保存すること
    expect(res).toEqual(mockReturn);
  });
});
