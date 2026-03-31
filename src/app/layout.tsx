import type { Metadata, Viewport } from "next";
import { Quicksand, Pacifico } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-quicksand" });
const pacifico = Pacifico({ subsets: ["latin"], weight: ["400"], variable: "--font-pacifico" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents auto-zoom on mobile inputs
};

export const metadata: Metadata = {
  title: "Loya Pâtisserie - En Tatlı Pastalar",
  description: "Sevdikleriniz için harika pastalar sipariş verin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${quicksand.variable} ${pacifico.variable} font-sans antialiased min-h-[100dvh] flex flex-col text-gray-800`}>
        <main className="flex-1 flex flex-col relative w-full overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
