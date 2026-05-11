/**
 * KCE Connect — Hybrid Auth Context
 * 
 * Supports both Email/Password (JWT) and Google Sign-In (Firebase).
 * Standardizes on a custom KCE JWT stored in localStorage as 'kce_token'.
 */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  getIdToken,
} from 'firebase/auth';
import { jwtDecode } from 'jwt-decode';
import { auth, googleProvider } from '../firebaseSetup';
import { authService } from '../services/authService';
import type { User } from '../types';

interface AuthContextType {
  user:               User | null;
  loading:            boolean;
  login:              (email: string, password: string) => Promise<void>;
  register:           (details: any) => Promise<void>;
  signInWithGoogle:   () => Promise<void>;
  logout:             () => Promise<void>;
}

interface DecodedToken extends User {
  exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user,    setUser]    = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Hydrate session from localStorage on mount.
   */
  useEffect(() => {
    const token = localStorage.getItem('kce_token');
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        // Check expiration
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
        } else {
          localStorage.removeItem('kce_token');
        }
      } catch (err) {
        console.error('[AuthContext] Token hydration failed:', err);
        localStorage.removeItem('kce_token');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Listen to Firebase auth state changes.
   * If a Firebase user appears (Google Login), we sync with backend to get a KCE JWT.
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // If we already have a user in state, don't re-sync unless necessary
        // (Prevent infinite loops or redundant calls)
        const currentToken = localStorage.getItem('kce_token');
        if (!currentToken) {
           try {
             const idToken = await getIdToken(firebaseUser, true);
             const { token, user: profile } = await authService.syncUser(idToken);
             localStorage.setItem('kce_token', token);
             setUser(profile);
           } catch (err) {
             console.error('[AuthContext] Firebase sync failed:', err);
             await firebaseSignOut(auth);
           }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // ── Standard Login ──────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const { token, user: profile } = await authService.login({ email, password });
      localStorage.setItem('kce_token', token);
      setUser(profile);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Registration ───────────────────────────────────────────
  const register = useCallback(async (details: any) => {
    setLoading(true);
    try {
      const { token, user: profile } = await authService.register(details);
      localStorage.setItem('kce_token', token);
      setUser(profile);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Google Sign-In ──────────────────────────────────────────
  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      if (!firebaseUser.email?.endsWith('@kce.ac.in')) {
        await firebaseSignOut(auth);
        throw new Error('Access restricted to @kce.ac.in accounts.');
      }

      const idToken = await getIdToken(firebaseUser, true);
      const { token, user: profile } = await authService.syncUser(idToken);
      
      localStorage.setItem('kce_token', token);
      setUser(profile);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Logout ──────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await firebaseSignOut(auth);
    localStorage.removeItem('kce_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
