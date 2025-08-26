import TelegramInit from "@/components/TelegramInit";
import ReactQueryProvider from "@/lib/queryClient/ReactQueryProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools/production";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-100 m-auto overflow-y-hidden py-5 `}
      >
        <TelegramInit />
        <ReactQueryProvider>
          <ReactQueryDevtools initialIsOpen={false} />
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
