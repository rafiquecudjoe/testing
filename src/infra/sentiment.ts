import language from "@google-cloud/language";

// https://cloud.google.com/natural-language/docs/basics?hl=ja#interpreting_sentiment_analysis_values

export const analyzeSentiment = async (text: string) => {
  try {
    const client = new language.LanguageServiceClient();
    const result = await client.analyzeSentiment({
      document: {
        type: "PLAIN_TEXT",
        content: text,
      },
    });
    return result[0].documentSentiment;
  } catch (e) {
    console.log("sentiment error: ", e);
    // FIXME: ECS上だとGCP認証が上手く行かないので、他機能の開発を止めないためにすべてOKにしておく
    return {
      magnitude: 1,
      score: 1,
    };
  }
};
