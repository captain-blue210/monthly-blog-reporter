export interface NoteArticles {
  data: Contents;
}

export interface Contents {
  contents: Article[];
  isLastPage: boolean;
  totalCount: number;
}

export interface Article {
  id: number;
  type: string;
  status: string;
  name: string;
  description: string | null;
  price: number;
  key: string;
  slug: string;
  publishAt: string;
  thumbnailExternalUrl: string;
  eyecatch: string;
  user: User;
  canRead: boolean;
  isAuthor: boolean;
  externalUrl: string | null;
  body: string;
  separator: string | null;
  isLimited: boolean;
  isTrial: boolean;
  canUpdate: boolean;
  tweetText: string;
  additionalAttr: {
    index: [
      {
        name: string;
        body: string;
      }
    ];
  };
  isRefund: boolean;
  commentCount: number;
  likes: string[];
  likeCount: number;
  anonymousLikeCount: number;
  isLiked: boolean;
  disableComment: boolean;
  hashtags: [
    {
      hashtag: {
        name: string;
      };
    }
  ];
  twitterShareUrl: string;
  facebookShareUrl: string;
  lineShareUrl: string;
  audio: unknown;
  pictures: unknown[];
  limitedMessage: string | null;
  labels: string[] | [];
  priorSale: unknown | null;
  canMultipleLimitedNote: boolean;
  hasEmbeddedContent: boolean;
  isPinned: boolean;
  pinnedUserNoteId: number | null;
  isTreasuredNote: boolean;
  spEyecatch: string;
  enableBacktoDraft: boolean;
  notificationMessages: string[] | [];
  isProfiled: boolean;
  isForWork: boolean;
  isCircleDescription: boolean;
  noteDraft: unknown | null;
  noteUrl: string;
}

export interface User {
  id: number;
  name: string;
  urlname: string;
  nickname: string;
  userProfileImagePath: string;
  customDomain: string | null;
  disableSupport: boolean;
  emailConfirmedFlag: boolean;
  likeAppealText: string | null;
  likeAppealImage: string | null;
  purchaseAppealTextNote: string | null;
  twitterNickname: string | null;
  shareAppeal: {
    text: string | null;
    image: string | null;
  };
  magazineAddAppeal: {
    text: string | null;
    image: string | null;
  };
}
