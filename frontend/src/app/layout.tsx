"use client";

import { Inter } from 'next/font/google';
import { ThemeProvider } from '../../node_modules/@mui/material/styles';
import CssBaseline from '../../node_modules/@mui/material/CssBaseline';
import { theme } from '../theme/theme';
import { AuthProvider } from '../contexts/AuthContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Box } from '../../node_modules/@mui/material';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <Box component="main" sx={{ flexGrow: 1 }}>
                {children}
              </Box>
              <Footer />
            </Box>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
