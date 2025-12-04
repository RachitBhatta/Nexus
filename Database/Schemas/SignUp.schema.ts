import {z} from "zod";

export const UsernameValidation=z
                                .string()
                                .min(8,"Username must be greater than 8 character")
                                .max(25,"Username must be no more than 25 character")
                                .regex(/^[a-zA-Z0-9_]+$/,"Username must not contain any special character")
                                .refine((val)=>!val.includes(".."),
                                "Username cannot have consecutive dots"
                                );
export const SignUpSchema=z.object({
    username:UsernameValidation,
    email:z
        .string()
        .email({message:"Invalid Email Address"})
        .toLowerCase()
        .transform((val)=>val.trim()),
    password:z
        .string()
        .min(8,"Password must be at least 8 character")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/\d/, "Password must contain at least one number")
        .regex(
            /[@$!%*?&#]/,
            "Password must contain at least one special character (@$!%*?&#)")
})

export type SignUpInput=z.infer<typeof SignUpSchema>;