import axios from "axios";
import { getFirstDayOfMonth, getLastDayOfMonth } from "../date/date-getter";
import { Item } from "../types/qiita-types";

const BASE_URL = "https://qiita.com/api/v2/users/";

export const getQiitaArticleUrlsOfMonth = async (
  userId: string | null,
  month: string,
): Promise<string> => {
  if (!userId) {
    return "QiitaのユーザーIDは登録されていません。";
  }

  const url = `${BASE_URL}/${userId}/items`;
  const firstDayOfMonth = getFirstDayOfMonth(month);
  const lastDayOfMonth = getLastDayOfMonth(month);

  const response = await axios.get<Item[]>(url);
  const urlList: string[] = response.data
    .filter((item) => {
      const createdAt: Date = new Date(item.created_at);
      return createdAt >= firstDayOfMonth && createdAt <= lastDayOfMonth;
    })
    .map((item) => item.url);

  return urlList.length > 0
    ? urlList.join("\n")
    : `${month}月に書いたQiitaの記事はありませんでした。`;
};
