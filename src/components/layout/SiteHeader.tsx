'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useId, useRef, useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { ButtonLink, ExternalButtonLink } from '@/components/ui/Button';
import { Link, usePathname } from '@/i18n/navigation';
import { localeLabels, locales, type Locale } from '@/i18n/routing';
import { cn } from '@/lib/cn';
import { navSections, site } from '@/lib/site';

function hrefFor(locale: Locale, sectionId: string) {
  return locale === 'en' ? `/#${sectionId}` : `/${locale}/#${sectionId}`;
}

export function SiteHeader() {
  const t = useTranslations('Nav');
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Esc fecha, Tab fica contido no painel e o foco volta ao gatilho.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const focusables = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [],
      ).filter((el) => el.offsetParent !== null);

    focusables()[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname, locale]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-colors duration-200',
        scrolled
          ? 'border-border bg-background/85 backdrop-blur-lg'
          : 'border-transparent bg-transparent',
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="Zylara"
          className="rounded-lg transition-opacity hover:opacity-80"
        >
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {navSections.map((section) => (
            <a
              key={section.id}
              href={hrefFor(locale, section.id)}
              className="rounded-full px-3.5 py-2 text-sm text-foreground-muted transition-colors duration-150 hover:bg-surface-hover hover:text-foreground"
            >
              {t(section.labelKey)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher className="hidden sm:flex" />

          <ExternalButtonLink
            href={site.repoUrl}
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex"
            aria-label={t('github')}
          >
            <GitHubIcon />
            <span className="hidden lg:inline">{t('github')}</span>
          </ExternalButtonLink>

          <Link
            href="/download"
            aria-current={pathname === '/download' ? 'page' : undefined}
            className="hidden h-8 items-center justify-center rounded-full bg-foreground px-3 text-xs font-medium text-background transition-colors duration-150 hover:bg-foreground/90 sm:inline-flex"
          >
            {t('download')}
          </Link>

          <button
            ref={triggerRef}
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? t('closeMenu') : t('openMenu')}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex size-10 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-surface-hover hover:text-foreground md:hidden"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            ref={panelRef}
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
            className="border-t border-border bg-background md:hidden"
          >
            <nav aria-label="Mobile" className="container-page flex flex-col gap-1 py-4">
              {navSections.map((section) => (
                <a
                  key={section.id}
                  href={hrefFor(locale, section.id)}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-base text-foreground-muted transition-colors hover:bg-surface-hover hover:text-foreground"
                >
                  {t(section.labelKey)}
                </a>
              ))}
              <div className="mt-3 flex items-center gap-2 border-t border-border pt-4">
                <LocaleSwitcher />
                <ExternalButtonLink
                  href={site.repoUrl}
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                >
                  {t('github')}
                </ExternalButtonLink>
                <ButtonLink
                  href="/download"
                  size="sm"
                  className="flex-1"
                  onClick={() => setOpen(false)}
                >
                  {t('download')}
                </ButtonLink>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function LocaleSwitcher({ className }: { className?: string }) {
  const t = useTranslations('Nav');
  const locale = useLocale() as Locale;
  const pathname = usePathname();

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-border bg-surface-raised p-0.5',
        className,
      )}
      role="group"
      aria-label={t('switchLanguage')}
    >
      {locales.map((value) => {
        const active = value === locale;
        return (
          <Link
            key={value}
            href={pathname}
            locale={value}
            hrefLang={localeLabels[value].htmlLang}
            aria-current={active ? 'true' : undefined}
            className={cn(
              'rounded-full px-2.5 py-1 text-2xs font-medium tracking-wide transition-colors duration-150',
              active
                ? 'bg-accent-soft text-accent'
                : 'text-foreground-subtle hover:text-foreground',
            )}
          >
            {localeLabels[value].short}
          </Link>
        );
      })}
    </div>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M3 6h12M3 12h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M4.5 4.5l9 9m0-9l-9 9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}
