import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { site } from '@/lib/site';
import { SectionHeading } from '@/components/ui/SectionHeading';

type Row = { title: string; description: string; value: string };

/**
 * Custo de uso.
 *
 * A primeira pergunta que trava um download de agente de código é "quanto isso
 * vai me custar". A resposta do Zylara é curta e verificável: o app é MIT e não
 * tem assinatura; o modelo é cobrado pelo provedor que o visitante conectar.
 * Nenhum preço é inventado aqui — quando existir plano pago, entra nesta lista.
 */
export async function Cost() {
  const t = await getTranslations('Cost');
  const rows = t.raw('rows') as Row[];

  return (
    <section id="cost" aria-labelledby="cost-title" className="scroll-mt-24 border-t border-border py-20 md:py-28">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading
            eyebrow={t('eyebrow')}
            title={t('title')}
            subtitle={t('subtitle')}
            id="cost-title"
          />

          <div>
            <dl className="border-y border-border">
              {rows.map((row) => (
                <div
                  key={row.title}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-1 border-b border-border py-5 last:border-b-0"
                >
                  <dt className="text-sm font-medium text-foreground">{row.title}</dt>
                  <dd className="justify-self-end rounded-full border border-border bg-surface-raised px-3 py-1 text-xs text-foreground">
                    {row.value}
                  </dd>
                  <dd className="col-start-1 text-sm text-foreground-muted">{row.description}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-4 text-xs text-foreground-muted">{t('note')}</p>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <a
                href="#faq"
                className="inline-flex items-center gap-1.5 text-foreground-muted underline underline-offset-2 transition-colors duration-150 hover:text-foreground"
              >
                {t('ctaFaq')}
              </a>
              <a
                href={site.releasesUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 text-foreground-muted underline underline-offset-2 transition-colors duration-150 hover:text-foreground"
              >
                {t('ctaReleases')}
              </a>
              <Link
                href="/download"
                className="inline-flex items-center gap-1.5 text-foreground-muted underline underline-offset-2 transition-colors duration-150 hover:text-foreground"
              >
                {t('ctaDownload')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
