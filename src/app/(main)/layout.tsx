import React from 'react';

import Header from '@/components/header/header';
import Footer from '@/components/footer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <div className='pt-8'>
            <Header />
            {children}
            <Footer />
        </div>
  );
}
