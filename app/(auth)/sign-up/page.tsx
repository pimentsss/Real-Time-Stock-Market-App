"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import CountrySelectField from "@/components/forms/CountrySelectField";
import FooterLink from "@/components/forms/FooterLink";
import { INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from "@/lib/constants";
import { signUpWithEmail, type SignUpFormData } from "@/lib/actions/auth.actions";

export default function SignUp() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpFormData>({
    defaultValues: { fullName: "", email: "", password: "", country: "US", investmentGoals: "Growth", riskTolerance: "Medium", preferredIndustry: "Technology" },
    mode: "onBlur",
  });

  const onSubmit = async (data: SignUpFormData) => {
    const result = await signUpWithEmail(data);
    if (result.success) router.push("/");
    else toast.error("Sign up failed", { description: result.error ?? "Failed to create an account." });
  };

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold text-gray-100">Sign Up & Personalize</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField name="fullName" label="Full Name" placeholder="John Doe" register={register} error={errors.fullName}
          validation={{ required: "Full name is required", minLength: { value: 2, message: "Full name must be at least 2 characters" } }} />
        <InputField name="email" label="Email" placeholder="contact@example.com" type="email" register={register} error={errors.email}
          validation={{ required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Please enter a valid email address" } }} />
        <InputField name="password" label="Password" placeholder="Enter a strong password" type="password" register={register} error={errors.password}
          validation={{ required: "Password is required", minLength: { value: 8, message: "Password must be at least 8 characters" } }} />
        <CountrySelectField name="country" label="Country" register={register} error={errors.country} required />
        <SelectField name="investmentGoals" label="Investment Goals" placeholder="Select your investment goal" options={INVESTMENT_GOALS} register={register} error={errors.investmentGoals} required />
        <SelectField name="riskTolerance" label="Risk Tolerance" placeholder="Select your risk level" options={RISK_TOLERANCE_OPTIONS} register={register} error={errors.riskTolerance} required />
        <SelectField name="preferredIndustry" label="Preferred Industry" placeholder="Select your preferred industry" options={PREFERRED_INDUSTRIES} register={register} error={errors.preferredIndustry} required />
        <button type="submit" disabled={isSubmitting} className="yellow-btn mt-5">
          {isSubmitting ? "Creating Account..." : "Start Your Investing Journey"}
        </button>
        <FooterLink text="Already have an account?" linkText="Sign in" href="/sign-in" />
      </form>
    </>
  );
}
