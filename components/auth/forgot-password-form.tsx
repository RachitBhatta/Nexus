"use client";

import {
    forgotPasswordInput,
    forgotPasswordSchema,
} from "@/lib/db/Schemas/password-reset.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import Link from "next/link";
import { Input } from "../ui/input";

export default function ForgotPasswordForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState(false);
    const [emailSent, setEmailSent] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        mode: "onBlur",
    });
    const onSubmit = async (data: forgotPasswordInput) => {
        setIsLoading(true);
        setError("");
        setSuccess(false);

        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || "Failed to send reset Email");
            }
            setSuccess(true);
            setEmailSent(data.email);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };
    if (success) {
        return (
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                    </div>
                    <CardTitle className="text-center">Check Your Email</CardTitle>
                    <CardDescription className="text-center">
                        We've sent a password reset link to <strong>{emailSent}</strong>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert>
                        <AlertDescription>
                            Click the link in the email to reset your password. The link will
                            expire in 1 hour.
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-2 text-sm text-muted-foreground text-center">
                        <p>Didn't receive the email? Check your spam folder.</p>
                        <Button
                            variant="link"
                            onClick={() => {
                                setSuccess(false);
                                setEmailSent("");
                            }}
                        >
                            Try another email address
                        </Button>
                    </div>

                    <Link href="/login">
                        <Button variant="outline" className="w-full">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Login
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }
    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Forgot Password?</CardTitle>
                <CardDescription>
                    Enter your email address and we'll send you a link to reset your
                    password
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                            Email Address
                        </label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            {...register("email")}
                            disabled={isLoading}
                            aria-invalid={!!errors.email}
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive">{errors.email.message}</p>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending reset link...
                            </>
                        ) : (
                            "Send Reset Link"
                        )}
                    </Button>

                    <Link href="/login">
                        <Button variant="ghost" className="w-full">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Login
                        </Button>
                    </Link>
                </form>
            </CardContent>
        </Card>
    );
}
