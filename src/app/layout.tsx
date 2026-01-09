import type { Metadata, Viewport } from "next";
import { Exo_2 } from "next/font/google";
import "./globals.css";
import { ClientHeader } from "@/components/layout/ClientHeader";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";

const exo2 = Exo_2({
  variable: "--font-exo2",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://new.ravenindustries.fr';

export const viewport: Viewport = {
  themeColor: '#44D92C',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Raven Industries - Pièces Détachées Moto, Quad, Jet-ski, Motoneige",
    template: "%s | Raven Industries",
  },
  description: "Spécialiste de la pièce détachée pour moto, quad, jet-ski et motoneige. Large choix de pièces de qualité au meilleur prix. Livraison rapide en France.",
  keywords: ["pièces détachées", "moto", "quad", "jet-ski", "motoneige", "raven industries", "accessoires moto", "pièces quad", "équipement moto"],
  authors: [{ name: "Raven Industries" }],
  creator: "Raven Industries",
  publisher: "Raven Industries",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Raven Industries - Pièces Détachées Moto & Quad",
    description: "Spécialiste de la pièce détachée pour moto, quad, jet-ski et motoneige. Qualité professionnelle au meilleur prix.",
    type: "website",
    locale: "fr_FR",
    siteName: "Raven Industries",
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Raven Industries - Pièces Détachées",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Raven Industries - Pièces Détachées",
    description: "Spécialiste de la pièce détachée pour moto, quad, jet-ski et motoneige",
    images: [`${siteUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // À remplir avec vos codes de vérification
    // google: 'votre-code-google',
    // yandex: 'votre-code-yandex',
    // bing: 'votre-code-bing',
  },
  category: 'ecommerce',
};

import { OrganizationSchema, WebsiteSchema, LocalBusinessSchema } from "@/components/seo/JsonLd";
import { Analytics } from "@/components/analytics/Analytics";
import { CookieBanner } from "@/components/gdpr/CookieBanner";
import { ToastProvider } from "@/components/ui/toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png?v=3" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png?v=3" />
        <link rel="icon" href="/favicon.ico?v=3" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico?v=3" />
        <OrganizationSchema />
        <WebsiteSchema />
        <LocalBusinessSchema />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=3" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${exo2.variable} font-sans antialiased bg-[#0a0a0a] text-[#e0e0e0]`} suppressHydrationWarning>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <div className="flex flex-col min-h-screen">
                <ClientHeader />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
              <CookieBanner />
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
        <Analytics />
      </body>
    </html>
  );
}
