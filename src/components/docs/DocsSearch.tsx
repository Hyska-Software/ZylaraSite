'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { DocsChrome } from '@/content/docs/types';
import { useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/cn';
import type { DocsPageLink } from '@/lib/docs';

type SearchItem = DocsPageLink & { group: string };

/** Sem acentos e em caixa baixa: "introdução" e "introducao" acham a mesma página. */
function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

/** Palavras do texto normalizado, para a comparação por radical. */
function words(value: string): string[] {
  // `\p{L}\p{N}` em vez de `a-z0-9`: em chinês a "palavra" é o próprio trecho,
  // e cortar só em ASCII deixaria o título inteiro de fora do radical.
  return value.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
}

/**
 * Compara um termo com o texto da página.
 *
 * Substring resolve o caso comum ("instala" → "Instalação"), mas falha quando a
 * pessoa digita uma forma mais longa que a do texto ("instalar"). Por isso, para
 * termos com 5+ letras, vale também o radical de 6 letras: é um stemmer barato
 * que acerta "instalar/instalador", "provider/providers" e "modelo/modelos" sem
 * biblioteca de busca.
 */
function matches(haystack: string, haystackWords: string[], tokens: string[]): boolean {
  const ROOT = 6;

  return tokens.every((token) => {
    if (haystack.includes(token)) return true;
    if (token.length < 5) return false;
    const root = token.slice(0, ROOT);
    return haystackWords.some((word) => word.slice(0, root.length) === root);
  });
}

/**
 * Busca da documentação (Ctrl K / ⌘K).
 *
 * Usa `<dialog>` nativo: foco preso, `Esc` e `::backdrop` vêm do navegador, sem
 * biblioteca. A busca é local — filtra as páginas do catálogo do idioma atual
 * por título, resumo e grupo —, então funciona offline e não manda o que o
 * usuário digita para lugar nenhum.
 */
export function DocsSearch({
  items,
  chrome,
}: {
  items: readonly SearchItem[];
  chrome: DocsChrome;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const router = useRouter();

  const results = useMemo(() => {
    const tokens = words(normalize(query.trim()));
    if (tokens.length === 0) return items;

    return items.filter((item) => {
      const haystack = normalize(`${item.title} ${item.summary} ${item.group}`);
      return matches(haystack, words(haystack), tokens);
    });
  }, [items, query]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) dialog.showModal();
      setQuery('');
      setActive(0);
      inputRef.current?.focus();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      setOpen(true);
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (results.length === 0) return;
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActive((index) => (index + step + results.length) % results.length);
      return;
    }

    if (event.key === 'Enter') {
      const target = results[active];
      if (!target) return;
      event.preventDefault();
      go(target.href);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={chrome.searchOpen}
        className="flex h-9 w-full items-center gap-2 rounded-full border border-border bg-surface-raised px-3 text-xs text-foreground-muted transition-colors duration-150 hover:border-border-strong hover:text-foreground lg:ml-auto lg:w-56"
      >
        <SearchIcon />
        <span className="truncate">{chrome.search}</span>
        <kbd className="ml-auto hidden shrink-0 font-mono text-2xs text-foreground-subtle sm:block">
          {chrome.searchHint}
        </kbd>
      </button>

      <dialog
        ref={dialogRef}
        aria-label={chrome.search}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === dialogRef.current) setOpen(false);
        }}
        className="m-auto w-[min(36rem,calc(100vw-2rem))] rounded-2xl border border-border bg-surface-raised p-0 text-foreground shadow-float backdrop:bg-background/70"
      >
        <div className="flex items-center gap-2 border-b border-border px-3">
          <SearchIcon />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={results[active] ? `${listId}-${active}` : undefined}
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKeyDown}
            placeholder={chrome.searchPlaceholder}
            className="h-12 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-foreground-subtle"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="shrink-0 rounded-md px-1.5 py-1 font-mono text-2xs text-foreground-subtle transition-colors duration-150 hover:text-foreground"
          >
            Esc
          </button>
        </div>

        {/* O `id` do wrapper é o alvo do `aria-controls`: o listbox só existe
            quando há resultado, e a referência não pode ficar pendurada. */}
        <div id={listId} className="scrollbar-none max-h-80 overflow-y-auto">
          {results.length > 0 ? (
            <ul role="listbox" aria-label={chrome.search} className="list-none p-2">
              {results.map((item, index) => (
                <li
                  key={item.href}
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={index === active}
                  onMouseMove={() => setActive(index)}
                  onClick={() => go(item.href)}
                  className={cn(
                    'flex cursor-pointer list-none flex-col gap-0.5 rounded-lg px-2.5 py-2 transition-colors duration-150',
                    index === active ? 'bg-surface-hover' : 'hover:bg-surface-hover/60',
                  )}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm text-foreground">{item.title}</span>
                    <span className="shrink-0 text-2xs uppercase tracking-[0.12em] text-foreground-subtle">
                      {item.group}
                    </span>
                  </span>
                  <span className="line-clamp-2 text-xs text-foreground-muted">{item.summary}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-8 text-center text-xs text-foreground-muted">
              {chrome.searchEmpty}
            </p>
          )}
        </div>
      </dialog>
    </>
  );
}

function SearchIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="7" cy="7" r="4.25" stroke="currentColor" strokeWidth="1.4" />
      <path d="m10.25 10.25 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
