import { App, ExpressReceiver } from "@slack/bolt";
import * as functions from "firebase-functions";
import { useMonthlyBlogReportCommand } from "./commands/monthly";

const config = functions.config();

export const expressReceiver = new ExpressReceiver({
  signingSecret: config.slack.secret,
  endpoints: "/events",
  processBeforeResponse: true,
});

const app = new App({
  receiver: expressReceiver,
  token: config.slack.token,
});

useMonthlyBlogReportCommand(app);
