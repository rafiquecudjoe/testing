import request from "supertest";
import { expressApp } from "../../app";
import { PrismaClient } from "@prisma/client";

jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
  sign: jest.fn().mockReturnValue("token"),
  verify: jest
    .fn()
    .mockReturnValue({ user_id: "user_id", token: "token", team_id: "1234" }),
}));
const prismaClient = new PrismaClient();

describe("GET /notifications", () => {
  // it("正常", async () => {
  //     const res = await request(expressApp)
  //         .get("/notifications")
  //         .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZWFtX2lkIjoiMTIzNCJ9.unvIlkuHuIFhN-wWaJgiMPMLfFAD1Ab7dwGKgh9YAXw')
  //     expect(res.statusCode).toBe(200);
  // });

  it("miss token", async () => {
    const res = await request(expressApp).get("/notifications");
    expect(res.statusCode).toBe(401);
    expect(res.text).toEqual(expect.stringContaining("required"));
  });
});

// describe("POST /notifications/:id/mark-as-read", () => {
//     beforeAll(async () => {
//         await prismaClient.reads.deleteMany();
//         await prismaClient.notifications.deleteMany();
//     })
//     afterAll(async () => {
//         await prismaClient.reads.deleteMany();
//         await prismaClient.notifications.deleteMany();
//     })
//     it("正常", async () => {
//         await prismaClient.notifications.create({
//             data: {
//                 "id": 1,
//                 "teamId": "team_1",
//                 "type": null,
//                 "body": "hello",
//                 "createdAt": 1600992812
//             }
//         })
//         const res = await request(expressApp)
//             .post("/notifications/1/mark-as-read")
//             .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZWFtX2lkIjoiMTIzNCJ9.unvIlkuHuIFhN-wWaJgiMPMLfFAD1Ab7dwGKgh9YAXw')
//         expect(res.statusCode).toBe(200);
//         await prismaClient.reads.deleteMany();
//         await prismaClient.notifications.deleteMany();
//     });
//
//     it("notificationId not exist", async () => {
//         const res = await request(expressApp)
//             .post("/notifications/1/mark-as-read")
//             .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZWFtX2lkIjoiMTIzNCJ9.unvIlkuHuIFhN-wWaJgiMPMLfFAD1Ab7dwGKgh9YAXw')
//         expect(res.statusCode).toBe(400);
//         expect(res.text).toEqual(expect.stringContaining("notification"));
//     });
//
//     it("miss token", async () => {
//         const res = await request(expressApp)
//             .post("/notifications/3/mark-as-read")
//         expect(res.statusCode).toBe(403);
//         expect(res.text).toEqual(expect.stringContaining("required"));
//
//     });
// });
