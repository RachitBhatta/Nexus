import z from "zod";

export const messageSchema=z.object({
    content:z
        .string()
        .min(10,{message:"Content must be of 10 character"})
        .max(300,{message:"Content must be no longer tha 300 character"})
})