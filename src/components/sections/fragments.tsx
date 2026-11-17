'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/cn';

/**
 * Fragmentos de UI do app usados como evidência na landing.
 *
 * Cada fragmento é markup real — nada de imagem — e usa só os tokens do
 * design system (DESIGN.md §3): `surface-raised`, `border`, `accent-soft` e a
 * escala 2xs. `PlanFragment`, `DiffFragment` e `PermissionFragment` aparecem no
 * bento de recursos, na timeline do workflow e no tour do produto; por isso
 * vivem aqui, e não duplicados em três arquivos.
 *
 * Todo texto visível vem do namespace `Preview` do catálogo do idioma ativo,
 * inclusive nomes de arquivo e rótulos de modo: a prévia precisa falar o mesmo
 * idioma da página que a apresenta.
 *
 * `decorative` marca o fragmento como `aria-hidden`: os textos são curtos e
 * repetem o que o card já diz em voz alta.
 */

type FragmentProps = {
  decorative?: boolean;
  className?: string;
};

const frame = 'overflow-hidden rounded-xl border border-border bg-background';

export function PlanFragment({ decorative, className }: FragmentProps) {
  const t = useTranslations('Preview');
  const steps = t.raw('planSteps') as string[];

  return (
    <div className={cn(frame, className)} aria-hidden={decorative || undefined}>
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <span className="inline-flex items-center gap-1.5 text-2xs font-medium text-foreground">
          <PlanIcon />
          {t('planTitle')}
        </span>
        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-2xs text-accent">
          {t('planBadge')}
        </span>
      </div>
      <ol className="flex flex-col gap-1.5 px-3 py-2.5">
        {steps.map((step, index) => (
          <li key={step} className="flex items-start gap-2 text-2xs text-foreground-muted">
            <span className="mt-px inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-accent-soft font-mono text-[9px] text-accent">
              {index + 1}
            </span>
            <span className="min-w-0 truncate font-mono">{step}</span>
          </li>
        ))}
      </ol>
      <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-2 text-2xs">
        <span className="truncate text-foreground-muted">{t('planLocked')}</span>
        <span className="shrink-0 rounded-md bg-foreground px-2 py-1 text-background">
          {t('planApprove')}
        </span>
      </div>
    </div>
  );
}

export function DiffFragment({ decorative, className }: FragmentProps) {
  const t = useTranslations('Preview');

  return (
    <div
      className={cn(frame, 'font-mono text-[10px] leading-relaxed', className)}
      aria-hidden={decorative || undefined}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-2.5 py-1.5">
        <span className="min-w-0 truncate text-foreground-muted">{t('diffFile')}</span>
        <span className="flex shrink-0 gap-1.5">
          <span className="text-success">{t('diffAdded')}</span>
          <span className="text-danger">{t('diffRemoved')}</span>
        </span>
      </div>
      <div className="px-2.5 py-1.5">
        <span className="block text-foreground-muted/80">@@ -12,4 +12,6 @@</span>
        <span className="block text-foreground-muted"> const ip = request.ip</span>
        <span className="block text-success">+const bucket = await limiter.take(ip)</span>
        <span className="block text-success">+if (!bucket.ok) return tooMany()</span>
        <span className="block text-foreground-muted"> return authenticate(body)</span>
      </div>
    </div>
  );
}

