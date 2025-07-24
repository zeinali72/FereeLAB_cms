import type { Metadata } from "next";
// import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/auth/SessionProvider";
import { GlobalLoadingIndicator } from "@/components/ui/global-loading-indicator";

// Temporary fallback to system fonts due to Google Fonts access issue
// const plusJakartaSans = Plus_Jakarta_Sans({
//   variable: "--font-plus-jakarta-sans",
//   subsets: ["latin"],
//   display: "swap",
//   weight: ["400", "500", "600", "700"],
// });

export const metadata: Metadata = {
  title: "FereeLAB AI Chat",
  description: "AI Chatbot powered by OpenRouter APIs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased font-sans"
        suppressHydrationWarning
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <GlobalLoadingIndicator />
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
