'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useId, useRef, useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher';
import { NavChevron, NavMenu, type NavSubItem } from '@/components/layout/NavMenu';
import { ButtonLink, ExternalButtonLink } from '@/components/ui/Button';
import { Link, usePathname } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import {
  faqGeneralSectionId,
  featurePageHref,
  pageLabelKeys,
  pagePaths,
  pageSectionHref,
  pageSections,
  type PageId,
} from '@/lib/pages';
import { featureMenu, site } from '@/lib/site';

type HeaderNavItem = {
  id: PageId;
  path: string;
  label: string;
  items: NavSubItem[];
};

export function SiteHeader() {
  const t = useTranslations('Nav');
  const tFeature = useTranslations('Features.items');
  const tHowItWorks = useTranslations('HowItWorksPage');
  const tWhyZylara = useTranslations('WhyZylaraPage');
  const tFaq = useTranslations('FaqPage');
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  /**
   * Menu principal: cada página é um item e cada seção da página é um submenu.
   * Os rótulos vêm das mesmas mensagens que as próprias páginas usam, então
   * renomear uma seção atualiza a navbar junto.
   */
  const faqGroups = tFaq.raw('groups') as { id: string; label: string }[];

  const navItems: HeaderNavItem[] = [
    {
      id: 'features',
      path: pagePaths.features,
      label: t(pageLabelKeys.features),
      items: featureMenu.map((item) => ({
        href: featurePageHref(item.id),
        label: tFeature(`${item.key}.title`),
        description: tFeature(`${item.key}.description`),
      })),
    },
    {
      id: 'howItWorks',
      path: pagePaths.howItWorks,
      label: t(pageLabelKeys.howItWorks),
      items: pageSections.howItWorks.map((section) => ({
        href: pageSectionHref(pagePaths.howItWorks, section.id),
        label: tHowItWorks(`${section.key}.title`),
      })),
    },
    {
      id: 'whyZylara',
      path: pagePaths.whyZylara,
      label: t(pageLabelKeys.whyZylara),
      items: pageSections.whyZylara.map((section) => ({
        href: pageSectionHref(pagePaths.whyZylara, section.id),
        label: tWhyZylara(`${section.key}.title`),
      })),
    },
    {
      id: 'faq',
      path: pagePaths.faq,
      label: t(pageLabelKeys.faq),
      items: [
        {
          href: pageSectionHref(pagePaths.faq, faqGeneralSectionId),
          label: tFaq('generalTitle'),
        },
        ...faqGroups.map((group) => ({
          href: pageSectionHref(pagePaths.faq, group.id),
          label: group.label,
        })),
      ],
    },
  ];

  // Esc fecha, Tab fica contido no painel e o foco volta ao gatilho.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const focusables = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [],
      ).filter((el) => el.offsetParent !== null && !el.closest('details:not([open])'));

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
    <header className="sticky top-0 z-50">
      {/* Fundo da navbar: só blur e véu, sempre ligados, sem cor de superfície e
          sem borda. A força do blur é do raio (8px); o véu `nav-shade` escurece
          o topo e dissolve até a base, e a máscara `nav-blur` desvanece os dois
          juntos. Fica atrás do conteúdo (`-z-10`) para o backdrop não pegar os
          próprios rótulos do menu. */}
      <div
        aria-hidden="true"
        className="nav-blur nav-shade pointer-events-none absolute inset-x-0 top-0 -z-10 h-16 backdrop-blur-sm"
      />

      <div className="container-page relative flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="Zylara"
          className="rounded-lg transition-opacity hover:opacity-80"
        >
          <Logo />
        </Link>

        <nav aria-label={t('mainNav')} className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <NavMenu
              key={item.id}
              label={item.label}
              path={item.path}
              active={pathname === item.path}
              overviewLabel={t('overview')}
              items={item.items}
            />
          ))}
          <a
            href={site.docsUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="hidden rounded-full px-3.5 py-2 text-sm text-foreground transition-colors duration-150 hover:bg-surface-hover lg:inline-flex"
          >
            {t('guide')}
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher className="hidden sm:flex" bordered={false} />

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
            className="inline-flex size-10 items-center justify-center rounded-full text-foreground-muted transition-colors hover:bg-surface-hover hover:text-foreground lg:hidden"
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
            className="max-h-[calc(100dvh-4rem)] overflow-y-auto bg-background lg:hidden"
          >
            <nav aria-label={t('mobileNav')} className="container-page flex flex-col gap-1 py-4">
              {navItems.map((item) => {
                const active = pathname === item.path;

                return (
                  <details key={item.id} className="group rounded-xl">
                    <summary
                      className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-3 py-3 text-base text-foreground transition-colors hover:bg-surface-hover [&::-webkit-details-marker]:hidden"
                    >
                      {item.label}
                      <NavChevron className="group-open:rotate-180" />
                    </summary>

                    <ul className="mb-1 ml-3 flex flex-col pl-2">
                      <li>
                        <Link
                          href={item.path}
                          onClick={() => setOpen(false)}
                          aria-current={active ? 'page' : undefined}
                          className="block rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-surface-hover"
                        >
                          {t('overview')}
                        </Link>
                      </li>
                      {item.items.map((leaf) => (
                        <li key={leaf.href}>
                          <Link
                            href={leaf.href}
                            onClick={() => setOpen(false)}
                            className="block rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-surface-hover"
                          >
                            {leaf.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                );
              })}

              <a
                href={site.docsUrl}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-base text-foreground transition-colors hover:bg-surface-hover"
              >
                {t('guide')}
              </a>

              <div className="mt-3 flex items-center gap-2 pt-4">
                <LocaleSwitcher bordered={false} />
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
