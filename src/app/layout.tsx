import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Script from "next/script";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-reddit-sans",
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
    <html lang="en" className={ibmPlexSans.variable}>
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
