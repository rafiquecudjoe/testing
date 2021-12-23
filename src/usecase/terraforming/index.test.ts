import { prismaMock } from "../../../singleton";
import { Terraforming } from "./index";

describe("terraforming", () => {
  const terraforming = new Terraforming();
  it("levelupレコードがないときはレベル１であり、現在までの全期間のpraiseを取得する", async () => {
    prismaMock.level_up_progress.findFirst.mockResolvedValue(null);
    prismaMock.praise.count.mockResolvedValue(2);
    const mockValues = {
      count: 2,
      complete: 100,
      currentPhase: 1,
    };
    const result = await terraforming.countAtCurrentStage("dummyID");
    expect(result).toEqual(mockValues);
  });

  it("levelupレコードがある時、レコードにあるレベル+1であり、そのendから今までの値を取得する", async () => {
    prismaMock.level_up_progress.findFirst.mockResolvedValue({
      id: 100,
      activeMembers: 100,
      teamId: "dummyId",
      startAt: new Date("2020-01-01").getTime(),
      endAt: new Date("2021-01-01").getTime(),
      stage: 1,
      createdAt: new Date("2021-01-01").getTime(),
      updatedAt: new Date("2021-01-01").getTime(),
    });
    prismaMock.praise.count.mockResolvedValue(101);
    const mockValues = {
      count: 101,
      complete: 200,
      currentPhase: 2,
    };
    const result = await terraforming.countAtCurrentStage("dummyId");
    expect(result).toEqual(mockValues);
  });

  it.todo("1000を超えた時");
});
