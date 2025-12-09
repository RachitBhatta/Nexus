import jwt from "jsonwebtoken"

export interface JWTPayload {
    userId: string,
    email: string,
    username: string,
    isVerified: boolean,
    twoFactorEnabled: boolean
}
export interface RefreshTokenPayload {
    userId: string,
    type: "refresh"
}

export interface ResetTokenPayload {
    email: string,
    type: "password-reset"
}

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] || "7d";
const REFRESH_TOKEN_EXPIRES_IN = "30d";
const RESET_TOKEN_EXPIRES_IN = "1h";

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env file")
}

export function generateAccessToken(payload: JWTPayload): string {
    try {
        const token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
            issuer: 'nexus-app',
            audience: "nexus-user"
        })
        return token;
    } catch (error) {
        console.error('Error in generating access token', error);
        throw new Error("Failed to generate Access Token")
    }
}

export function generateRefreshToken(userId: string): string {
    try {
        const payload: RefreshTokenPayload = {
            userId,
            type: "refresh"
        }
        const token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: REFRESH_TOKEN_EXPIRES_IN,
            issuer: "nexus-app"
        });
        return token;
    } catch (error) {
        console.error("Error generating refresh token:", error);
        throw new Error("Failed to generate refresh token");
    }
}
export function verifyToken(token: string): JWTPayload {
    try {
        const decoded = jwt.verify(token, JWT_SECRET, {
            issuer: "nexus-app",
            audience: "nexus-user"
        }) as JWTPayload
        return decoded;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error("Token has expired");
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new Error("Invalid token");
        }
        throw new Error("Token verification failed");
    }
}
export function verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
        const decoded = jwt.verify(token, JWT_SECRET, {
            issuer: "nexus-app"
        }) as RefreshTokenPayload;

        if (decoded.type !== "refresh") {
            throw new Error("Invalid token type");
        }

        return decoded;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error("Refresh token has expired");
        }
        if (error instanceof Error && error.message === "Invalid token type") {
            throw error;
        }
        throw new Error("Invalid refresh token");
    }
}export function generateResetToken(email:string):string{
    try {
        const payload:ResetTokenPayload={
            email,
            type:"password-reset"
        }
        const token=jwt.sign(payload,JWT_SECRET,{
            expiresIn:RESET_TOKEN_EXPIRES_IN,
            issuer:"nexus-app"
        })
        return token;
    } catch (error) {
        console.error("Reset Password Token creation Failed",error);
        throw new Error("Failed to create Reset Password Token");
    }
}

export function verifyResetToken(token:string):ResetTokenPayload{
    try {
        const decoded=jwt.verify(token,JWT_SECRET,{
            issuer:"nexus-app"
        }) as ResetTokenPayload;
        if(decoded.type !=="password-reset"){
            throw new Error("Invalid token type")
        }
        return decoded;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error("Reset token has expired");
        }
        if (error instanceof Error && error.message === "Invalid token type") {
            throw error;
        }
        throw new Error("Invalid reset token");
    }
}
export function decodeToken(token:string):JWTPayload | null{
    try {
        const decoded=jwt.decode(token) as JWTPayload;
        return decoded;
    } catch (error) {
        return null;
    }
}

export function getTokenExpiryTime(token:string):Date | null{
    try {
        const decoded=jwt.decode(token) as {exp?:number}
        if(decoded?.exp){
            return new Date(decoded.exp*1000);
        }
        return null;
    } catch (error) {
        return null
    }
}