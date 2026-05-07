"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, MailCheck } from "lucide-react";
import { forgotPasswordSchema, ForgotPasswordFormValues } from "@/hooks/useAuthForm";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
      toast.success("Reset link sent! Check your inbox 📬");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not send reset email.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative pb-20">
      <Navbar />

      <main className="max-w-md mx-auto px-6 mt-12">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 font-comic font-bold text-indigo-500 hover:text-indigo-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-indigo-900 font-baloo">Forgot Password?</CardTitle>
            <CardDescription className="font-comic text-slate-500 text-lg">
              No worries! Enter your email and we&apos;ll send a reset link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto border-3 border-emerald-200">
                  <MailCheck className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold font-baloo text-indigo-900">Check your inbox!</h3>
                <p className="font-comic text-slate-500">
                  We sent a password reset link to{" "}
                  <span className="font-bold text-indigo-600">{form.getValues("email")}</span>
                </p>
                <p className="font-comic text-slate-400 text-sm">
                  Didn&apos;t receive it?{" "}
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="text-indigo-500 hover:underline font-bold"
                  >
                    Try again
                  </button>
                </p>
              </div>
            ) : (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email address</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="student@eduai.com"
                    aria-describedby={form.formState.errors.email ? "forgot-email-error" : undefined}
                    aria-invalid={!!form.formState.errors.email}
                    disabled={loading}
                    {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                    <p id="forgot-email-error" role="alert" className="text-red-500 text-sm font-comic font-medium">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full text-xl py-6"
                  variant="default"
                  disabled={loading}
                  aria-busy={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
