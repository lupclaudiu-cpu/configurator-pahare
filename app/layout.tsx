import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Configurator Pahare Personalizate",
  description: "Configurator premium pentru pahare personalizate cu logo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  );
}
