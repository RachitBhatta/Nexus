"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2, Mail } from "lucide-react";

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState("");

    useEffect(() => {
        if (!email) {
            router.push("/signup");
        }
    }, [email, router]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();

        if (otp.length !== 6) {
            setError("Please enter a valid 6-digit code");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/auth/verify-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, verifyOTP: otp }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Verification failed");
            }

            setSuccess(true);

            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Verification failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        setResendLoading(true);
        setResendMessage("");
        setError("");

        try {
            const response = await fetch("/api/auth/send-verification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to resend code");
            }

            setResendMessage("A new verification code has been sent to your email");
            setOtp(""); 
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to resend code");
        } finally {
            setResendLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <div className="flex justify-center mb-4">
                            <CheckCircle2 className="h-16 w-16 text-green-500" />
                        </div>
                        <CardTitle className="text-center">Email Verified!</CardTitle>
                        <CardDescription className="text-center">
                            Your account has been verified. Redirecting to login...
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <Mail className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <CardTitle className="text-center">Verify Your Email</CardTitle>
                    <CardDescription className="text-center">
                        We've sent a 6-digit code to <strong>{email}</strong>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleVerify} className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {resendMessage && (
                            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <AlertDescription className="text-green-700 dark:text-green-300">
                                    {resendMessage}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="otp" className="text-sm font-medium">
                                Verification Code
                            </label>
                            <Input
                                id="otp"
                                type="text"
                                placeholder="000000"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                className="text-center text-2xl tracking-widest"
                                disabled={isLoading}
                                autoFocus
                            />
                            <p className="text-xs text-muted-foreground text-center">
                                Code expires in 10 minutes
                            </p>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading || otp.length !== 6}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                "Verify Email"
                            )}
                        </Button>

                        <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-2">
                                Didn't receive the code?
                            </p>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleResendCode}
                                disabled={resendLoading}
                                className="text-primary"
                            >
                                {resendLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    "Resend Code"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}