import {
  summarizeByDay,
  summarizeByWeek,
  summarizeByMonth,
} from "./../../infra/praise/index";
import { summarize } from "./index";

jest.mock("@/infra/praise", () => ({
  ...jest.requireActual("../../infra/praise"),
  summarizeByDay: jest.fn(),
  summarizeByWeek: jest.fn(),
  summarizeByMonth: jest.fn(),
}));

describe("count", () => {
  it.todo("自分のチームのみ取得する");

  it("日毎の値を取得する", async () => {
    // given

    // when
    await summarize({
      teamId: "dummyString",
      start: "dammyStart",
      end: "dammyEnd",
      summarizedBy: "day",
    });

    // then
    //summarizedByDayが呼び出される
    expect(summarizeByDay).toHaveBeenCalledWith({
      teamId: "dummyString",
      start: "dammyStart",
      end: "dammyEnd",
    });
  });
  it.todo("endまでの値を取得する");
  it("週毎に集計する", async () => {
    // given

    // when
    await summarize({
      teamId: "dummyString",
      start: "dammyStart",
      end: "dammyEnd",
      summarizedBy: "week",
    });

    // then
    //summarizedByDayが呼び出される
    expect(summarizeByWeek).toHaveBeenCalledWith({
      teamId: "dummyString",
      start: "dammyStart",
      end: "dammyEnd",
    });
  });
  it("月ごとに集計する", async () => {
    // given

    // when
    await summarize({
      teamId: "dummyString",
      start: "dammyStart",
      end: "dammyEnd",
      summarizedBy: "month",
    });

    // then
    //summarizedByDayが呼び出される
    expect(summarizeByMonth).toHaveBeenCalledWith({
      teamId: "dummyString",
      start: "dammyStart",
      end: "dammyEnd",
    });
  });
});
