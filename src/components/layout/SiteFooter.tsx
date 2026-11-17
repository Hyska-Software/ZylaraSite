import { getLocale, getTranslations } from 'next-intl/server';
import { Fragment, type CSSProperties } from 'react';
import { DistortedWordmark } from '@/components/brand/DistortedWordmark';
import { Logo } from '@/components/brand/Logo';
import type { Locale } from '@/i18n/routing';
import { legalContactEmail, legalPaths } from '@/lib/legal';
import { localePrefix } from '@/lib/locale';
import { pageHref } from '@/lib/pages';
import { getLatestRelease } from '@/lib/releases';
import { site } from '@/lib/site';

export async function SiteFooter() {
  const t = await getTranslations('Footer');
  const locale = (await getLocale()) as Locale;
  const release = await getLatestRelease();
  const year = new Date().getFullYear();
  const home = localePrefix(locale);

  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-3">
            <Logo />
            <p className="max-w-xs text-sm text-foreground-muted">{t('tagline')}</p>
            <p className="mt-1 flex items-center gap-2 font-mono text-2xs text-foreground-muted">
              <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
              {t('version')} {release.version}
            </p>
          </div>

          <FooterColumn
            title={t('product')}
            links={[
              { label: t('features'), href: pageHref(locale, 'features') },
              { label: t('workflow'), href: pageHref(locale, 'howItWorks') },
              { label: t('positioning'), href: pageHref(locale, 'whyZylara') },
              { label: t('faq'), href: pageHref(locale, 'faq') },
              { label: t('cost'), href: `${home}#cost` },
              { label: t('download'), href: `${home}/download` },
            ]}
          />

          <FooterColumn
            title={t('developers')}
            links={[
              { label: t('repository'), href: site.repoUrl, external: true },
              { label: t('issues'), href: site.issuesUrl, external: true },
              { label: t('releases'), href: site.releasesUrl, external: true },
              { label: t('guide'), href: site.docsUrl, external: true },
            ]}
          />

          <FooterColumn
            title={t('legal')}
            links={[
              { label: t('terms'), href: legalPaths.terms },
              { label: t('privacy'), href: legalPaths.privacy },
              { label: t('contact'), href: `mailto:${legalContactEmail}`, external: true },
            ]}
          />
        </div>
      </div>

      {/* Wordmark gigante: fecha a página com a marca e reage ao ponteiro. */}
      <div className="relative overflow-hidden border-t border-border">
        <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="container-page relative py-8 md:py-10">
          <DistortedWordmark className="text-foreground" />
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-foreground-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Zylara. {t('rights')}
          </p>
          <p className="font-mono text-2xs">{t('license')}</p>
        </div>
      </div>
    </footer>
  );
}

type FooterLink = { label: string; href: string; external?: boolean };

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-2xs font-medium uppercase tracking-[0.12em] text-foreground-muted">
        {title}
      </h2>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={`${title}-${link.label}`}>
            <a
              href={link.href}
              {...(link.external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
              className="footer-link group inline-flex items-center gap-1.5 text-sm text-foreground-muted"
            >
              <FooterLinkLabel label={link.label} />
              {link.external ? <ExternalIcon /> : null}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Rótulo em palavras: cada uma é uma janela que rola para cima no hover
 * (efeito em `globals.css`, `.footer-link__*`). A segunda cópia é só visual —
 * fica fora da árvore de acessibilidade e da seleção de texto.
 */
function FooterLinkLabel({ label }: { label: string }) {
  const words = label.split(/\s+/).filter(Boolean);

  return (
    <span>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          {index > 0 ? ' ' : null}
          <span
            className="footer-link__word"
            style={{ '--roll-step': index } as CSSProperties}
          >
            <span className="footer-link__track">
              <span className="footer-link__copy">{word}</span>
              <span
                aria-hidden="true"
                className="footer-link__copy footer-link__copy--ghost text-foreground"
              >
                {word}
              </span>
            </span>
          </span>
        </Fragment>
      ))}
    </span>
  );
}

function ExternalIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className="shrink-0 transition duration-200 ease-out-soft group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
    >
      <path
        d="M4.5 2.5h5v5M9.5 2.5 3 9"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
