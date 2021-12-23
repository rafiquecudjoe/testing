import { analyzeSentiment } from "./sentiment";

describe("感情分析のテスト", () => {
  it("api呼び出し", async () => {
    const content = "Azureのサポートに怒りをぶつけてしまった";

    const result = await analyzeSentiment(content);
    expect(typeof result?.score).toBe("number");
    expect(typeof result?.magnitude).toBe("number");
  });
});
