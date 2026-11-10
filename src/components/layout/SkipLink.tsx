import { getTranslations } from 'next-intl/server';

/** Primeiro elemento focável da página; aparece só com foco de teclado. */
export async function SkipLink() {
  const t = await getTranslations('Nav');

  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:text-background"
    >
      {t('skipToContent')}
    </a>
  );
}
