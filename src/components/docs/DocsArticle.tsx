import type { DocBlock, DocList, DocPage, DocsChrome } from '@/content/docs/types';
import { DocsCode } from '@/components/docs/DocsCode';
import { DocsInline } from '@/components/docs/DocsInline';
import { DocsInstallers } from '@/components/docs/DocsInstallers';
import { DocsToc } from '@/components/docs/DocsToc';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/cn';
import type { DocsPageLink, DocsTocItem } from '@/lib/docs';
import type { LatestRelease } from '@/lib/site';

/**
 * Corpo de uma página da documentação.
 *
 * Três colunas na tela larga: navegação (no layout), prosa com largura de
 * leitura (`max-w-2xl`) e índice "Nesta página". Em telas menores o índice vira
 * um bloco recolhível acima do texto — nunca some, só muda de lugar.
 *
 * Os blocos vêm do Markdown do acervo (`user-docs/`); este componente é o único
 * lugar que decide tipografia, espaçamento e tokens, então uma página nova não
 * precisa de CSS próprio.
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
  /** Só é resolvida quando a página tem um bloco `:::downloads`. */
  release?: LatestRelease | null;
  previous?: DocsPageLink;
  next?: DocsPageLink;
}) {
  const sections = groupBlocks(page.blocks);

  return (
    <div className="grid grid-cols-1 gap-10 pt-8 pb-16 xl:grid-cols-[minmax(0,1fr)_13rem] xl:gap-16">
      <article className="min-w-0 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tighter text-foreground md:text-4xl">
          {page.title}
        </h1>
        {page.description ? (
          <p className="mt-4 text-lg text-foreground-muted">{page.description}</p>
        ) : null}

        {toc.length > 1 ? (
          <details className="mt-8 rounded-xl border border-border bg-surface px-3 py-2.5 xl:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-xs font-medium text-foreground [&::-webkit-details-marker]:hidden">
              {chrome.onThisPage}
              <ChevronIcon className="text-foreground-muted" />
            </summary>
            <DocsToc items={toc} label={chrome.onThisPage} className="mt-3 pb-1" />
          </details>
        ) : null}

        {sections.map((section, index) => (
          <div key={section.heading?.id ?? `intro-${index}`}>
            {section.heading ? (
              <section
                aria-labelledby={section.heading.id}
                className="mt-10 border-t border-border pt-8"
              >
                <h2
                  id={section.heading.id}
                  className="scroll-mt-24 text-xl font-semibold tracking-tight text-foreground"
                >
                  {section.heading.text}
                </h2>
                <div className="mt-4 flex flex-col gap-4">
                  {section.body.map((block, blockIndex) => (
                    <DocBlockView key={blockIndex} block={block} chrome={chrome} release={release} />
                  ))}
                </div>
              </section>
            ) : (
              <div className="mt-8 flex flex-col gap-4">
                {section.body.map((block, blockIndex) => (
                  <DocBlockView key={blockIndex} block={block} chrome={chrome} release={release} />
                ))}
              </div>
            )}
          </div>
        ))}

        <DocsPager chrome={chrome} previous={previous} next={next} />
      </article>

      <div className="hidden xl:block">
        <DocsToc items={toc} label={chrome.onThisPage} className="sticky top-20" />
      </div>
    </div>
  );
}

type Section = { heading?: { id: string; text: string }; body: DocBlock[] };

/** Agrupa o fluxo do Markdown em seções `##`: o que vem antes é a abertura. */
function groupBlocks(blocks: readonly DocBlock[]): Section[] {
  const sections: Section[] = [];
  let current: Section = { body: [] };

  for (const block of blocks) {
    if (block.type === 'h2') {
      sections.push(current);
      current = { heading: { id: block.id, text: block.text }, body: [] };
      continue;
    }

    current.body.push(block);
  }

  sections.push(current);
  return sections.filter((section) => section.heading || section.body.length > 0);
}

function DocBlockView({
  block,
  chrome,
  release,
}: {
  block: DocBlock;
  chrome: DocsChrome;
  release?: LatestRelease | null;
}) {
  switch (block.type) {
    case 'h3':
      return (
        <h3
          id={block.id}
          className="mt-4 scroll-mt-24 text-base font-semibold tracking-tight text-foreground"
        >
          {block.text}
        </h3>
      );

    case 'p':
      return (
        <p className="text-base text-foreground-muted">
          <DocsInline nodes={block.content} />
        </p>
      );

    case 'list':
      return <DocListView list={block.list} />;

    case 'table':
      return (
        <div className="scrollbar-none overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr>
                {block.head.map((cell, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="border-b border-border pb-2 pr-4 text-2xs font-medium uppercase tracking-[0.12em] text-foreground-subtle"
                  >
                    <DocsInline nodes={cell} />
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
                        className="border-b border-border py-2.5 pr-4 align-top text-left font-medium text-foreground"
                      >
                        <DocsInline nodes={cell} />
                      </th>
                    ) : (
                      <td
                        key={cellIndex}
                        className="border-b border-border py-2.5 pr-4 align-top text-foreground-muted"
                      >
                        <DocsInline nodes={cell} />
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'code':
      return (
        <DocsCode
          tabs={[{ label: block.lang || 'text', code: block.code }]}
          copyLabel={chrome.copy}
          copiedLabel={chrome.copied}
        />
      );

    case 'slot':
      // Sem release (fetch falhou no build), o bloco simplesmente não aparece:
      // melhor do que um card vazio ou com link inventado.
      if (block.name === 'downloads' && release) {
        return <DocsInstallers release={release} chrome={chrome} />;
      }
      return null;
  }
}

function DocListView({ list, nested = false }: { list: DocList; nested?: boolean }) {
  const Tag = list.ordered ? 'ol' : 'ul';

  return (
    <Tag
      start={list.ordered && list.start !== 1 ? list.start : undefined}
      className={cn(
        'flex flex-col gap-2 pl-5 text-base text-foreground-muted marker:text-foreground-subtle',
        list.ordered ? 'list-decimal' : 'list-disc',
        nested && 'mt-2 gap-1.5 text-[0.95em]',
      )}
    >
      {list.items.map((item, index) => (
        <li key={index} className="min-w-0">
          <DocsInline nodes={item.content} />
          {item.children ? <DocListView list={item.children} nested /> : null}
        </li>
      ))}
    </Tag>
  );
}

function DocsPager({
  chrome,
  previous,
  next,
}: {
  chrome: DocsChrome;
  previous?: DocsPageLink;
  next?: DocsPageLink;
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
  item: DocsPageLink;
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
