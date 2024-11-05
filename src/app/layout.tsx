import { Readex_Pro } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Script from "next/script";

const readexPro = Readex_Pro({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-readex",
});

export const metadata = {
  title: "StudySmart - Your Personal Study Companion",
  description:
    "Organize your study time effectively with personalized study plans",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={readexPro.variable}>
      <head>
        <Script
          src="//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <Providers>
          <main className="min-h-screen font-sans">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
