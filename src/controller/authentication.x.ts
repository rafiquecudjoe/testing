// import { APIGatewayProxyEvent } from "aws-lambda";
// import context from "aws-lambda-mock-context";
// import request from "supertest";
// import { receiver } from "./route";

// import { refreshToken, logout } from "./authentication";
// import { Authentication } from "../service/authentication";
// import moment from "moment";
// import jwt from "jsonwebtoken";
// import { prismaMock } from "../../singleton";
// jest.mock("jsonwebtoken", () => ({
//   ...jest.requireActual("jsonwebtoken"),
//   sign: jest.fn().mockReturnValue("token"),
//   verify: jest.fn().mockReturnValue({ user_id: "user_id", token: "token" }),
// }));

// slack
// フロントからの挙動
// 1. loginボタンを押す
// 2. slackの認証に遷移
// 3. ok→front redirect
// 4. token, login完了

// backendの挙動
// get /login api
// → slackのurlにclientId等を付与してフロントに返す
// get /oauth/callback?code=foo
// codeを用いてaccessTokenを取得
// accessTokenからTPのjwtを生成して、returnする

// describe("login", () => {
//   const authentication = new Authentication();
//   const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;
//   it("get token success after logged", async () => {
//     const result = {
//       app_id: "app_id",
//       authed_user: {
//         id: "user_id",
//       },
//       team: {
//         id: "team_id",
//         name: "team_name",
//       },
//       bot_user_id: "bot_user_id",
//       access_token: "access_token",
//       refresh_token: "refresh_token",
//       expires_in: "expires_in",
//       scope: "scope",
//       oAuthCode: "oAuthCode",
//       token_type: "bot",
//       is_enterprise_install: false,
//       created_at: moment().unix(),
//     };
//     prismaMock.slack_tokens.create.mockResolvedValue({
//       app_id: result.app_id,
//       user_id: result.authed_user.id,
//       bot_user_id: result.bot_user_id,
//       team_id: result.team.id,
//       team_name: result.team.name,
//       access_token: result.access_token,
//       refresh_token: result.refresh_token,
//       expires_in: result.expires_in,
//       scope: result.scope,
//       code: result.oAuthCode,
//       token_type: result.token_type,
//       is_enterprise_install: result.is_enterprise_install,
//       created_at: moment().unix(),
//     });

//     const expectRes = {
//       user_id: "user_id",
//       token: "token",
//     };
//     const res = await authentication.login(result);
//     //ログインでteamplanetのトークンが取得できること
//     expect(res.user_id).toEqual(expectRes.user_id);
//     expect(typeof res.token).toBe("string");

//     const payload = jwt.verify(res.token, jwtPrivateKey);
//     //トークンにユーザーIDが含まれること
//     expect(payload["user_id"]).toEqual(expectRes.user_id);

//     //トークンにslackのaccess tokenが含まれること
//     expect(payload["token"]).toEqual(expectRes.token);
//   });
// });

// describe("refreshToken", () => {
//   const dummyCallback = () => ({});
//   it("Missing access token", async () => {
//     const event = {} as APIGatewayProxyEvent;
//     const ctx = context();

//     const res = await refreshToken(event, ctx, dummyCallback);

//     if (!res) throw new Error();
//     expect(res.statusCode).toBe(400);
//     expect(res.body).toEqual(expect.stringContaining("required"));
//   });

//   it("Invalid access token", async () => {
//     const event = {
//       headers: {
//         Authorization: "Bearer abcxyz",
//       },
//     } as unknown as APIGatewayProxyEvent;
//     const ctx = context();

//     const res = await refreshToken(event, ctx, dummyCallback);

//     if (!res) throw new Error();
//     expect(res.statusCode).toBe(404);
//   });
// });

// describe("logout", () => {
//   const dummyCallback = () => ({});
//   it("Missing access token", async () => {
//     const event = {} as APIGatewayProxyEvent;
//     const ctx = context();

//     const res = await logout(event, ctx, dummyCallback);

//     if (!res) throw new Error();
//     expect(res.statusCode).toBe(400);
//     expect(res.body).toEqual(expect.stringContaining("required"));
//   });
// });
