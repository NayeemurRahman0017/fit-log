import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Footer} from "./Components/shared/Footer";

import Navbar from "./Components/shared/Navbar";

import { AppProvider } from "./Components/shared/AppProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FitLog",
  description: "Workout Library",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col`}
      >
        <AppProvider>
          <Navbar />
          

          <main className="flex-1">
            {children}
          </main>
          <Footer/>

          
        </AppProvider>
      </body>
    </html>
  );
}