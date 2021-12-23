import { expressApp } from "../../app";
import request from "supertest";
import { pick } from "lodash";
import { findById } from "../../infra/teamProfile";
jest.unmock("../../../prisma");

jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
  sign: jest.fn().mockReturnValue("token"),
  verify: jest
    .fn()
    .mockReturnValue({ user_id: "user_id", token: "token", team_id: "1234" }),
}));
describe("GET /me", () => {
  it.todo("tokenがないとエラー");
  it.todo("tokenにユーザーidがないとエラー");
  it.todo("DBにユーザーがないとエラー");
  it.skip("ユーザー名とiconについて返す", async () => {
    // given
    // user情報を入れる
    const dummyUser = {
      teamId: "dummyTeam",
      userId: "dummyUser",
      name: "dummyName",
      icon: "dummyIcon",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const dummyTeam = {
      teamId: "dummyTeam",
      name: "dummyName",
      icon: JSON.stringify({
        "icon-1":
          "https://a.slack-edge.com/80588/img/avatars-teams/ava_0007-102.png",
      }),
    };
    // FIXME: このモックが働いていない
    jest.mock("../../infra/teamProfile", () => {
      return {
        findByIds: jest.fn().mockReturnValue(dummyUser),
      };
    });
    jest.mock("../../infra/userProfile", () => {
      return {
        findById: jest.fn().mockReturnValue(dummyTeam),
      };
    });
    // when
    const res = await request(expressApp)
      .get("/me")
      .set("authorization", "Bearer dummy");

    // then
    expect(res.status).toBe(200);
    expect(res.body).toBe({
      user: pick(dummyUser, ["name", "icon"]),
      team: pick(dummyTeam, ["name", "icon"]),
    });
  });
});
