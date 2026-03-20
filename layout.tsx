
import Header from './src/components/header';
import './globals.css';
import React from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <Header onSearch={() => {}} />
        {children}
      </body>
    </html>
  );
}
