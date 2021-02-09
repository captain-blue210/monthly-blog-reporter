import axios from "axios";
import { Article, NoteArticles } from "../types/note-types";

const BASE_URL = "https://note.com/api/v2/creators";

export const getNoteArticles = async (userId: string): Promise<string[]> => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const url = `${BASE_URL}/${userId}/contents?kind=note&publish_on=${year}-${month}&disabled_pinned=true`;

  const response = await axios.get<NoteArticles>(url);
  const urlList: string[] = response.data.data.contents.map(
    (item: Article) => item.noteUrl
  );
  return urlList;
};
