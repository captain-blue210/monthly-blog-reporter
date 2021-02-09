import axios from "axios";
import { getFirstDayOfMonth, getLastDayOfMonth } from "../date/date-getter";
import { ZennArticles } from "../types/zenn-types";

const BASE_URL = "https://api.zenn.dev/articles?username=";

export const getZennArticles = async (userId: string): Promise<string[]> => {
  const url = `${BASE_URL}${userId}`;
  const firstDayOfMonth: Date = getFirstDayOfMonth(new Date());
  const lastDayOfMonth: Date = getLastDayOfMonth(new Date());

  const response = await axios.get<ZennArticles>(url);
  const urlList: string[] = response.data.articles
    .filter((item) => {
      const publishedAt: Date = new Date(item.published_at);
      return publishedAt >= firstDayOfMonth && publishedAt < lastDayOfMonth;
    })
    .map(
      (item) => `https://zenn.dev/${item.user.username}/articles/${item.slug}`
    );
  return urlList;
};
