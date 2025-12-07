'use client';

import { checkPasswordStrength } from "@/lib/auth/password";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface PasswordStrengthMeterProps{
    password:string
}
export default function PasswordStrengthMeter({password}:PasswordStrengthMeterProps){
    const strength=useMemo(()=>{
        if(!password){
            return {score:0,
            label:"",
            color:"",
            feedback:[]
            }
        }

        const {feedback ,score}=checkPasswordStrength(password)
    let label="";
    let color=""

    if (score <= 1) {
        label = "Weak";
        color = "bg-red-500";
    } else if (score === 2) {
        label = "Fair";
        color = "bg-orange-500";
    } else if (score === 3) {
        label = "Good";
        color = "bg-yellow-500";
    } else if (score >= 4) {
        label = "Strong";
        color = "bg-green-500";
    }

    return { score, label, color, feedback };
    },[password])
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                    className={cn("h-full transition-all duration-300", strength.color)}
                    style={{ width: `${(strength.score / 4) * 100}%` }}
                    />
                    </div>
            <span className={cn("text-xs font-medium", {
            "text-red-500": strength.score <= 1,
            "text-orange-500": strength.score === 2,
            "text-yellow-500": strength.score === 3,
            "text-green-500": strength.score >= 4,
            })}>
            {strength.label}
            </span>
        </div>

        {strength.feedback.length > 0 && (
            <ul className="text-xs text-muted-foreground space-y-1">
            {strength.feedback.map((item, index) => (
                <li key={index} className="flex items-center gap-1">
                <span className="text-orange-500">•</span>
                {item}
                </li>
            ))}
            </ul>
        )}
        </div>
    );
}