import { prismaMock } from "../../../singleton";
import { getCommunications } from "./index";
import dayjs from "dayjs";

describe("get communication", () => {
  const raw = [
    {
      sourceId: "U025TU0HJLC",
      targetId: "U02HCKX25PE",
      _count: 4,
    },
    {
      sourceId: "U02HCKX25PE",
      targetId: "U025TU0HJLC",
      _count: 1,
    },
  ];

  const mockUser = [
    {
      user: {
        userId: "U025TU0HJLC",
        teamId: "teamId",
        name: "dev_1",
      },
      target: {
        userId: "U02HCKX25PE",
        teamId: "teamId",
        name: "dev_2",
      },
    },
  ];

  const usersOfTeam = ["U025TU0HJLC", "U02HCKX25PE"];

  it("response data when found by teamID", async () => {
    prismaMock.communications.findMany.mockResolvedValue(mockUser as any);
    prismaMock.communications.groupBy.mockResolvedValue(raw as any);
    const outputNodes = [
      {
        id: "U025TU0HJLC",
        teamId: "teamId",
        name: "dev_1",
        img: "",
        linkCount: 4,
      },
      {
        id: "U02HCKX25PE",
        teamId: "teamId",
        name: "dev_2",
        img: "",
        linkCount: 1,
      },
    ];

    const outputLinks = raw.map((item) => ({
      source: item.sourceId,
      target: item.targetId,
      count: item._count,
    }));
    const result = await getCommunications("teamId", dayjs().unix());

    //userごとのlinkCountが正しい値であるか
    expect(result?.nodes).toEqual(outputNodes);
    expect(result?.links).toEqual(outputLinks);

    //team内のすべてのuserがnodeとして返却されているか
    expect(result?.nodes.map((item) => item.id)).toEqual(usersOfTeam);
  });

  it(`response empty data when didn't find by teamID`, async () => {
    prismaMock.communications.findMany.mockResolvedValue([]);
    prismaMock.communications.groupBy.mockResolvedValue([]);
    const result = await getCommunications("teamId", dayjs().unix());
    expect(result?.nodes).toEqual([]);
    expect(result?.links).toEqual([]);
  });
});
