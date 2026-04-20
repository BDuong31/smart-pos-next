'use client';

import { changePassword } from '@/apis/auth';
import EyeRegular from '@/components/icons/eye';
import EyeOffRegular from '@/components/icons/eye-off';
import DebounceInput from '@/components/input/debounce-input';
import { useToast } from '@/context/toast-context';
import React, { useState, FormEvent } from 'react';
import { changePasswordSchema } from '../data';
import { SplashScreen } from '@/components/loading';

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isShowCurrentPassword, setIsShowCurrentPassword] = useState(false);
  const [isShowNewPassword, setIsShowNewPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [errorCurrentPassword, setErrorCurrentPassword] = useState('');
  const [errorNewPassword, setErrorNewPassword] = useState('');
  const [errorConfirmPassword, setErrorConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorCurrentPassword('');
    setErrorNewPassword('');
    setErrorConfirmPassword('');

    const result = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!result.success) {
      result.error.issues.forEach((err) => {
        if (err.path.includes('currentPassword')) {
          setErrorCurrentPassword(err.message);
        }
        if (err.path.includes('newPassword')) {
          setErrorNewPassword(err.message);
        }
        if (err.path.includes('confirmPassword')) {
          setErrorConfirmPassword(err.message);
        }
        if (err.path.includes('passwordMismatch')) {
          setErrorConfirmPassword(err.message);
        }
        if (err.path.includes('currentPasswordMismatch')) {
          setErrorConfirmPassword(err.message);
        }
      });
      setIsLoading(false);
      return;
    }
    try {
      const response = await changePassword(currentPassword, newPassword);
      console.log(response);
      if (response) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setErrorConfirmPassword('Đổi mật khẩu thành công');
      } else {
        setErrorConfirmPassword('Đổi mật khẩu thất bại, vui lòng thử lại');
      }
    } catch (error) {
      setErrorConfirmPassword('Đổi mật khẩu thất bại, vui lòng thử lại');
      console.error('Error changing password:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <SplashScreen className="h-[80vh]" />;
  }
  return (
    <div className="flex flex-col w-full">
      <h1 className="text-2xl font-bold mb-1">Đổi Mật Khẩu</h1>
      <p className="text-graymain mb-8 border-b pb-4">
        Quản lý mật khẩu của bạn để bảo vệ tài khoản
      </p>

      <div className='flex w-full justify-center'>
        <div className="space-y-6 max-w-2xl w-[42rem]">
                <div className="flex items-start">
                    <label className="w-64 text-gray-500 text-right pr-4 self-center" htmlFor="current-password">
                        Mật Khẩu Hiện Tại
                    </label>
                    <div className='flex flex-col w-full'>
                      <div className='relative w-full'>
                        <DebounceInput 
                            type={isShowCurrentPassword ? "text" : "password"}
                            id="current-password"
                            name="current-password"
                            placeholder="Nhập mật khẩu hiện tại"
                            value={currentPassword}
                            onChange={(value: string) => setCurrentPassword(value)}
                            className="w-full px-4 py-3 border border-darkgrey rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div
                          className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
                          onClick={() => setIsShowCurrentPassword(!isShowCurrentPassword)}
                        >
                          {isShowCurrentPassword ? <EyeRegular/> : <EyeOffRegular/>}
                        </div>
                      </div>
                      {errorCurrentPassword && (
                        <p className="text-[#FF0000] text-sm mt-1">{errorCurrentPassword}</p>
                      )}
                    </div>
                </div>

                <div className="flex items-start">
                    <label className="w-64 text-gray-500 text-right pr-4 self-center" htmlFor="new-password">
                      Mật Khẩu Mới
                    </label>
                    <div className='flex flex-col w-full'>
                      <div className='relative w-full'>
                        <DebounceInput 
                            type={isShowNewPassword ? "text" : "password"}
                            id="new-password"
                            name="new-password"
                            placeholder="Nhập mật khẩu mới"
                            value={newPassword}
                            onChange={(value: string) => setNewPassword(value)}
                            className="w-full px-4 py-3 border border-darkgrey rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div
                          className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
                          onClick={() => setIsShowNewPassword(!isShowNewPassword)}
                        >
                          {isShowNewPassword ? <EyeRegular/> : <EyeOffRegular/>}
                        </div>
                      </div>
                      {errorNewPassword && (
                        <p className="text-[#FF0000] text-sm mt-1">{errorNewPassword}</p>
                      )}
                    </div>
                </div>

                <div className="flex items-start">
                  <label className="w-64 text-gray-500 text-right pr-4 self-center" htmlFor="confirm-password">
                      Xác Nhận Mật Khẩu Mới
                  </label>
                  <div className='flex flex-col w-full'>
                    <div className='relative w-full'>
                      <DebounceInput
                          type={isShowConfirmPassword ? "text" : "password"}
                          id="confirm-password"
                          name="confirm-password"
                          placeholder="Xác nhận mật khẩu mới"
                          value={confirmPassword}
                          onChange={(value: string) => setConfirmPassword(value)}
                          className="w-full px-4 py-3 border border-darkgrey rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div
                        className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer"
                        onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
                      >
                        {isShowConfirmPassword ? <EyeRegular/> : <EyeOffRegular/>}
                      </div>
                    </div>
                    {errorConfirmPassword && (
                      <p className="text-[#FF0000] text-sm">{errorConfirmPassword}</p>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                    <button
                    type="submit"
                    className={`btn bg-darkgrey px-2 text-white w-full ${isLoading ? 'btn-disabled' : ''}`}
                    disabled={isLoading}
                    onClick={() => {
                        handleSubmit();
                    }}
                    >
                    {isLoading ? (
                        <span className="loading loading-spinner"></span>
                    ) : (
                        'Lưu Thay Đổi'
                    )}
                    </button>
                </div>
        </div>
      </div>
    </div>
  );
}