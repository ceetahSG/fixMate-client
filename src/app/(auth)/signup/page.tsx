"use client";

import { useState } from "react";
import Link from "next/link";
import { UserRound, Wrench } from "lucide-react";
import AuthLayout from "@/app/(auth)/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

type Role = "Customer" | "Technician";

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>("Customer");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setConfirmPasswordError("");

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    }

    const form = new FormData(e.currentTarget as HTMLFormElement);
    const formData = Object.fromEntries(form.entries());
    console.log(formData);
    const { data, error } = await authClient.signUp.email({
      name: fullName,
      email: email,
      password: password,
      role: role,
    });
    if (error) {
      console.error("Sign up error:", error);
    } else {
      console.log("Sign up successful:", data);
      router.push("/"); // Redirect to sign-in page after successful sign-up
    }
  };

  return (
    <AuthLayout
      eyebrow="REPAIRS, MADE DEPENDABLE"
      heading="Create your place in a better repair network."
      description="Discover skilled technicians, follow every repair, and keep the entire process in one place."
    >
      <div className="w-full">
        {/* Form Title & Subtitle */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-[#172b2b] sm:text-[26px]">
            Create your account
          </h2>
          <p className="mt-1.5 text-sm text-slate-500">
            Choose your role and enter your account details.
          </p>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label
              htmlFor="fullName"
              className="text-sm font-medium text-slate-700"
            >
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              name="fullName"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="h-10 rounded-lg border-slate-200 px-3.5 text-sm transition-colors placeholder:text-slate-400 focus-visible:border-[#176b63] focus-visible:ring-1 focus-visible:ring-[#176b63]"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-slate-700"
            >
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-10 rounded-lg border-slate-200 px-3.5 text-sm transition-colors placeholder:text-slate-400 focus-visible:border-[#176b63] focus-visible:ring-1 focus-visible:ring-[#176b63]"
            />
          </div>

          {/* Password with Show/Hide toggle & helper note */}
          <div className="space-y-1.5">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-slate-700"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                minLength={8}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                required
                aria-invalid={Boolean(passwordError)}
                className="h-10 rounded-lg border-slate-200 px-3.5 pr-14 text-sm transition-colors placeholder:text-slate-400 focus-visible:border-[#176b63] focus-visible:ring-1 focus-visible:ring-[#176b63]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-xs font-semibold text-[#176b63] transition-colors hover:text-[#125851]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <p className="text-[12px] text-slate-400">At least 8 characters.</p>
            {passwordError && (
              <p className="text-xs text-red-600" role="alert">
                {passwordError}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-slate-700"
            >
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              minLength={8}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setConfirmPasswordError("");
              }}
              required
              aria-invalid={Boolean(confirmPasswordError)}
              className="h-10 rounded-lg border-slate-200 px-3.5 text-sm transition-colors placeholder:text-slate-400 focus-visible:border-[#176b63] focus-visible:ring-1 focus-visible:ring-[#176b63]"
            />
            {confirmPasswordError && (
              <p className="text-xs text-red-600" role="alert">
                {confirmPasswordError}
              </p>
            )}
          </div>

          {/* Account Role Selector */}
          <div className="space-y-1.5 pt-1">
            <Label className="text-sm font-medium text-slate-700">
              Account Role
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {/* Customer Card */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => setRole("Customer")}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") && setRole("Customer")
                }
                className={cn(
                  "relative flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-all outline-none select-none",
                  role === "Customer"
                    ? "border-[#176b63] bg-[#176b63]/5 ring-1 ring-[#176b63]"
                    : "border-slate-200 bg-white hover:border-slate-300",
                )}
              >
                <div className="flex items-center gap-2.5">
                  <UserRound
                    className={cn(
                      "size-4.5 transition-colors",
                      role === "Customer" ? "text-[#176b63]" : "text-slate-600",
                    )}
                  />
                  <div>
                    <p className="text-sm font-semibold text-[#172b2b]">
                      Customer
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Book and track repairs
                    </p>
                  </div>
                </div>
                <div
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded-full border transition-all",
                    role === "Customer"
                      ? "border-[#176b63] bg-white"
                      : "border-slate-300 bg-white",
                  )}
                >
                  {role === "Customer" && (
                    <span className="size-2 rounded-full bg-[#176b63]" />
                  )}
                </div>
              </div>

              {/* Technician Card */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => setRole("Technician")}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") && setRole("Technician")
                }
                className={cn(
                  "relative flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-all outline-none select-none",
                  role === "Technician"
                    ? "border-[#176b63] bg-[#176b63]/5 ring-1 ring-[#176b63]"
                    : "border-slate-200 bg-white hover:border-slate-300",
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Wrench
                    className={cn(
                      "size-4.5 transition-colors",
                      role === "Technician"
                        ? "text-[#176b63]"
                        : "text-slate-600",
                    )}
                  />
                  <div>
                    <p className="text-sm font-semibold text-[#172b2b]">
                      Technician
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Offer repair services
                    </p>
                  </div>
                </div>
                <div
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded-full border transition-all",
                    role === "Technician"
                      ? "border-[#176b63] bg-white"
                      : "border-slate-300 bg-white",
                  )}
                >
                  {role === "Technician" && (
                    <span className="size-2 rounded-full bg-[#176b63]" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              className="h-10 w-full rounded-lg bg-[#176b63] text-sm font-semibold text-white shadow-none transition-colors hover:bg-[#125851]"
            >
              Create Account
            </Button>
          </div>

          {/* Footer Link to Sign In */}
          <p className="pt-2 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="font-semibold text-[#176b63] transition-colors hover:underline"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
