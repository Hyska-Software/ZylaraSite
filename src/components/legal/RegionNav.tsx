'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

type RegionItem = { id: string; label: string };

/**
 * Seletor de jurisdição das páginas legais.
 *
 * As pílulas são âncoras de verdade (`href="#id"`), então funcionam sem JS: o
 * navegador rola até a seção e o `scroll-padding-top` de `globals.css` evita
 * que o cabeçalho sticky cubra o título. Com JS, o `IntersectionObserver`
 * destaca a pílula da seção que está em leitura. Sem o observer, a primeira
 * pílula fica como atual — nunca há um estado "nenhuma selecionada".
 */
export function RegionNav({
  label,
  hint,
  items,
  className,
}: {
  label: string;
  hint?: string;
  items: RegionItem[];
  className?: string;
}) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);

    if (sections.length === 0 || typeof IntersectionObserver === 'undefined') return;

    // A faixa de detecção começa abaixo do cabeçalho e termina no meio da tela:
    // assim a seção destacada é a que o leitor está vendo, não a que acabou de sair.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const top = visible.reduce((best, entry) =>
          entry.boundingClientRect.top < best.boundingClientRect.top ? entry : best,
        );
        setActiveId(top.target.id);
      },
      { rootMargin: '-96px 0px -55% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label={label} className={cn('flex flex-col gap-3', className)}>
      <ul className="flex flex-wrap gap-1.5 lg:flex-col lg:gap-1">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active ? 'location' : undefined}
                className={cn(
                  'inline-flex w-full items-center gap-2 rounded-full px-3 py-1.5 text-xs transition-colors duration-150 lg:rounded-lg',
                  active
                    ? 'bg-accent-soft text-accent'
                    : 'text-foreground-muted hover:bg-surface-hover hover:text-foreground',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'size-1.5 shrink-0 rounded-full transition-colors duration-150',
                    active ? 'bg-accent' : 'bg-border-strong',
                  )}
                />
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
      {hint ? <p className="text-2xs text-foreground-subtle lg:pr-2">{hint}</p> : null}
    </nav>
  );
}
