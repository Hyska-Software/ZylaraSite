import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import { BreadcrumbJsonLd } from '@/components/seo/PageStructuredData';
import { Link } from '@/i18n/navigation';

type QuickLink = { href: string; label: string };

type Props = {
  /** Rótulo curto da página na trilha e acima do título. */
  eyebrow: string;
  title: string;
  subtitle: string;
  /** Texto da página atual na trilha de navegação. */
  crumb: string;
  /** Caminho canônico sem prefixo de idioma, usado no JSON-LD. */
  path: string;
  actions?: ReactNode;
  quickNav?: { label: string; items: QuickLink[] };
};

/**
 * Cabeçalho das páginas de conteúdo.
 *
 * Trilha de navegação + `h1` + resumo + CTAs, com as mesmas âncoras de seção em
 * pílulas que a navbar usava — agora dentro da página. A grade de fundo é o
 * mesmo `bg-grid` do hero, para a página pertencer ao site sem repetir o
 * mascote.
 */
export async function PageHero({
  eyebrow,
  title,
  subtitle,
  crumb,
  path,
  actions,
  quickNav,
}: Props) {
  const t = await getTranslations('Pages');

  return (
    <section className="relative overflow-hidden pt-12 pb-10 md:pt-20 md:pb-14">
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 opacity-60" />

      <div className="container-page relative">
        <nav aria-label={t('breadcrumbLabel')} className="flex items-center gap-2 text-xs">
          <Link
            href="/"
            className="rounded text-foreground-muted transition-colors duration-150 hover:text-foreground"
          >
            {t('breadcrumbHome')}
          </Link>
          <span aria-hidden="true" className="text-foreground-subtle">
            /
          </span>
          <span aria-current="page" className="text-foreground">
            {crumb}
          </span>
        </nav>

        <p className="mt-8 text-2xs font-medium uppercase tracking-[0.14em] text-foreground-subtle">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tighter text-foreground md:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-foreground-muted">{subtitle}</p>

        {actions ? <div className="mt-8 flex flex-wrap items-center gap-3">{actions}</div> : null}

        {quickNav && quickNav.items.length > 0 ? (
          <nav
            aria-label={quickNav.label}
            className="mt-10 flex flex-wrap gap-2 border-t border-border pt-6"
          >
            {quickNav.items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full border border-border bg-surface-raised px-3 py-1.5 text-xs text-foreground-muted transition-colors duration-150 hover:border-border-strong hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>
        ) : null}
      </div>

      <BreadcrumbJsonLd
        trail={[
          { name: t('breadcrumbHome'), path: '/' },
          { name: crumb, path },
        ]}
      />
    </section>
  );
}
