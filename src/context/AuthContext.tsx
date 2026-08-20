import React, { createContext, useContext, useState } from 'react';
import { Role } from '../types';

interface AuthContextType {
  role: Role;
  setRole: (role: Role) => void;
  selectedWardFilter: string;
  setSelectedWardFilter: (wardId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('citizen');
  const [selectedWardFilter, setSelectedWardFilter] = useState<string>('WARD_51');

  return (
    <AuthContext.Provider value={{ role, setRole, selectedWardFilter, setSelectedWardFilter }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
