'use client';

import { useEffect, useId, useState } from 'react';
import type { DocsChrome } from '@/content/docs/types';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/cn';
import type { DocsNavGroup } from '@/lib/docs';

type SidebarProps = {
  groups: readonly DocsNavGroup[];
  chrome: DocsChrome;
  repoUrl: string;
};

/**
 * Navegação lateral da documentação.
 *
 * Os grupos abrem e fecham pelo mesmo chevron dos acordeões do site (FAQ e menu
 * do cabeçalho): rótulo em caixa alta e discreto, seta à direita girando 180°.
 * Todos começam abertos — esconder a página atual atrás de um grupo fechado é o
 * pior estado possível para quem chega por um link direto. O item ativo vem de
 * `usePathname`, que já chega sem prefixo de idioma.
 */
export function DocsSidebar({ groups, chrome, repoUrl }: SidebarProps) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const pathname = usePathname();

  function toggle(id: string) {
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <aside className="hidden lg:block">
      <div className="scrollbar-none sticky top-16 -mx-2 flex max-h-[calc(100dvh-4rem)] flex-col gap-6 overflow-y-auto px-2 pt-6 pb-10">
        <div className="flex items-center justify-between gap-3 px-1">
          <p className="font-mono text-base tracking-tight text-foreground">{chrome.label}</p>
          <a
            href={repoUrl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={chrome.repository}
            className="rounded-md p-1.5 text-foreground-muted transition-colors duration-150 hover:bg-surface-hover hover:text-foreground"
          >
            <GitHubIcon />
          </a>
        </div>

        <nav aria-label={chrome.nav} className="flex flex-col gap-6">
          {groups.map((group) => {
            const open = !collapsed.has(group.id);

            return (
              <div key={group.id}>
                <button
                  type="button"
                  onClick={() => toggle(group.id)}
                  aria-expanded={open}
                  className="group flex w-full items-center justify-between gap-2 rounded-md py-1 text-left"
                >
                  <span className="text-2xs font-medium uppercase tracking-[0.14em] text-foreground-muted transition-colors duration-150 group-hover:text-foreground">
                    {group.label}
                  </span>
                  <ChevronIcon
                    className={cn(
                      'text-foreground-subtle transition-transform duration-200',
                      open && 'rotate-180',
                    )}
                  />
                </button>

                {open ? (
                  <ul className="mt-1.5 flex flex-col gap-0.5">
                    {group.pages.map((page) => (
                      <NavLink
                        key={page.slug}
                        href={page.href}
                        title={page.title}
                        active={page.href === pathname}
                      />
                    ))}
                  </ul>
                ) : null}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

/** Versão móvel para telas pequenas: um botão com a página atual e a lista. */
export function DocsMobileNav({
  groups,
  chrome,
}: Omit<SidebarProps, 'repoUrl'>) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const current = groups.flatMap((group) => group.pages).find((page) => page.href === pathname);

  return (
    <div className="flex flex-col gap-2 lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-9 w-fit items-center gap-2 rounded-full border border-border bg-surface-raised px-3 text-xs text-foreground transition-colors duration-150 hover:border-border-strong"
      >
        <MenuIcon />
        <span className="max-w-[10rem] truncate">
          {current?.title ?? chrome.menu}
        </span>
        <ChevronIcon className={cn('text-foreground-muted', open && 'rotate-180')} />
      </button>

      {open ? (
        <nav
          id={panelId}
          aria-label={chrome.nav}
          className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-3"
        >
          {groups.map((group) => (
            <div key={group.id} className="flex flex-col gap-1">
              <p className="px-1 text-2xs font-medium uppercase tracking-[0.14em] text-foreground-subtle">
                {group.label}
              </p>
              <ul className="flex flex-col gap-0.5">
                {group.pages.map((page) => (
                  <li key={page.slug}>
                    <Link
                      href={page.href}
                      aria-current={page.href === pathname ? 'page' : undefined}
                      className={cn(
                        'block rounded-md px-2 py-1.5 text-sm transition-colors duration-150',
                        page.href === pathname
                          ? 'bg-surface-hover text-foreground'
                          : 'text-foreground-muted hover:bg-surface-hover hover:text-foreground',
                      )}
                    >
                      {page.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      ) : null}
    </div>
  );
}

function NavLink({ href, title, active }: { href: string; title: string; active: boolean }) {
  return (
    <li>
      <Link
        href={href}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'flex items-center gap-2 rounded-md py-1.5 pr-2 pl-1.5 text-sm transition-colors duration-150',
          active
            ? 'bg-surface-hover text-foreground'
            : 'text-foreground-muted hover:bg-surface-hover/60 hover:text-foreground',
        )}
      >
        {/* Coluna fixa: a bolinha da página atual não desloca o texto das outras. */}
        <span aria-hidden="true" className="flex w-2 shrink-0 justify-center">
          {active ? <span className="size-1.5 rounded-full bg-accent" /> : null}
        </span>
        <span className="truncate">{title}</span>
      </Link>
    </li>
  );
}

function MenuIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2.5 5h11M2.5 11h11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={cn('shrink-0 transition-transform duration-150', className)}
    >
      <path
        d="M3.5 5.5 7 9l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}
