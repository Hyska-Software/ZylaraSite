'use client';

import { useEffect, useState } from 'react';
import type { DocsTocItem } from '@/lib/docs';
import { cn } from '@/lib/cn';

/**
 * Índice "Nesta página" da coluna direita.
 *
 * O item ativo é calculado por posição (`scroll`), não por
 * `IntersectionObserver`: seções têm alturas muito diferentes e o observador
 * elege "visível" o que acabou de entrar na tela, o que faz o índice pular para
 * frente. Aqui vale a última seção cujo topo já passou da linha de referência —
 * o mesmo critério que o leitor enxerga. `scrollend` não é usado porque não
 * existe em todos os navegadores.
 */
export function DocsToc({
  items,
  label,
  className,
}: {
  items: readonly DocsTocItem[];
  label: string;
  className?: string;
}) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '');

  useEffect(() => {
    let frame = 0;

    function measure() {
      frame = 0;
      const line = 96; // altura da navbar fixa + respiro
      let current = items[0]?.id ?? '';

      for (const item of items) {
        const element = document.getElementById(item.id);
        if (!element) continue;
        if (element.getBoundingClientRect().top - line <= 0) current = item.id;
      }

      setActiveId(current);
    }

    function onScroll() {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    }

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label={label} className={className}>
      <p className="text-2xs font-medium uppercase tracking-[0.14em] text-foreground-subtle">
        {label}
      </p>

      <ul className="mt-4 flex flex-col gap-2">
        {items.map((item) => {
          const active = item.id === activeId;

          return (
            <li key={item.id} className="relative">
              {active ? (
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 -left-3 h-4 w-0.5 -translate-y-1/2 rounded-full bg-accent"
                />
              ) : null}
              <a
                href={`#${item.id}`}
                aria-current={active ? 'location' : undefined}
                className={cn(
                  'block rounded text-xs transition-colors duration-150',
                  active
                    ? 'text-foreground'
                    : 'text-foreground-muted hover:text-foreground',
                )}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
