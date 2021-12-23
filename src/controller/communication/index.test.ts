import { expressApp } from "../../app";
import request from "supertest";
import prisma from "../../../prisma";
import dayjs from "dayjs";
import { isArray } from "util";
import mockAuthenticateRequest from "../../util/mockAuthenticateRequest";

describe("GET /communication", () => {
  afterEach(async () => {
    await prisma.$disconnect();
  });

  it("valid case", async () => {
    const req = request(expressApp)
      .get("/communication")
      .query({ fromAt: dayjs().unix() });
    const res = await mockAuthenticateRequest(req);
    expect(res.status).toBe(200);
    expect(isArray(res.body?.nodes)).toBe(true);
    expect(isArray(res.body?.links)).toBe(true);
  });

  it("miss fromAt in request query", async () => {
    const req = request(expressApp).get("/communication");
    const res = await mockAuthenticateRequest(req);
    expect(res.status).toBe(400);
    expect(res.text).toEqual(expect.stringContaining("required"));
  });

  it("not authenticate", async () => {
    const res = await request(expressApp).get("/communication").query({});
    expect(res.status).toBe(401);
    expect(res.text).toEqual(expect.stringContaining("required access token"));
  });
});
