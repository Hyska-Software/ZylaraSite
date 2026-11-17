import { setRequestLocale } from 'next-intl/server';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { StructuredData } from '@/components/seo/StructuredData';
import { Cost } from '@/components/sections/Cost';
import { DownloadSection } from '@/components/sections/DownloadSection';
import { Faq } from '@/components/sections/Faq';
import { FeatureBento } from '@/components/sections/FeatureBento';
import { Hero } from '@/components/sections/Hero';
import { Positioning } from '@/components/sections/Positioning';
import { ProductTour } from '@/components/sections/ProductTour';
import { ProviderRail } from '@/components/sections/ProviderRail';
import { Workflow } from '@/components/sections/Workflow';
import { getLatestRelease } from '@/lib/releases';

type Props = { params: Promise<{ locale: string }> };

/** A versão publicada chega do GitHub Releases: revalida a landing a cada 30 min. */
export const revalidate = 1800;

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const release = await getLatestRelease();

  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <ProductTour />
        <ProviderRail />
        <FeatureBento />
        <Workflow />
        <Positioning />
        <Cost />
        <Faq />
        <DownloadSection />
      </main>
      <SiteFooter />
      <StructuredData release={release} />
    </>
  );
}
