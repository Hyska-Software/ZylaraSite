import { getTranslations } from 'next-intl/server';
import { BrandIcon, ProviderGlyphSprite } from '@/components/brand/ProviderIcons';
import type { ProviderIconName } from '@/components/brand/provider-glyphs';

/**
 * Estúdio de provedores.
 *
 * Duas camadas, e cada uma responde a uma pergunta diferente:
 * 1. a nuvem de marcas mostra *quais modelos* você alcança (17 famílias que o
 *    catálogo do app já serve) — em movimento, para caber sem virar um bloco
 *    de logos apertados;
 * 2. as rotas mostram *como* você conecta (assinatura, créditos, plano ou
 *    chave) — estáticas, porque são informação, não decoração.
 *
 * As cores por marca seguem o mapa de `docs/MODEL_ICONS.md` do app, mas
 * aparecem só no hover: em repouso a faixa fica neutra, coerente com o tom
 * calmo do resto da página.
 */

type Brand = { key: ProviderIconName; name: string; tint: string };

/** Tints do app (DESIGN.md §8), aplicados só quando o tile é tocado. */
const brands: Brand[] = [
  { key: 'deepseek', name: 'DeepSeek', tint: 'group-hover/tile:bg-accent-soft group-hover/tile:text-accent' },
  { key: 'google', name: 'Gemini', tint: 'group-hover/tile:bg-accent-soft group-hover/tile:text-accent' },
  { key: 'openai', name: 'GPT', tint: 'group-hover/tile:bg-success-soft group-hover/tile:text-success' },
  { key: 'anthropic', name: 'Claude', tint: 'group-hover/tile:bg-warning-soft group-hover/tile:text-warning' },
  { key: 'zai', name: 'GLM', tint: 'group-hover/tile:bg-accent-soft group-hover/tile:text-accent' },
  { key: 'qwen', name: 'Qwen', tint: 'group-hover/tile:bg-accent-soft group-hover/tile:text-accent' },
  { key: 'kimi', name: 'Kimi', tint: 'group-hover/tile:bg-accent-soft group-hover/tile:text-accent' },
  { key: 'minimax', name: 'MiniMax', tint: 'group-hover/tile:bg-danger-soft group-hover/tile:text-danger' },
  { key: 'grok', name: 'Grok', tint: 'group-hover/tile:bg-surface-hover group-hover/tile:text-foreground' },
  { key: 'mistral', name: 'Mistral', tint: 'group-hover/tile:bg-warning-soft group-hover/tile:text-warning' },
  { key: 'hunyuan', name: 'Hunyuan', tint: 'group-hover/tile:bg-accent-soft group-hover/tile:text-accent' },
  { key: 'nvidia', name: 'Nemotron', tint: 'group-hover/tile:bg-success-soft group-hover/tile:text-success' },
  { key: 'xiaomimimo', name: 'MiMo', tint: 'group-hover/tile:bg-danger-soft group-hover/tile:text-danger' },
  { key: 'longcat', name: 'LongCat', tint: 'group-hover/tile:bg-success-soft group-hover/tile:text-success' },
  { key: 'stepfun', name: 'StepFun', tint: 'group-hover/tile:bg-success-soft group-hover/tile:text-success' },
  { key: 'meta', name: 'Muse', tint: 'group-hover/tile:bg-warning-soft group-hover/tile:text-warning' },
  { key: 'opencode', name: 'OpenCode', tint: 'group-hover/tile:bg-surface-hover group-hover/tile:text-foreground' },
];

/** As quatro rotas reais de acesso (docs/MODELS.md). */
const routes: { key: ProviderIconName; name: string; detailKey: 'go' | 'zen' | 'openai' | 'anthropic' }[] = [
  { key: 'opencode', name: 'OpenCode Go', detailKey: 'go' },
  { key: 'opencode', name: 'OpenCode Zen', detailKey: 'zen' },
  { key: 'openai', name: 'OpenAI', detailKey: 'openai' },
  { key: 'anthropic', name: 'Anthropic', detailKey: 'anthropic' },
];

