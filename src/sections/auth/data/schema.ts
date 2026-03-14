import { z } from "zod";

export const loginSchema = z.object({
    username: z
        .string()
        .min(0, { message: 'Tên người dùng là bắt buộc' }),
    password: z
        .string()
        .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
        .max(30, { message: 'Mật khẩu không được quá 30 ký tự' }),
})

export type LoginData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    username: z
        .string()
        .min(6, { message: 'Tên người dùng phải có ít nhất 6 ký tự' })
        .max(30, { message: 'Tên người dùng không được quá 30 ký tự' }),
    email: z
        .string()
        .min(0, { message: 'Địa chỉ email là bắt buộc' })
        .email({ message: 'Địa chỉ email không hợp lệ' }),
    password: z
        .string()
        .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
        .max(30, { message: 'Mật khẩu không được quá 30 ký tự' }),
    fullName: z
        .string()
        .min(0, { message: 'Họ và tên là bắt buộc' })
        .max(50, { message: 'Họ và tên không được quá 50 ký tự' }),
})

export type RegisterData = z.infer<typeof registerSchema>;