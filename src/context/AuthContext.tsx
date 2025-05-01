
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'eventsAttended'>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Jane Smith',
    email: 'jane@skasc.ac.in',
    department: 'Computer Science',
    year: '3',
    interests: ['tech', 'career', 'seminar'],
    eventsAttended: ['1', '3', '5'],
    profileImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&h=250&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '2',
    name: 'Mike Johnson',
    email: 'mike@skasc.ac.in',
    department: 'Business Administration',
    year: '2',
    interests: ['sports', 'social', 'cultural'],
    eventsAttended: ['2', '4'],
    profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&h=250&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '3',
    name: 'Priya Patel',
    email: 'priya@skasc.ac.in',
    department: 'Electronics Engineering',
    year: '4',
    interests: ['tech', 'cultural', 'career'],
    eventsAttended: ['1', '5', '6'],
    profileImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=250&h=250&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  },
  {
    id: '4',
    name: 'Alex Chen',
    email: 'alex@skasc.ac.in',
    department: 'Computer Science',
    year: '3',
    interests: ['tech', 'seminar'],
    eventsAttended: ['3', '7'],
    profileImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&h=250&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  }
];

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Validate university email
      if (!email.endsWith('@skasc.ac.in')) {
        throw new Error('Please use your university email (@skasc.ac.in)');
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if the user exists in our mock data
      const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        toast({
          title: `Welcome back, ${foundUser.name}!`,
          description: "You've successfully signed in",
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Signed out",
      description: "You've been successfully logged out",
    });
  };

  const register = async (userData: Omit<User, 'id' | 'eventsAttended'>): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      const emailExists = mockUsers.some(u => u.email.toLowerCase() === userData.email.toLowerCase());
      if (emailExists) {
        return false;
      }
      
      // Create a new user
      const newUser: User = {
        ...userData,
        id: (mockUsers.length + 1).toString(),
        eventsAttended: []
      };
      
      // In a real app, we would send this to an API
      // For now, we'll just log it
      console.log('Registered new user:', newUser);
      
      // Auto-login the new user
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      toast({
        title: `Welcome to HedWig, ${newUser.name}!`,
        description: "Your account has been created successfully",
      });
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
