import request from "supertest";
import { expressApp } from "../../app";

// jest.mock("@slack/oauth", () => {
//   const originalOauth = jest.requireActual("@slack/oauth");
//   const dummyInstllation = {
//     user: {
//       id: "dummyuser",
//     },
//     bot: {
//       id: "dummybotid",
//     },
//   };
//   return {
//     ...originalOauth,
//     InstallProvider: jest.fn().mockImplementation(() => {
//       return {
//         ...originalOauth.InstallProvider,
//         handleCallback: (req, res, { success, failure }) => {
//           success(dummyInstllation, null, req, res);
//         },
//       };
//     }),
//   };
// });
// TODO: tokenの検証のテストが必要
describe.skip("/slack/callback slackからのコールバックのテスト", () => {
  // it("accessTokenを取得する", () => {});
  // it("slacktokenテーブルへの保存", () => {}); usecase層？
  it("tokenをつけてフロントにredirectする", async () => {
    const res = await request(expressApp).get("/slack/callback").query({
      code: "dummycode",
      state: "my-state-secret",
    });
    expect(res.status).toBe(302);
    const url = process.env.FRONT_URL;
    expect(res.header.location).toContain(url);
    expect(res.header.location).toContain("?token=");
  });
});
