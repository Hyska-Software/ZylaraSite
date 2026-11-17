import { getTranslations } from 'next-intl/server';

/**
 * Slot da captura do app no fim da dobra inicial.
 *
 * Hoje é um placeholder: moldura de janela (title bar com os três pontos) e,
 * dentro, um retângulo tracejado 16:9 com o rótulo da captura. Quando a imagem
 * final chegar, troque **apenas** o bloco interno tracejado por:
 *
 *   <img
 *     src="/app/hero.webp"
 *     alt={t('shotAlt')}
 *     width={1920}
 *     height={1080}
 *     className="h-full w-full rounded-lg object-cover"
 *   />
 *
 * salvo em `public/app/`, adicione `Hero.shotAlt` nos dois catálogos (é o
 * `alt` da imagem) e ajuste o `aspect-[16/9]` do container se a proporção for
 * outra. A moldura (borda + sombra + title bar) fica: é ela que segura o peso
 * visual da dobra.
 *
 * A largura do slot é decidida no hero (`max-w-7xl`, fora do container de
 * texto); aqui só se mantém `w-full` para a captura acompanhar.
 *
 * Enquanto for placeholder, o conjunto fica `aria-hidden` — não há informação
 * para o leitor de tela e um "captura do app" anunciado seria ruído.
 */
export async function HeroShot() {
  const t = await getTranslations('Hero');

  return (
    <figure aria-hidden="true" className="w-full">
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-float">
        <div className="flex h-10 items-center gap-1.5 border-b border-border px-4">
          <span className="size-2.5 rounded-full bg-border-strong" />
          <span className="size-2.5 rounded-full bg-border-strong" />
          <span className="size-2.5 rounded-full bg-border-strong" />
        </div>

        <div className="p-3 md:p-4">
          <div className="flex aspect-[16/9] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border-strong bg-background text-foreground-subtle">
            <FrameIcon />
            <p className="text-xs font-medium text-foreground-muted">{t('shotPlaceholder')}</p>
            <p className="font-mono text-2xs text-foreground-subtle">16:9</p>
          </div>
        </div>
      </div>
    </figure>
  );
}

function FrameIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2.5" y="4" width="15" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="m5.5 13 3.2-3.6 2.3 2.4 1.6-1.7 2.4 2.9"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="7.6" r="1" fill="currentColor" />
    </svg>
  );
}
