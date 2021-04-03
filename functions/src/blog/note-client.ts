import axios from "axios";
import { getMonthStr } from "../date/date-getter";
import { Article, NoteArticles } from "../types/note-types";

const BASE_URL = "https://note.com/api/v2/creators";

export const getNoteArticleUrlsOfMonth = async (
  userId: string | null,
  month: string,
): Promise<string> => {
  if (!userId) {
    return "noteのユーザーIDは登録されていません。";
  }

  const year = new Date().getFullYear();
  const monthStr = getMonthStr(month);

  const url = `${BASE_URL}/${userId}/contents?kind=note&publish_on=${year}-${monthStr}&disabled_pinned=true`;

  const response = await axios.get<NoteArticles>(url);
  const urlList: string[] = response.data.data.contents.map(
    (item: Article) => item.noteUrl,
  );

  return urlList.length > 0
    ? urlList.join("\n")
    : `${monthStr}月に書いたnoteの記事はありませんでした。`;
};
