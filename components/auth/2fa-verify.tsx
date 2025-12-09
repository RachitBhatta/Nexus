import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface twoFAVerifyProps{
    identifier:string,
    password:string,
}

export default function twoFAVerify({identifier,password}:twoFAVerifyProps){
    const router=useRouter();
    const [isLoading,setIsLoading]=useState(false);
    const [error,setError]=useState<string>("");
    const [twoFACode,setTwoFACode]=useState("");
    const [useBackupCode,setUseBackupCode]=useState(false);
    const requiredLength=useBackupCode?8:6;
    const handleVerify=async()=>{
        
        if(twoFACode.length<requiredLength){
            setError(useBackupCode?"Please enter a backup code":"Please enter a 6-digit code")
            return;
        }
        setIsLoading(true);
        setError("")
        try {
            const endpoint=useBackupCode?"/api/auth/2fa/verify-backup":"/api/auth/2fa/verify";

            const response=await fetch(endpoint,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    identifier,
                    password,
                    [useBackupCode?"backupCode":"twoFACode"]:twoFACode
                })
            })
            const result=await response.json();
            if(!response.ok){
                throw new Error(result.message|| "Verification Failed");
            }
            router.push("/dashboard");
            router.refresh();
        } catch (error) {
            setError(error instanceof Error?error.message:"Verification Failed")
        }finally{
            setIsLoading(false)
        }
    }
    const onBack=()=>{
        router.push("/login")
    }
    return(
        <Card>
            <CardHeader>
                <CardTitle>
                    Two-Factor Authentication
                </CardTitle>
                <CardDescription>
                    {
                        useBackupCode?"Enter one of your backup codes":
                        "Enter the 6-digit code from your email"
                    }
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error &&(
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4"/>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <div>
                    <Input
                        type='text'
                        placeholder={useBackupCode ? "XXXXXXXX" : "000000"}
                        maxLength={useBackupCode?8:6}
                        value={twoFACode}
                        onChange={(e)=>{
                            setTwoFACode(
                                useBackupCode
                                ?e.target.value.toUpperCase()
                                :e.target.value.replace(/\D/g,"")
                            )
                        }}
                        className="text-center text-2xl tracking-widest"
                        disabled={isLoading}
                    />
                    <div>
                        <Button
                            onClick={handleVerify}
                            disabled={isLoading || twoFACode.length<requiredLength}
                            className="w-full"
                        >
                            {
                                isLoading?(
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    </>
                                ):(
                                    "Verify & Login"
                                )
                            }
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={()=>{
                                setUseBackupCode(!useBackupCode);
                                setTwoFACode("")
                                setError("")
                            }}
                            disabled={isLoading}
                            className="w-full"
                        >
                            {useBackupCode?"Use Authentication Code":"Use BackUp Code"}
                        </Button>

                    </div>
                
                </div>
                <Button 
                    variant="link" 
                    disabled={isLoading}
                    onClick={onBack}
                >
                    Back To Login
                </Button>
            </CardContent>
        </Card>
    )
}