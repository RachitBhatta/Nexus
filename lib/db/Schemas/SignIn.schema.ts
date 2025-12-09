import {z} from "zod";

export const SignInSchema=z.object({
    identifier:z
                .string()
                .min(1,"Username or Email is required")
                .transform((val)=>val.trim().toLowerCase()),
    password:z
                .string()
                .min(8,"Password must be at least 8 characters")
                
})

export const twoFASchema=z.object({
    identifier:z
                .string()
                .min(1, "Email or Username is required")
                .transform((val)=>val.trim().toLowerCase()),
    password:z.string().min(1, "Password is required"),
    twoFACode:z
            .string()
            .length(6,"Two factor Authentication code must be 6 digits")
            .regex(/^\d{6}$/, "Two factor Authentication code must contain only numbers")
})

export type SignInInput=z.infer<typeof SignInSchema>;
export type twoFAInput=z.infer<typeof twoFASchema>;