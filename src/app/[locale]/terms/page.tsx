import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { LegalDocument } from '@/components/legal/LegalDocument';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { routing } from '@/i18n/routing';
import { legalPaths } from '@/lib/legal';
import { languageAlternates, localizedPath, ogAlternateLocales, ogLocale } from '@/lib/locale';
import { absoluteUrl } from '@/lib/url';

type Props = { params: Promise<{ locale: string }> };

const slug = legalPaths.terms;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'TermsPage' });
  const path = localizedPath(locale, slug);

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: path,
      languages: languageAlternates(slug),
    },
    openGraph: {
      type: 'website',
      siteName: 'Zylara',
      title: t('metaTitle'),
      description: t('metaDescription'),
      url: absoluteUrl(path),
      locale: ogLocale(locale),
      alternateLocale: ogAlternateLocales(locale),
    },
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <>
      <SiteHeader />
      <main id="main">
        <LegalDocument namespace="TermsPage" current="terms" />
      </main>
      <SiteFooter />
    </>
  );
}
