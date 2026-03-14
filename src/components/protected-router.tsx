'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
// import { useAuth } from '@/context/auth-context';

//-----------------------------------------------------------------------------------------------

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useSelector(
        (state: RootState) => state.auth.isAuthenticated
  );
  
  const router = useRouter();

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  return <>{children}</>;
};

export default ProtectedRoute;
