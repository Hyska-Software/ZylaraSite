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
  DiffFragment,
  ModesFragment,
  PermissionFragment,
  PermissionMatrixFragment,
  PlanFragment,
  TranscriptFragment,
  WindowFrame,
} from '@/components/sections/fragments';
import { DownloadCta } from '@/components/ui/DownloadCta';
import { routing } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/pageMeta';
import { pagePaths, pageSections } from '@/lib/pages';
import { getLatestRelease } from '@/lib/releases';

type Props = { params: Promise<{ locale: string }> };

type Step = {
  number: string;
  title: string;
  description: string;
  detail: string;
  checkpoints: string[];
};
type Item = { title: string; description: string };
type PermissionRow = { label: string; cells: string[] };
type Level = { label: string; description: string };
type Mode = { name: string; title: string; description: string; points: string[] };

const path = pagePaths.howItWorks;

/** A faixa de download lê a release publicada, então a página revalida junto. */
export const revalidate = 1800;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  return buildPageMetadata({ locale, path, namespace: 'HowItWorksPage' });
}

/**
 * Página "Como funciona".
 *
 * A landing resume o ciclo em três cartões; aqui o ciclo aparece com quatro
 * etapas (o plano e a aprovação são passos distintos), a anatomia de um turno,
 * a matriz de permissões e o que o botão de parar faz de fato.
 */
