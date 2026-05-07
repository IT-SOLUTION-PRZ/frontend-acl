"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useAuthForm } from "@/hooks/useAuthForm";
import { Navbar } from "@/components/layout/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// ─── Password strength helper ────────────────────────────────────────────────

function getPasswordStrength(password: string): { label: string; color: string; width: string } {
  if (!password) return { label: "", color: "bg-transparent", width: "0%" };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { label: "Weak", color: "bg-red-400", width: "20%" };
  if (score === 2) return { label: "Fair", color: "bg-orange-400", width: "40%" };
  if (score === 3) return { label: "Good", color: "bg-yellow-400", width: "60%" };
  if (score === 4) return { label: "Strong", color: "bg-emerald-400", width: "80%" };
  return { label: "Very Strong", color: "bg-emerald-500", width: "100%" };
}

// ─── Reusable show/hide password field ──────────────────────────────────────

function PasswordField({
  id,
  errorId,
  label,
  registration,
  error,
  showStrength = false,
  watchValue = "",
  disabled = false,
}: {
  id: string;
  errorId: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registration: any;
  error?: string;
  showStrength?: boolean;
  watchValue?: string;
  disabled?: boolean;
}) {
  const [show, setShow] = useState(false);
  const strength = getPasswordStrength(watchValue);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={!!error}
          disabled={disabled}
          {...registration}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors"
          aria-label={show ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      {showStrength && watchValue && (
        <div className="space-y-1">
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
              style={{ width: strength.width }}
            />
          </div>
          <p className="text-xs font-comic text-slate-500">{strength.label}</p>
        </div>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-red-500 text-sm font-comic font-medium">
          {error}
        </p>
      )}
    </div>
  );
}

// ─── OAuth divider ───────────────────────────────────────────────────────────

