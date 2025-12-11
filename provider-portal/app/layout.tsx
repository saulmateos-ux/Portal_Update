import type { Metadata } from 'next';
import { Montserrat, Lexend } from 'next/font/google';
import './globals.css';

/**
 * GAIN Provider Portal - Root Layout
 * Typography: Montserrat Bold (headlines) + Lexend (body)
 * Based on GAIN Brand Design Guidelines v3.0 (December 2025)
 */

// Montserrat for headlines (Gilroy alternative)
const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  weight: ['700'], // Bold only for headlines
  variable: '--font-montserrat',
});

// Lexend for body text
const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '600'], // Regular and Semi-bold
  variable: '--font-lexend',
});

export const metadata: Metadata = {
  title: 'GAIN Provider Portal',
  description: 'Enhanced Provider Portal for GAIN - AI-powered financial analytics and insights',
  keywords: ['healthcare finance', 'personal injury', 'receivables management', 'analytics'],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' }
    ],
  },
};

/**
 * Root Layout - No authentication required
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${lexend.variable}`}>
      <body className={lexend.className}>
        {children}
      </body>
    </html>
  );
}