export function PermissionFragment({ decorative, className }: FragmentProps) {
  const t = useTranslations('Preview');
  const risks = [
    { label: t('riskRead'), tone: 'bg-surface text-foreground-muted' },
    { label: t('riskCommand'), tone: 'bg-warning-soft text-warning' },
    { label: t('riskSecret'), tone: 'bg-danger-soft text-danger' },
    { label: t('riskOutside'), tone: 'bg-danger-soft text-danger' },
  ];

  return (
    <div className={cn(frame, className)} aria-hidden={decorative || undefined}>
      <div className="flex flex-col gap-2 px-3 py-3">
        <div className="flex flex-wrap gap-1.5">
          {risks.map((risk) => (
            <span
              key={risk.label}
              className={cn('rounded-full px-2 py-0.5 font-mono text-2xs', risk.tone)}
            >
              {risk.label}
            </span>
          ))}
        </div>
        <p className="flex items-start gap-1.5 font-mono text-2xs text-foreground-muted">
          <span aria-hidden="true" className="text-foreground-muted/70">
            $
          </span>
          <span className="min-w-0 break-all">pnpm test --filter auth</span>
        </p>
      </div>
      <div className="flex items-center gap-2 border-t border-border px-3 py-2 text-2xs">
        <span className="rounded-md border border-border px-2 py-1 text-foreground-muted">
          {t('deny')}
        </span>
        <span className="rounded-md bg-foreground px-2 py-1 text-background">{t('allow')}</span>
        <span className="ml-auto text-foreground-muted">{t('review')}</span>
      </div>
    </div>
  );
}

export function SkillsFragment({ decorative, className }: FragmentProps) {
  const t = useTranslations('Preview');
  const skills = t.raw('skills') as { name: string; hint: string }[];

  return (
    <div
      className={cn('flex flex-col gap-1.5', className)}
      aria-hidden={decorative || undefined}
    >
      {skills.map((skill) => (
        <span
          key={skill.name}
          className="flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5 font-mono text-2xs"
        >
          <span className="size-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
          <span className="shrink-0 text-foreground">{skill.name}</span>
          <span className="min-w-0 truncate text-foreground-muted">{skill.hint}</span>
        </span>
      ))}
    </div>
  );
}

