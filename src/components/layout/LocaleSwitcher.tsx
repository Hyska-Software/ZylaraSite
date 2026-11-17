'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { localeLabels, locales, type Locale } from '@/i18n/routing';
import { cn } from '@/lib/cn';

/**
 * Alternância de idioma em pílulas. Vive no cabeçalho do site e também nas
 * páginas legais, onde a opção de linguagem precisa ficar visível no corpo
 * do documento — por isso é um componente próprio.
 *
 * Trocar o idioma mantém o caminho atual (`pathname` sem prefixo, como o
 * `Link` do next-intl espera).
 */
export function LocaleSwitcher({ className }: { className?: string }) {
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
            aria-label={localeLabels[value].label}
            aria-current={active ? 'true' : undefined}
            className={cn(
              'rounded-full px-2.5 py-1 text-2xs font-medium tracking-wide transition-colors duration-150',
              active
                ? 'bg-accent-soft text-accent'
                : 'text-foreground-muted hover:text-foreground',
            )}
          >
            {localeLabels[value].short}
          </Link>
        );
      })}
    </div>
  );
}
