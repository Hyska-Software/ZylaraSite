import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'pt-BR', 'zh-CN'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  // `/` serve o idioma padrão; os demais recebem prefixo (`/pt-BR`).
  localePrefix: 'as-needed',
  localeDetection: true,
  localeCookie: {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  },
  alternateLinks: true,
});

export const localeLabels: Record<Locale, { label: string; short: string; htmlLang: string }> = {
  en: { label: 'English', short: 'EN', htmlLang: 'en' },
  'pt-BR': { label: 'Português (Brasil)', short: 'PT', htmlLang: 'pt-BR' },
  'zh-CN': { label: '简体中文', short: 'ZH', htmlLang: 'zh-CN' },
};
