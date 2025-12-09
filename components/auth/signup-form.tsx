"use client";
import { SignUpInput } from "@/lib/db/Schemas/SignUp.schema";
import { SignUpSchema } from "@/lib/db/Schemas/SignUp.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import OAuthButton from "./oauth-button";
import Link from "next/link";
import PasswordStrengthMeter from "./password-strength-meter";
import { generateStrongPassword } from "./strong-password-suggestion";
export default function SignUpForm(){
    const router=useRouter()
    const [isLoading,setIsLoading]=useState(false);
    const [error,setError]=useState<string>("");
    const [showPassword,setShowPassword]=useState(false);
    const [success,setSuccess]=useState(false);
    const[suggestedPassword,setSuggestedPassword]=useState("")
    const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    } = useForm<SignUpInput>({
        resolver: zodResolver(SignUpSchema),
        mode: "onBlur",
    });
    useEffect(()=>{
        if(!password || password.length<8){
            setSuggestedPassword(generateStrongPassword())
        }else{
            setSuggestedPassword("");
        }
    })
    const password=watch("password");
    const onSubmit=async(data:SignUpInput)=>{
        setIsLoading(true);
        setSuccess(false);
        setError("");

        try {
            const response=await fetch("/api/auth/signup",{
                method:"POST",
                headers:{"Content-type":"application/json"},
                body:JSON.stringify(data)
            });
            const result=await response.json();
            if(!response.ok){
                throw new Error(result.message || "Sign up Failed");
            }
            setSuccess(true);

            setTimeout(()=>{
                router.push(`/verify-email?email=${encodeURIComponent(data.email)}`)
            },2000)
        } catch (error) {
            setError(error instanceof Error?error.message:"An error occurred during sign up process")
        }finally{
            setIsLoading(false)
        }
    }
    if (success) {
    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
            <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-center">Account Created!</CardTitle>
            <CardDescription className="text-center">
                We've sent a verification code to your email. Redirecting...
            </CardDescription>
            </CardHeader>
        </Card>
    );
    }
    return(
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Join Nexus and start building amazing projects</CardDescription>
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
                    <label htmlFor="username" className="text-sm font-medium">
                    Username
                    </label>
                    <Input
                    id="username"
                    type="text"
                    placeholder="johndoe"
                    {...register("username")}
                    disabled={isLoading}
                    aria-invalid={!!errors.username}
                    />
                    {errors.username && (
                    <p className="text-sm text-destructive">{errors.username.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                    Email
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

                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                    Password
                    </label>
                    <div className="relative">
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...register("password")}
                        disabled={isLoading}
                        aria-invalid={!!errors.password}
                    />
                    {!password && suggestedPassword && (
                        <p className="text-sm text-muted-foreground">
                            Suggested Password:<code>{suggestedPassword}</code>
                        </p>
                    )}
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>

                    </div>
                    {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                    )}
                    
                    {/* Password Strength Meter */}
                    {password && <PasswordStrengthMeter password={password} />}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                    </>
                    ) : (
                    "Create Account"
                    )}
                </Button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div>

                <OAuthButton disabled={isLoading} />

                <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:underline font-medium">
                    Sign in
                    </Link>
                </p>

                <p className="text-xs text-center text-muted-foreground">
                    By creating an account, you agree to our{" "}
                    <Link href="/terms" className="underline hover:text-foreground">
                    Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="underline hover:text-foreground">
                    Privacy Policy
                    </Link>
                </p>
                </form>
            </CardContent>
        </Card>
    )
}