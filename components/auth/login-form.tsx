'use client';
import {useForm} from "react-hook-form"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignInInput } from "@/lib/db/Schemas/SignIn.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInSchema } from "@/lib/db/Schemas/SignIn.schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle } from "lucide-react";

export function LoginForm(){
    const router=useRouter;
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
                            className=""
                            type="text"
                            placeholder="ex@example.com"
                            {...register("identifier")}
                            disabled={isLoading}
                            arial-invalid={!!errors.identifier}
                        ></input>
                        {errors.identifier &&(
                            <p className="text-sm text-destructive">{errors.identifier.message}</p>
                        )}
                    </div>

                </form>
            </CardContent>
        </Card>
    )
}
