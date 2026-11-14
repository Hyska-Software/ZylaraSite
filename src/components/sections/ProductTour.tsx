'use client';

import { useId, useState, type KeyboardEvent } from 'react';
import { useTranslations } from 'next-intl';
import {
  DiffFragment,
  LibraryFragment,
  PermissionFragment,
  PlanFragment,
  SkillsFragment,
  WindowFrame,
} from '@/components/sections/fragments';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/cn';

type TourTab = {
  id: 'plan' | 'permissions' | 'diff' | 'library' | 'skills';
  label: string;
  title: string;
  description: string;
  points: string[];
};

/**
 * Tour do produto: cinco telas reais do app, uma por aba.
 *
 * É a resposta ao "confie em mim" da prévia estática do hero — cada aba mostra
 * o fragmento da UI correspondente (`fragments.tsx`) ao lado do que ele
 * significa. A tablist segue o padrão ARIA de `DownloadConsole`: setas, Home e
 * End percorrem, só a aba ativa entra na ordem de tabulação.
 */
export function ProductTour() {
  const t = useTranslations('Tour');
  const tabs = t.raw('tabs') as TourTab[];
  const baseId = useId();
  const [active, setActive] = useState(0);

  const selected = tabs[active] ?? tabs[0];

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const last = tabs.length - 1;
    let next: number;

    if (event.key === 'ArrowRight') next = active === last ? 0 : active + 1;
    else if (event.key === 'ArrowLeft') next = active === 0 ? last : active - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = last;
    else return;

    event.preventDefault();
    setActive(next);
    document.getElementById(`${baseId}-tab-${next}`)?.focus();
  }

  if (!selected) return null;

  return (
    <section id="tour" aria-labelledby="tour-title" className="scroll-mt-24 py-20 md:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
          id="tour-title"
        />

        <div
          role="tablist"
          aria-label={t('tabsLabel')}
          className="mt-10 flex gap-1 overflow-x-auto rounded-full border border-border bg-surface p-1"
        >
          {tabs.map((tab, index) => {
            const isActive = index === active;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`${baseId}-tab-${index}`}
                aria-selected={isActive}
                aria-controls={`${baseId}-panel`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActive(index)}
                onKeyDown={onTabKeyDown}
                className={cn(
                  'inline-flex shrink-0 items-center justify-center rounded-full px-4 py-2 text-sm transition-colors duration-150',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                  isActive
                    ? 'bg-surface-raised text-foreground shadow-soft'
                    : 'text-foreground-muted hover:text-foreground',
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`${baseId}-panel`}
          aria-labelledby={`${baseId}-tab-${active}`}
          tabIndex={0}
          className="mt-4 grid gap-8 rounded-2xl border border-border bg-surface p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:p-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center"
        >
          <WindowFrame>{renderPanel(selected.id)}</WindowFrame>

          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-medium text-foreground">{selected.title}</h3>
            <p className="text-sm text-foreground-muted">{selected.description}</p>
            <ul className="flex flex-col gap-2">
              {selected.points.map((point) => (
                <li key={point} className="flex items-start gap-2 text-sm text-foreground-muted">
                  <CheckIcon />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function renderPanel(id: TourTab['id']) {
  if (id === 'permissions') return <PermissionFragment />;
  if (id === 'diff') return <DiffFragment />;
  if (id === 'library') return <LibraryFragment />;
  if (id === 'skills') return <SkillsFragment />;
  return <PlanFragment />;
}

function CheckIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="mt-1 shrink-0 text-accent"
    >
      <path
        d="m3.5 8.5 3 3 6-7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
