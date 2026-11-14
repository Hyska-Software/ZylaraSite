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
 * `decorative` marca o fragmento como `aria-hidden`: os textos são curtos e
 * repetem o que o card já diz em voz alta.
 */

type FragmentProps = {
  decorative?: boolean;
  className?: string;
};

const frame = 'overflow-hidden rounded-xl border border-border bg-background';

export function PlanFragment({ decorative, className }: FragmentProps) {
  return (
    <div className={cn(frame, className)} aria-hidden={decorative || undefined}>
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <span className="inline-flex items-center gap-1.5 text-2xs font-medium text-foreground">
          <PlanIcon />
          Plano · 3 etapas
        </span>
        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-2xs text-accent">Revisar</span>
      </div>
      <ol className="flex flex-col gap-1.5 px-3 py-2.5">
        {['ler auth/middleware.ts', 'bucket por IP', 'teste do limite'].map((step, index) => (
          <li key={step} className="flex items-start gap-2 text-2xs text-foreground-muted">
            <span className="mt-px inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-accent-soft font-mono text-[9px] text-accent">
              {index + 1}
            </span>
            <span className="min-w-0 truncate font-mono">{step}</span>
          </li>
        ))}
      </ol>
      <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-2 text-2xs">
        <span className="truncate text-foreground-muted">Composer travado</span>
        <span className="shrink-0 rounded-md bg-foreground px-2 py-1 text-background">
          Aprovar plano
        </span>
      </div>
    </div>
  );
}

export function DiffFragment({ decorative, className }: FragmentProps) {
  return (
    <div
      className={cn(frame, 'font-mono text-[10px] leading-relaxed', className)}
      aria-hidden={decorative || undefined}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-2.5 py-1.5">
        <span className="min-w-0 truncate text-foreground-muted">src/server/auth.ts</span>
        <span className="flex shrink-0 gap-1.5">
          <span className="text-success">+24</span>
          <span className="text-danger">−3</span>
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

const risks = [
  { label: 'read', tone: 'bg-surface text-foreground-muted' },
  { label: 'command', tone: 'bg-warning-soft text-warning' },
  { label: 'secret', tone: 'bg-danger-soft text-danger' },
  { label: 'outside', tone: 'bg-danger-soft text-danger' },
] as const;

export function PermissionFragment({ decorative, className }: FragmentProps) {
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
          Negar
        </span>
        <span className="rounded-md bg-foreground px-2 py-1 text-background">Permitir</span>
        <span className="ml-auto text-foreground-muted">Revisar</span>
      </div>
    </div>
  );
}

export function SkillsFragment({ decorative, className }: FragmentProps) {
  const skills = [
    { name: 'code-review', hint: 'diff + testes antes do commit' },
    { name: 'release-notes', hint: 'changelog a partir dos commits' },
    { name: 'incident', hint: 'runbook e postmortem' },
  ];

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
  const filters = ['Tudo', 'Favoritos', 'Imagens', 'Código', 'Mídia'];
  const files = [
    { name: 'plano-auth.md', kind: 'MD' },
    { name: 'diff-auth.png', kind: 'PNG' },
    { name: 'coverage.zip', kind: 'ZIP' },
    { name: 'schema.json', kind: 'JSON' },
  ];

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
  return (
    <div
      className={cn(
        'inline-flex w-fit items-center gap-1 rounded-full border border-border bg-background p-1 text-2xs',
        className,
      )}
      aria-hidden={decorative || undefined}
    >
      <span className="rounded-full bg-surface-hover px-2.5 py-1 text-foreground">Chat</span>
      <span className="px-2.5 py-1 text-foreground-muted">Code</span>
      <span className="px-2.5 py-1 text-foreground-muted">Agentes</span>
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

/** Chrome de janela para o tour: title bar + área de conteúdo. */
export function WindowFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-float">
      <div className="flex h-9 items-center gap-2 border-b border-border px-3">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="size-2 rounded-full bg-border-strong" />
          <span className="size-2 rounded-full bg-border-strong" />
          <span className="size-2 rounded-full bg-border-strong" />
        </span>
        <span className="mx-auto inline-flex items-center gap-1 rounded-full bg-surface-hover p-0.5 text-2xs">
          <span className="rounded-full bg-surface-raised px-2 py-0.5 text-foreground">Chat</span>
          <span className="px-2 py-0.5 text-foreground-muted">Code</span>
          <span className="px-2 py-0.5 text-foreground-muted">Agentes</span>
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
