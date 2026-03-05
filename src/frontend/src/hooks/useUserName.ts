import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "cafeteria_user_name";
const LOGGED_IN_KEY = "cafeteria_is_logged_in";

function readStoredName(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

function readIsLoggedIn(): boolean {
  try {
    return localStorage.getItem(LOGGED_IN_KEY) === "true";
  } catch {
    return false;
  }
}

export interface UseUserNameReturn {
  userName: string;
  isLoggedIn: boolean;
  login: (name: string) => void;
  logout: () => void;
  setUserName: (name: string) => void;
}

// Module-level listeners so all consumers share a single source of truth
type Listener = () => void;
const listeners = new Set<Listener>();

function notifyListeners() {
  for (const fn of listeners) {
    fn();
  }
}

export function useUserName(): UseUserNameReturn {
  const [userName, setUserNameState] = useState<string>(readStoredName);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(readIsLoggedIn);

  // Re-sync when another tab or component mutates localStorage
  useEffect(() => {
    const sync = () => {
      setUserNameState(readStoredName());
      setIsLoggedIn(readIsLoggedIn());
    };

    listeners.add(sync);
    window.addEventListener("storage", sync);

    return () => {
      listeners.delete(sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const login = useCallback((rawName: string) => {
    const trimmed = rawName.trim() || "Student";
    try {
      localStorage.setItem(STORAGE_KEY, trimmed);
      localStorage.setItem(LOGGED_IN_KEY, "true");
    } catch {
      /* storage unavailable — still update state */
    }
    setUserNameState(trimmed);
    setIsLoggedIn(true);
    notifyListeners();
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LOGGED_IN_KEY);
    } catch {
      /* ignore */
    }
    setUserNameState("");
    setIsLoggedIn(false);
    notifyListeners();
  }, []);

  const setUserName = useCallback((name: string) => {
    const trimmed = name.trim() || "Student";
    try {
      localStorage.setItem(STORAGE_KEY, trimmed);
    } catch {
      /* ignore */
    }
    setUserNameState(trimmed);
    notifyListeners();
  }, []);

  return { userName, isLoggedIn, login, logout, setUserName };
}
