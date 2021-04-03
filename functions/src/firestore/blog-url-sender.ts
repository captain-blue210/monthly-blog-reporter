import { App } from "@slack/bolt";
import * as functions from "firebase-functions";
import { getNoteArticleUrlsOfMonth } from "../blog/note-client";
import { getQiitaArticleUrlsOfMonth } from "../blog/qiita-client";
import { getZennArticleUrlsOfMonth } from "../blog/zenn-client";
import { BlogIds } from "../types/blogids-types";

const config = functions.config();

const app = new App({
  signingSecret: config.slack.secret,
  token: config.slack.token,
  processBeforeResponse: true,
});

app.error(async (e) => {
  console.log(e);
});

export const onCreate = functions
  .region("asia-northeast1")
  .firestore.document("blog-ids/{docId}")
  .onCreate(async (snapshot) => {
    const data: BlogIds = snapshot.data() as BlogIds;

    try {
      const qiitaUrls = await getQiitaArticleUrlsOfMonth(
        data.qiitaUserId,
        data.month,
      );
      const zennUrls = await getZennArticleUrlsOfMonth(
        data.zennUserId,
        data.month,
      );
      const noteUrls = await getNoteArticleUrlsOfMonth(
        data.noteUserId,
        data.month,
      );

      await app.client.chat.postMessage({
        token: config.slack.token,
        channel: data.slackChannelId,
        text: "",
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: `${data.month}月に書いた記事URL一覧`,
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
              text: qiitaUrls,
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
              text: zennUrls,
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
              text: noteUrls,
            },
          },
        ],
      });
    } catch (error) {
      console.log(error);
      await app.client.chat.postEphemeral({
        token: config.slack.token,
        channel: data.slackChannelId,
        user: data.slackUserId,
        text:
          "記事一覧取得時にエラーが発生しました。アプリ管理者に問い合わせてください。",
      });
    }
  });
