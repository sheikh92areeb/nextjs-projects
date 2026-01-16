import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SnapCart | 10 minutes Grocery Delivery App",
  description: "10 minutes Grocery Delivery App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full min-h-screen bg-linear-to-b from-green-200 to-white">
        {children}
      </body>
    </html>
  );
}
