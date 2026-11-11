"use server";

import { headers } from "next/headers";
import { getAuth } from "@/lib/better-auth/auth";
import { inngest } from "@/lib/inngest/client";

export type SignUpFormData = {
  fullName: string;
  email: string;
  password: string;
  country: string;
  investmentGoals: string;
  riskTolerance: string;
  preferredIndustry: string;
};

export type SignInFormData = { email: string; password: string };

const errorMessage = (e: unknown, fallback: string) => (e instanceof Error && e.message ? e.message : fallback);

export const signUpWithEmail = async ({ email, password, fullName, country, investmentGoals, riskTolerance, preferredIndustry }: SignUpFormData) => {
  try {
    const auth = await getAuth();
    const response = await auth.api.signUpEmail({ body: { email, password, name: fullName } });
    if (response) {
      // Kicks off the AI-personalized welcome email
      await inngest.send({
        name: "app/user.created",
        data: { email, name: fullName, country, investmentGoals, riskTolerance, preferredIndustry },
      });
    }
    return { success: true };
  } catch (e) {
    console.log("Sign up failed", e);
    return { success: false, error: errorMessage(e, "Sign up failed") };
  }
};

export const signInWithEmail = async ({ email, password }: SignInFormData) => {
  try {
    const auth = await getAuth();
    await auth.api.signInEmail({ body: { email, password } });
    return { success: true };
  } catch (e) {
    console.log("Sign in failed", e);
    return { success: false, error: errorMessage(e, "Sign in failed") };
  }
};

export const signOut = async () => {
  try {
    const auth = await getAuth();
    await auth.api.signOut({ headers: await headers() });
  } catch (e) {
    console.log("Sign out failed", e);
    return { success: false, error: "Sign out failed" };
  }
};
