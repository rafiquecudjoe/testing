import prismaClient from "../../../prisma";
import dayjs from "dayjs";

import { findById, save } from "./index";

jest.unmock("../../../prisma");

describe("teamProfile", () => {
  beforeAll(async () => {
    await prismaClient.teamProfile.deleteMany();
  });

  afterAll(async () => {
    await prismaClient.$disconnect();
  });
  const now = dayjs().unix();

  it("findById", async () => {
    const input = {
      teamId: "dummy_team_id_123",
      name: "user_123",
      icon: "icon_xxx",
      createdAt: now,
      updatedAt: now,
    };
    await prismaClient.teamProfile.create({
      data: input,
    });

    const output = await findById(input.teamId);
    expect(output).toEqual(input);
  });

  it("save", async () => {
    const input = {
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
