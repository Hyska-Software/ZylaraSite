import { getLocale, getTranslations } from 'next-intl/server';
import { getRepoStats } from '@/lib/stats';
import { site, type LatestRelease } from '@/lib/site';

/**
 * Prova social da dobra inicial.
 *
 * Só entra aqui o que dá para verificar no repositório ou na release: versão
 * publicada, licença, ausência de conta, dados locais e — quando a API responde
 * — o número de estrelas. Sem número inventado e sem contador animado.
 */
export async function ProofBar({ release }: { release: LatestRelease }) {
  const t = await getTranslations('Proof');
  const locale = await getLocale();
  const stats = await getRepoStats();

  const stars = stats
    ? new Intl.NumberFormat(locale === 'pt-BR' ? 'pt-BR' : 'en', {
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(stats.stars)
    : null;

  return (
    <ul className="mt-6 flex flex-wrap items-center gap-2">
      <li className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-raised px-2.5 py-1 text-xs text-foreground-muted">
        <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
        <span className="font-mono">v{release.version}</span>
      </li>

      <li className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-raised px-2.5 py-1 text-xs text-foreground-muted">
        {t('license')}
      </li>

      <li className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-raised px-2.5 py-1 text-xs text-foreground-muted">
        {t('noAccount')}
      </li>

      <li className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-raised px-2.5 py-1 text-xs text-foreground-muted">
        {t('localData')}
      </li>

      {stars ? (
        <li>
          <a
            href={site.repoUrl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={t('starsLabel', { count: stars })}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-raised px-2.5 py-1 text-xs text-foreground-muted transition-colors duration-150 hover:border-border-strong hover:text-foreground"
          >
            <StarIcon />
            <span className="font-mono tabular-nums">{stars}</span>
          </a>
        </li>
      ) : null}
    </ul>
  );
}

function StarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 1.75l1.94 3.93 4.34.63-3.14 3.06.74 4.32L8 11.65l-3.88 2.04.74-4.32L1.72 6.3l4.34-.63L8 1.75Z" />
    </svg>
  );
}
