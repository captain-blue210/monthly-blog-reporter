import { App } from "@slack/bolt";
import * as funcitons from "firebase-functions";
import { getNoteArticles } from "../../blog/note-client";
import { getQiitaArticles } from "../../blog/qiita-client";
import { getZennArticles } from "../../blog/zenn-client";

const VIEW_ID = "monthly";

const config = funcitons.config();

export const useMonthlyBlogReportCommand = (app: App) => {
  app.command("/monthly", async ({ ack, body, context, command }) => {
    ack();

    try {
      await app.client.views.open({
        token: context.botToken,
        trigger_id: body.trigger_id,
        view: {
          type: "modal",
          callback_id: VIEW_ID,
          title: {
            type: "plain_text",
            text: "Monthly Blog Reporter",
          },
          blocks: [
            {
              type: "input",
              optional: true,
              block_id: "qiita",
              element: {
                type: "plain_text_input",
                action_id: "qiita_user_id",
                placeholder: {
                  type: "plain_text",
                  text: "QiitaユーザーID（@を除く）",
                },
              },
              label: {
                type: "plain_text",
                text: "Qiita",
                emoji: true,
              },
            },
            {
              type: "input",
              optional: true,
              block_id: "zenn",
              element: {
                type: "plain_text_input",
                action_id: "zenn_user_id",
                placeholder: {
                  type: "plain_text",
                  text: "ZennユーザーID（@を除く）",
                },
              },
              label: {
                type: "plain_text",
                text: "Zenn",
                emoji: true,
              },
            },
            {
              type: "input",
              optional: true,
              block_id: "note",
              element: {
                type: "plain_text_input",
                action_id: "note_user_id",
                placeholder: {
                  type: "plain_text",
                  text: "noteユーザーID（@を除く）",
                },
              },
              label: {
                type: "plain_text",
                text: "note",
                emoji: true,
              },
            },
          ],
          private_metadata: command.channel_id,
          submit: {
            type: "plain_text",
            text: "取得",
          },
          close: {
            type: "plain_text",
            text: "Cancel",
            emoji: true,
          },
        },
      });
    } catch (error) {
      console.log(error);
      await app.client.chat.postEphemeral({
        token: config.slack.bot_token,
        channel: body.channel_id,
        user: body.user.id,
        text:
          "モーダル表示時にエラーが発生しました。アプリ管理者に問い合わせてください。",
      });
    }
  });

  app.view(VIEW_ID, async ({ ack, context, view, body }) => {
    await ack();

    const channelId = view.private_metadata;
    const qiitaUserId = view.state.values.qiita.qiita_user_id.value;
    const zennUserId = view.state.values.zenn.zenn_user_id.value;
    const noteUserId = view.state.values.note.note_user_id.value;

    try {
      const qiitaArticles: string[] = await getQiitaArticles(qiitaUserId);
      const zennArticles: string[] = await getZennArticles(zennUserId);
      const noteArticles: string[] = await getNoteArticles(noteUserId);

      await app.client.chat.postMessage({
        token: context.conte,
        channel: channelId,
        text: "",
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "月に書いた記事URL一覧",
              emoji: true,
            },
          },
          {
            type: "divider",
          },
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "Qiita",
              emoji: true,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: qiitaArticles.join("\n"),
            },
          },
          {
            type: "divider",
          },
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "Zenn",
              emoji: true,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: zennArticles.join("\n"),
            },
          },
          {
            type: "divider",
          },
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "note",
              emoji: true,
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: noteArticles.join("\n"),
            },
          },
        ],
      });
    } catch (error) {
      console.log(error);
      await app.client.chat.postEphemeral({
        token: config.slack.bot_token,
        channel: channelId,
        user: body.user.id,
        text:
          "データ表示時にエラーが発生しました。アプリ管理者に問い合わせてください。",
      });
    }
  });
};
