import { firestore } from "firebase-admin";

export type BlogIds = {
  slackUserId: string;
  slackChannelId: string;
  qiitaUserId: string | null;
  zennUserId: string | null;
  noteUserId: string | null;
  month: string;
  createdAt: firestore.Timestamp;
};
