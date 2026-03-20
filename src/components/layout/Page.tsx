import React from 'react';
import Header from '@/components/header';

interface PageProps {
  children: React.ReactNode;
  withHeader?: boolean;     // 是否显示 Header，默认 true
  className?: string;       // 主区域附加类，可用于页面自定义间距等
  onSearch?: (term: string) => void; // 透传 Header 的搜索回调
}

const Page: React.FC<PageProps> = ({
  children,
  withHeader = true,
  className = '',
  onSearch = () => {},
}) => {
  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      {withHeader && <Header onSearch={onSearch} />}
      <main className={`flex-1 w-full px-4 md:px-12 lg:px-20 xl:px-24 py-5 ${className}`}>
        {children}
      </main>
    </div>
  );
};

export default Page;
