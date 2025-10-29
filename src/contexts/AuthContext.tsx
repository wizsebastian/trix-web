import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase-config';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Lista de emails de administradores
  const adminEmails = [
    'admin@trixgeo.com',
    'luis@trixgeo.com',
    'geomatrix@gmail.com',
    'wizsebastian@gmail.com'
  ];

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setIsAdmin(false);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const checkAdminStatus = async (user: User | null) => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    // Verificar si el email está en la lista de administradores
    const isEmailAdmin = adminEmails.includes(user.email || '');
    
    if (isEmailAdmin) {
      setIsAdmin(true);
      return;
    }

    // Verificar en la base de datos si existe un documento de admin
    try {
      const adminDoc = await getDoc(doc(db, 'admin_users', user.uid));
      setIsAdmin(adminDoc.exists() && adminDoc.data()?.isAdmin === true);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      await checkAdminStatus(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    isAdmin,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}