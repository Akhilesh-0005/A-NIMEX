import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../data/users';

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password_unused: string) => Promise<{success: boolean, message: string}>;
  logout: () => void;
  signup: (email: string, password_unused: string) => Promise<{success: boolean, message: string}>;
  changePassword: (email: string, currentPassword: string, newPassword: string) => Promise<{success: boolean, message: string}>;
  deleteUser: (userId: string) => Promise<{success: boolean, message: string}>;
  toggleFavorite: (movieId: number) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  useEffect(() => {
    // Simulate checking for a logged-in user in local storage
    const storedUser = localStorage.getItem('animeVaultUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Also load favorites from their specific storage
      const userFavorites = JSON.parse(localStorage.getItem(`animeVaultFavorites-${parsedUser.id}`) || '[]');
      setUser({ ...parsedUser, favorites: userFavorites });
    }
  }, []);

  const login = useCallback(async (email: string, password): Promise<{success: boolean, message: string}> => {
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        const foundUser = users.find(u => u.email === email);
        if (foundUser && foundUser.password === password) {
          const userFavorites = JSON.parse(localStorage.getItem(`animeVaultFavorites-${foundUser.id}`) || '[]');
          const userWithFavorites = { ...foundUser, favorites: userFavorites };
          setUser(userWithFavorites);
          localStorage.setItem('animeVaultUser', JSON.stringify(userWithFavorites));
          return { success: true, message: 'Login successful!' };
        }
        return { success: false, message: 'Invalid email or password.' };
    } catch (error) {
        console.error("Login failed:", error);
        return { success: false, message: 'An unexpected error occurred. Please try again later.' };
    }
  }, [users]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('animeVaultUser');
  }, []);

  const signup = useCallback(async (email: string, password: string): Promise<{success: boolean, message: string}> => {
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        if (users.some(u => u.email === email)) {
          return { success: false, message: 'An account with this email already exists.' };
        }
        const newUser: User = { id: Date.now().toString(), email, password, favorites: [] };
        setUsers(prevUsers => [...prevUsers, newUser]);
        setUser(newUser);
        localStorage.setItem('animeVaultUser', JSON.stringify(newUser));
        localStorage.setItem(`animeVaultFavorites-${newUser.id}`, JSON.stringify([]));
        return { success: true, message: 'Signup successful!' };
    } catch (error) {
        console.error("Signup failed:", error);
        return { success: false, message: 'An unexpected error occurred. Please try again later.' };
    }
  }, [users]);

  const changePassword = useCallback(async (email: string, currentPassword: string, newPassword: string): Promise<{success: boolean, message: string}> => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const userIndex = users.findIndex(u => u.email === email);
        if (userIndex === -1) {
            return { success: false, message: "User not found." };
        }
        
        const foundUser = users[userIndex];
        if (foundUser.password !== currentPassword) {
            return { success: false, message: "Incorrect current password." };
        }

        const updatedUsers = [...users];
        updatedUsers[userIndex] = { ...foundUser, password: newPassword };
        setUsers(updatedUsers);

        return { success: true, message: "Password updated successfully!" };
    } catch (error) {
        console.error("Change password failed:", error);
        return { success: false, message: 'An unexpected error occurred. Please try again later.' };
    }
  }, [users]);
  
  const deleteUser = useCallback(async (userId: string): Promise<{ success: boolean, message: string }> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
      return { success: true, message: "User deleted." };
    } catch (error) {
      console.error("Delete user failed:", error);
      return { success: false, message: "Failed to delete user." };
    }
  }, []);

  const toggleFavorite = useCallback((movieId: number) => {
    setUser(currentUser => {
        if (!currentUser) return null;

        const currentFavorites = currentUser.favorites || [];
        const isFavorited = currentFavorites.includes(movieId);
        const newFavorites = isFavorited
            ? currentFavorites.filter(id => id !== movieId)
            : [...currentFavorites, movieId];
        
        const updatedUser = { ...currentUser, favorites: newFavorites };
        
        localStorage.setItem(`animeVaultFavorites-${currentUser.id}`, JSON.stringify(newFavorites));
        localStorage.setItem('animeVaultUser', JSON.stringify(updatedUser)); 

        return updatedUser;
    });
  }, []);


  return (
    <AuthContext.Provider value={{ user, users, login, logout, signup, changePassword, deleteUser, toggleFavorite }}>
      {children}
    </AuthContext.Provider>
  );
};