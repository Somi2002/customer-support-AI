"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
