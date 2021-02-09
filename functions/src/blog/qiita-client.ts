import axios from "axios";
import { getFirstDayOfMonth, getLastDayOfMonth } from "../date/date-getter";
import { Item } from "../types/qiita-types";

const BASE_URL = "https://qiita.com/api/v2/users/";

export const getQiitaArticles = async (userId: string): Promise<string[]> => {
  const url = `${BASE_URL}/${userId}/items`;
  const firstDayOfMonth = getFirstDayOfMonth(new Date());
  const lastDayOfMonth = getLastDayOfMonth(new Date());

  const response = await axios.get<Item[]>(url);
  const urlList: string[] = response.data
    .filter((item) => {
      const createdAt: Date = new Date(item.created_at);
      return createdAt >= firstDayOfMonth && createdAt < lastDayOfMonth;
    })
    .map((item) => item.url);
  return urlList;
};