function OAuthSection({
  onGoogle,
  onGitHub,
  disabled,
}: {
  onGoogle: () => void;
  onGitHub: () => void;
  disabled: boolean;
}) {
  return (
    <>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t-2 border-indigo-100" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 font-comic text-slate-400 text-sm">or continue with</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={disabled}
          onClick={onGoogle}
          className="clay-btn-secondary flex items-center justify-center gap-2 py-3 text-sm font-comic font-bold disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={onGitHub}
          className="clay-btn-secondary flex items-center justify-center gap-2 py-3 text-sm font-comic font-bold disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          GitHub
        </button>
      </div>
    </>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const {
    loginForm,
    registerForm,
    onLoginSubmit,
    onRegisterSubmit,
    signInWithGoogle,
    signInWithGitHub,
    loginLoading,
    registerLoading,
  } = useAuthForm();

  const watchPassword = registerForm.watch("password");

  return (
    <div className="min-h-screen relative pb-20">
      <Navbar />

      <main className="max-w-md mx-auto px-6 mt-12">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="flex w-full mb-8 bg-indigo-100 p-1.5 rounded-2xl border-2 border-indigo-200">
            <TabsTrigger
              value="login"
              className="flex-1 rounded-xl font-comic font-bold text-lg text-indigo-500 data-active:text-indigo-900 data-active:bg-white data-active:shadow-md py-3 transition-all"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="flex-1 rounded-xl font-comic font-bold text-lg text-indigo-500 data-active:text-indigo-900 data-active:bg-white data-active:shadow-md py-3 transition-all"
            >
              Register
            </TabsTrigger>
          </TabsList>

          {/* ── LOGIN ── */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl text-indigo-900 font-baloo">Welcome back!</CardTitle>
                <CardDescription className="font-comic text-slate-500 text-lg">
                  Sign in to your account to continue.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4" noValidate>
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="student@eduai.com"
                      aria-describedby={loginForm.formState.errors.email ? "login-email-error" : undefined}
                      aria-invalid={!!loginForm.formState.errors.email}
                      disabled={loginLoading}
                      {...loginForm.register("email")}
                    />
                    {loginForm.formState.errors.email && (
                      <p id="login-email-error" role="alert" className="text-red-500 text-sm font-comic font-medium">
                        {loginForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <PasswordField
                    id="login-password"
                    errorId="login-password-error"
                    label="Password"
                    registration={loginForm.register("password")}
                    error={loginForm.formState.errors.password?.message}
                    disabled={loginLoading}
                  />

                  <div className="flex justify-end">
                    <Link
                      href="/forgot-password"
                      className="text-sm font-comic text-indigo-500 hover:text-indigo-700 hover:underline transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full text-xl py-6"
                    variant="default"
                    disabled={loginLoading}
                    aria-busy={loginLoading}
                  >
                    {loginLoading ? "Logging in..." : "Log in"}
                  </Button>

                  <OAuthSection onGoogle={signInWithGoogle} onGitHub={signInWithGitHub} disabled={loginLoading} />
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── REGISTER ── */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl text-indigo-900 font-baloo">Create an account</CardTitle>
                <CardDescription className="font-comic text-slate-500 text-lg">
                  Join us to create your own magical lessons.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4" noValidate>
                  <div className="space-y-2">
                    <Label htmlFor="reg-name">Name</Label>
                    <Input
                      id="reg-name"
                      placeholder="Johnny Appleseed"
                      aria-describedby={registerForm.formState.errors.name ? "reg-name-error" : undefined}
                      aria-invalid={!!registerForm.formState.errors.name}
                      disabled={registerLoading}
                      {...registerForm.register("name")}
                    />
                    {registerForm.formState.errors.name && (
                      <p id="reg-name-error" role="alert" className="text-red-500 text-sm font-comic font-medium">
                        {registerForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="student@eduai.com"
                      aria-describedby={registerForm.formState.errors.email ? "reg-email-error" : undefined}
                      aria-invalid={!!registerForm.formState.errors.email}
                      disabled={registerLoading}
                      {...registerForm.register("email")}
                    />
                    {registerForm.formState.errors.email && (
                      <p id="reg-email-error" role="alert" className="text-red-500 text-sm font-comic font-medium">
                        {registerForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <PasswordField
                    id="reg-password"
                    errorId="reg-password-error"
                    label="Password"
                    registration={registerForm.register("password")}
                    error={registerForm.formState.errors.password?.message}
                    showStrength
                    watchValue={watchPassword}
                    disabled={registerLoading}
                  />

                  <PasswordField
                    id="reg-confirm-password"
                    errorId="reg-confirm-password-error"
                    label="Confirm Password"
                    registration={registerForm.register("confirmPassword")}
                    error={registerForm.formState.errors.confirmPassword?.message}
                    disabled={registerLoading}
                  />

                  {/* T&C checkbox */}
                  <div className="flex items-start gap-3 pt-1">
                    <input
                      id="reg-terms"
                      type="checkbox"
                      className="mt-1 w-5 h-5 rounded accent-indigo-600 cursor-pointer"
                      disabled={registerLoading}
                      {...registerForm.register("acceptTerms")}
                    />
                    <label htmlFor="reg-terms" className="text-sm font-comic text-slate-600 leading-relaxed cursor-pointer">
                      I agree to the{" "}
                      <Link href="/terms" className="text-indigo-500 hover:underline font-bold">Terms of Service</Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-indigo-500 hover:underline font-bold">Privacy Policy</Link>
                    </label>
                  </div>
                  {registerForm.formState.errors.acceptTerms && (
                    <p role="alert" className="text-red-500 text-sm font-comic font-medium -mt-2">
                      {registerForm.formState.errors.acceptTerms.message}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full text-xl py-6"
                    variant="cta"
                    disabled={registerLoading}
                    aria-busy={registerLoading}
                  >
                    {registerLoading ? "Creating..." : "Create Account"}
                  </Button>

                  <OAuthSection onGoogle={signInWithGoogle} onGitHub={signInWithGitHub} disabled={registerLoading} />
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
