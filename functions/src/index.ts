import * as BlogUrlSender from "./firestore/blog-url-sender";
import * as Slack from "./slack/app";

export const bolt = { ...Slack };
export const firestore = { ...BlogUrlSender };
