import { z } from 'zod';

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(6, { message: 'Mật khẩu hiện tại phải có ít nhất 6 ký tự.' })
    .max(30, { message: 'Mật khẩu hiện tại không được vượt quá 30 ký tự.' }),
  newPassword: z
    .string()
    .min(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' })
    .max(30, { message: 'Mật khẩu mới không được vượt quá 30 ký tự.' }),
  confirmPassword: z
    .string()
    .min(6, { message: 'Xác nhận mật khẩu phải có ít nhất 6 ký tự.' })
    .max(30, { message: 'Xác nhận mật khẩu không được vượt quá 30 ký tự.' }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Mật khẩu mới và xác nhận mật khẩu không khớp',
  path: ['passwordMismatch'],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: 'Mật khẩu mới phải khác mật khẩu hiện tại',
  path: ['currentPasswordMismatch'],
});

export type ChangePasswordData = z.infer<typeof changePasswordSchema>;