import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import {
  pageLabelKeys,
  pageOrder,
  pagePaths,
  type PageId,
} from '@/lib/pages';
import { cn } from '@/lib/cn';

/**
 * Links "anterior/próxima" entre as páginas de conteúdo.
 *
 * Dependem só da ordem de `pageOrder`: a primeira página mostra apenas a
 * próxima, a última apenas a anterior, e nenhuma lista de links precisa ser
 * mantida à mão em cada arquivo de rota.
 */
export async function PageNav({ current }: { current: PageId }) {
  const t = await getTranslations('Pages');
  const tNav = await getTranslations('Nav');

  const index = pageOrder.indexOf(current);
  const previous = index > 0 ? pageOrder[index - 1] : undefined;
  const next = index >= 0 && index < pageOrder.length - 1 ? pageOrder[index + 1] : undefined;

  if (!previous && !next) return null;

  return (
    <nav aria-label={t('pageNavLabel')}>
      <div className="container-page flex flex-col gap-3 py-10 sm:flex-row sm:items-stretch sm:justify-between">
        {previous ? (
          <PageLink
            id={previous}
            label={t('previousLabel')}
            title={tNav(pageLabelKeys[previous])}
            direction="previous"
          />
        ) : null}

        {next ? (
          <PageLink
            id={next}
            label={t('nextLabel')}
            title={tNav(pageLabelKeys[next])}
            direction="next"
          />
        ) : null}
      </div>
    </nav>
  );
}

function PageLink({
  id,
  label,
  title,
  direction,
}: {
  id: PageId;
  label: string;
  title: string;
  direction: 'previous' | 'next';
}) {
  return (
    <Link
      href={pagePaths[id]}
      className={cn(
        'group flex min-w-0 flex-col gap-1 rounded-2xl border border-border bg-surface-raised p-5 transition-colors duration-150 hover:border-border-strong',
        direction === 'next' ? 'sm:items-end sm:text-right' : 'sm:items-start',
        direction === 'next' && 'sm:ml-auto',
      )}
    >
      <span className="inline-flex items-center gap-1.5 text-2xs uppercase tracking-[0.12em] text-foreground-subtle">
        {direction === 'previous' ? <ArrowIcon /> : null}
        {label}
        {direction === 'next' ? <ArrowIcon className="rotate-180" /> : null}
      </span>
      <span className="text-base font-medium text-foreground transition-colors duration-150 group-hover:text-foreground">
        {title}
      </span>
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