export function LibraryFragment({ decorative, className }: FragmentProps) {
  const t = useTranslations('Preview');
  const filters = t.raw('libraryFilters') as string[];
  const files = t.raw('libraryFiles') as { name: string; kind: string }[];

  return (
    <div className={cn(frame, className)} aria-hidden={decorative || undefined}>
      <div className="flex flex-wrap items-center gap-1.5 border-b border-border px-3 py-2">
        {filters.map((filter, index) => (
          <span
            key={filter}
            className={cn(
              'rounded-full px-2 py-0.5 text-2xs',
              index === 0 ? 'bg-surface-hover text-foreground' : 'text-foreground-muted',
            )}
          >
            {filter}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-1.5 p-3">
        {files.map((file) => (
          <span
            key={file.name}
            className="flex flex-col gap-2 rounded-lg border border-border bg-surface-raised p-2.5"
          >
            <span className="inline-flex w-fit rounded bg-surface px-1.5 py-0.5 font-mono text-[9px] text-foreground-muted">
              {file.kind}
            </span>
            <span className="min-w-0 truncate font-mono text-2xs text-foreground">
              {file.name}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function ModesFragment({ decorative, className }: FragmentProps) {
  const t = useTranslations('Preview');

  return (
    <div
      className={cn(
        'inline-flex w-fit items-center gap-1 rounded-full border border-border bg-background p-1 text-2xs',
        className,
      )}
      aria-hidden={decorative || undefined}
    >
      <span className="rounded-full bg-surface-hover px-2.5 py-1 text-foreground">
        {t('modeChat')}
      </span>
      <span className="px-2.5 py-1 text-foreground-muted">{t('modeCode')}</span>
      <span className="px-2.5 py-1 text-foreground-muted">{t('modeAgents')}</span>
    </div>
  );
}

export function FolderFragment({ decorative, className }: FragmentProps) {
  const entries = ['conversations/', 'artifacts/', 'skills/', 'settings.json'];

  return (
    <div className={cn(frame, className)} aria-hidden={decorative || undefined}>
      <p className="border-b border-border px-3 py-2 font-mono text-2xs text-foreground-muted">
        ~/.zylara
      </p>
      <ul className="grid grid-cols-2 gap-1.5 p-3 font-mono text-2xs text-foreground-muted">
        {entries.map((entry) => (
          <li key={entry} className="truncate rounded bg-surface px-2 py-1">
            {entry}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Matriz de permissões: o que cada modo libera sem perguntar.
 *
 * As três colunas são ler, editar e comandos — o eixo que muda entre os modos.
 * Caminhos fora do workspace ficam de fora da matriz de propósito: em qualquer
 * modo eles continuam pedindo aprovação, e o rodapé diz isso.
 */
export function PermissionMatrixFragment({ decorative, className }: FragmentProps) {
  const t = useTranslations('Preview');
  const rows: { mode: string; states: ('on' | 'ask' | 'off')[] }[] = [
    { mode: t('matrixRead'), states: ['on', 'off', 'off'] },
    { mode: t('matrixReview'), states: ['on', 'ask', 'ask'] },
    { mode: t('matrixEdit'), states: ['on', 'on', 'ask'] },
    { mode: t('matrixAutopilot'), states: ['on', 'on', 'on'] },
  ];

  return (
    <div className={cn(frame, className)} aria-hidden={decorative || undefined}>
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <span className="text-2xs font-medium text-foreground">{t('matrixTitle')}</span>
        <span className="truncate font-mono text-[9px] text-foreground-muted">
          {t('matrixAxis')}
        </span>
      </div>

      <ul className="flex flex-col gap-1.5 px-3 py-3">
        {rows.map((row) => (
          <li key={row.mode} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <span className="truncate text-2xs text-foreground-muted">{row.mode}</span>
            <span className="flex shrink-0 gap-1.5">
              {row.states.map((state, index) => (
                <span
                  key={`${row.mode}-${index}`}
                  className={cn(
                    'inline-flex size-4 items-center justify-center rounded-full border text-[8px]',
                    state === 'on' && 'border-accent bg-accent-soft text-accent',
                    state === 'ask' && 'border-warning bg-warning-soft text-warning',
                    state === 'off' && 'border-border text-foreground-subtle',
                  )}
                >
                  {state === 'on' ? '✓' : state === 'ask' ? '?' : '–'}
                </span>
              ))}
            </span>
          </li>
        ))}
      </ul>

      <p className="border-t border-border px-3 py-2 text-2xs text-foreground-muted">
        {t('matrixFooter')}
      </p>
    </div>
  );
}

/** Um turno de Code com o rastro que a página `/how-it-works` descreve. */
export function TranscriptFragment({ decorative, className }: FragmentProps) {
  const t = useTranslations('Preview');

  return (
    <div
      className={cn(frame, 'text-2xs', className)}
      aria-hidden={decorative || undefined}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
          <PlanIcon />
          {t('transcriptTitle')}
        </span>
        <span className="font-mono text-[9px] text-foreground-muted">claude-sonnet</span>
      </div>

      <ul className="flex flex-col gap-2 px-3 py-3">
        <li className="ml-8 rounded-lg rounded-br-sm bg-user-bubble px-2.5 py-1.5 text-foreground">
          {t('transcriptPrompt')}
        </li>
        <li className="flex items-center gap-2 rounded-lg border border-border bg-surface-raised px-2.5 py-1.5">
          <span className="rounded-full bg-accent-soft px-2 py-0.5 font-mono text-[9px] text-accent">
            {t('transcriptPlanApproved')}
          </span>
          <span className="min-w-0 truncate text-foreground-muted">
            {t('transcriptPlanSummary')}
          </span>
        </li>
        <li className="flex items-start gap-1.5 px-1 font-mono text-foreground-muted">
          <span aria-hidden="true" className="text-foreground-subtle">
            $
          </span>
          <span className="min-w-0 break-all">pnpm test --filter auth</span>
          <span className="ml-auto shrink-0 rounded-full bg-warning-soft px-1.5 py-0.5 text-[9px] text-warning">
            {t('transcriptCommand')}
          </span>
        </li>
        <li className="flex items-center gap-2 rounded-lg border border-border bg-surface-raised px-2.5 py-1.5 font-mono">
          <span className="min-w-0 truncate text-foreground">src/server/auth.ts</span>
          <span className="ml-auto shrink-0 text-success">+24</span>
          <span className="shrink-0 text-danger">−3</span>
        </li>
      </ul>

      <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-2 text-foreground-muted">
        <span className="font-mono text-[9px]">{t('transcriptTokens')}</span>
        <span className="inline-flex items-center gap-1.5">
          <span className="rounded-md border border-border px-2 py-0.5">{t('transcriptStop')}</span>
          <span className="rounded-md bg-foreground px-2 py-0.5 text-background">
            {t('transcriptCommit')}
          </span>
        </span>
      </div>
    </div>
  );
}

/** Painel de fontes citadas por uma resposta. */
export function SourcesFragment({ decorative, className }: FragmentProps) {
  const t = useTranslations('Preview');
  const sources = t.raw('sources') as { domain: string; title: string }[];

  return (
    <div className={cn(frame, className)} aria-hidden={decorative || undefined}>
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <span className="text-2xs font-medium text-foreground">{t('sourcesTitle')}</span>
        <span className="font-mono text-[9px] text-foreground-muted">{t('sourcesCaption')}</span>
      </div>

      <ul className="flex flex-col gap-1.5 px-3 py-3">
        {sources.map((source) => (
          <li
            key={source.domain}
            className="flex items-center gap-2 rounded-lg border border-border bg-surface-raised px-2.5 py-1.5"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-surface-hover font-mono text-[9px] text-foreground-muted">
              {source.domain.charAt(0).toUpperCase()}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-mono text-[9px] text-foreground-muted">
                {source.domain}
              </span>
              <span className="block truncate text-2xs text-foreground">{source.title}</span>
            </span>
          </li>
        ))}
      </ul>

      <p className="border-t border-border px-3 py-2 font-mono text-[9px] text-foreground-muted">
        {t('sourcesFooter')}
      </p>
    </div>
  );
}

/** Lista do painel de artefatos: tipo, nome e tamanho. */
export function ArtifactsFragment({ decorative, className }: FragmentProps) {
  const t = useTranslations('Preview');
  const artifacts = t.raw('artifacts') as { kind: string; name: string; size: string }[];

  return (
    <div className={cn(frame, className)} aria-hidden={decorative || undefined}>
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <span className="text-2xs font-medium text-foreground">{t('artifactsTitle')}</span>
        <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[9px] text-foreground-muted">
          {t('artifactsBadge')}
        </span>
      </div>

      <ul className="flex flex-col gap-1.5 px-3 py-3">
        {artifacts.map((artifact) => (
          <li
            key={artifact.name}
            className="flex items-center gap-2 rounded-lg border border-border bg-surface-raised px-2.5 py-1.5"
          >
            <span className="inline-flex w-9 shrink-0 justify-center rounded bg-surface-hover px-1 py-0.5 font-mono text-[9px] text-foreground-muted">
              {artifact.kind}
            </span>
            <span className="min-w-0 flex-1 truncate font-mono text-2xs text-foreground">
              {artifact.name}
            </span>
            <span className="shrink-0 font-mono text-[9px] text-foreground-muted">
              {artifact.size}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Chrome de janela para o tour: title bar + área de conteúdo. */
export function WindowFrame({ children }: { children: React.ReactNode }) {
  const t = useTranslations('Preview');

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-float">
      <div className="flex h-9 items-center gap-2 border-b border-border px-3">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2 rounded-full bg-border-strong" />
          <span className="size-2 rounded-full bg-border-strong" />
          <span className="size-2 rounded-full bg-border-strong" />
        </span>
        <span className="mx-auto inline-flex items-center gap-1 rounded-full bg-surface-hover p-0.5 text-2xs">
          <span className="rounded-full bg-surface-raised px-2 py-0.5 text-foreground">
            {t('modeChat')}
          </span>
          <span className="px-2 py-0.5 text-foreground-muted">{t('modeCode')}</span>
          <span className="px-2 py-0.5 text-foreground-muted">{t('modeAgents')}</span>
        </span>
        <span className="w-10" aria-hidden="true" />
      </div>
      <div className="bg-background p-4 sm:p-5">{children}</div>
    </div>
  );
}

function PlanIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2.5 1.5h7v9l-3.5-2-3.5 2v-9Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
