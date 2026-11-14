import { getTranslations } from 'next-intl/server';
import { BrandIcon, ProviderGlyphSprite } from '@/components/brand/ProviderIcons';
import type { ProviderIconName } from '@/components/brand/provider-glyphs';

/**
 * Modelos e rotas de acesso.
 *
 * Duas camadas, e cada uma responde a uma pergunta diferente:
 * 1. a faixa de marcas mostra *quais modelos* você alcança (17 famílias que o
 *    catálogo do app já serve);
 * 2. as rotas mostram *como* você conecta (assinatura, créditos, plano ou
 *    chave) — estáticas, porque são informação, não decoração.
 *
 * As cores por marca ficam no hover da marca (`docs/MODEL_ICONS.md`), mas desde
 * a revisão da landing o estado de repouso é neutro: tints de risco eram lidos
 * como semântica de status, e aqui não existe status de marca.
 */

type Brand = { key: ProviderIconName; name: string };

const brands: Brand[] = [
  { key: 'deepseek', name: 'DeepSeek' },
  { key: 'google', name: 'Gemini' },
  { key: 'openai', name: 'GPT' },
  { key: 'anthropic', name: 'Claude' },
  { key: 'zai', name: 'GLM' },
  { key: 'qwen', name: 'Qwen' },
  { key: 'kimi', name: 'Kimi' },
  { key: 'minimax', name: 'MiniMax' },
  { key: 'grok', name: 'Grok' },
  { key: 'mistral', name: 'Mistral' },
  { key: 'hunyuan', name: 'Hunyuan' },
  { key: 'nvidia', name: 'Nemotron' },
  { key: 'xiaomimimo', name: 'MiMo' },
  { key: 'longcat', name: 'LongCat' },
  { key: 'stepfun', name: 'StepFun' },
  { key: 'meta', name: 'Muse' },
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
 * mostra vazio. Uma pill ocupa ~150px com o respiro; 16 marcas por passagem dão
 * ~2.400px, então duas passagens por metade (~4.800px) cobrem qualquer tela
 * comum sem esticar o espaçamento entre as pills.
 */
const PASSES_PER_HALF = 2;

/** Quantidade publicada em `Providers.caption` — mantenha as duas em sincronia. */
const MODEL_FAMILIES = 16;

export async function ProviderRail() {
  const t = await getTranslations('Providers');
  const stats = t.raw('stats') as { value: string; label: string }[];

  return (
    <section
      id="providers"
      aria-labelledby="providers-title"
      className="scroll-mt-24 border-y border-border bg-surface py-16 md:py-20"
    >
      <ProviderGlyphSprite />

      <div className="container-page">
        <div className="grid gap-x-10 gap-y-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div className="max-w-2xl">
            <h2
              id="providers-title"
              className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
            >
              {t('label')}
            </h2>
            <p className="mt-3 text-base text-foreground-muted">{t('caption')}</p>
          </div>

          <dl className="flex flex-wrap gap-x-8 gap-y-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <dt className="order-2 text-2xs text-foreground-muted">{stat.label}</dt>
                <dd className="order-1 font-mono text-xl tabular-nums text-foreground">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-10">
        <Marquee items={brands} />
      </div>

      <div className="container-page mt-12">
        <h3 className="font-mono text-2xs uppercase tracking-[0.12em] text-foreground-muted">
          {t('routes')}
        </h3>

        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {routes.map((route) => (
            <li
              key={route.name}
              className="group/tile flex items-center gap-3 rounded-xl border border-border bg-background p-3 transition-colors duration-200 hover:border-border-strong"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-raised text-foreground-muted transition-colors duration-200 group-hover/tile:text-foreground">
                <BrandIcon name={route.key} size={17} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-xs font-medium text-foreground">
                  {route.name}
                </span>
                <span className="block truncate font-mono text-2xs text-foreground-muted">
                  {t(`routeDetail.${route.detailKey}`)}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-xs text-foreground-muted">{t('modelsNote', { count: MODEL_FAMILIES })}</p>
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
      <div className="flex w-max animate-[marquee-scroll_40s_linear_infinite] hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none">
        {[half, half].map((group, index) => (
          <ul
            key={index}
            aria-hidden={index > 0 || undefined}
            className="flex shrink-0 items-center motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-3 motion-reduce:[&:last-child]:hidden"
          >
            {group.map((brand, position) => (
              <li
                key={`${brand.key}-${position}`}
                className="group/tile mr-2.5 flex shrink-0 items-center gap-2.5 rounded-full border border-border bg-background py-1.5 pl-1.5 pr-4 transition-colors duration-200 hover:border-border-strong motion-reduce:mr-0"
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-surface-hover text-foreground-muted transition-colors duration-200 group-hover/tile:text-foreground">
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
