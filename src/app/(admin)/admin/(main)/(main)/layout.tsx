'use client'
import React from 'react';

import HeaderAdmin from '@/components/header/header-admin';
import SideRightAdmin from '@/layout/side-right-admin';
// import { useUserProfile } from '@/context/user-context';
import { useRouter } from 'next/navigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const { userProfile } = useUserProfile()
  // const router = useRouter()
  // React.useEffect(() => {
  //   if(userProfile?.role === 'customer'){
  //     router.replace('http://localhost:3001')
  //   }
  // },[userProfile, router])
  return (
    <div className='flex'>
        <SideRightAdmin />
        <div className='flex flex-col self-start w-full max-h-screen overflow-auto'>
          <HeaderAdmin />
          {children}
        </div>
    </div>
  );
}
