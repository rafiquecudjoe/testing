import { expressApp } from "../../app";
import request from "supertest";
import prisma from "../../../prisma";
describe("GET /healthCheck", () => {
  jest.unmock("../../../prisma");

  afterEach(async () => {
    await prisma.$disconnect();
  });
  it("DB接続できていればOK", async () => {
    // given

    // when
    try {
      const res = await request(expressApp).get("/healthCheck");
      // then
      expect(res.status).toBe(200);
      expect(res.text).toBe("ok");
    } catch (e) {
      console.log(e);
    }
  });
});
