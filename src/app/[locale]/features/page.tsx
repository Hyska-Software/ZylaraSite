import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SkipLink } from '@/components/layout/SkipLink';
import { CheckIcon } from '@/components/pages/PageIcons';
import { PageCta } from '@/components/pages/PageCta';
import { PageHero } from '@/components/pages/PageHero';
import { PageNav } from '@/components/pages/PageNav';
import { PageSection } from '@/components/pages/PageSection';
import {
  ArtifactsFragment,
  DiffFragment,
  FolderFragment,
  LibraryFragment,
  ModesFragment,
  PermissionMatrixFragment,
  PlanFragment,
  SkillsFragment,
  SourcesFragment,
} from '@/components/sections/fragments';
import { DownloadCta } from '@/components/ui/DownloadCta';
import { routing } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/pageMeta';
import { pagePaths } from '@/lib/pages';
import { getLatestRelease } from '@/lib/releases';
import { featureMenu, type FeatureMenuKey } from '@/lib/site';

type Props = { params: Promise<{ locale: string }> };

type Detail = { body: string[]; points: string[] };
type WorkspaceItem = { title: string; description: string };

const path = pagePaths.features;

/** A faixa de download lê a release publicada, então a página revalida junto. */
export const revalidate = 1800;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return buildPageMetadata({ locale, path, namespace: 'FeaturesPage' });
}

/**
 * Página de recursos.
 *
 * Cada seção reutiliza o `id` do card da landing (`featureAnchor`), então o
 * menu "Recursos" leva direto ao detalhe e deep links antigos continuam
 * funcionando. Os visuais são os mesmos fragmentos de UI do resto do site.
 */
export default async function FeaturesPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('FeaturesPage');
  const tFeatures = await getTranslations('Features');
  const release = await getLatestRelease();

  const details = t.raw('details') as Record<FeatureMenuKey, Detail>;
  const workspace = t.raw('workspace.items') as WorkspaceItem[];

  return (
    <>
      <SkipLink />
      <SiteHeader />

      <main id="main">
        <PageHero
          eyebrow={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
          crumb={t('eyebrow')}
          path={path}
          actions={<DownloadCta release={release} />}
          quickNav={{
            label: t('quickNavLabel'),
            items: featureMenu.map((item) => ({
              href: `#${item.id}`,
              label: tFeatures(`items.${item.key}.title`),
            })),
          }}
        />

        {featureMenu.map((item, index) => {
          const detail = details[item.key];

          return (
            <PageSection
              key={item.id}
              id={item.id}
              eyebrow={String(index + 1).padStart(2, '0')}
              title={tFeatures(`items.${item.key}.title`)}
              tone={index % 2 === 1 ? 'surface' : 'plain'}
            >
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-12">
                <div className="min-w-0">
                  <div className="flex flex-col gap-4">
                    {detail.body.map((paragraph) => (
                      <p key={paragraph} className="max-w-2xl text-sm text-foreground-muted">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <ul className="mt-6 flex flex-col gap-2.5">
                    {detail.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2 text-sm text-foreground-muted"
                      >
                        <CheckIcon />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="min-w-0">
                  <FeatureVisual feature={item.key} />
                </div>
              </div>
            </PageSection>
          );
        })}

        <PageSection
          id="workspace"
          eyebrow={t('workspace.eyebrow')}
          title={t('workspace.title')}
          subtitle={t('workspace.subtitle')}
        >
          <ul className="grid gap-3 lg:grid-cols-3">
            {workspace.map((item, index) => (
              <li
                key={item.title}
                className="flex flex-col gap-5 rounded-2xl border border-border bg-surface-raised p-5"
              >
                <div>
                  <h3 className="text-lg font-medium text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-foreground-muted">{item.description}</p>
                </div>
                <div className="mt-auto">{workspaceVisual(index)}</div>
              </li>
            ))}
          </ul>
        </PageSection>

        <PageNav current="features" />
        <PageCta release={release} />
      </main>

      <SiteFooter />
    </>
  );
}

/** Fragmento de UI correspondente ao recurso — decorativo para o leitor de tela. */
function FeatureVisual({ feature }: { feature: FeatureMenuKey }) {
  if (feature === 'localFirst') return <FolderFragment decorative />;
  if (feature === 'planMode') return <PlanFragment decorative />;
  if (feature === 'permissions') return <PermissionMatrixFragment decorative />;
  if (feature === 'diffs') return <DiffFragment decorative />;
  if (feature === 'skills') return <SkillsFragment decorative />;
  return <ModesFragment decorative />;
}

/** Os três painéis que vivem ao lado da conversa. */
function workspaceVisual(index: number) {
  if (index === 1) return <ArtifactsFragment decorative />;
  if (index === 2) return <SourcesFragment decorative />;
  return <LibraryFragment decorative />;
}
