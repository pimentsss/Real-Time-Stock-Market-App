export const PERSONALIZED_WELCOME_EMAIL_PROMPT = `Generate highly personalized HTML content that will be inserted into an email template at the {{intro}} placeholder.

User profile data:
{{userProfile}}

PERSONALIZATION REQUIREMENTS:
- Reference the user's investment goals, risk tolerance and preferred industry directly.
- Keep it to 2 sentences, about 35-50 words, warm and encouraging.
- Do NOT start with "Welcome" (the template already says it). Use openers like "Thanks for joining Signalist!" or "Great to have you aboard!".

FORMAT:
- Return ONLY clean HTML, no markdown, no code fences, no commentary.
- Wrap it in a single <p class="mobile-text" style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;"> tag.
- Use <strong style="color: #FDD458;"> for key personalized phrases.`;

export const NEWS_SUMMARY_EMAIL_PROMPT = `Generate HTML content for a market news summary email that will be inserted into the NEWS_SUMMARY_EMAIL_TEMPLATE at the {{newsContent}} placeholder.

News data to summarize:
{{newsData}}

REQUIREMENTS:
- Group the news into 2-3 sections with <h3 style="margin:30px 0 15px;font-size:18px;font-weight:600;color:#f8f9fa;"> headings (e.g. "📊 Market Overview", "📈 Top Gainers", "🏢 Company News").
- For each article write a short card: a <div style="background:#212328;padding:24px;margin:20px 0;border-radius:8px;"> containing an <h4 style="margin:0 0 16px;font-size:18px;color:#FFFFFF;"> plain-English title, 2-3 bullet points (<ul>/<li style="color:#CCDADC;">) explaining what happened and why it matters to a regular investor, a "💡 Bottom Line:" sentence, and an <a href="ARTICLE_URL" style="color:#FDD458;">Read Full Story →</a> link using the article's real URL.
- Use simple, jargon-free language.

FORMAT:
- Return ONLY clean HTML, no markdown, no code fences, no commentary.`;
