import { saveCommunications } from "../../infra/communication";
import prisma from "../../../prisma";
import { analyzeSentiment } from "../../infra/sentiment";
import { checkLevelUp, processLevelUp } from "../levelUp";
import dayjs from "dayjs";
import { BaseError } from "../../util/error";
import { getThread, getUserProfile, Message } from "../../service/slackBot";
import { getUserIdList } from "../../util/getUserIdList";
import { union, compact } from "lodash";
type Payload = {
  text: string;
  team: string;
  user: string;
  ts?: string;
  thread_ts?: string;
  channel: string;
  subtype?: string;
};

type MessageEventUserCaseErrorMessage =
  | "cant analyze sentiment"
  | "do nothing"
  | "not levelUp";

export class MessageEventUseCaseError extends BaseError {
  constructor(error: MessageEventUserCaseErrorMessage) {
    super(error);
  }
}
export const messageEvent = async (
  { text, team, user, ts = "", thread_ts = "", channel }: Payload,
  token: string
) => {
  // 褒め言葉か判断
  // const { text, team, user, channel} = payload
  // eslint-disable-next-line no-useless-catch
  try {
    await handleCommunication({
      token,
      user,
      team,
      text,
      channel,
      ts,
      thread_ts,
    });
  } catch (e) {
    if (e.message !== "no communication") throw e;
  }

  const sentiment = await (async () => {
    try {
      const sentiment = await analyzeSentiment(text);
      if (!sentiment) {
        throw new MessageEventUseCaseError("cant analyze sentiment");
      }
      return sentiment;
    } catch (e) {
      console.error(e);
      throw new MessageEventUseCaseError("cant analyze sentiment");
    }
  })();
  const recordedSentiment = await saveSentiment({
    text,
    magnitude: Number(sentiment?.magnitude),
    score: Number(sentiment?.score),
  });
  // TODO: しきい値を動的にする？
  const SENTIMENT_THRESHOLD = 0.4;
  if (Number(sentiment.score) < SENTIMENT_THRESHOLD) {
    console.log(sentiment, "not praise");
    // throw new Error('do nothing')
    throw new MessageEventUseCaseError("do nothing");
  }
  console.log(sentiment);
  // save
  await savePraise({
    teamId: team,
    userId: user,
    text: text,
    channelId: channel,
    sentimentId: Number(recordedSentiment?.id),
  });

  const checkLevelUpResult = await checkLevelUp(team);
  if (!checkLevelUpResult.result) {
    throw new MessageEventUseCaseError("not levelUp");
  }
  const payload = {
    teamId: team,
    stage: checkLevelUpResult.stage,
    activeMembers: checkLevelUpResult.activeMembers,
    startAt: dayjs().unix(),
    endAt: dayjs().unix(),
    createdAt: dayjs().unix(),
  };
  await processLevelUp(payload);
  // post
  return true;
};

export const saveSentiment = async (input: {
  text: string;
  magnitude: number;
  score: number;
}) => {
  const { text, magnitude, score } = input;
  return prisma.sentiment.create({
    data: {
      text,
      magnitude,
      score,
    },
  });
};

export const savePraise = async (input: {
  teamId: string;
  userId: string;
  text: string;
  channelId: string;
  sentimentId: number;
}) => {
  const { teamId, userId, text, channelId, sentimentId } = input;
  return await prisma.praise.create({
    data: {
      teamId,
      userId,
      text,
      channelId,
      sentimentId,
    },
  });
};

export const getTargetFromThread = (thread: Message[], senderId: string) => {
  if (thread.length === 0) return [];
  const replyUsers = thread[0].reply_users?.filter((item) => item !== senderId);
  const parentUser = thread[0].user;
  const mentionUsers = thread
    .map((message) => {
      if (typeof message?.text === "string")
        return getUserIdList(message?.text);
    })
    .flat();
  return compact(union(replyUsers, mentionUsers, [parentUser]));
};

export const getTargetFromText = (text: string, senderId: string): string[] => {
  return getUserIdList(text).filter((item) => item !== senderId);
};
export const handleCommunication = async (
  input: Omit<Payload, "subtype"> & { token: string }
) => {
  const {
    token,
    user: senderId,
    text,
    team: teamId,
    channel,
    thread_ts,
  } = input;
  // 対象となるのは
  // 1.スレッドじゃない時
  //  mentionをつけている(text中にある)ユーザー

  // 2. スレッドのとき
  //  - リプライしているユーザー
  //  - スレッドの親ユーザー
  //  - 各投稿のテキスト中のユーザー
  const targetUsers: string[] = thread_ts
    ? getTargetFromThread(
        await getThread(token, channel, thread_ts, 10, "", []),
        senderId
      )
    : getTargetFromText(text, senderId);
  console.log(targetUsers);

  if (targetUsers.length === 0) {
    console.log("no communication");
    throw new Error("no communication");
  }
  // 文中のユーザーprofileがなければ作成
  await Promise.all(
    targetUsers.map(async (targetUser) => {
      const isExistedUser = await prisma.userProfile.findUnique({
        where: {
          userId_teamId: {
            userId: targetUser,
            teamId,
          },
        },
      });

      if (!isExistedUser) {
        const slackProfile = await getUserProfile(token, targetUser);
        await prisma.userProfile.create({
          data: {
            userId: targetUser,
            teamId,
            name: slackProfile?.profile?.display_name || "",
            icon: slackProfile?.profile?.image_original,
            createdAt: dayjs().unix(),
            updatedAt: dayjs().unix(),
          },
        });
      }
    })
  );

  const payload = targetUsers.map((targetId) => {
    return {
      teamId,
      sourceId: senderId,
      targetId: targetId,
      createdAt: dayjs().unix(),
    };
  });
  return await saveCommunications(payload);
};
