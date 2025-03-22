
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from './types';
import { getUserByCredentials, STORAGE_KEYS, initializeLocalStorage } from '../data/mockData';
import { useToast } from '@/components/ui/use-toast';

// Create context
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
  isLoading: true,
});

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Initialize data and check for existing user session
  useEffect(() => {
    initializeLocalStorage();
    
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<void> => {
    try {
      const foundUser = getUserByCredentials(username, password);
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(foundUser));
        toast({
          title: "Login successful",
          description: `Welcome back, ${foundUser.name}!`,
        });
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: "An error occurred during login",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Logout function
  const logout = (): void => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  // Context value
  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Higher order component to protect routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles?: string[]
) => {
  const AuthenticatedComponent: React.FC<P> = (props) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const isAuthorized = !allowedRoles || (user && allowedRoles.includes(user.role));

    if (isLoading) {
      return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!isAuthenticated || !isAuthorized) {
      return <Navigate to="/login" />;
    }

    return <Component {...props} />;
  };

  return AuthenticatedComponent;
};

// Import at the bottom to avoid circular dependencies
import { Navigate } from 'react-router-dom';
