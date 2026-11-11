const shell = (body: string) => `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#050505;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#050505;">
<tr><td align="center" style="padding:40px 20px;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#141414;border-radius:8px;border:1px solid #30333A;">
<tr><td style="padding:40px 40px 20px;"><span style="font-size:24px;font-weight:700;color:#FDD458;">Signalist</span></td></tr>
<tr><td style="padding:0 40px 40px;color:#CCDADC;font-size:16px;line-height:1.6;">${body}</td></tr>
<tr><td style="padding:0 40px 40px;color:#9095A1;font-size:13px;">Signalist · You're receiving this because you signed up.<br>
<a href="${process.env.NEXT_PUBLIC_BASE_URL ?? "#"}" style="color:#9095A1;">Visit Signalist</a></td></tr>
</table></td></tr></table></body></html>`;

export const WELCOME_EMAIL_TEMPLATE = shell(`
<h1 style="margin:0 0 30px;font-size:24px;font-weight:600;color:#FDD458;">Welcome aboard {{name}}</h1>
{{intro}}
<p style="margin:0 0 15px;font-weight:600;color:#fff;">Here's what you can do right now:</p>
<ul style="margin:0 0 30px;padding-left:20px;">
<li style="margin-bottom:12px;">Set up your watchlist to follow your favorite stocks</li>
<li style="margin-bottom:12px;">Explore live charts, heatmaps and company details</li>
<li style="margin-bottom:12px;">Get a daily AI summary of the news that matters to you</li>
</ul>
<a href="${process.env.NEXT_PUBLIC_BASE_URL ?? "#"}" style="display:inline-block;background:linear-gradient(135deg,#FDD458 0%,#E8BA40 100%);color:#000;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:500;">Go to Dashboard</a>
`);

export const NEWS_SUMMARY_EMAIL_TEMPLATE = shell(`
<h1 style="margin:0 0 20px;font-size:24px;font-weight:600;color:#FDD458;">Market News Summary Today</h1>
<p style="margin:0 0 30px;font-size:14px;color:#6b7280;">{{date}}</p>
{{newsContent}}
`);
