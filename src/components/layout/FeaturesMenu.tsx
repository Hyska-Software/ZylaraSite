'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { Locale } from '@/i18n/routing';
import { cn } from '@/lib/cn';
import { featureMenu, sectionHref } from '@/lib/site';

/** Atraso para atravessar o respiro entre o gatilho e o painel sem fechar. */
const CLOSE_DELAY = 140;

/**
 * Item "Features" do cabeçalho com um menu suspenso que abre no hover.
 *
 * Acessibilidade: também abre por clique e por teclado (Enter, Espaço,
 * ArrowDown), fecha com Esc devolvendo o foco ao gatilho, ArrowUp/Down percorrem
 * os itens e sair da área com foco fecha o menu. O atraso no fechamento evita
 * que o painel pisque ao mover o mouse na diagonal entre o gatilho e os itens.
 */
export function FeaturesMenu() {
  const t = useTranslations('Nav');
  const tItem = useTranslations('Features.items');
  const locale = useLocale() as Locale;
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

  const items = useCallback(
    () => Array.from(panelRef.current?.querySelectorAll<HTMLAnchorElement>('a[href]') ?? []),
    [],
  );

  // Foco no primeiro item quando o menu foi aberto pelo teclado.
  useEffect(() => {
    if (!open || !focusFirstOnOpen.current) return;
    focusFirstOnOpen.current = false;
    items()[0]?.focus();
  }, [open, items]);

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
    const links = items();
    if (links.length === 0) return;
    const current = links.findIndex((link) => link === document.activeElement);

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      links[(current + 1) % links.length]?.focus();
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      links[(current - 1 + links.length) % links.length]?.focus();
      return;
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      links[event.key === 'Home' ? 0 : links.length - 1]?.focus();
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
        aria-label={t('features')}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          'inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm transition-colors duration-150 hover:bg-surface-hover hover:text-foreground',
          open ? 'bg-surface-hover text-foreground' : 'text-foreground-muted',
        )}
      >
        {t('features')}
        <ChevronIcon className={open ? 'rotate-180' : undefined} />
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
              className="rounded-2xl border border-border bg-surface-raised p-1.5 shadow-float"
            >
              <ul>
                {featureMenu.map((item) => (
                  <li key={item.id}>
                    <a
                      href={sectionHref(locale, item.id)}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-3 py-2 transition-colors duration-150 hover:bg-surface-hover"
                    >
                      <span className="block text-sm font-medium text-foreground">
                        {tItem(`${item.key}.title`)}
                      </span>
                      <span className="mt-0.5 block text-2xs leading-relaxed text-foreground-muted">
                        {tItem(`${item.key}.description`)}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className={cn('transition-transform duration-150', className)}
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
