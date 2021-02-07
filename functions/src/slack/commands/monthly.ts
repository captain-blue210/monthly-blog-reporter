import { App } from "@slack/bolt";

export const useMonthlyBlogReportCommand = (app: App) => {
  app.command("/monthly", async ({ command, ack, say }) => {
    ack();
    say(`Hello, ${command.text}`);
  });
};
