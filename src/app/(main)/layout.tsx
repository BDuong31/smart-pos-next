'use client';
import React, { useEffect } from 'react';

import Header from '@/components/header/header';
import Footer from '@/components/footer';
import { fetchCartByUserId } from '@/store/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getMe } from '@/store/slices/userSlice';
import { SocketProvider } from '@/context/socket-context';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);


  useEffect(() => {
    if (!user) {
      dispatch(getMe());
    } 
  }, [dispatch, user]);
  
  useEffect(() => {
      if (user?.id) {
          dispatch(fetchCartByUserId(user.id));
      }
  }, [user, dispatch]);

  return (
        <div className='pt-8'>
            <Header />
            <SocketProvider>
            {children}
            </SocketProvider>
            <Footer />
        </div>
  );
}
