import { firestore } from "firebase-admin";

export type BlogIds = {
  slackUserId: string;
  slackChannelId: string;
  qiitaUserId: string | null;
  zennUserId: string | null;
  noteUserId: string | null;
  createdAt: firestore.Timestamp;
};
