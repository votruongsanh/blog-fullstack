import {
  CssBaseline,
  InitColorSchemeScript,
  ThemeProvider,
} from "@mui/material";
import * as React from "react";
import theme from "./theme";

export default function AppThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Gắn script để tránh flicker khi SSR hoặc reload */}
      <InitColorSchemeScript attribute="class" />
      <ThemeProvider theme={theme} defaultMode="system">
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </>
  );
}
