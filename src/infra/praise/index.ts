import dayjs, { Dayjs } from "dayjs";
import prisma from "../../../prisma";

export type count = {
  at: string;
  sum: number;
};

const addDays = (date, days = 1) => {
  return dayjs(date).add(days, "day");
};

const dateRangeDay = (
  start: Date | Dayjs,
  end: Date,
  range: Array<Date | Dayjs> = []
) => {
  if (start > end) return range;
  const next = addDays(start, 1);
  return dateRangeDay(next, end, [...range, start]);
};

const addWeeks = (date, days = 1) => {
  return dayjs(date).add(days * 7, "day");
};

const dateRangeWeek = (
  start: Date | Dayjs,
  end: Date,
  range: Array<Date | Dayjs> = []
) => {
  if (start > end) return range;
  const next = addWeeks(start, 1);
  return dateRangeWeek(next, end, [...range, start]);
};

const addMonths = (date, days = 1) => {
  return dayjs(date).add(days, "month");
};

const dateRangeMonth = (
  start: Date | Dayjs,
  end: Date,
  range: Array<Date | Dayjs> = []
) => {
  if (start > end) return range;
  const next = addMonths(start, 1);
  return dateRangeMonth(next, end, [...range, start]);
};

export const summarizeByDay = async ({
  teamId,
  start,
  end,
}: {
  teamId: string;
  start: string;
  end: string;
}): Promise<count[]> => {
  // TODO: injectionコントローラーでvalidationするかDateにして再度文字列に戻して投げる;
  const res = await prisma.$queryRaw<
    {
      summaryAt: string;
      summaryCount: number;
    }[]
  >`
  SELECT
    DATE_FORMAT(convert_tz(createdAt, '+00:00', '+09:00'),'%Y-%m-%d') AS "summaryAt",
    count(id) as "summaryCount"
  FROM
    praise
  WHERE
    teamId = ${teamId}
    AND convert_tz(createdAt, '+00:00', '+09:00') >= ${start}
    AND convert_tz(createdAt, '+00:00', '+09:00') <= ${end}
  GROUP BY
    summaryAt
  ORDER BY
    summaryAt ASC;`;

  const listOfDates = dateRangeDay(new Date(start), new Date(end)).map((date) =>
    dayjs(date).format("YYYY-MM-DD")
  );

  const output = listOfDates.map((i) => {
    return {
      at: i,
      sum: res.find((j) => j.summaryAt === i)?.summaryCount ?? 0,
    };
  });

  return output;
};

export const summarizeByWeek = async ({
  teamId,
  start,
  end,
}: {
  teamId: string;
  start: string;
  end: string;
}): Promise<count[]> => {
  // TODO: sql injectionコントローラーでvalidationするかDateにして再度文字列に戻して投げる
  const res = await prisma.$queryRaw<
    {
      summaryAt: string;
      summaryCount: number;
    }[]
  >`
  SELECT
  DATE_FORMAT(
    convert_tz(
      DATE_SUB(createdAt, INTERVAL MOD(DATEDIFF(createdAt, convert_tz(date(${start}), '+00:00', '+09:00')), 7) DAY),
      '+00:00',
      '+09:00'),
    '%Y-%m-%d') as 'summaryAt',
    count(id) as "summaryCount"
  FROM
    praise
  WHERE
    teamId = ${teamId}
    AND convert_tz(createdAt, '+00:00', '+09:00') >= ${start}
    AND convert_tz(createdAt, '+00:00', '+09:00') <= ${end}
  GROUP BY
    summaryAt
  ORDER BY
    summaryAt ASC;`;

  const listOfDates = dateRangeWeek(new Date(start), new Date(end)).map(
    (date) => dayjs(date).format("YYYY-MM-DD")
  );
  const output = listOfDates.map((i) => {
    return {
      at: i,
      sum: res.find((j) => j.summaryAt === i)?.summaryCount ?? 0,
    };
  });

  return output;
};

export const summarizeByMonth = async ({
  teamId,
  start,
  end,
}: {
  teamId: string;
  start: string;
  end: string;
}): Promise<count[]> => {
  //TODO: sql injectionコントローラーでvalidationするかDateにして再度文字列に戻して投げる
  const res = await prisma.$queryRaw<
    {
      summaryAt: string;
      summaryCount: number;
    }[]
  >`
    SELECT
      DATE_FORMAT(convert_tz(createdAt, '+00:00', '+09:00'),'%Y-%m') AS "summaryAt",
      count(id) as "summaryCount"
    FROM
      praise
    WHERE
      teamId = ${teamId}
      AND convert_tz(createdAt, '+00:00', '+09:00') >= ${start}
      AND convert_tz(createdAt, '+00:00', '+09:00') <= ${end}
    GROUP BY
      summaryAt
    ORDER BY
      summaryAt ASC;`;

  const listOfDates = dateRangeMonth(new Date(start), new Date(end)).map(
    (date) => dayjs(date).format("YYYY-MM")
  );
  const output = listOfDates.map((i) => {
    return {
      at: i,
      sum:
        res.find((j) => j.summaryAt === dayjs(i).format("YYYY-MM"))
          ?.summaryCount ?? 0,
    };
  });

  return output;
};
