import z from 'zod'


export const forgotPasswordSchema=z.object({
    email:z
        .string()
        .email("Invalid email address")
        .toLowerCase()
        .transform((val)=>val.trim())
})
export const resetPasswordSchema=z.object({
    token:z.string().min(1,"Reset Token is required"),
    newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[@$!%*?&#]/, "Password must contain at least one special character")

});

export const changePasswordSchema=z.object({
    currentPassword:z.string().min(1,"Current Password is required"),
    newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[@$!%*?&#]/, "Password must contain at least one special character")
}).refine((data)=>data.currentPassword !== data.newPassword,{
    message:"New Password should be different from current password",
    path:["new Password"]
})

export type forgotPasswordInput=z.infer<typeof forgotPasswordSchema>;
export type changePasswordInput=z.infer<typeof changePasswordSchema>;
export type resetPasswordInput=z.infer<typeof resetPasswordSchema>;