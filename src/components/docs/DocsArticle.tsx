import type { DocBlock, DocPage, DocsChrome } from '@/content/docs/types';
import { DocsCode } from '@/components/docs/DocsCode';
import { DocsInline } from '@/components/docs/DocsInline';
import { DocsInstallers } from '@/components/docs/DocsInstallers';
import { DocsToc } from '@/components/docs/DocsToc';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';
import type { DocsNavItem, DocsTocItem } from '@/lib/docs';
import type { LatestRelease } from '@/lib/site';

/**
 * Corpo de uma página da documentação.
 *
 * Três colunas na tela larga: navegação (no layout), prosa com largura de
 * leitura (`max-w-2xl`) e índice "Nesta página". Em telas menores o índice vira
 * um bloco recolhível acima do texto — nunca some, só muda de lugar.
 *
 * O conteúdo é declarativo (`DocBlock`): este componente decide a tipografia e
 * os tokens, então uma página nova não precisa de CSS próprio.
 */
export function DocsArticle({
  page,
  toc,
  chrome,
  release,
  previous,
  next,
}: {
  page: DocPage;
  toc: readonly DocsTocItem[];
  chrome: DocsChrome;
  release: LatestRelease;
  previous?: DocsNavItem;
  next?: DocsNavItem;
}) {
  return (
    <div className="grid grid-cols-1 gap-10 pt-8 pb-16 xl:grid-cols-[minmax(0,1fr)_13rem] xl:gap-16">
      <article className="min-w-0 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tighter text-foreground md:text-4xl">
          {page.title}
        </h1>
        <p className="mt-4 text-lg text-foreground-muted">{page.lede}</p>

        {toc.length > 1 ? (
          <details className="mt-8 rounded-xl border border-border bg-surface px-3 py-2.5 xl:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-xs font-medium text-foreground [&::-webkit-details-marker]:hidden">
              {chrome.onThisPage}
              <ChevronIcon className="text-foreground-muted" />
            </summary>
            <DocsToc items={toc} label={chrome.onThisPage} className="mt-3 pb-1" />
          </details>
        ) : null}

        {page.sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-title`}
            className="mt-10 scroll-mt-24 border-t border-border pt-8"
          >
            <h2
              id={`${section.id}-title`}
              className="text-xl font-semibold tracking-tight text-foreground"
            >
              {section.title}
            </h2>

            <div className="mt-4 flex flex-col gap-4">
              {section.blocks.map((block, index) => (
                <Block key={index} block={block} chrome={chrome} release={release} />
              ))}
            </div>
          </section>
        ))}

        <DocsPager chrome={chrome} previous={previous} next={next} />
      </article>

      <div className="hidden xl:block">
        <DocsToc items={toc} label={chrome.onThisPage} className="sticky top-20" />
      </div>
    </div>
  );
}

function Block({
  block,
  chrome,
  release,
}: {
  block: DocBlock;
  chrome: DocsChrome;
  release: LatestRelease;
}) {
  switch (block.kind) {
    case 'text':
      return (
        <p className="text-base text-foreground-muted">
          <DocsInline text={block.text} />
        </p>
      );

    case 'list':
      if (block.ordered) {
        return (
          <ol className="flex list-decimal flex-col gap-2 pl-5 text-base text-foreground-muted marker:text-foreground-subtle">
            {block.items.map((item, index) => (
              <li key={index}>
                <DocsInline text={item} />
              </li>
            ))}
          </ol>
        );
      }

      return (
        <ul className="flex flex-col gap-2 text-base text-foreground-muted">
          {block.items.map((item, index) => (
            <li key={index} className="flex items-start gap-2.5">
              <span
                aria-hidden="true"
                className="mt-[0.7em] size-1 shrink-0 rounded-full bg-border-strong"
              />
              <span className="min-w-0">
                <DocsInline text={item} />
              </span>
            </li>
          ))}
        </ul>
      );

    case 'note':
      return (
        <div className="flex items-start gap-2.5 text-base text-foreground-muted">
          <InfoIcon />
          <p className="min-w-0">
            <span className="mr-1.5 font-medium text-foreground">{block.label}</span>
            <DocsInline text={block.text} />
          </p>
        </div>
      );

    case 'code':
      return <DocsCode tabs={block.tabs} copyLabel={chrome.copy} copiedLabel={chrome.copied} />;

    case 'table':
      return (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr>
                {block.head.map((cell) => (
                  <th
                    key={cell}
                    scope="col"
                    className="border-b border-border pb-2 pr-4 text-2xs font-medium uppercase tracking-[0.12em] text-foreground-subtle"
                  >
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) =>
                    cellIndex === 0 ? (
                      <th
                        key={cellIndex}
                        scope="row"
                        className="border-b border-border py-2.5 pr-4 text-left align-top font-medium text-foreground"
                      >
                        {cell}
                      </th>
                    ) : (
                      <td
                        key={cellIndex}
                        className="border-b border-border py-2.5 pr-4 align-top text-foreground-muted"
                      >
                        <DocsInline text={cell} />
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'installers':
      return <DocsInstallers release={release} chrome={chrome} />;
  }
}

function DocsPager({
  chrome,
  previous,
  next,
}: {
  chrome: DocsChrome;
  previous?: DocsNavItem;
  next?: DocsNavItem;
}) {
  if (!previous && !next) return null;

  return (
    <nav
      aria-label={chrome.pagination}
      className="mt-12 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between"
    >
      {previous ? (
        <PagerLink item={previous} label={chrome.previous} direction="previous" />
      ) : null}
      {next ? <PagerLink item={next} label={chrome.next} direction="next" /> : null}
    </nav>
  );
}

function PagerLink({
  item,
  label,
  direction,
}: {
  item: DocsNavItem;
  label: string;
  direction: 'previous' | 'next';
}) {
  return (
    <Link
      href={item.href}
      className={cn(
        'group flex min-w-0 flex-col gap-1 rounded-xl border border-border bg-surface p-4 transition-colors duration-150 hover:border-border-strong',
        direction === 'next' ? 'sm:ml-auto sm:items-end sm:text-right' : 'sm:items-start',
      )}
    >
      <span className="inline-flex items-center gap-1.5 text-2xs uppercase tracking-[0.12em] text-foreground-subtle">
        {direction === 'previous' ? <ArrowIcon /> : null}
        {label}
        {direction === 'next' ? <ArrowIcon className="rotate-180" /> : null}
      </span>
      <span className="text-sm font-medium text-foreground">{item.title}</span>
    </Link>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      <path
        d="M7.5 2.5 4 6l3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
      className={cn('shrink-0', className)}
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

function InfoIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="mt-1 shrink-0 text-foreground-subtle"
    >
      <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 7.25v3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="8" cy="5.1" r="0.75" fill="currentColor" />
    </svg>
  );
}
