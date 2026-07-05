import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "stacksnumber — numbers on demand for verification",
  description:
    "Buy a real, working phone line for the minute it takes to receive an SMS code. No contract, no SIM card, no number tied to your name.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}