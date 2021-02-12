import axios from "axios";
import { getFirstDayOfMonth, getLastDayOfMonth } from "../date/date-getter";
import { ZennArticles } from "../types/zenn-types";

const BASE_URL = "https://api.zenn.dev/articles?username=";

export const getZennArticleUrlsOfMonth = async (
  userId: string | null
): Promise<string> => {
  if (!userId) {
    return "ZennのユーザーIDは登録されていません。";
  }

  const url = `${BASE_URL}${userId}`;
  const now = new Date();
  const firstDayOfMonth = getFirstDayOfMonth(now);
  const lastDayOfMonth = getLastDayOfMonth(now);

  const response = await axios.get<ZennArticles>(url);
  const urlList: string[] = response.data.articles
    .filter((item) => {
      const publishedAt: Date = new Date(item.published_at);
      return publishedAt >= firstDayOfMonth && publishedAt <= lastDayOfMonth;
    })
    .map(
      (item) => `https://zenn.dev/${item.user.username}/articles/${item.slug}`
    );

  return urlList.length > 0
    ? urlList.join("\n")
    : `${now.getMonth() + 1}月に書いたZennの記事はありませんでした。`;
};
