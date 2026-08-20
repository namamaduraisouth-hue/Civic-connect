import React from 'react';

export const CivicEmblem: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Golden Shield / Circle */}
      <circle cx="50" cy="50" r="48" fill="#0F2942" stroke="#D97706" strokeWidth="4" />
      <circle cx="50" cy="50" r="42" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="4 2" />
      
      {/* Gopuram Tower Silhouette */}
      <path d="M50 14 L55 24 H45 L50 14 Z" fill="#F59E0B" />
      <path d="M43 24 H57 V32 H43 V24 Z" fill="#D97706" />
      <path d="M40 32 H60 V42 H40 V32 Z" fill="#F59E0B" />
      <path d="M36 42 H64 V54 H36 V42 Z" fill="#D97706" />
      <path d="M32 54 H68 V68 H32 V54 Z" fill="#F59E0B" />
      <path d="M28 68 H72 V82 H28 V68 Z" fill="#0F2942" stroke="#D97706" strokeWidth="2" />
      
      {/* Gopuram Doorway */}
      <path d="M44 82 V70 Q50 64 56 70 V82 Z" fill="#FFFFFF" />
      
      {/* Civic Connect Node Dot & Waves */}
      <circle cx="50" cy="48" r="4" fill="#60A5FA" />
      <path d="M36 86 C42 82 58 82 64 86" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};
