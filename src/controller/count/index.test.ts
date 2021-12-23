import request from "supertest";
import { expressApp } from "../../app";

jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
  sign: jest.fn().mockReturnValue("token"),
  verify: jest
    .fn()
    .mockReturnValue({ user_id: "user_id", token: "token", team_id: "1234" }),
}));

jest.mock("../../usecase/count", () => ({
  summarize: jest.fn(),
}));

describe("GET /count", () => {
  it("正常", async () => {
    const res = await request(expressApp)
      .get("/count")
      .set("authorization", "Bearer dummy")
      .query({
        start: "2020-01-01",
        count: 7,
        summarizedBy: "day",
      });
    console.log(res.text);

    expect(res.statusCode).toBe(200);
  });

  it.skip("query paramsにstartが含まれていないとき400", async () => {
    const res = await request(expressApp).get("/count").query({
      count: 7,
      summarizedBy: "day",
    });

    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual(expect.stringContaining("required"));
  });

  it.skip("query paramsにcountが含まれていないとき400", async () => {
    const res = await request(expressApp).get("/count").query({
      start: "2020-01-01",
      summarizedBy: "day",
    });

    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual(expect.stringContaining("required"));
  });

  it.skip("start, endがパースできないとき400", async () => {
    const res = await request(expressApp)
      .get("/count")
      .query({ start: "", end: "" });

    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual(expect.stringContaining("start"));
  });

  it.skip("periodがday, month, yearでないとき400", async () => {
    const res = await request(expressApp).get("/count").query({
      start: "2020-01-01",
      count: 7,
      summarizedBy: "wrong",
    });

    expect(res.statusCode).toBe(400);
    expect(res.text).toEqual(expect.stringContaining("summarizedBy"));
  });
});
