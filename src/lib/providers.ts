import type { ProviderIconName } from '@/components/brand/provider-glyphs';

/**
 * Famílias de modelo que o catálogo do app já serve.
 *
 * Fonte única da lista: `ProviderRail` (faixa de marcas, seção de provedores) e
 * o hero (linha "Funciona com") leem daqui, então o número publicado nunca
 * diverge entre as duas seções. `Providers.caption` do catálogo de mensagens
 * repete o total em texto — ao mudar a lista, ajuste a frase nos dois idiomas.
 *
 * O hero mostra só as primeiras marcas e resume o resto em "+N"; por isso
 * `heroBrands` existe: a conta do restante sai de `brands.length` e não de um
 * número digitado à mão.
 */

export type Brand = { key: ProviderIconName; name: string };

/** Ordem de exibição — a mesma do marquee e da grade de provedores. */
export const brands: Brand[] = [
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

/** Total publicado em `Providers.caption` — mantenha os dois em sincronia. */
export const MODEL_FAMILIES = brands.length;

/** Marcas que cabem na dobra inicial; o restante vira "+N" no hero. */
export const heroBrands = brands.slice(0, 6);
