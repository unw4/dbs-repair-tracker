import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tamir Takip",
  description: "Bilgisayar tamircisi iş takip sistemi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
