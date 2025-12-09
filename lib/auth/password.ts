import bcrypt from "bcryptjs"
import crypto from "crypto"

const SALT_ROUNDS=10;

export async function hashPassword(password:string):Promise<string>{
    try {
        const hashedPassword =await bcrypt.hash(password,SALT_ROUNDS);
        return hashedPassword;
    } catch (error) {
        console.error("Error in hashing password",error);
        throw new Error("Cannot hash the password")
    }
}

export async function verifyPassword(plainPassword:string,hashedPassword:string):Promise<boolean>{
    try {
        const isMatch=await bcrypt.compare(plainPassword,hashedPassword);
        return isMatch;
    } catch (error) {
        console.error("Error verifying Password",error);
        throw new Error("Failed to verify password");
    }
}

export async function generateOTP(length:number=6):Promise<string>{
    const digits="0123456789";
    let otp="";
    for(let i=0;i<length;i++){
        const randomIndex=crypto.randomInt(0,digits.length);
        otp+=digits[randomIndex];
    }
    return otp;
}

export function generateSecurityToken(length:number=32):string{
    return crypto.randomBytes(length).toString("hex")
}

export function generateBackupCodes(count:number=8):string[]{
    const codes:string[]=[];
    for(let i=0;i<count;i++){
        const code=crypto.randomBytes(4).toString("hex").toUpperCase();
        codes.push(code);
    }
    return codes
}

export async function hashBackupCodes(backupCode:string):Promise<string>{
    return hashPassword(backupCode);
}

export async function verifyBackupCode(plainCode:string,hashCode:string):Promise<boolean>{
    return verifyPassword(plainCode,hashCode);
}


export function checkPasswordStrength(password:string):{score:number,feedback:string[]}{
    let score=0;
    const feedback:string[]=[]

    if(password.length>=8){
        score++;
    }
    if(password.length>=12){
        score++;
    }
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
        score++;
    } else {
        feedback.push("Use both uppercase and lowercase letters");
    }
    
    if (/\d/.test(password)) {
        score++;
    } else {
        feedback.push("Include at least one number");
    }
    
    if (/[@$!%*?&#]/.test(password)) {
        score++;
    } else {
        feedback.push("Include at least one special character");
    }
    
    // Common patterns check
    if (/(.)\1{2,}/.test(password)) {
        feedback.push("Avoid repeating characters");
        score = Math.max(0, score - 1);
    }
    
    if (/^[0-9]+$/.test(password)) {
        feedback.push("Don't use only numbers");
        score = 0;
    }
    
    return {
        score: Math.min(score, 4),
        feedback
    };
}
