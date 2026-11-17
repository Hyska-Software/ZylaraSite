'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';

/** Atraso para atravessar o respiro entre o gatilho e o painel sem fechar. */
const CLOSE_DELAY = 140;

export type NavSubItem = {
  href: string;
  label: string;
  description?: string;
};

type Props = {
  /** Rótulo do gatilho (o mesmo nome da página no menu). */
  label: string;
  /** Página que o submenu detalha. */
  path: string;
  active: boolean;
  /** Texto do link que leva à página inteira. */
  overviewLabel: string;
  items: NavSubItem[];
};

/**
 * Item do menu principal com submenu de seções da página.
 *
 * Um único componente serve os quatro itens: Recursos (seis recursos),
 * Como funciona, Por que Zylara e FAQ (grupos de perguntas). Cada entrada leva
 * ao âncora da seção na página correspondente; o pé do painel leva à página
 * inteira, e é esse link que carrega `aria-current` quando a rota está ativa.
 *
 * Acessibilidade: abre no hover, no clique e por teclado (Enter, Espaço,
 * ArrowDown), fecha com Esc devolvendo o foco ao gatilho, ArrowUp/Down/Home/End
 * percorrem os itens e sair da área com foco fecha o menu. O atraso no
 * fechamento evita que o painel pisque ao mover o mouse na diagonal.
 */
export function NavMenu({ label, path, active, overviewLabel, items }: Props) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | null>(null);
  const focusFirstOnOpen = useRef(false);
  const menuId = useId();

  const cancelClose = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY);
  }, [cancelClose]);

  const openMenu = useCallback(() => {
    cancelClose();
    setOpen(true);
  }, [cancelClose]);

  const links = useCallback(
    () => Array.from(panelRef.current?.querySelectorAll<HTMLAnchorElement>('a[href]') ?? []),
    [],
  );

  // Foco no primeiro item quando o menu foi aberto pelo teclado.
  useEffect(() => {
    if (!open || !focusFirstOnOpen.current) return;
    focusFirstOnOpen.current = false;
    links()[0]?.focus();
  }, [open, links]);

  // Esc fecha de qualquer lugar do menu e devolve o foco ao gatilho.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => () => cancelClose(), [cancelClose]);

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== 'ArrowDown') return;
    event.preventDefault();
    focusFirstOnOpen.current = true;
    openMenu();
  }

  function onPanelKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const anchors = links();
    if (anchors.length === 0) return;
    const current = anchors.findIndex((link) => link === document.activeElement);

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      anchors[(current + 1) % anchors.length]?.focus();
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      anchors[(current - 1 + anchors.length) % anchors.length]?.focus();
      return;
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      anchors[event.key === 'Home' ? 0 : anchors.length - 1]?.focus();
    }
  }

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
      onFocus={openMenu}
      onBlur={(event) => {
        if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
        setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-current={active ? 'page' : undefined}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          'inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm text-foreground transition-colors duration-150 hover:bg-surface-hover',
          (open || active) && 'bg-surface-hover',
        )}
      >
        {label}
        <NavChevron className={open ? 'rotate-180' : undefined} />
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <div className="absolute left-1/2 top-full z-50 w-80 -translate-x-1/2 pt-2">
            <motion.div
              ref={panelRef}
              id={menuId}
              initial={reduced ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
              transition={{ duration: 0.16, ease: [0.22, 0.61, 0.36, 1] }}
              onKeyDown={onPanelKeyDown}
              className="rounded-2xl bg-surface-raised p-1.5 shadow-float"
            >
              <ul>
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-3 py-2 transition-colors duration-150 hover:bg-surface-hover"
                    >
                      <span className="block text-sm font-medium text-foreground">
                        {item.label}
                      </span>
                      {item.description ? (
                        <span className="mt-0.5 block text-2xs leading-relaxed text-foreground-muted">
                          {item.description}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-1 pt-1">
                <Link
                  href={path}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm text-foreground transition-colors duration-150 hover:bg-surface-hover"
                >
                  {overviewLabel}
                  <NavChevron className="-rotate-90" />
                </Link>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/** Seta do gatilho e das entradas; o mesmo desenho em desktop e mobile. */
export function NavChevron({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className={cn('shrink-0 transition-transform duration-150', className)}
    >
      <path
        d="M3 4.75 6 7.75l3-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
