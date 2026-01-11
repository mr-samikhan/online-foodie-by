"use client";
import bcrypt from "bcryptjs";
import { createContext, useContext, useEffect, useState } from "react";
import { useToastStore } from "@/store/ToastStore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToastStore();

  const getStorage = (key) => {
    if (typeof window === "undefined") return null;
    return JSON.parse(localStorage.getItem(key));
  };

  const setStorage = (key, value) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
  };

  // Initialize default users with hashed passwords
  useEffect(() => {
    if (typeof window === "undefined") return;

    let users = getStorage("users");

    if (!users || users.length === 0) {
      users = [
        {
          id: "1",
          username: "admin",
          password: bcrypt.hashSync("1234", 10), // hashed password
          role: "admin",
          permissions: ["dashboard", "services", "settings", "orders"],
        },
        {
          id: "2",
          username: "cashier",
          password: bcrypt.hashSync("1234", 10), // hashed password
          role: "cashier",
          permissions: ["dashboard", "services"],
        },
      ];

      setStorage("users", users);
    }
  }, []);

  useEffect(() => {
    const savedUser = getStorage("user");
    if (savedUser) setUser(savedUser);
    setLoading(false);
  }, []);

  // Login function
  const login = (username, password) => {
    const users = getStorage("users") || [];

    const found = users.find((u) => u.username === username);

    // Compare password using bcrypt
    if (!found || !bcrypt.compareSync(password, found.password)) {
      return showToast("Invalid credentials", "error");
      // throw new Error("Invalid credentials");
      // return { success: false, message: "Invalid credentials" };
    }

    showToast(`Welcome back, ${found.username}!`, "success");

    const sessionUser = {
      id: found.id,
      username: found.username,
      role: found.role,
      permissions: found.permissions,
    };

    setStorage("user", sessionUser);
    setUser(sessionUser);

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
