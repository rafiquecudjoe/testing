import fetch from "node-fetch";
import { URLSearchParams } from "url";
import { compact } from "lodash";

import prisma from "../../prisma";
import { analyzeSentiment } from "../infra/sentiment";
import { getUserIdList } from "../util/getUserIdList";
import { RequestHandler } from "express";

type SlackApiParam = {
  team_id?: string;
  team_domain?: string;
  channel_id?: string;
  channel_name?: string;
  user_id?: string;
  user_name?: string;
  command?: string;
  text?: string;
  api_app_id?: string;
  response_url?: string;
  trigger_id?: string;
};

export const kithomeru: RequestHandler = async (event) => {
  try {
    const param: SlackApiParam = [
      ...new URLSearchParams(event.body).entries(),
    ].reduce((obj, e) => ({ ...obj, [e[0]]: e[1] }), {} as SlackApiParam);
    const slackUserPromises = getUserIdList(param?.text || "").map(
      async (userName) => {
        return await prisma.slack_users.findFirst({
          where: {
            name: userName,
          },
        });
      }
    );

    const toSlackUsers = compact(await Promise.all(slackUserPromises));

    if (toSlackUsers.length) {
      const result = await analyzeSentiment(param?.text || "");

      const payload = toSlackUsers.map((tsu) => {
        return {
          channel_id: param.channel_id,
          channel_name: param.channel_name,
          team_id: param.team_id,
          team_domain: param.team_domain,
          user_id: tsu.id || param.user_id,
          user_name: tsu.name || param.user_name,
          command: param.command,
          text: param.text,
          api_app_id: param.api_app_id,
          trigger_id: param.trigger_id,
          response_url: param.response_url,
          magnitude: result?.magnitude,
          score: result?.score,
        };
      });

      await prisma.praises.createMany({ data: payload });
    }

    const responseMessage = [
      "褒めたよ",
      "すごい！ほめた！",
      "褒め褒め褒め褒め褒め褒め褒め褒め褒め褒め褒めた",
      "イケてる！かっこいい！",
    ];
    const messageIdx = Math.floor(Math.random() * responseMessage.length);

    const webhookBody = {
      channel: `@${param.user_id}`,
      username: "kitkatbot",
      text: responseMessage[messageIdx],
      icon_emoji: ":6_ほめる2:",
    };
    await fetch(process.env.WEBHOOK_URL, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
      },
      method: "POST",
      body: `payload=${JSON.stringify(webhookBody)}`,
    });

    return {
      statusCode: 200,
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        response_type: "in_channel",
      }),
    };
  } catch (e) {
    console.error("error", e);
    return {
      statusCode: 500,
      body: e,
    };
  }
};
