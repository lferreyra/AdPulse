import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "AdPulse Intelligence — Inteligencia de Anuncios Meta",
    template: "%s | AdPulse Intelligence",
  },
  description:
    "Descubre, analiza y monitorea productos digitales promocionados en Meta Ads. Señales observables, datos transparentes, decisiones informadas.",
  keywords: ["meta ads", "ads library", "productos digitales", "marketing", "research"],
  openGraph: {
    title: "AdPulse Intelligence",
    description: "Inteligencia de anuncios Meta para marketers y emprendedores.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <Toaster position="bottom-right" theme="system" />
        </ThemeProvider>
      </body>
    </html>
  );
}
