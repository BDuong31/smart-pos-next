'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { getProfile } from '@/apis/user';
import { getMe } from '@/store/slices/userSlice'
//-----------------------------------------------------------------------------------------------

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(
        (state: RootState) => state.auth.isAuthenticated
  );
  const { user } = useSelector((state: RootState) => state.user);
  
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }

    if (isAuthenticated && !user) {
      dispatch(getMe());
    }
  }, [isAuthenticated, user, router]);

  return <>{children}</>;
};

export default ProtectedRoute;
