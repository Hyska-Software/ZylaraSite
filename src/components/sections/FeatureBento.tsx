import { getTranslations } from 'next-intl/server';
import { cn } from '@/lib/cn';
import { SectionHeading } from '@/components/ui/SectionHeading';

type FeatureKey = 'localFirst' | 'planMode' | 'permissions' | 'diffs' | 'skills' | 'modes';
type VisualKind = 'folder' | 'plan' | 'risk' | 'diff' | 'skill' | 'modes';

const features: { key: FeatureKey; span: string; visual: VisualKind }[] = [
  { key: 'localFirst', span: 'md:col-span-2', visual: 'folder' },
  { key: 'planMode', span: '', visual: 'plan' },
  { key: 'permissions', span: '', visual: 'risk' },
  { key: 'diffs', span: 'md:col-span-2', visual: 'diff' },
  { key: 'skills', span: '', visual: 'skill' },
  { key: 'modes', span: 'md:col-span-2', visual: 'modes' },
];

export async function FeatureBento() {
  const t = await getTranslations('Features');

  return (
    <section id="features" aria-labelledby="features-title" className="scroll-mt-24 py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
          id="features-title"
        />

        <ul className="mt-12 grid gap-3 md:grid-cols-3">
          {features.map((feature) => (
            <li key={feature.key} className={cn('min-w-0', feature.span)}>
              <article className="flex h-full flex-col justify-between gap-8 rounded-2xl border border-border bg-surface-raised p-6 transition-colors duration-200 hover:border-border-strong">
                <div>
                  <h3 className="text-lg font-medium text-foreground">
                    {t(`items.${feature.key}.title`)}
                  </h3>
                  <p className="mt-2 max-w-prose text-sm text-foreground-muted">
                    {t(`items.${feature.key}.description`)}
                  </p>
                </div>
                <FeatureVisual kind={feature.visual} />
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Visuais decorativos por card — tudo em SVG/CSS, aria-hidden. */
function FeatureVisual({ kind }: { kind: VisualKind }) {
  if (kind === 'folder') {
    return (
      <div aria-hidden="true" className="rounded-xl border border-border bg-background p-3">
        <p className="font-mono text-2xs text-foreground-subtle">~/.zylara</p>
        <ul className="mt-2 grid grid-cols-2 gap-1.5 font-mono text-2xs text-foreground-subtle">
          <li className="rounded bg-surface px-2 py-1">conversations/</li>
          <li className="rounded bg-surface px-2 py-1">artifacts/</li>
          <li className="rounded bg-surface px-2 py-1">skills/</li>
          <li className="rounded bg-surface px-2 py-1">settings.json</li>
        </ul>
      </div>
    );
  }

  if (kind === 'plan') {
    return (
      <div
        aria-hidden="true"
        className="flex flex-col gap-2 rounded-xl border border-border bg-background p-3"
      >
        {[0, 1, 2].map((index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="size-3.5 shrink-0 rounded-full border border-accent/60" />
            <span
              className="h-1.5 rounded-full bg-surface-hover"
              style={{ width: `${100 - index * 22}%` }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (kind === 'risk') {
    return (
      <div aria-hidden="true" className="flex flex-wrap gap-1.5">
        <span className="rounded-full bg-surface px-2 py-0.5 font-mono text-2xs text-foreground-muted">
          read
        </span>
        <span className="rounded-full bg-warning-soft px-2 py-0.5 font-mono text-2xs text-warning">
          command
        </span>
        <span className="rounded-full bg-danger-soft px-2 py-0.5 font-mono text-2xs text-danger">
          secret
        </span>
        <span className="rounded-full bg-danger-soft px-2 py-0.5 font-mono text-2xs text-danger">
          outside
        </span>
      </div>
    );
  }

  if (kind === 'diff') {
    return (
      <div
        aria-hidden="true"
        className="overflow-hidden rounded-xl border border-border bg-background font-mono text-[10px] leading-relaxed"
      >
        <div className="flex items-center justify-between border-b border-border px-2.5 py-1.5 text-foreground-subtle">
          <span>src/server/auth.ts</span>
          <span className="flex gap-1.5">
            <span className="text-success">+24</span>
            <span className="text-danger">−3</span>
          </span>
        </div>
        <div className="px-2.5 py-1.5">
          <span className="block text-foreground-subtle">@@ -12,4 +12,6 @@</span>
          <span className="block text-foreground-muted"> const ip = request.ip</span>
          <span className="block text-success">+const bucket = await limiter.take(ip)</span>
          <span className="block text-success">+if (!bucket.ok) return tooMany()</span>
        </div>
      </div>
    );
  }

  if (kind === 'skill') {
    return (
      <div aria-hidden="true" className="flex flex-col gap-1.5">
        {['code-review', 'release-notes', 'incident'].map((name) => (
          <span
            key={name}
            className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-border bg-background px-2 py-1 font-mono text-2xs text-foreground-muted"
          >
            <span className="size-1 rounded-full bg-accent" />
            {name}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="inline-flex w-fit items-center gap-1 rounded-full border border-border bg-background p-1 text-2xs"
    >
      <span className="rounded-full bg-surface-hover px-2.5 py-1 text-foreground">Chat</span>
      <span className="px-2.5 py-1 text-foreground-subtle">Code</span>
      <span className="px-2.5 py-1 text-foreground-subtle">Agentes</span>
    </div>
  );
}