/**
 * Cada metade precisa ser mais larga que a viewport, senão a emenda do laço
 * mostra vazio. Uma pill ocupa ~150px com o respiro; 17 marcas por passagem dão
 * ~2.550px, então duas passagens por metade (~5.100px) cobrem qualquer tela
 * comum sem esticar o espaçamento entre as pills.
 */
const PASSES_PER_HALF = 2;

export async function ProviderRail() {
  const t = await getTranslations('Providers');

  return (
    <section
      aria-labelledby="providers-label"
      className="relative overflow-hidden border-y border-border bg-surface py-14 md:py-16"
    >
      <ProviderGlyphSprite />

      <div className="container-page">
        <div className="flex items-center gap-4 md:gap-6">
          <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
          <p
            id="providers-label"
            className="text-center text-2xs font-medium uppercase tracking-[0.14em] text-foreground-subtle"
          >
            {t('label')}
          </p>
          <span aria-hidden="true" className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
        </div>

        <p className="mx-auto mt-4 max-w-lg text-center text-sm text-foreground-muted">
          {t('caption')}
        </p>
      </div>

      <div className="mt-10">
        <Marquee items={brands} />
      </div>

      <div className="container-page mt-12">
        <div className="flex items-center gap-3">
          <p className="font-mono text-2xs uppercase tracking-[0.12em] text-foreground-subtle">
            {t('routes')}
          </p>
          <span aria-hidden="true" className="h-px flex-1 bg-border" />
        </div>

        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {routes.map((route) => (
            <li
              key={route.name}
              className="group/tile flex items-center gap-3 rounded-xl border border-border bg-background p-3 transition-colors duration-200 hover:border-border-strong"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-raised text-foreground-subtle transition-colors duration-200 group-hover/tile:text-foreground">
                <BrandIcon name={route.key} size={17} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-xs font-medium text-foreground">
                  {route.name}
                </span>
                <span className="block truncate font-mono text-2xs text-foreground-subtle">
                  {t(`routeDetail.${route.detailKey}`)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * Faixa infinita. O trilho tem duas metades idênticas e o laço anda -50%, então
 * a segunda metade assume exatamente onde a primeira termina. Cada metade
 * repete as marcas várias vezes para ficar sempre mais larga que a viewport —
 * é isso que evita o vão vazio na emenda. A cópia fica `aria-hidden`, então
 * cada marca é lida uma vez só pelo leitor de tela.
 * Com `prefers-reduced-motion` vira uma grade estática que preenche a largura.
 */
function Marquee({ items }: { items: Brand[] }) {
  const half = Array.from({ length: PASSES_PER_HALF }, () => items).flat();

  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] motion-reduce:overflow-visible motion-reduce:[mask-image:none]">
      <div className="flex w-max animate-[marquee-scroll_70s_linear_infinite] hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none">
        {[half, half].map((group, index) => (
          <ul
            key={index}
            aria-hidden={index > 0 || undefined}
            className="flex shrink-0 items-center motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-3 motion-reduce:[&:last-child]:hidden"
          >
            {group.map((brand, position) => (
              <li
                key={`${brand.key}-${position}`}
                className="group/tile mr-3 flex shrink-0 items-center gap-2.5 rounded-full border border-border bg-background py-1.5 pl-1.5 pr-4 transition-colors duration-200 hover:border-border-strong motion-reduce:mr-0"
              >
                <span
                  className={`flex size-7 items-center justify-center rounded-full bg-surface-hover text-foreground-subtle transition-colors duration-200 ${brand.tint}`}
                >
                  <BrandIcon name={brand.key} size={15} />
                </span>
                <span className="whitespace-nowrap text-xs font-medium text-foreground-muted transition-colors duration-200 group-hover/tile:text-foreground">
                  {brand.name}
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
