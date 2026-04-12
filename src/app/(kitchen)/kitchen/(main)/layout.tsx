'use client'
import React from 'react';

import HeaderAdmin from '@/components/header/header-admin';
import SideRightAdmin from '@/layout/side-right-admin';
import ProtectedRoute from '@/components/protected-router';
// import { ProfileProvider, useUserProfile } from '@/context/user-context';
import { useRouter } from 'next/navigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      {/* <ProfileProvider> */}
        {children}
      {/* </ProfileProvider> */}
    </ProtectedRoute>
  );
}
