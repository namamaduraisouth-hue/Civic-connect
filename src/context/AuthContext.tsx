import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, AuthUser } from '../types';
import { MADURAI_SOUTH_WARDS } from '../data/maduraiSouthWards';

export const DEMO_USERS: AuthUser[] = [
  {
    id: "user-mla-001",
    email: "mla@maduraisouth.gov.in",
    role: "mla",
    name: "M. Boominathan (MLA, 192-Madurai South)",
    phone: "0452-2530111",
    created_at: "2026-01-01T00:00:00Z"
  },
  {
    id: "user-councillor-ward51",
    email: "councillor.ward51@maduraisouth.gov.in",
    role: "councillor",
    name: "K. Pandian",
    ward_id: "WARD_51",
    ward_name: "Ward 51 - Thirumalai Nayakkar Mahal",
    phone: "9842100051",
    created_at: "2026-01-01T00:00:00Z"
  },
  {
    id: "user-councillor-ward52",
    email: "councillor.ward52@maduraisouth.gov.in",
    role: "councillor",
    name: "R. Banumathi",
    ward_id: "WARD_52",
    ward_name: "Ward 52 - Kamarajar Salai North",
    phone: "9842100052",
    created_at: "2026-01-01T00:00:00Z"
  },
  {
    id: "user-councillor-ward55",
    email: "councillor.ward55@maduraisouth.gov.in",
    role: "councillor",
    name: "R. Senthil Kumar",
    ward_id: "WARD_55",
    ward_name: "Ward 55 - Mariamman Kovil Teppakulam",
    phone: "9842100055",
    created_at: "2026-01-01T00:00:00Z"
  },
  {
    id: "user-councillor-ward58",
    email: "councillor.ward58@maduraisouth.gov.in",
    role: "councillor",
    name: "C. Maruthu",
    ward_id: "WARD_58",
    ward_name: "Ward 58 - Villapuram Main",
    phone: "9842100058",
    created_at: "2026-01-01T00:00:00Z"
  }
];

interface AuthContextType {
  user: AuthUser | null;
  role: Role;
  isAuthenticated: boolean;
  isMla: boolean;
  isCouncillor: boolean;
  selectedWardFilter: string;
  setSelectedWardFilter: (wardId: string) => void;
  login: (email: string, password?: string, requiredRole?: Role) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('madurai_civic_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse auth user", e);
      }
    }
    return null;
  });

  const [selectedWardFilter, setSelectedWardFilter] = useState<string>(() => {
    if (user?.ward_id) return user.ward_id;
    return 'WARD_51';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('madurai_civic_auth_user', JSON.stringify(user));
      if (user.ward_id) setSelectedWardFilter(user.ward_id);
    } else {
      localStorage.removeItem('madurai_civic_auth_user');
    }
  }, [user]);

  const login = (
    email: string, 
    _password?: string, 
    requiredRole?: Role
  ): { success: boolean; error?: string } => {
    const normalizedEmail = email.trim().toLowerCase();
    const matchedUser = DEMO_USERS.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!matchedUser) {
      // Check if trying to login with a general councillor or mla pattern
      if (normalizedEmail.includes('mla')) {
        const fallbackMla = DEMO_USERS[0];
        if (requiredRole && requiredRole !== 'mla') {
          return { success: false, error: 'Unauthorized role access' };
        }
        setUser(fallbackMla);
        return { success: true };
      }

      if (normalizedEmail.includes('councillor')) {
        const fallbackCouncillor = DEMO_USERS[1];
        if (requiredRole && requiredRole !== 'councillor') {
          return { success: false, error: 'Unauthorized role access' };
        }
        setUser(fallbackCouncillor);
        setSelectedWardFilter(fallbackCouncillor.ward_id || 'WARD_51');
        return { success: true };
      }

      return { success: false, error: 'Invalid email or password' };
    }

    if (requiredRole && matchedUser.role !== requiredRole) {
      return { 
        success: false, 
        error: `Access Denied: ${matchedUser.role.toUpperCase()} account cannot access ${requiredRole.toUpperCase()} portal.` 
      };
    }

    setUser(matchedUser);
    if (matchedUser.ward_id) {
      setSelectedWardFilter(matchedUser.ward_id);
    }
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const role: Role = user ? user.role : 'citizen';
  const isAuthenticated = Boolean(user);
  const isMla = role === 'mla';
  const isCouncillor = role === 'councillor';

  return (
    <AuthContext.Provider value={{ 
      user,
      role, 
      isAuthenticated,
      isMla,
      isCouncillor,
      selectedWardFilter, 
      setSelectedWardFilter,
      login,
      logout
    }}>
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

