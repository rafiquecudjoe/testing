import {
  messageEvent,
  MessageEventUseCaseError,
} from "./../../usecase/messageEvent";

export const messageEventController = async ({ event, client }) => {
  const message = event as EventPayload; // TODO: 型が合わない

  console.log("### EVENT ###");
  console.log(event);

  // eslint-disable-next-line no-useless-catch
  try {
    await messageEvent(message, client.token);
  } catch (e) {
    if (!(e instanceof MessageEventUseCaseError)) {
      throw e;
    }
    console.warn("MessageEventUseCaseError", e);
  }

  // レベルアップ、通知の処理
};
type EventPayload = {
  user: string;
  ts: string;
  team: string;
  channel: string;
  text: string;
};

export async function noBotMessages(arg) {
  if (!arg.message.subtype || arg.message.subtype !== "bot_message") {
    await arg.next();
  }
}

// event payload
// {
//   client_msg_id: 'e2bad84e-f912-41d0-b08c-355c055c877e',
//   type: 'message',
//   text: 'test',
//   user: 'U025MHVA4TC',
//   ts: '1630564421.002400',
//   team: 'T0256S1JFLP',
//   blocks: [ { type: 'rich_text', block_id: '1AxIp', elements: [Array] } ],
//   channel: 'C025MPV3143',
//   event_ts: '1630564421.002400',
//   channel_type: 'channel'
// }

// slack botは自身が参加していないチャンネルのイベントを取得できない
