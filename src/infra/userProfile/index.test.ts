import prismaClient from "../../../prisma";
import dayjs from "dayjs";

import { findByIds, save } from "./index";

jest.unmock("../../../prisma");

describe("userProfile", () => {
  beforeAll(async () => {
    await prismaClient.communications.deleteMany();
    await prismaClient.userProfile.deleteMany();
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });
  const now = dayjs().unix();

  it("findByIds", async () => {
    const input = {
      userId: "testuser123",
      teamId: "dummy_team_id_123",
      name: "user_123",
      icon: "icon_xxx",
      createdAt: now,
      updatedAt: now,
    };
    await prismaClient.userProfile.create({
      data: input,
    });

    const output = await findByIds({
      teamId: input.teamId,
      userId: input.userId,
    });
    expect(output).toEqual(input);
  });

  it("save", async () => {
    const input = {
      userId: "testuser123",
      teamId: "dummy_team_id_123",
      name: "user_123",
      icon: "icon_xxx",
    };

    const mockReturn = {
      ...input,
      createdAt: now,
      updatedAt: now,
    };

    const output = await save(input);
    expect(output).toEqual(mockReturn);
  });
});
