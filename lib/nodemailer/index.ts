import nodemailer from "nodemailer";
import { NEWS_SUMMARY_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from "./templates";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.NODEMAILER_EMAIL, pass: process.env.NODEMAILER_PASSWORD },
});

const from = () => `"Signalist" <${process.env.NODEMAILER_EMAIL}>`;

export const sendWelcomeEmail = async ({ email, name, intro }: { email: string; name: string; intro: string }) => {
  const html = WELCOME_EMAIL_TEMPLATE.replace("{{name}}", name).replace("{{intro}}", intro);
  await transporter.sendMail({
    from: from(),
    to: email,
    subject: "Welcome to Signalist - your stock market toolkit is ready!",
    text: "Thanks for joining Signalist",
    html,
  });
};

export const sendNewsSummaryEmail = async ({ email, date, newsContent }: { email: string; date: string; newsContent: string }) => {
  const html = NEWS_SUMMARY_EMAIL_TEMPLATE.replace("{{date}}", date).replace("{{newsContent}}", newsContent);
  await transporter.sendMail({
    from: from(),
    to: email,
    subject: `📈 Market News Summary Today - ${date}`,
    text: "Today's market news summary from Signalist",
    html,
  });
};
