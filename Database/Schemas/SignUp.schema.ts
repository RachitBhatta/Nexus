import {z} from "zod";

export const UsernameValidation=z
                                .string()
                                .min(8,"Username must be greater than 8 character")
                                .max(25,"Username must be no more than 25 character")
                                .regex(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/igm,"Username must not contain any special character");

export const SignUpSchema=z.object({
    username:UsernameValidation,
    email:z
        .string()
        .email({message:"Invalid Email Address"}),
    password:z
        .string()
        .min(8,"Password must be at least 8 character")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/ ,
            "Password must include uppercase, lowercase, number, and special character.")


})