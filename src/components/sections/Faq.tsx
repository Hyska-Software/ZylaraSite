import { getTranslations } from 'next-intl/server';
import { SectionHeading } from '@/components/ui/SectionHeading';

type Item = { question: string; answer: string };

export async function Faq() {
  const t = await getTranslations('Faq');
  const items = t.raw('items') as Item[];

  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-24 border-t border-border py-20 md:py-28">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow={t('eyebrow')} title={t('title')} id="faq-title" />

          <ul className="flex flex-col">
            {items.map((item) => (
              <li key={item.question} className="border-t border-border last:border-b">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-medium text-foreground transition-colors duration-150 hover:text-accent [&::-webkit-details-marker]:hidden">
                    {item.question}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden="true"
                      className="shrink-0 text-foreground-subtle transition-transform duration-200 group-open:rotate-45"
                    >
                      <path
                        d="M7 2.5v9M2.5 7h9"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
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
