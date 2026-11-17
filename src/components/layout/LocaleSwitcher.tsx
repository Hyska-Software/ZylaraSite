'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { NavChevron } from '@/components/layout/NavMenu';
import { Link, usePathname } from '@/i18n/navigation';
import { localeLabels, locales, type Locale } from '@/i18n/routing';
import { cn } from '@/lib/cn';

/** Atraso para atravessar o respiro entre o gatilho e o painel sem fechar. */
const CLOSE_DELAY = 140;

type Props = {
  className?: string;
  /** Borda no gatilho: páginas legais sim, navbar não (lá o item vive do hover). */
  bordered?: boolean;
  /** Lado do gatilho em que o painel se alinha; na navbar ele encosta à direita. */
  align?: 'start' | 'end';
  /** Abre acima do gatilho — usado no menu mobile, preso ao rodapé do painel. */
  side?: 'bottom' | 'top';
};

/**
 * Seletor de idioma em dropdown, com a bandeira e o nome de cada idioma.
 *
 * O gatilho segue o desenho dos itens da navbar (`NavMenu`): pílula sem borda,
 * fundo só no hover, seta que gira ao abrir. O painel repete a superfície dos
 * submenus (`surface-raised` + `shadow-float`), então o controle parece mais
 * um link do menu em vez de um widget à parte.
 *
 * Acessibilidade: abre no hover (só ponteiro de mouse), no clique e por teclado
 * (ArrowDown/ArrowUp já com o foco no idioma atual), fecha com Esc devolvendo o
 * foco ao gatilho, e ArrowUp/Down/Home/End percorrem as opções. Cada opção é um
 * `Link` do next-intl, que mantém o caminho atual — trocar o idioma não sai da
 * página. Sair com o foco fecha o painel.
 */
export function LocaleSwitcher({
  className,
  bordered = true,
  align = 'start',
  side = 'bottom',
}: Props) {
  const t = useTranslations('Nav');
  const reduced = useReducedMotion();
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | null>(null);
  const focusOnOpen = useRef(false);
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

  const options = useCallback(
    () => Array.from(panelRef.current?.querySelectorAll<HTMLAnchorElement>('a[href]') ?? []),
    [],
  );

  // Teclado: o painel abre já no idioma atual, que é o ponto de partida óbvio.
  useEffect(() => {
    if (!open || !focusOnOpen.current) return;
    focusOnOpen.current = false;
    const links = options();
    (links.find((link) => link.getAttribute('aria-current') === 'true') ?? links[0])?.focus();
  }, [open, options]);

  // Esc fecha de qualquer ponto do painel e devolve o foco ao gatilho.
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

  // Trocar de idioma (ou de página) fecha o painel.
  useEffect(() => {
    setOpen(false);
  }, [pathname, locale]);

  // No toque não há hover: só o ponteiro de mouse abre ao passar por cima, o que
  // evita o vai-e-vem de abrir no mouseenter e fechar no clique do mesmo toque.
  function onPointerEnter(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'mouse') openMenu();
  }

  function onPointerLeave(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'mouse') scheduleClose();
  }

  function onTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    focusOnOpen.current = true;
    openMenu();
  }

  function onPanelKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const links = options();
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
      className={cn('relative', className)}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
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
        aria-label={`${t('switchLanguage')}: ${localeLabels[locale].label}`}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          'inline-flex items-center gap-2 rounded-full px-2.5 py-2 text-sm text-foreground transition-colors duration-150',
          bordered
            ? 'border border-border bg-surface-raised hover:bg-surface-hover'
            : 'hover:bg-surface-hover',
          open && 'bg-surface-hover',
        )}
      >
        <LocaleFlag locale={locale} />
        <span className="font-medium tracking-wide">{localeLabels[locale].short}</span>
        <NavChevron className={open ? 'rotate-180' : undefined} />
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <div
            className={cn(
              'absolute z-50 w-56',
              side === 'top' ? 'bottom-full pb-2' : 'top-full pt-2',
              align === 'end' ? 'right-0' : 'left-0',
            )}
          >
            <motion.div
              ref={panelRef}
              id={menuId}
              initial={reduced ? false : { opacity: 0, y: side === 'top' ? 6 : -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: side === 'top' ? 6 : -6 }}
              transition={{ duration: 0.16, ease: [0.22, 0.61, 0.36, 1] }}
              onKeyDown={onPanelKeyDown}
              className="rounded-2xl bg-surface-raised p-1.5 shadow-float"
            >
              <ul>
                {locales.map((value) => {
                  const active = value === locale;
                  const meta = localeLabels[value];

                  return (
                    <li key={value}>
                      <Link
                        href={pathname}
                        locale={value}
                        hrefLang={meta.htmlLang}
                        lang={meta.htmlLang}
                        aria-current={active ? 'true' : undefined}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm transition-colors duration-150',
                          active
                            ? 'font-medium text-foreground hover:bg-surface-hover'
                            : 'text-foreground-muted hover:bg-surface-hover hover:text-foreground',
                        )}
                      >
                        <LocaleFlag locale={value} />
                        <span className="flex-1">{meta.label}</span>
                        {active ? <CheckIcon /> : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/**
 * Bandeira em SVG, não emoji: o Windows não desenha emoji de bandeira (sai
 * "US"/"BR" em letras), então o mapa de caracteres regionais não serve aqui.
 * Os desenhos são simplificados — listras e estrelas do lado americano,
 * losango e círculo do brasileiro — para continuarem legíveis a 20×14px.
 */
function LocaleFlag({ locale }: { locale: Locale }) {
  return (
    <span
      className="inline-flex shrink-0 overflow-hidden rounded-[3px] ring-1 ring-border ring-inset"
    >
      <svg viewBox="0 0 20 14" width="20" height="14" aria-hidden="true" className="block">
        {locale === 'pt-BR' ? <BrazilFlag /> : <UsFlag />}
      </svg>
    </span>
  );
}

function UsFlag() {
  // 13 listras nas proporções oficiais; o encontrão de 0.01 evita emenda visível.
  const stripe = 14 / 13;

  return (
    <>
      <rect width="20" height="14" fill="#ffffff" />
      {[0, 2, 4, 6, 8, 10, 12].map((index) => (
        <rect key={index} y={index * stripe} width="20" height={stripe + 0.01} fill="#b22234" />
      ))}
      <rect width="8" height={stripe * 7} fill="#3c3b6e" />
      {[
        [1.7, 1.8],
        [4.2, 1.8],
        [6.7, 1.8],
        [2.95, 3.6],
        [5.45, 3.6],
        [1.7, 5.4],
        [4.2, 5.4],
        [6.7, 5.4],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={0.55} fill="#ffffff" />
      ))}
    </>
  );
}

function BrazilFlag() {
  return (
    <>
      <rect width="20" height="14" fill="#009c3b" />
      <polygon points="10,2 17.6,7 10,12 2.4,7" fill="#ffdf00" />
      <circle cx="10" cy="7" r="2.6" fill="#002776" />
      <path
        d="M7.75 8.1Q10 5.6 12.35 6.35"
        fill="none"
        stroke="#ffffff"
        strokeWidth="0.55"
        strokeLinecap="round"
      />
    </>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className="shrink-0 text-accent"
    >
      <path
        d="M2.25 6.25 4.75 8.75 9.75 3.25"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
