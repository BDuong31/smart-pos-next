import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .min(0, { message: 'Email address is required' })
        .email({ message: 'Invalid email address' }),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters long' })
        .max(30, { message: 'Password must be at most 30 characters long' }),
})

export type LoginData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    username: z
        .string()
        .min(6, { message: 'Username must be at least 6 characters long' })
        .max(30, { message: 'Username must be at most 30 characters long' }),
    email: z
        .string()
        .min(0, { message: 'Email address is required' })
        .email({ message: 'Invalid email address' }),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters long' })
        .max(30, { message: 'Password must be at most 30 characters long' }),
    fullName: z
        .string()
        .min(0, { message: 'Full name is required' })
        .max(50, { message: 'Full name must be at most 50 characters long' }),
})

export type RegisterData = z.infer<typeof registerSchema>;