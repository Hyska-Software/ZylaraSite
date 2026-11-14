import { getTranslations } from 'next-intl/server';
import { SectionHeading } from '@/components/ui/SectionHeading';

type Point = { title: string; description: string };

/**
 * Posicionamento: as três escolhas do produto e, logo abaixo, o que ele não
 * faz.
 *
 * A seção antiga terminava com uma ressalva ("não afirmamos ser mais rápido"),
 * que soava como pedido de desculpas. A lista de limites cumpre o mesmo papel
 * de honestidade — de forma explícita, no mesmo tom dos recursos — e evita que
 * o visitante descubra a limitação depois de instalar.
 */
export async function Positioning() {
  const t = await getTranslations('Positioning');
  const points = t.raw('points') as Point[];
  const limits = t.raw('limits') as Point[];

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

        <div className="mt-14 rounded-2xl border border-border bg-surface-raised p-6 md:p-8">
          <h3 className="text-lg font-medium text-foreground">{t('limitsTitle')}</h3>
          <p className="mt-2 max-w-2xl text-sm text-foreground-muted">{t('limitsSubtitle')}</p>

          <ul className="mt-6 grid gap-x-10 gap-y-5 md:grid-cols-2">
            {limits.map((limit) => (
              <li key={limit.title} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-border-strong text-foreground-muted"
                >
                  <MinusIcon />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-foreground">{limit.title}</span>
                  <span className="mt-1 block text-sm text-foreground-muted">
                    {limit.description}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function MinusIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
      <path d="M1.5 4h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
