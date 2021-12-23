import { RequestHandler } from "../route";

type AnalysisResponse = {
  score: {
    current: number;
    prev: number;
  };
  advise: string;
  averagePraises: {
    current: number;
    prev: number;
  };
  averageWords: Characters;
  averageFrequency: Frequency;
};
type Characters = {
  current: number;
  prev: number;
};

type Frequency = {
  current: number;
  prev: number;
};

export const analysis: RequestHandler<AnalysisResponse> = async (req, res) => {
  const dummyCharacters: Characters = {
    current: parseFloat((Math.random() * 100).toFixed(1)),
    prev: parseFloat((Math.random() * 100).toFixed(1)),
  };
  const dummyFrequency: Frequency = {
    current: parseFloat((Math.random() * 10).toFixed(1)),
    prev: parseFloat((Math.random() * 10).toFixed(1)),
  };
  const dummyPraises = {
    current: parseFloat((Math.random() * 2).toFixed(1)),
    prev: parseFloat((Math.random() * 2).toFixed(1)),
  };
  const dummyData = {
    score: {
      current: Math.floor(Math.random() * 100),
      prev: Math.floor(Math.random() * 100),
    },
    advise:
      "先週よりも褒めた回数が増えていますね。投稿頻度が少なくなっているので、まずは挨拶からはじめてみませんか？",
    averageWords: dummyCharacters,
    averageFrequency: dummyFrequency,
    averagePraises: dummyPraises,
  };

  res.send(dummyData);
};
