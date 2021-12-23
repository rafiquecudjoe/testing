import { summarizeByDay, summarizeByWeek, summarizeByMonth } from "./index";
import prisma from "../../../prisma";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(timezone);
jest.unmock("../../../prisma");
// FIXME: タイムゾーンを考慮できていない
const generatePraise = ({
  createdAt,
  teamId,
  channelId,
}: {
  createdAt?: string;
  teamId?: string;
  channelId?: string;
}) => ({
  createdAt: dayjs.tz(createdAt || "2020-01-01", "Asia/Tokyo").toDate(),
  teamId: teamId || "dummyteam",
  channelId: channelId || "dummychannel",
  userId: "dummy",
  text: "dummy",
});

describe("prize repository", () => {
  beforeEach(async () => {
    await prisma.praise.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
  it("日毎に集計する", async () => {
    // given
    // 同じ日に2つデータ入れる
    // 違う日に一つデータ入れる
    const input = ["2020-01-01 00:00", "2020-01-01 01:00", "2020-01-03 00:00"]
      .map((i) => {
        return {
          createdAt: i,
        };
      })
      .map(generatePraise);
    await prisma.praise.createMany({
      data: input,
    });

    // when
    const res = await summarizeByDay({
      teamId: "dummyteam",
      start: "2020-01-01",
      end: "2020-01-07",
    });

    // then
    expect(res).toEqual([
      {
        at: "2020-01-01",
        sum: 2,
      },
      {
        at: "2020-01-02",
        sum: 0,
      },
      {
        at: "2020-01-03",
        sum: 1,
      },
      {
        at: "2020-01-04",
        sum: 0,
      },
      {
        at: "2020-01-05",
        sum: 0,
      },
      {
        at: "2020-01-06",
        sum: 0,
      },
      {
        at: "2020-01-07",
        sum: 0,
      },
    ]);
    it.todo("別チームは計上しない");
    it.todo("期間外は集計しない");
  });

  it("7日ごとに集計する", async () => {
    // given
    // 同じ週に2つデータ入れる
    // 違う週に一つデータ入れる
    const input = ["2020-01-01 09:00", "2020-01-02 10:00", "2020-01-08 09:00"]
      .map((i) => {
        return {
          createdAt: i,
        };
      })
      .map(generatePraise);
    await prisma.praise.createMany({
      data: input,
    });

    // when
    const res = await summarizeByWeek({
      teamId: "dummyteam",
      start: "2020-01-01",
      end: "2020-01-15",
    });

    // then
    expect(res).toEqual([
      {
        at: "2020-01-01",
        sum: 2,
      },
      {
        at: "2020-01-08",
        sum: 1,
      },
      {
        at: "2020-01-15",
        sum: 0,
      },
    ]);
    it.todo("別チームは計上しない");
    it.todo("期間外は集計しない");
  });
  it("月ごと", async () => {
    // given
    // 同じ月に2つデータ入れる
    // 違う月に一つデータ入れる
    const input = ["2020-01-01 00:00", "2020-01-11 01:00", "2020-02-03 00:00"]
      .map((i) => {
        return {
          createdAt: i,
        };
      })
      .map(generatePraise);
    await prisma.praise.createMany({
      data: input,
    });

    // when
    const res = await summarizeByMonth({
      teamId: "dummyteam",
      start: "2020-01-01",
      end: "2020-03-31",
    });

    // then
    expect(res).toEqual([
      {
        at: "2020-01",
        sum: 2,
      },
      {
        at: "2020-02",
        sum: 1,
      },
      {
        at: "2020-03",
        sum: 0,
      },
    ]);
  });
  it("月ごと（sum=0含む）", async () => {
    // given
    // 同じ月に10こデータ入れる
    // ひと月飛ばして1つデータ入れる
    const input = [
      "2020-01-01 00:00",
      "2020-01-02 00:00",
      "2020-01-03 00:00",
      "2020-01-04 00:00",
      "2020-01-05 00:00",
      "2020-01-06 00:00",
      "2020-01-07 00:00",
      "2020-01-08 00:00",
      "2020-01-09 00:00",
      "2020-01-10 00:00",
      "2020-03-01 00:00",
    ]
      .map((i) => {
        return {
          createdAt: i,
        };
      })
      .map(generatePraise);
    await prisma.praise.createMany({
      data: input,
    });

    // when
    const res = await summarizeByMonth({
      teamId: "dummyteam",
      start: "2020-01-01",
      end: "2020-03-31",
    });

    // then
    expect(res).toEqual([
      {
        at: "2020-01",
        sum: 10,
      },
      {
        at: "2020-02",
        sum: 0,
      },
      {
        at: "2020-03",
        sum: 1,
      },
    ]);
  });
});
