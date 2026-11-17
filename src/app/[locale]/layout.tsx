import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { localeLabels, routing } from '@/i18n/routing';
import {
  languageAlternates,
  localePrefix,
  localizedPath,
  ogAlternateLocales,
  ogLocale,
} from '@/lib/locale';
import { theme } from '@/lib/theme';
import { absoluteUrl, siteUrl } from '@/lib/url';
import '../globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono-jetbrains',
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: theme.background,
  colorScheme: theme.colorScheme,
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata({ params }: Omit<Props, 'children'>): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'Metadata' });
  const path = localePrefix(locale);
  const canonical = localizedPath(locale, '/');

  return {
    metadataBase: new URL(siteUrl),
    title: t('title'),
    description: t('description'),
    applicationName: 'Zylara',
    alternates: {
      canonical,
      languages: languageAlternates('/'),
    },
    openGraph: {
      type: 'website',
      siteName: 'Zylara',
      title: t('title'),
      description: t('description'),
      url: absoluteUrl(canonical),
      locale: ogLocale(locale),
      alternateLocale: ogAlternateLocales(locale),
      images: [{ url: `${path}/opengraph-image`, width: 1200, height: 630, alt: t('title') }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
    },
    icons: {
      icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
      apple: [{ url: '/brand/zylara-tile.svg' }],
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const htmlLang = localeLabels[locale].htmlLang;

  return (
    <html lang={htmlLang} className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="bg-background text-foreground antialiased">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
