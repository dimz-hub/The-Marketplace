"use client"
import React from 'react';
import { useParams } from 'next/navigation';
import BusinessRegistration from '@/app/components/BusinessForm'; // Update this to match your form component file path

export default function EditBusinessPage() {
  const params = useParams();
  
  // Captures the dynamic segment from the url path (/business/edit/123abc456)
  const businessId = params?.id as string;

  return (
    <div className="min-h-screen bg-gray-100 py-12 ">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Modify Workspaces</h1>
        <p className="text-sm text-gray-500 mt-1">Make changes to your registered organization properties below.</p>
      </div>

      {/* 🚀 Pass down the dynamic editId directly to toggle your Form into PATCH mode */}
      <div className='mt-[70px]'>

      <BusinessRegistration editId={businessId} />
      </div>
    </div>
  );
}