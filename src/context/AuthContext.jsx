import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/config";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(
    localStorage.getItem("sitesentri_guest_mode") === "true"
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);

      if (firebaseUser) {
        setIsGuest(false);
        localStorage.removeItem("sitesentri_guest_mode");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    setIsGuest(false);
    localStorage.removeItem("sitesentri_guest_mode");
    return result;
  };

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    setIsGuest(false);
    localStorage.removeItem("sitesentri_guest_mode");
    return result;
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem("sitesentri_guest_mode");
  };

  const continueAsGuest = () => {
    setUser(null);
    setIsGuest(true);
    localStorage.setItem("sitesentri_guest_mode", "true");
  };

  const exitGuestMode = () => {
    setIsGuest(false);
    localStorage.removeItem("sitesentri_guest_mode");
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isGuest,
      signup,
      login,
      logout,
      continueAsGuest,
      exitGuestMode,
      isAuthenticated: !!user || isGuest,
    }),
    [user, loading, isGuest]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }
  return context;
};