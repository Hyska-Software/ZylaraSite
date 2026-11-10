import { getTranslations } from 'next-intl/server';
import { SectionHeading } from '@/components/ui/SectionHeading';

type Step = { number: string; title: string; description: string; detail: string };

export async function Workflow() {
  const t = await getTranslations('Workflow');
  const steps = t.raw('steps') as Step[];

  return (
    <section
      id="workflow"
      aria-labelledby="workflow-title"
      className="scroll-mt-24 border-y border-border bg-surface py-20 md:py-28"
    >
      <div className="container-page">
        <SectionHeading
          eyebrow={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
          id="workflow-title"
        />

        {/* Sem JS todas as etapas aparecem: é uma lista normal, não um carrossel. */}
        <ol className="mt-12 grid gap-3 md:grid-cols-3">
          {steps.map((step) => (
            <li key={step.number} className="flex">
              <article className="flex w-full flex-col gap-4 rounded-2xl border border-border bg-background p-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-8 items-center justify-center rounded-full border border-border-strong font-mono text-2xs text-foreground-muted">
                    {step.number}
                  </span>
                  <h3 className="text-lg font-medium text-foreground">{step.title}</h3>
                </div>
                <p className="text-sm text-foreground-muted">{step.description}</p>
                <p className="mt-auto border-t border-border pt-4 text-xs text-foreground-subtle">
                  {step.detail}
                </p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
