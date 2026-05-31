import Navbar from '@/app/components/Navbar';
import React from 'react';

interface SubFolderLayoutProps {
  children: React.ReactNode;
}

export default function SubFolderLayout({ children }: SubFolderLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Optional: You can place a sub-navigation or header here */}
      <div className = 'w-[90%] mx-auto'>

       <Navbar  color = {true}/>
      </div>

      {/* This renders the active page.tsx file of the folder */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}