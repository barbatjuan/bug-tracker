import { useState, useEffect } from 'react';
import { User } from '../types';
import { getCurrentUser, setCurrentUser, getUsers } from '../utils/storage';

export const useAuth = () => {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUserState(user);
    setLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    // Simple authentication - in production, this would be handled by a backend
    const users = getUsers();
    const user = users.find(u => u.username === username);
    
    if (user && password === 'password') { // Simple password for demo
      setCurrentUser(user);
      setCurrentUserState(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentUserState(null);
  };

  return {
    currentUser,
    login,
    logout,
    loading,
    isAuthenticated: !!currentUser,
  };
};