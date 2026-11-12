import { getFormatter, getTranslations } from 'next-intl/server';
import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher';
import { RegionNav } from '@/components/legal/RegionNav';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';
import {
  legalContactEmail,
  legalPaths,
  legalRegions,
  legalUpdatedAt,
  type LegalDocumentId,
} from '@/lib/legal';

type LegalBlock = { title: string; body?: string[]; items?: string[] };
type LegalRegionCopy = { short: string; title: string; intro: string; sections: LegalBlock[] };

const documents: { id: LegalDocumentId; labelKey: 'terms' | 'privacy' }[] = [
  { id: 'terms', labelKey: 'terms' },
  { id: 'privacy', labelKey: 'privacy' },
];

/**
 * Renderizador das duas páginas legais (Termos e Privacidade).
 *
 * A estrutura é a mesma de qualquer página do site — hero com grade sutil,
 * coluna de leitura `max-w-3xl` e o rodapé —, e o texto vem do catálogo do
 * idioma ativo. O seletor de jurisdição ancora as três seções regionais
 * (EUA, Europa e Brasil) sem esconder as outras: o documento continua sendo
 * um texto único, com parágrafos adicionais por região.
 */
export async function LegalDocument({
  namespace,
  current,
}: {
  namespace: 'TermsPage' | 'PrivacyPage';
  current: LegalDocumentId;
}) {
  const t = await getTranslations(namespace);
  const tLegal = await getTranslations('Legal');
  const format = await getFormatter();

  const summary = t.raw('summary') as string[];
  const sections = t.raw('sections') as LegalBlock[];
  const regions = legalRegions.map((id) => ({
    id,
    ...(t.raw(`regions.${id}`) as LegalRegionCopy),
  }));

  const updated = format.dateTime(new Date(`${legalUpdatedAt}T12:00:00Z`), {
    dateStyle: 'long',
    timeZone: 'UTC',
  });

  return (
    <>
      <section className="relative overflow-hidden border-b border-border pt-16 pb-12 md:pt-24 md:pb-14">
        <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 opacity-60" />

        <div className="container-page relative">
          <div className="max-w-3xl">
            <p className="text-2xs font-medium uppercase tracking-[0.14em] text-foreground-subtle">
              {tLegal('eyebrow')}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tighter text-foreground md:text-5xl">
              {t('title')}
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-foreground-muted">{t('subtitle')}</p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-6 text-xs text-foreground-subtle">
            <p>
              {tLegal('updatedLabel')}{' '}
              <time dateTime={legalUpdatedAt} className="font-mono text-foreground-muted">
                {updated}
              </time>
            </p>

            <p>
              {tLegal('contactLabel')}{' '}
              <a
                href={`mailto:${legalContactEmail}`}
                className="text-foreground-muted underline underline-offset-2 transition-colors duration-150 hover:text-foreground"
              >
                {legalContactEmail}
              </a>
            </p>

            <div className="flex items-center gap-2">
              <span>{tLegal('languageLabel')}</span>
              <LocaleSwitcher />
            </div>
          </div>

          <p className="mt-4 max-w-3xl text-2xs text-foreground-subtle">{tLegal('languageNote')}</p>
        </div>
      </section>

      <div className="container-page py-14 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex flex-col gap-7">
              <div>
                <h2 className="text-2xs font-medium uppercase tracking-[0.12em] text-foreground-subtle">
                  {tLegal('documents')}
                </h2>
                <ul className="mt-3 flex flex-col gap-1">
                  {documents.map((document) => {
                    const active = document.id === current;
                    return (
                      <li key={document.id}>
                        <Link
                          href={legalPaths[document.id]}
                          aria-current={active ? 'page' : undefined}
                          className={cn(
                            'flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs transition-colors duration-150',
                            active
                              ? 'bg-accent-soft text-accent'
                              : 'text-foreground-muted hover:bg-surface-hover hover:text-foreground',
                          )}
                        >
                          {tLegal(document.labelKey)}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div>
                <h2 className="text-2xs font-medium uppercase tracking-[0.12em] text-foreground-subtle">
                  {tLegal('regionsLabel')}
                </h2>
                <RegionNav
                  className="mt-3"
                  label={tLegal('regionsLabel')}
                  hint={tLegal('regionsHint')}
                  items={regions.map((region) => ({ id: region.id, label: region.short }))}
                />
              </div>
            </div>
          </aside>

          <article className="min-w-0 max-w-3xl">
            <div className="rounded-2xl border border-border bg-surface-raised p-5 md:p-6">
              <p className="text-2xs font-medium uppercase tracking-[0.12em] text-foreground-subtle">
                {tLegal('summaryTitle')}
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {summary.map((line) => (
                  <li key={line} className="flex gap-2.5 text-sm text-foreground-muted">
                    <span
                      aria-hidden="true"
                      className="mt-2 size-1 shrink-0 rounded-full bg-accent"
                    />
                    {line}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12 flex flex-col gap-10">
              {sections.map((section, index) => (
                <LegalSection key={section.title} section={section} number={index + 1} />
              ))}
            </div>

            {regions.map((region) => (
              <section
                key={region.id}
                id={region.id}
                aria-labelledby={`${current}-${region.id}`}
                className="mt-14 scroll-mt-24 border-t border-border pt-10"
              >
                <p className="font-mono text-2xs uppercase tracking-[0.12em] text-foreground-subtle">
                  {tLegal('regionsLabel')}
                </p>
                <h2
                  id={`${current}-${region.id}`}
                  className="mt-2 text-2xl font-semibold tracking-tight text-foreground"
                >
                  {region.title}
                </h2>
                <p className="mt-3 text-base text-foreground-muted">{region.intro}</p>

                <div className="mt-8 flex flex-col gap-8">
                  {region.sections.map((section) => (
                    <LegalSection key={section.title} section={section} as="h3" />
                  ))}
                </div>
              </section>
            ))}

            <section
              aria-labelledby={`${current}-contact`}
              className="mt-14 border-t border-border pt-10"
            >
              <h2
                id={`${current}-contact`}
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                {t('contact.title')}
              </h2>
              {(t.raw('contact.body') as string[]).map((paragraph) => (
                <p key={paragraph} className="mt-3 text-base text-foreground-muted">
                  {paragraph}
                </p>
              ))}
              <a
                href={`mailto:${legalContactEmail}`}
                className="mt-4 inline-flex items-center gap-2 rounded text-base text-foreground underline underline-offset-2 transition-colors duration-150 hover:text-accent"
              >
                {legalContactEmail}
              </a>
            </section>
          </article>
        </div>
      </div>
    </>
  );
}

/** Seção do documento: título, parágrafos e, opcionalmente, uma lista de itens. */
function LegalSection({
  section,
  number,
  as = 'h2',
}: {
  section: LegalBlock;
  number?: number;
  as?: 'h2' | 'h3';
}) {
  const Heading = as;
  const items = section.items ?? [];

  return (
    <section>
      <div className="flex items-baseline gap-3">
        {number ? (
          <span aria-hidden="true" className="font-mono text-2xs text-foreground-subtle">
            {String(number).padStart(2, '0')}
          </span>
        ) : null}
        <Heading
          className={cn(
            'text-foreground',
            as === 'h2' ? 'text-xl font-semibold' : 'text-lg font-medium',
          )}
        >
          {section.title}
        </Heading>
      </div>

      {(section.body ?? []).map((paragraph) => (
        <p key={paragraph} className="mt-3 text-base text-foreground-muted">
          {paragraph}
        </p>
      ))}

      {items.length > 0 ? (
        <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-base text-foreground-muted marker:text-foreground-subtle">
          {items.map((item) => (
            <li key={item} className="pl-1">
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
