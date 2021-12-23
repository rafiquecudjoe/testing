import request from "supertest";
import { expressApp } from "./app";

describe("corsのテスト", () => {
  it("許可されたものはOK", async () => {
    const allowed = `http://localhost:3000`;
    const res = await request(expressApp)
      .options("/healthCheck")
      .set("Origin", allowed);
    expect(res.header["access-control-allow-origin"]).toBe(allowed);
  });
  it("許可されていないoriginだとエラー", async () => {
    const res = await request(expressApp)
      .options("/healthCheck")
      .set("Origin", `https://${Math.random()}.random`);
    expect(res.header["access-control-allow-origin"]).toBe(undefined);
  });
});
