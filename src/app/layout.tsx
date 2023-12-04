import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/ui/Navigation";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Stocks",
  description: "Binance-like",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Navigation />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
