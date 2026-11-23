import type { Metadata } from "next";
import "./globals.css";
import ToastProvider from "./ToastProvider";

export const metadata: Metadata = {
  title: "FixMate - Trusted Local Repair Support",
  description: "Find trusted local repair services for your devices.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
