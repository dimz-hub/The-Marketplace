import React, { ReactNode } from 'react';

interface FieldsetGroupProps {
  label: string;
  children: ReactNode;
}

const FieldsetGroup = ({ label, children }: FieldsetGroupProps) => (
  <div className="relative mb-6">
    <fieldset className="border-2 border-[#007185] rounded-lg px-3 pb-2 transition-all focus-within:border-[#e47911]">
      <legend className="text-[#007185] px-2 text-sm font-bold ml-2">
        {label}
      </legend>
      {children}
    </fieldset>
  </div>
);

export default FieldsetGroup;