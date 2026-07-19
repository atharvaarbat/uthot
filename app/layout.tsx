import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Sans, Raleway, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

const ralewayHeading = Raleway({ subsets: ['latin'], variable: '--font-heading' });

const instrumentSans = Instrument_Sans({ subsets: ['latin'], variable: '--font-sans' });

const instrumentSerif = Instrument_Serif({ subsets: ['latin'], weight: ['400'], variable: '--font-serif' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://uthot.hdtl.in"),
  title: "uthot — seven gates for founders",
  description:
    "Thirty-five questions you can't paste your way through. A thinking instrument for founders.",
  openGraph: {
    title: "uthot — seven gates for founders",
    description:
      "Thirty-five questions you can't paste your way through. A thinking instrument for founders.",
    url: "https://uthot.hdtl.in",
    siteName: "uthot",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "uthot — seven gates for founders",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "uthot — seven gates for founders",
    description:
      "Thirty-five questions you can't paste your way through. A thinking instrument for founders.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", instrumentSans.variable, ralewayHeading.variable, instrumentSerif.variable)}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>

      </body>
    </html>
  );
}
