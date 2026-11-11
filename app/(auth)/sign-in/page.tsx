"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import InputField from "@/components/forms/InputField";
import FooterLink from "@/components/forms/FooterLink";
import { signInWithEmail, type SignInFormData } from "@/lib/actions/auth.actions";

export default function SignIn() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInFormData>({
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  const onSubmit = async (data: SignInFormData) => {
    const result = await signInWithEmail(data);
    if (result.success) router.push("/");
    else toast.error("Sign in failed", { description: result.error ?? "Failed to sign in." });
  };

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold text-gray-100">Log In Your Account</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField name="email" label="Email" placeholder="contact@example.com" type="email" register={register} error={errors.email}
          validation={{ required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Please enter a valid email address" } }} />
        <InputField name="password" label="Password" placeholder="Enter your password" type="password" register={register} error={errors.password}
          validation={{ required: "Password is required", minLength: { value: 8, message: "Password must be at least 8 characters" } }} />
        <button type="submit" disabled={isSubmitting} className="yellow-btn mt-5">
          {isSubmitting ? "Signing In..." : "Sign In"}
        </button>
        <FooterLink text="Don't have an account?" linkText="Create an account" href="/sign-up" />
      </form>
    </>
  );
}
