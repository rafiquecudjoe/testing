import { boltApp as app } from "../app";
import lodash from "lodash";

export interface Purpose {
  value?: string;
  creator?: string;
  last_set?: number;
}

interface Channel {
  id?: string;
  name?: string;
  is_channel?: boolean;
  is_group?: boolean;
  is_im?: boolean;
  created?: number;
  is_archived?: boolean;
  is_general?: boolean;
  unlinked?: number;
  name_normalized?: string;
  is_shared?: boolean;
  creator?: string;
  is_moved?: number;
  is_ext_shared?: boolean;
  is_global_shared?: boolean;
  is_org_default?: boolean;
  is_org_mandatory?: boolean;
  is_org_shared?: boolean;
  pending_shared?: string[];
  pending_connected_team_ids?: string[];
  is_pending_ext_shared?: boolean;
  conversation_host_id?: string;
  is_member?: boolean;
  is_private?: boolean;
  is_mpim?: boolean;
  topic?: Purpose;
  purpose?: Purpose;
  num_members?: number;
  shared_team_ids?: string[];
  internal_team_ids?: string[];
  previous_names?: string[];
}

export type Message = {
  bot_id?: string;
  type?: string;
  text?: string;
  user?: string;
  ts?: string;
  team?: string;
  bot_profile?: BotProfile;
  thread_ts?: string;
  reply_count?: number;
  reply_users_count?: number;
  latest_reply?: string;
  reply_users?: string[];
  subscribed?: boolean;
  parent_user_id?: string;
  is_locked?: boolean;
};

export interface BotProfile {
  id?: string;
  deleted?: boolean;
  name?: string;
  updated?: number;
  app_id?: string;
  icons?: Icons;
  team_id?: string;
}
export interface Icons {
  image_36?: string;
  image_48?: string;
  image_72?: string;
}

export const joinBotToChannels = async (token, teamId, limit = 20) => {
  const listChannels = await getAllChannels(token, teamId, limit, "", []);
  if (!listChannels || !listChannels.length) return { success: false };
  await Promise.all(
    listChannels.map((channel) =>
      app.client.conversations.join({
        channel: channel.id,
        token,
      })
    )
  );
  return { success: true, channels: listChannels.map((item) => item.id) };
};

const getAllChannels = async (
  token,
  teamId,
  limit,
  cursor = "",
  res: Channel[] | null | undefined
) => {
  const req_params = {
    token,
    exclude_archived: true,
    team_id: teamId,
    type: "public_channel",
    limit,
  };
  if (cursor) {
    req_params["cursor"] = cursor;
  }
  const raw = await app.client.conversations.list(req_params);
  const result = lodash.union(res, raw.channels);
  if (raw?.response_metadata?.next_cursor) {
    return await getAllChannels(
      token,
      teamId,
      limit,
      raw?.response_metadata?.next_cursor,
      result
    );
  } else {
    return result;
  }
};

export const getThread = async (
  token,
  channelId,
  ts,
  limit,
  cursor = "",
  res: Message[] | null | undefined
): Promise<Message[]> => {
  const req_params = {
    token,
    channel: channelId,
    ts,
    limit,
  };
  if (cursor) {
    req_params["cursor"] = cursor;
  }
  console.log("req_params", req_params);
  const raw = await app.client.conversations.replies(req_params);
  console.log("raw", raw);
  const result = lodash.union(res, raw.messages);
  console.log("result", result);
  if (raw?.response_metadata?.next_cursor) {
    return await getThread(
      token,
      channelId,
      ts,
      limit,
      raw?.response_metadata?.next_cursor,
      result
    );
  } else {
    return result;
  }
};

export const getUserProfile = (token, userId) => {
  return app.client.users.profile.get({
    token,
    user: userId,
  });
};
