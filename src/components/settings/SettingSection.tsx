import React from 'react';

interface SettingSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const SettingSection: React.FC<SettingSectionProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      {children}
    </div>
  );
};

export default SettingSection;