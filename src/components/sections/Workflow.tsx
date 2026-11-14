import { getTranslations } from 'next-intl/server';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { DiffFragment, PermissionFragment, PlanFragment } from '@/components/sections/fragments';

type Step = { number: string; title: string; description: string; detail: string };

/**
 * Workflow em linha do tempo: plano → permissão → diff.
 *
 * Cada passo carrega o artefato que ele produz, então a seção deixa de ser três
 * cartões soltos e passa a mostrar a mesma tarefa atravessando o app. O texto
 * auxiliar (`detail`) usa `foreground-muted`: é conteúdo, não legenda
 * decorativa.
 */
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
          {steps.map((step, index) => (
            <li key={step.number} className="relative flex">
              {index < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute top-12 -right-3 hidden h-px w-3 bg-border-strong md:block"
                />
              ) : null}

              <article className="flex w-full flex-col gap-4 rounded-2xl border border-border bg-background p-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border-strong font-mono text-2xs text-foreground-muted">
                    {step.number}
                  </span>
                  <h3 className="text-lg font-medium text-foreground">{step.title}</h3>
                </div>

                <p className="text-sm text-foreground-muted">{step.description}</p>

                <div className="mt-auto flex flex-col gap-3">
                  <StepArtifact index={index} />
                  <p className="border-t border-border pt-4 text-xs text-foreground-muted">
                    {step.detail}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function StepArtifact({ index }: { index: number }) {
  if (index === 1) return <PermissionFragment decorative />;
  if (index === 2) return <DiffFragment decorative />;
  return <PlanFragment decorative />;
}
