import type { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, MockProxy } from "jest-mock-extended";

import prisma from "./prisma";

jest.mock("./prisma", () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as MockProxy<PrismaClient>;
