import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { LegalDocument } from '@/components/legal/LegalDocument';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SkipLink } from '@/components/layout/SkipLink';
import { routing } from '@/i18n/routing';
import { legalPaths } from '@/lib/legal';
import { absoluteUrl } from '@/lib/url';

type Props = { params: Promise<{ locale: string }> };

const slug = legalPaths.privacy;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: 'PrivacyPage' });
  const path = locale === routing.defaultLocale ? slug : `/${locale}${slug}`;

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: path,
      languages: {
        en: slug,
        'pt-BR': `/pt-BR${slug}`,
        'x-default': slug,
      },
    },
    openGraph: {
      type: 'website',
      siteName: 'Zylara',
      title: t('metaTitle'),
      description: t('metaDescription'),
      url: absoluteUrl(path),
      locale: locale === 'en' ? 'en_US' : 'pt_BR',
      alternateLocale: locale === 'en' ? ['pt_BR'] : ['en_US'],
    },
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main">
        <LegalDocument namespace="PrivacyPage" current="privacy" />
      </main>
      <SiteFooter />
    </>
  );
}
