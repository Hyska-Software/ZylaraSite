import type { DocsCatalog } from '@/content/docs/types';
import { en } from '@/content/docs/en';
import { ptBR } from '@/content/docs/pt-BR';
import { zhCN } from '@/content/docs/zh-CN';

/**
 * Catálogo da documentação por idioma.
 *
 * `satisfies DocsCatalog` (que é `Record<Locale, DocsContent>`) faz o `tsc`
 * falhar quando um idioma novo entra em `routing.ts` sem tradução — a mesma
 * garantia que `scripts/check-messages.mjs` dá para a interface.
 */
export const docsCatalog = {
  en,
  'pt-BR': ptBR,
  'zh-CN': zhCN,
} satisfies DocsCatalog;
