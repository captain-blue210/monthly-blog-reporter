export interface ZennArticles {
  articles: Article[];
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  published: boolean;
  comments_count: number;
  liked_count: number;
  body_letters_count: number;
  reading_time: number;
  article_type: string;
  emoji: string;
  is_suspending_private: boolean;
  published_at: string;
  body_updated_at: string | null;
  source_repo_updated_at: string;
  created_at: string;
  updated_at: string;
  user: User;
  topics: Topic[];
}

export interface User {
  id: number;
  username: string;
  name: string;
  avatar_small_url: string;
}

export interface Topic {
  id: number;
  name: string;
  display_name: string;
  taggings_count: number;
  image_url: string;
}
