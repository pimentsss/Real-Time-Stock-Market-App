import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { connectToDatabase } from "@/database/mongoose";

const createAuth = (db: Parameters<typeof mongodbAdapter>[0]) =>
  betterAuth({
    database: mongodbAdapter(db),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    emailAndPassword: {
      enabled: true,
      disableSignUp: false,
      requireEmailVerification: false,
      minPasswordLength: 8,
      maxPasswordLength: 128,
      autoSignIn: true,
    },
    plugins: [nextCookies()],
  });

let authInstance: ReturnType<typeof createAuth> | null = null;

// Lazily build auth once Mongo is connected (shares the mongoose connection).
export const getAuth = async () => {
  if (authInstance) return authInstance;
  const mongoose = await connectToDatabase();
  const db = mongoose.connection.db;
  if (!db) throw new Error("MongoDB connection not found");

  // mongoose bundles its own mongodb driver; the Db shape is the same
  authInstance = createAuth(db as unknown as Parameters<typeof mongodbAdapter>[0]);
  return authInstance;
};
