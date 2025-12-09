'use client';
import {useForm} from "react-hook-form"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignInInput } from "@/lib/db/Schemas/SignIn.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema } from "@/lib/db/Schemas/SignIn.schema";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle, } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle, Eye, EyeOff, Loader, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import OAuthButton from "./oauth-button";

export function LoginForm(){
    const router=useRouter();
    const [isLoading,setIsLoading]=useState(false);
    const [error,setError]=useState<string>("");
    const [showPassword,setShowPassword]=useState(false);
    
    const {handleSubmit,
            register,
            formState:{errors}}=useForm<SignInInput>({
                mode:"onBlur",
                resolver:zodResolver(SignInSchema)

            });   
    const onSubmit=async(data:SignInInput)=>{
        setIsLoading(true),
        setError("");
        try {
            const response=fetch("/api/auth/login",{
                method:"POST",
                headers:{"Content-type":"application/json"},
                body:JSON.stringify(data),
            });
            const result=(await response).json();
            if(result.require2FA ){
                sessionStorage.setItem("2fa-identifier",data.identifier);
                sessionStorage.setItem("2fa-password",data.password);

                router.push("/2fa-verify");
                return;
            }
            if(!response.ok){
                throw new Error("Login Failed",result.message);
            }
            router.push("/dashboard");
            router.refresh();


        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred during login");
        }finally{}
            setIsLoading(false);
    }
    return(
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Welcome Back!</CardTitle>
                <CardDescription>Sign in to your Nexus account</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="">
                    {error &&(
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {error}
                            </AlertDescription>
                        </Alert>
                    )}
                    <div className="space-y-2">
                        <label htmlFor="identifier" className="text-sm font-medium">
                            Email or Username
                        </label>
                        <input 
                            id="identifier" 
                            type="text"
                            placeholder="ex@example.com"
                            {...register("identifier")}
                            disabled={isLoading}
                            aria-invalid={!!errors.identifier}
                        />
                        {errors.identifier &&(
                            <p className="text-sm text-destructive">{errors.identifier.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">Password</label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword?"text":"password"}
                                placeholder="••••••••"
                                {...register("password")}
                                disabled={isLoading}
                                aria-invalid={!!errors.password}
                            />
                            <button
                                type="button"
                                onClick={()=>setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword?<EyeOff className="h-4 w-4"/>:<Eye className="h-4 w-4"/>}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-sm text-destructive">{errors.password.message}</p>
                        )}
                    </div>
                    <div className="flex justify-end items-center">
                        <Link 
                            href="/forgot-password"
                            className="text-sm hover:underline text-primary"
                        >
                            Forgot Password?
                        </Link>
                    </div>
                    <Button>
                        {isLoading?(
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                Signing in...
                            </>
                        ):(
                            "Sign In"
                        )}
                    </Button>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center uppercase text-xs">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div> 
                    </div>
                    <OAuthButton disabled={isLoading}/>
                    <p className="text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-primary hover:underline font-medium">
                        Sign up
                        </Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    )
}
