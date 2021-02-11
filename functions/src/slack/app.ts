import { App, ExpressReceiver } from "@slack/bolt";
import * as functions from "firebase-functions";
import { useMonthlyBlogReportCommand } from "./commands/monthly";

const config = functions.config();

const expressReceiver = new ExpressReceiver({
  signingSecret: config.slack.secret,
  endpoints: "/events",
  processBeforeResponse: true,
});

const app = new App({
  receiver: expressReceiver,
  token: config.slack.token,
  processBeforeResponse: true,
});

useMonthlyBlogReportCommand(app);

export const slack = functions
  .region("asia-northeast1")
  .https.onRequest(expressReceiver.app);
