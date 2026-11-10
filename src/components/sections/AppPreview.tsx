import { getTranslations } from 'next-intl/server';

/**
 * Prévia estática do app: janela com title bar, composer, plano e diff.
 * Reproduz o chrome descrito em DESIGN.md §5 (titlebar, painel do chat, painel
 * de artefatos) usando apenas os tokens do design system.
 */
export async function AppPreview() {
  const t = await getTranslations('Hero');
  const steps = t.raw('planSteps') as string[];

  return (
    <figure
      aria-label={t('previewLabel')}
      className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-float"
    >
      {/* title bar */}
      <div className="flex h-11 items-center gap-2 border-b border-border px-3">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-border-strong" />
          <span className="size-2.5 rounded-full bg-border-strong" />
          <span className="size-2.5 rounded-full bg-border-strong" />
        </div>
        <div className="mx-auto flex items-center gap-1 rounded-full bg-surface-hover p-0.5 text-2xs">
          <span className="rounded-full bg-surface-raised px-2.5 py-1 text-foreground">Chat</span>
          <span className="px-2.5 py-1 text-foreground-subtle">Code</span>
          <span className="px-2.5 py-1 text-foreground-subtle">Agentes</span>
        </div>
        <span className="w-12" aria-hidden="true" />
      </div>

      <div className="grid md:grid-cols-[132px_1fr]">
        {/* sidebar */}
        <aside className="hidden border-r border-border bg-surface p-3 md:block">
          <div className="rounded-lg border border-border px-2.5 py-1.5 text-2xs text-foreground-muted">
            + Novo chat
          </div>
          <ul className="mt-4 flex flex-col gap-2.5 text-2xs text-foreground-subtle">
            <li className="text-foreground">Biblioteca</li>
            <li>Skills</li>
            <li className="pt-2 text-foreground-subtle/70">Hoje</li>
            <li className="truncate">Rate limit no login</li>
            <li className="truncate">Ícones do installer</li>
          </ul>
        </aside>

        {/* chat */}
        <div className="bg-background">
          <div className="flex flex-col gap-3 px-4 py-4">
            {/* mensagem do usuário */}
            <div className="flex justify-end">
              <p className="max-w-[85%] rounded-2xl rounded-br-md bg-user-bubble px-3 py-2 text-xs text-foreground">
                {t('prompt')}
              </p>
            </div>

            {/* plano */}
            <div className="rounded-xl border border-border bg-surface-raised p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-2xs font-medium text-foreground">
                  <PlanIcon />
                  {t('planLabel')}
                </span>
                <span className="rounded-full bg-accent-soft px-2 py-0.5 text-2xs text-accent">
                  {t('permissionValue')}
                </span>
              </div>
              <ol className="mt-2.5 flex flex-col gap-1.5">
                {steps.map((step, index) => (
                  <li key={step} className="flex items-start gap-2 text-2xs text-foreground-muted">
                    <span className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[9px] text-accent">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* diff */}
            <div className="rounded-xl border border-border bg-surface-raised">
              <div className="flex items-center justify-between border-b border-border px-3 py-2">
                <span className="truncate font-mono text-2xs text-foreground-muted">
                  {t('diffFile')}
                </span>
                <span className="flex shrink-0 items-center gap-1.5 font-mono text-2xs">
                  <span className="text-success">{t('diffAdded')}</span>
                  <span className="text-danger">{t('diffRemoved')}</span>
                </span>
              </div>
              <pre className="overflow-hidden px-3 py-2 font-mono text-[10px] leading-relaxed">
                <code>
                  <span className="block text-foreground-subtle">
                    {'@@ -12,6 +12,9 @@ export async function login()'}
                  </span>
                  <span className="block text-foreground-muted">{'  const ip = request.ip'}</span>
                  <span className="block text-success">{'+  const bucket = await limiter.take(ip)'}</span>
                  <span className="block text-success">{'+  if (!bucket.ok) return tooMany()'}</span>
                  <span className="block text-foreground-muted">{'  return authenticate(body)'}</span>
                </code>
              </pre>
            </div>
          </div>

          {/* composer */}
          <div className="px-4 pb-4">
            <div className="rounded-2xl border border-border bg-surface-raised px-3 py-2.5">
              <p className="text-2xs text-foreground-subtle">{t('prompt')}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-2xs text-foreground-subtle">
                  <span className="rounded-full bg-accent-soft px-2 py-0.5 text-accent">
                    {t('planLabel')}
                  </span>
                  <span>{t('permissionValue')}</span>
                </span>
                <span className="inline-flex size-6 items-center justify-center rounded-full bg-foreground text-background">
                  <ArrowUpIcon />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* rodapé de estado */}
      <div className="flex items-center justify-between border-t border-border px-3 py-2 text-2xs text-foreground-subtle">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
          {t('approvedLabel')}
        </span>
        <span>{t('appliedLabel')}</span>
      </div>
    </figure>
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

function ArrowUpIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M6 9.5v-7m0 0L3 5.5M6 2.5l3 3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
