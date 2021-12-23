import request from "supertest";
import { expressApp } from "../../app";
jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
  sign: jest.fn().mockReturnValue("token"),
  verify: jest
    .fn()
    .mockReturnValue({ user_id: "user_id", token: "token", team_id: "1234" }),
}));

describe("GET /timeline", () => {
  it("正常", async () => {
    const res = await request(expressApp)
      .get("/timeline")
      .set(
        "authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZWFtX2lkIjoiMTIzNCJ9.unvIlkuHuIFhN-wWaJgiMPMLfFAD1Ab7dwGKgh9YAXw"
      );
    expect(res.statusCode).toBe(200);
  });

  it("miss token", async () => {
    const res = await request(expressApp).get("/timeline");
    expect(res.statusCode).toBe(401);
    expect(res.text).toEqual(expect.stringContaining("required"));
  });
});
