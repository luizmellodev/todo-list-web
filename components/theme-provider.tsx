"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false} // Desabilite temporariamente para testar
      disableTransitionOnChange
      forcedTheme="light" // Force um tema inicial
    >
      {children}
    </NextThemesProvider>
  );
}
