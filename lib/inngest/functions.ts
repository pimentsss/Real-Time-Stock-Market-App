import { inngest } from "@/lib/inngest/client";
import { NEWS_SUMMARY_EMAIL_PROMPT, PERSONALIZED_WELCOME_EMAIL_PROMPT } from "@/lib/inngest/prompts";
import { sendNewsSummaryEmail, sendWelcomeEmail } from "@/lib/nodemailer";
import { getAllUsersForNewsEmail } from "@/lib/actions/user.actions";
import { getWatchlistSymbolsByEmail } from "@/lib/actions/watchlist.actions";
import { getNews } from "@/lib/actions/finnhub.actions";
import { getFormattedTodayDate, type MarketNewsArticle } from "@/lib/utils";

const GEMINI_MODEL = "gemini-2.5-flash-lite";

type GeminiResponse = { candidates?: { content?: { parts?: { text?: string }[] } }[] };
const textOf = (r: unknown) => {
  const part = (r as GeminiResponse)?.candidates?.[0]?.content?.parts?.[0];
  return part && "text" in part ? part.text : undefined;
};

export const sendSignUpEmail = inngest.createFunction(
  { id: "sign-up-email", triggers: { event: "app/user.created" } },
  async ({ event, step }) => {
    const userProfile = `
      - Country: ${event.data.country}
      - Investment goals: ${event.data.investmentGoals}
      - Risk tolerance: ${event.data.riskTolerance}
      - Preferred industry: ${event.data.preferredIndustry}
    `;
    const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace("{{userProfile}}", userProfile);

    const response = await step.ai.infer("generate-welcome-intro", {
      model: step.ai.models.gemini({ model: GEMINI_MODEL }),
      body: { contents: [{ role: "user", parts: [{ text: prompt }] }] },
    });

    await step.run("send-welcome-email", async () => {
      const intro =
        textOf(response) ||
        "Thanks for joining Signalist. You now have the tools to track markets and make smarter moves.";
      const { data: { email, name } } = event;
      return sendWelcomeEmail({ email, name, intro });
    });

    return { success: true, message: "Welcome email sent successfully" };
  },
);

export const sendDailyNewsSummary = inngest.createFunction(
  // Every day at 12:00 UTC, plus on-demand via event
  { id: "daily-news-summary", triggers: [{ event: "app/send.daily.news" }, { cron: "0 12 * * *" }] },
  async ({ step }) => {
    // 1. Users who should get the email
    const users = await step.run("get-all-users", getAllUsersForNewsEmail);
    if (!users || users.length === 0) return { success: false, message: "No users found for news email" };

    // 2. Personalized news per user (watchlist symbols, else general market news)
    const results = await step.run("fetch-user-news", async () => {
      const perUser: { user: (typeof users)[number]; articles: MarketNewsArticle[] }[] = [];
      for (const user of users) {
        try {
          const symbols = await getWatchlistSymbolsByEmail(user.email);
          let articles = await getNews(symbols);
          articles = (articles || []).slice(0, 6);
          if (!articles.length) articles = ((await getNews()) || []).slice(0, 6);
          perUser.push({ user, articles });
        } catch (e) {
          console.error("daily-news: error preparing user news", user.email, e);
          perUser.push({ user, articles: [] });
        }
      }
      return perUser;
    });

    // 3. AI summary per user
    const userNewsSummaries: { user: (typeof users)[number]; newsContent: string | null }[] = [];
    for (const { user, articles } of results) {
      try {
        const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace("{{newsData}}", JSON.stringify(articles, null, 2));
        const response = await step.ai.infer(`summarize-news-${user.email}`, {
          model: step.ai.models.gemini({ model: GEMINI_MODEL }),
          body: { contents: [{ role: "user", parts: [{ text: prompt }] }] },
        });
        userNewsSummaries.push({ user, newsContent: textOf(response) || "No market news." });
      } catch (e) {
        console.error("Failed to summarize news for:", user.email, e);
        userNewsSummaries.push({ user, newsContent: null });
      }
    }

    // 4. Send emails
    await step.run("send-news-emails", async () => {
      await Promise.all(
        userNewsSummaries.map(async ({ user, newsContent }) => {
          if (!newsContent) return false;
          return sendNewsSummaryEmail({ email: user.email, date: getFormattedTodayDate(), newsContent });
        }),
      );
    });

    return { success: true, message: "Daily news summary emails sent successfully" };
  },
);
