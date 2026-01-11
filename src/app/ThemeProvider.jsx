"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeProvider({ children }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return <div className={theme === "dark" ? "dark" : ""}>{children}</div>;
}
