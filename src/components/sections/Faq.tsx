import { getTranslations } from 'next-intl/server';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { site } from '@/lib/site';

type Item = { question: string; answer: string };

/**
 * FAQ.
 *
 * Cobre as objeções que bloqueiam o download — custo, segurança do agente,
 * por que macOS e Linux são beta, comparação, requisitos e como apagar os
 * dados — e oferece uma saída para o que não estiver aqui. `name="faq"` faz o
 * `<details>` funcionar como acordeão exclusivo nos navegadores que suportam;
 * onde não suporta, todos abrem normalmente.
 */
export async function Faq() {
  const t = await getTranslations('Faq');
  const items = t.raw('items') as Item[];

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="scroll-mt-24 border-t border-border py-20 md:py-28"
    >
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col items-start gap-6">
            <SectionHeading eyebrow={t('eyebrow')} title={t('title')} id="faq-title" />

            <div className="w-full max-w-sm rounded-xl border border-border bg-surface-raised p-4">
              <p className="text-sm font-medium text-foreground">{t('issueTitle')}</p>
              <p className="mt-1.5 text-sm text-foreground-muted">{t('issueBody')}</p>
              <a
                href={site.issuesUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-foreground-muted underline underline-offset-2 transition-colors duration-150 hover:text-foreground"
              >
                {t('issueCta')}
              </a>
            </div>
          </div>

          <ul className="flex flex-col">
            {items.map((item, index) => (
              <li
                key={item.question}
                id={`faq-${index + 1}`}
                className="scroll-mt-24 border-t border-border last:border-b"
              >
                <details className="group" name="faq">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-medium text-foreground transition-colors duration-150 hover:text-accent [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden="true"
                      className="shrink-0 text-foreground-muted transition-transform duration-200 group-open:rotate-180"
                    >
                      <path
                        d="M3.5 5.5 7 9l3.5-3.5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </summary>
                  <p className="pb-5 pr-8 text-sm text-foreground-muted">{item.answer}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
