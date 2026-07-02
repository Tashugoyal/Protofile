import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  getCurrentUser,
  saveProfile,
  saveTheme,
  signin,
  signout,
  signup,
} from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser());

  const handleSignup = useCallback((data) => {
    const newUser = signup(data);
    setUser(newUser);
    return newUser;
  }, []);

  const handleSignin = useCallback((data) => {
    const loggedIn = signin(data);
    setUser(loggedIn);
    return loggedIn;
  }, []);

  const handleSignout = useCallback(() => {
    signout();
    setUser(null);
  }, []);

  const handleSaveProfile = useCallback((profile) => {
    if (!user) return null;
    const updated = saveProfile(user.id, profile);
    setUser(updated);
    return updated;
  }, [user]);

  const handleSaveTheme = useCallback((theme) => {
    if (!user) return null;
    const updated = saveTheme(user.id, theme);
    setUser(updated);
    return updated;
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      signup: handleSignup,
      signin: handleSignin,
      signout: handleSignout,
      saveProfile: handleSaveProfile,
      saveTheme: handleSaveTheme,
    }),
    [user, handleSignup, handleSignin, handleSignout, handleSaveProfile, handleSaveTheme],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
