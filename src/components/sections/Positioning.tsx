import { getTranslations } from 'next-intl/server';
import { SectionHeading } from '@/components/ui/SectionHeading';

type Point = { title: string; description: string };

export async function Positioning() {
  const t = await getTranslations('Positioning');
  const points = t.raw('points') as Point[];

  return (
    <section
      id="positioning"
      aria-labelledby="positioning-title"
      className="scroll-mt-24 py-20 md:py-28"
    >
      <div className="container-page">
        <SectionHeading
          eyebrow={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
          id="positioning-title"
        />

        <dl className="mt-12 grid gap-x-10 gap-y-8 md:grid-cols-3">
          {points.map((point) => (
            <div key={point.title} className="border-t border-border pt-5">
              <dt className="text-base font-medium text-foreground">{point.title}</dt>
              <dd className="mt-2 text-sm text-foreground-muted">{point.description}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-10 max-w-2xl text-xs text-foreground-subtle">{t('note')}</p>
      </div>
    </section>
  );
}
