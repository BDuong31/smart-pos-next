'use client'
import React from 'react';

import HeaderAdmin from '@/components/header/header-admin';
import SideRightAdmin from '@/layout/side-right-admin';
import ProtectedRoute from '@/components/protected-router';
// import { ProfileProvider, useUserProfile } from '@/context/user-context';
import { useRouter } from 'next/navigation';
import { Socket } from 'socket.io-client';
import { SocketProvider } from '@/context/socket-context';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute>
      {/* <ProfileProvider> */}
      <SocketProvider>
        {children}
      </SocketProvider>
      {/* </ProfileProvider> */}
    </ProtectedRoute>
  );
}
