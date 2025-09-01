import TelegramInit from "@/components/TelegramInit";
import ReactQueryProvider from "@/lib/queryClient/ReactQueryProvider";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools/production";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import BottomNavigation from "../components/BottomNavigation"; // app/layout.tsx или компонент TelegramProvider
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vapestore Liquid Lounge",
  description: "Поды, жидкости, картриджи по самым выгодным ценам.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scrollbar-hide">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-100 m-auto h-screen py-5 scrollbar-hide`}
      >
        <TelegramInit />
        <ReactQueryProvider>
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          {children}
          <BottomNavigation />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
