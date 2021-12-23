import request from "supertest";
import { expressApp } from "../../app";

describe("GET /login", () => {
  it("slackの認証URLにリダイレクトする", async () => {
    const res = await request(expressApp).get("/login");
    expect(res.status).toBe(302);
    expect(res.header.location).toMatch(/^https:\/\/slack\.com\/oauth/);
  });
  it.todo("すでにtokenがあればそれを返す");
});
