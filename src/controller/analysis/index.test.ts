import request from "supertest";
import { expressApp } from "../../app";
jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
  sign: jest.fn().mockReturnValue("token"),
  verify: jest
    .fn()
    .mockReturnValue({ user_id: "user_id", token: "token", team_id: "1234" }),
}));

describe("GET /analysis", () => {
  it("正常", async () => {
    const res = await request(expressApp)
      .get("/analysis")
      .set("authorization", "Bearer test");
    console.log(res.body);
    expect(res.statusCode).toBe(200);
  });

  it("miss token", async () => {
    const res = await request(expressApp).get("/analysis");
    expect(res.statusCode).toBe(401);
    expect(res.text).toEqual(expect.stringContaining("required"));
  });
});
