import * as playwright from "playwright-aws-lambda";

const options = {
  headless: true,
  args: ["--no-sandbox"],
};

const BASE_URL = "https://zenn.dev";

export const getZennArticleUrlsOfMonth = async (
  userId: string | null,
  month: string,
): Promise<string> => {
  if (!userId) {
    return "ZennのユーザーIDは登録されていません。";
  }

  const USER_ARTICLE_PAGE = `${BASE_URL}/${userId}`;
  const browser = await playwright.launchChromium(options);
  const page = await browser.newPage();
  await page.goto(USER_ARTICLE_PAGE);

  for (;;) {
    const hasLoadButton = await page.$("button.ButtonLoad_button__1gh7L");

    if (!hasLoadButton) {
      break;
    }

    const button = await page.waitForSelector(
      "button.ButtonLoad_button__1gh7L",
    );

    await button.click();

    const hasMoreLoadButton = await page
      .$("button.ButtonLoad_button__1gh7L")
      .then((res) => !!res);
    if (!hasMoreLoadButton) {
      break;
    }
  }

  console.log("---start zenn scraping---");
  const args = { BASE_URL, month };
  const result = await page.$$eval(
    "article",
    (list, args) =>
      list
        .filter((elm) => {
          const getLastDayOfMonth = (month: string): Date => {
            const date = new Date();
            date.setMonth(parseInt(month) - 1);
            return new Date(date.getFullYear(), date.getMonth() + 1, 0);
          };

          const getFirstDayOfMonth = (month: string): Date => {
            const date = new Date();
            date.setMonth(parseInt(month) - 1);
            return new Date(date.getFullYear(), date.getMonth(), 1);
          };

          const firstDayOfMonth = getFirstDayOfMonth(args.month);
          const lastDayOfMonth = getLastDayOfMonth(args.month);
          const publishedAt: Date = new Date(
            elm
              ?.querySelector("article time")
              ?.getAttribute("datetime") as string,
          );
          return (
            publishedAt >= firstDayOfMonth && publishedAt <= lastDayOfMonth
          );
        })
        .map((elm) =>
          elm
            .querySelector("article > a:nth-child(2)")
            ?.getAttribute("href")
            ?.toString(),
        )
        .map((ref) => `${args.BASE_URL}${ref}`),
    args,
  );
  console.log(result);
  browser?.close();
  return result.length > 0
    ? result.join("\n")
    : `${month}月に書いたZennの記事はありませんでした。`;
  // const url = `${BASE_URL}${userId}`;
  // const firstDayOfMonth = getFirstDayOfMonth(month);
  // const lastDayOfMonth = getLastDayOfMonth(month);

  // const response = await axios.get<ZennArticles>(url);
  // const urlList: string[] = response.data.articles
  //   .filter((item) => {
  //     const publishedAt: Date = new Date(item.published_at);
  //     return publishedAt >= firstDayOfMonth && publishedAt <= lastDayOfMonth;
  //   })
  //   .map(
  //     (item) => `https://zenn.dev/${item.user.username}/articles/${item.slug}`,
  //   );
};
