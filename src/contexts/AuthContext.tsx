
import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  signup: (username: string, password: string, displayName: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default user for demo
const DEFAULT_USERS = [
  {
    username: "user",
    password: "pass",
    displayName: "Demo User",
    bio: "This is a demo account for testing the blog application.",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=user",
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<Array<{ username: string; password: string; displayName: string; bio: string; avatar: string }>>(DEFAULT_USERS);

  // Check localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("blogUser");
    const storedUsers = localStorage.getItem("blogUsers");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      localStorage.setItem("blogUsers", JSON.stringify(DEFAULT_USERS));
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      setUser(userWithoutPassword);
      localStorage.setItem("blogUser", JSON.stringify(userWithoutPassword));
      return true;
    }
    
    return false;
  };

  const signup = (username: string, password: string, displayName: string): boolean => {
    if (users.some(u => u.username === username)) {
      return false;
    }

    const newUser = {
      username,
      password,
      displayName: displayName || username,
      bio: "",
      avatar: `https://api.dicebear.com/7.x/personas/svg?seed=${username}`,
    };

    setUsers(prev => {
      const updatedUsers = [...prev, newUser];
      localStorage.setItem("blogUsers", JSON.stringify(updatedUsers));
      return updatedUsers;
    });

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem("blogUser", JSON.stringify(userWithoutPassword));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("blogUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
