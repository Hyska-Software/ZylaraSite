import { getTranslations } from 'next-intl/server';
import { BrandIcon } from '@/components/brand/ProviderIcons';
import { brands, heroBrands } from '@/lib/providers';

/**
 * Linha "Funciona com" da dobra inicial.
 *
 * Mostra as primeiras famílias de modelo do catálogo (glifos oficiais, sem
 * tint: cor de marca aqui viraria semântica de status — mesma regra da seção de
 * provedores) e resume o resto em "+N", com link para `#providers`, onde a lista
 * completa aparece. O total sai de `brands.length`, nunca de um número digitado.
 *
 * Cada glifo é decorativo para o leitor de tela (`aria-hidden` no `svg`); o nome
 * da marca chega por `sr-only`, então a linha é lida como uma frase só —
 * "Funciona com DeepSeek, Gemini, GPT… e mais 10 modelos".
 *
 * Depende do sprite de glifos, renderizado uma única vez no `<main>` da home
 * antes do hero (`src/components/brand/ProviderIcons.tsx`).
 */
export async function HeroProviders() {
  const t = await getTranslations('Hero');
  const remaining = brands.length - heroBrands.length;

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 text-xs text-foreground-muted">
      <span>{t('worksWith')}</span>

      <ul className="flex items-center gap-4">
        {heroBrands.map((brand) => (
          <li key={brand.key} className="flex items-center">
            <BrandIcon name={brand.key} size={18} />
            <span className="sr-only">{brand.name}</span>
          </li>
        ))}
      </ul>

      <a
        href="#providers"
        className="transition-colors duration-150 hover:text-foreground"
      >
        {t('worksWithMore', { count: remaining })}
      </a>
    </div>
  );
}
