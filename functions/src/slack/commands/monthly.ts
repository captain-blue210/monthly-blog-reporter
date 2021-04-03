import { App } from "@slack/bolt";
import * as admin from "firebase-admin";
import { firestore } from "firebase-admin";
import * as funcitons from "firebase-functions";

const VIEW_ID = "monthly";

const config = funcitons.config();
const db = admin.initializeApp().firestore();

export const useMonthlyBlogReportCommand = (app: App): void => {
  app.command("/monthly", async ({ ack, body, context, command }) => {
    await ack();

    const snapshot = await db
      .collection("blog-ids")
      .where("slackUserId", "==", body.user_id)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    const blogIds = {
      qiitaUserId: "",
      zennUserId: "",
      noteUserId: "",
    };

    snapshot.forEach((doc) => {
      blogIds.qiitaUserId = doc.data().qiitaUserId;
      blogIds.zennUserId = doc.data().zennUserId;
      blogIds.noteUserId = doc.data().noteUserId;
    });

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
                initial_value: blogIds.qiitaUserId,
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
                initial_value: blogIds.zennUserId,
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
                initial_value: blogIds.noteUserId,
              },
              label: {
                type: "plain_text",
                text: "note",
                emoji: true,
              },
            },
            {
              type: "input",
              block_id: "month",
              element: {
                action_id: "month_id",
                type: "static_select",
                placeholder: {
                  type: "plain_text",
                  text: "月を選択",
                },
                options: [
                  {
                    text: {
                      type: "plain_text",
                      text: "1月",
                    },
                    value: "1",
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "2月",
                    },
                    value: "2",
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "3月",
                    },
                    value: "3",
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "4月",
                    },
                    value: "4",
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "5月",
                    },
                    value: "5",
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "6月",
                    },
                    value: "6",
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "7月",
                    },
                    value: "7",
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "8月",
                    },
                    value: "8",
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "9月",
                    },
                    value: "9",
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "10月",
                    },
                    value: "10",
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "11月",
                    },
                    value: "11",
                  },
                  {
                    text: {
                      type: "plain_text",
                      text: "12月",
                    },
                    value: "12",
                  },
                ],
              },
              label: {
                type: "plain_text",
                text: "記事一覧を取得したい月を入力してください",
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
        token: config.slack.token,
        channel: body.channel_id,
        user: body.user_id,
        text:
          "モーダル表示時にエラーが発生しました。アプリ管理者に問い合わせてください。",
      });
    }
  });

  app.view(VIEW_ID, async ({ ack, view, body }) => {
    await ack();

    const channelId = view.private_metadata;
    const qiitaUserId = view.state.values.qiita.qiita_user_id.value;
    const zennUserId = view.state.values.zenn.zenn_user_id.value;
    const noteUserId = view.state.values.note.note_user_id.value;
    const month = view.state.values.month.month_id.selected_option.value;

    try {
      await db.collection("blog-ids").add({
        slackUserId: body.user.id,
        slackChannelId: channelId,
        qiitaUserId: qiitaUserId,
        zennUserId: zennUserId,
        noteUserId: noteUserId,
        month: month,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.log(error);
      await app.client.chat.postEphemeral({
        token: config.slack.token,
        channel: channelId,
        user: body.user.id,
        text:
          "データ登録時にエラーが発生しました。アプリ管理者に問い合わせてください。",
      });
    }
  });
};
