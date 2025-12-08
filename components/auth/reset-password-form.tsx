"use client";

import { resetPasswordInput, resetPasswordSchema } from "@/lib/db/Schemas/password-reset.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter,useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { AlertCircle, CheckCheckIcon, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { Input } from "../ui/input";
import PasswordStrengthMeter from "./password-strength-meter";

export default function ResetPasswordForm(){
    const router=useRouter();
    const searchParams=useSearchParams();
    const token=searchParams.get("token");
    const [isLoading,setIsLoading]=useState(false);
    const [success,setSuccess]=useState(false);
    const [error,setError]=useState<string>("");
    const [showPassword,setShowPassword]=useState(false);
    const {
        register,
        handleSubmit,
        watch,
        formState:{errors}
    }=useForm({
        resolver:zodResolver(resetPasswordSchema),
        mode:"onBlur",
        defaultValues:{
            token: token ||"",
        }
    });
    const newPassword=watch("newPassword")
    const onSubmit=async(data:resetPasswordInput)=>{
        setIsLoading(true);
        setSuccess(false);
        setError("");
        try {
            const response=await fetch("/api/auth/reset-password",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(data)
            })
            const result=await response.json();

            if(!response.ok){
                throw new Error(result.message || "Failed to reset Password")
            }

            setSuccess(true);
            setTimeout(()=>{
                router.push("/login")
            },2000)

        } catch (error) {
            setError(error instanceof Error?error.message:"An error occured")
        }finally{
            setIsLoading(false);
        }
    }
    if(!token){
        return(
            <Card>
                <CardHeader>
                    <CardTitle>
                        Invalid Reset Link
                    </CardTitle>
                    <CardDescription>
                        This reset link is invalid or has expired
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={()=>router.push("/forgot-password") } className="w-full">
                        Request a new reset link
                    </Button>
                </CardContent>
            </Card>
        )
    }
    if(success){
        return(
            <Card>
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <CheckCircle2 className="h-16 w-16 text-green-500"/>
                    </div>
                    <CardTitle className="text-center">Password Changed SuccessFully</CardTitle>
                    <CardDescription className="text-center">
                        Your password has been changed . Redirecting to login...
                    </CardDescription>
                </CardHeader>
            </Card>
        )
    }return(
        <Card>
            <CardHeader>
                <CardTitle>Reset Password</CardTitle>
                <CardDescription>Enter your new password below</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4"/>
                            <AlertDescription>
                                {error}
                            </AlertDescription>
                        </Alert>
                    )}
                    <input type="hidden"{...register("token")}/>
                    <div className="space-y-2">
                        <label htmlFor="newPassword" className="text-sm font-medium">
                            New Password
                        </label>
                        <div>
                            <Input
                                type={showPassword?"text":"password"}
                                id="newPassword"
                                placeholder="••••••••"
                                {...register("newPassword")}
                                disabled={isLoading}
                                aria-invalid={!!errors.newPassword}
                            />
                            <button
                                type="button"
                                onClick={()=>setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                            {showPassword?<EyeOff className="h-4 w-4"/>:<Eye className="h-4 w-4"/>}
                            </button>
                        </div>
                        {errors.newPassword &&(
                            <p className="text-destructive text-sm">{errors.newPassword?.message}</p>
                        )}
                        {newPassword && <PasswordStrengthMeter password={newPassword}/>}
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading?(
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/> 
                            Resetting password...
                        </>):(
                            "Reset Password"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}