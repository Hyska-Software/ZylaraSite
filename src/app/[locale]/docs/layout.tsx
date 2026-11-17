import type { ReactNode } from 'react';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { docsChrome } from '@/content/docs/chrome';
import { DocsMobileNav, DocsSidebar } from '@/components/docs/DocsSidebar';
import { DocsSearch } from '@/components/docs/DocsSearch';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { routing } from '@/i18n/routing';
import { docsGroups, docsSearchIndex } from '@/lib/docs';
import { getDocsData } from '@/lib/docsContent';
import { site } from '@/lib/site';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

/**
 * Shell da documentação.
 *
 * Uma coluna de navegação fixa (`DocsSidebar`) à esquerda e, à direita, a
 * página com o próprio índice — a estrutura da doc do OpenCode, com os tokens e
 * a tipografia do site. A moldura é mais larga que `container-page`: são três
 * colunas e a prosa ainda precisa de 65–75 caracteres por linha.
 *
 * A árvore lateral vem de `user-docs/nav.json`; nada aqui é mantido à mão.
 */
export default async function DocsLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const data = getDocsData(locale);
  const chrome = docsChrome(locale);
  const groups = docsGroups(data);
  const searchIndex = docsSearchIndex(data);

  return (
    <>
      <SiteHeader />

      <main id="main" className="mx-auto w-full max-w-[92rem] px-5 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12 xl:gap-16">
          <DocsSidebar groups={groups} chrome={chrome} repoUrl={site.repoUrl} />

          <div className="min-w-0">
            <div className="flex flex-col gap-3 border-b border-border pt-4 pb-3 lg:flex-row lg:items-center lg:justify-between">
              <DocsMobileNav groups={groups} chrome={chrome} />
              <DocsSearch items={searchIndex} chrome={chrome} />
            </div>

            {children}
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
