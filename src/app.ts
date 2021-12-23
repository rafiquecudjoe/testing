import { App, ExpressReceiver } from "@slack/bolt";
import * as dotenv from "dotenv";
import { installer } from "./installProvider";
import express from "express";
import {
  noBotMessages,
  messageEventController,
} from "./controller/messageEvent";
dotenv.config();
// console.log(process.env);
export const receiver = new ExpressReceiver({
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  signingSecret: process.env.SLACK_SIGNING_SECRET || "",
  endpoints: { events: "/slack/events" },
});
const boltApp = new App({
  receiver,
  authorize: installer.authorize,
  // clientId: // MEMO: installProviderで設定
  // clientSecret: // MEMO: installProviderで設定
  signingSecret: process.env.SLACK_SIGNING_SECRET, // MEMO: api clientのために必要
});

boltApp.message(noBotMessages, messageEventController);
import "./controller/route";

const expressApp = express();

expressApp.use("/", receiver.router);
export { expressApp, boltApp };