export default async function HowItWorksPage({ params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('HowItWorksPage');
  const release = await getLatestRelease();

  /** Âncoras compartilhadas com a navbar (`@/lib/pages`). */
  const [loopSection, turnSection, permissionsSection, controlSection, modesSection] =
    pageSections.howItWorks;

  const steps = t.raw('loop.steps') as Step[];
  const turnItems = t.raw('turn.items') as Item[];
  const columns = t.raw('permissions.columns') as string[];
  const rows = t.raw('permissions.rows') as PermissionRow[];
  const levels = t.raw('permissions.levels') as Level[];
  const controlItems = t.raw('control.items') as Item[];
  const modes = t.raw('modes.items') as Mode[];

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
            items: [
              { href: `#${loopSection.id}`, label: t(`${loopSection.key}.title`) },
              { href: `#${turnSection.id}`, label: t(`${turnSection.key}.title`) },
              { href: `#${permissionsSection.id}`, label: t(`${permissionsSection.key}.title`) },
              { href: `#${controlSection.id}`, label: t(`${controlSection.key}.title`) },
              { href: `#${modesSection.id}`, label: t(`${modesSection.key}.title`) },
            ],
          }}
        />

        <PageSection
          id={loopSection.id}
          eyebrow={t('loop.eyebrow')}
          title={t('loop.title')}
          subtitle={t('loop.subtitle')}
        >
          <ol className="flex flex-col gap-3">
            {steps.map((step, index) => (
              <li
                key={step.number}
                className="grid gap-6 rounded-2xl border border-border bg-surface-raised p-5 md:p-6 lg:grid-cols-[3rem_minmax(0,1fr)_minmax(0,0.7fr)] lg:items-start"
              >
                <span className="inline-flex size-9 items-center justify-center rounded-full border border-border-strong font-mono text-2xs text-foreground-muted">
                  {step.number}
                </span>

                <div className="min-w-0">
                  <h3 className="text-lg font-medium text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm text-foreground-muted">{step.description}</p>
                  <p className="mt-4 border-t border-border pt-4 text-xs text-foreground-muted">
                    {step.detail}
                  </p>
                  <ul className="mt-3 flex flex-col gap-1.5">
                    {step.checkpoints.map((checkpoint) => (
                      <li
                        key={checkpoint}
                        className="flex items-start gap-2 text-xs text-foreground-muted"
                      >
                        <CheckIcon />
                        <span>{checkpoint}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="min-w-0">
                  <StepVisual index={index} />
                </div>
              </li>
            ))}
          </ol>
        </PageSection>

        <PageSection
          id={turnSection.id}
          eyebrow={t('turn.eyebrow')}
          title={t('turn.title')}
          subtitle={t('turn.subtitle')}
          tone="surface"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-12">
            <WindowFrame>
              <TranscriptFragment />
            </WindowFrame>

            <ol className="flex flex-col">
              {turnItems.map((item, index) => (
                <li
                  key={item.title}
                  className="flex gap-4 border-t border-border py-4 first:border-t-0 first:pt-0 last:pb-0"
                >
                  <span className="mt-0.5 font-mono text-2xs text-foreground-subtle">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-foreground">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-sm text-foreground-muted">
                      {item.description}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </PageSection>

        <PageSection
          id={permissionsSection.id}
          eyebrow={t('permissions.eyebrow')}
          title={t('permissions.title')}
          subtitle={t('permissions.subtitle')}
        >
          <div className="overflow-x-auto rounded-2xl border border-border bg-background">
            <table className="w-full min-w-[34rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  {columns.map((column) => (
                    <th
                      key={column}
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-foreground-muted"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-b border-border last:border-b-0">
                    <th
                      scope="row"
                      className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-foreground"
                    >
                      {row.label}
                    </th>
                    {row.cells.map((cell, index) => (
                      <td
                        key={`${row.label}-${columns[index + 1] ?? index}`}
                        className="px-4 py-3 text-sm text-foreground-muted"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mt-8 text-sm font-medium text-foreground">{t('permissions.levelsTitle')}</h3>
          <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-5">
            {levels.map((level) => (
              <div key={level.label} className="border-t border-border pt-3">
                <dt className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <PermissionDot />
                  {level.label}
                </dt>
                <dd className="mt-1 text-xs text-foreground-muted">{level.description}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 max-w-2xl text-xs text-foreground-muted">{t('permissions.note')}</p>
        </PageSection>

        <PageSection
          id={controlSection.id}
          eyebrow={t('control.eyebrow')}
          title={t('control.title')}
          subtitle={t('control.subtitle')}
          tone="surface"
        >
          <ul className="grid gap-3 md:grid-cols-3">
            {controlItems.map((item) => (
              <li
                key={item.title}
                className="rounded-2xl border border-border bg-background p-5"
              >
                <h3 className="text-lg font-medium text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-foreground-muted">{item.description}</p>
              </li>
            ))}
          </ul>
        </PageSection>

        <PageSection
          id={modesSection.id}
          eyebrow={t('modes.eyebrow')}
          title={t('modes.title')}
          subtitle={t('modes.subtitle')}
        >
          <div className="mb-8">
            <ModesFragment />
          </div>

          <ul className="grid gap-3 md:grid-cols-3">
            {modes.map((mode) => (
              <li
                key={mode.name}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-surface-raised p-5"
              >
                <span className="inline-flex w-fit items-center rounded-full border border-border px-2.5 py-1 font-mono text-2xs text-foreground-muted">
                  {mode.name}
                </span>
                <div>
                  <h3 className="text-lg font-medium text-foreground">{mode.title}</h3>
                  <p className="mt-2 text-sm text-foreground-muted">{mode.description}</p>
                </div>
                <ul className="mt-auto flex flex-col gap-2 border-t border-border pt-4">
                  {mode.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2 text-xs text-foreground-muted"
                    >
                      <CheckIcon />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </PageSection>

        <PageNav current="howItWorks" />
        <PageCta release={release} />
      </main>

      <SiteFooter />
    </>
  );
}

/** Artefato que cada etapa produz, na ordem do ciclo. */
function StepVisual({ index }: { index: number }) {
  if (index === 1) return <PermissionMatrixFragment decorative />;
  if (index === 2) return <PermissionFragment decorative />;
  if (index === 3) return <DiffFragment decorative />;
  return <PlanFragment decorative />;
}

/** Marcador neutro dos rótulos de risco (o texto ao lado já nomeia o risco). */
function PermissionDot() {
  return <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-accent" />;
}
