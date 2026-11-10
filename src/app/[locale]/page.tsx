import { setRequestLocale } from 'next-intl/server';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SkipLink } from '@/components/layout/SkipLink';
import { DownloadSection } from '@/components/sections/DownloadSection';
import { Faq } from '@/components/sections/Faq';
import { FeatureBento } from '@/components/sections/FeatureBento';
import { FinalCta } from '@/components/sections/FinalCta';
import { Hero } from '@/components/sections/Hero';
import { Positioning } from '@/components/sections/Positioning';
import { ProviderRail } from '@/components/sections/ProviderRail';
import { Workflow } from '@/components/sections/Workflow';

type Props = { params: Promise<{ locale: string }> };

/** A versão publicada chega do GitHub Releases: revalida a landing a cada 30 min. */
export const revalidate = 1800;

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main">
        <Hero />
        <ProviderRail />
        <FeatureBento />
        <Workflow />
        <Positioning />
        <Faq />
        <DownloadSection />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
