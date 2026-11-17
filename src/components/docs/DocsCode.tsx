'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

/**
 * Bloco de código da documentação, com abas e cópia.
 *
 * As abas existem porque o mesmo comando muda por plataforma (Windows, macOS,
 * Linux) — é o padrão da doc do OpenCode que inspirou esta página. Com uma aba
 * só não há `tablist`: vira um rótulo e o bloco, sem foco desnecessário.
 * `prefers-reduced-motion` não é problema aqui: só há transição de cor.
 */
export function DocsCode({
  tabs,
  copyLabel,
  copiedLabel,
}: {
  tabs: readonly { label: string; code: string }[];
  copyLabel: string;
  copiedLabel: string;
}) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const baseId = useId();

  useEffect(() => () => {
    if (timeout.current) clearTimeout(timeout.current);
  }, []);

  const currentTab = tabs[active] ?? tabs[0];
  if (!currentTab) return null;

  const multiple = tabs.length > 1;

  async function handleCopy() {
    const copiedOk = await copyText(currentTab?.code ?? '');
    if (!copiedOk) return;

    setCopied(true);
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setCopied(false), 1600);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const step = event.key === 'ArrowRight' ? 1 : -1;
    setActive((index) => (index + step + tabs.length) % tabs.length);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-border px-2 py-1.5">
        {multiple ? (
          <div
            role="tablist"
            onKeyDown={handleKeyDown}
            className="-mx-1 flex min-w-0 items-center gap-0.5 overflow-x-auto px-1"
          >
            {tabs.map((tab, index) => (
              <button
                key={tab.label}
                type="button"
                role="tab"
                id={`${baseId}-tab-${index}`}
                aria-controls={`${baseId}-panel`}
                aria-selected={index === active}
                tabIndex={index === active ? 0 : -1}
                onClick={() => setActive(index)}
                className={cn(
                  'shrink-0 rounded-md px-2 py-1 font-mono text-2xs transition-colors duration-150',
                  index === active
                    ? 'bg-surface-hover text-foreground'
                    : 'text-foreground-muted hover:text-foreground',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        ) : (
          <p className="px-1 font-mono text-2xs text-foreground-muted">{currentTab.label}</p>
        )}

        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 rounded-md px-2 py-1 text-2xs text-foreground-muted transition-colors duration-150 hover:bg-surface-hover hover:text-foreground"
        >
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>

      <div
        id={`${baseId}-panel`}
        role={multiple ? 'tabpanel' : undefined}
        aria-labelledby={multiple ? `${baseId}-tab-${active}` : undefined}
      >
        <pre className="scrollbar-none overflow-x-auto px-3 py-3 font-mono text-xs leading-relaxed text-foreground">
          <code>{currentTab.code}</code>
        </pre>
      </div>
    </div>
  );
}

/**
 * Copia o comando.
 *
 * `navigator.clipboard` só existe em contexto seguro (https ou localhost) e
 * ainda depende de permissão; num site servido por IP na rede local ele falha.
 * Nesse caso cai na seleção + `execCommand`, que funciona dentro do gesto do
 * clique. Sem cópia, o botão não mente: o rótulo não muda.
 */
async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    // segue para o caminho legado
  }

  const area = document.createElement('textarea');
  area.value = value;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.top = '0';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();

  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    area.remove();
  }
}
