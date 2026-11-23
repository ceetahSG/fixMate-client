"use client";

import { useState } from "react";
import Link from "next/link";
import AuthLayout from "@/app/(auth)/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await authClient.signIn.email({
      email: email,
      password: password,
      // An optional URL to redirect to after the user signs in. (optional)
    });
    if (error) {
      console.error("Sign-in error:", error);
      toast.add({
        title: "Sign-in failed",
        description: error.message || "Please check your credentials and try again.",
        type: "error",
      });
    } else {
      toast.add({
        title: "Welcome back",
        description: "You have been signed in successfully.",
        type: "success",
      });
      router.push("/");
      router.refresh();
    }
  };

  const handleGoogleSignIn = () => {
    toast.add({
      title: "Google sign-in unavailable",
      description: "Google authentication is not configured yet.",
      type: "warning",
    });
    console.log({
      provider: "google",
    });
  };

  return (
    <AuthLayout
      eyebrow="REPAIRS, MADE DEPENDABLE"
      heading="Welcome back to your repair workspace."
      description="Discover skilled technicians, follow every repair, and keep the entire process in one place."
    >
      <div className="w-full">
        {/* Form Title & Subtitle */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-[#172b2b] sm:text-[26px]">
            Sign in to FixMate
          </h2>
          <p className="mt-1.5 text-sm text-slate-500">
            Enter your details to continue.
          </p>
        </div>

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
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

          {/* Password Field with Show/Hide toggle */}
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
                onChange={(e) => setPassword(e.target.value)}
                required
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
          </div>

          {/* Submit Button */}
          <div className="pt-1">
            <Button
              type="submit"
              className="h-10 w-full rounded-lg bg-[#176b63] text-sm font-semibold text-white shadow-none transition-colors hover:bg-[#125851]"
            >
              Sign In
            </Button>
          </div>

          {/* Google Sign-in Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            className="h-10 w-full rounded-lg border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-none transition-colors hover:bg-slate-50"
          >
            <svg className="size-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            Continue with Google
          </Button>

          {/* Footer Link to Register */}
          <p className="pt-2 text-center text-sm text-slate-500">
            New to FixMate?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[#176b63] transition-colors hover:underline"
            >
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}
