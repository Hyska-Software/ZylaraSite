import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

/**
 * Captura do app no fim da dobra inicial.
 *
 * A captura real mora em `public/app/hero.png` (1918×1031) e vai direto na
 * página: sem moldura, borda, title bar ou sombra em volta. O acabamento é o
 * próprio `rounded-2xl` na imagem — o mesmo raio que as demais superfícies do
 * site usam —, então nada de `overflow-hidden` num wrapper: o canto arredondado
 * é da imagem, e uma troca de raio é uma classe só.
 *
 * A proporção vem das próprias dimensões da captura — o slot não força
 * `aspect-[16/9]`, só `h-auto`. Trocar a imagem por outra proporção pede apenas
 * atualizar as constantes `SHOT_WIDTH`/`SHOT_HEIGHT` abaixo; nenhum CSS muda.
 * Elas existem para o navegador reservar a altura antes do download (sem
 * deslocamento do layout) e são repassadas ao `next/image`, que serve a captura
 * otimizada no tamanho da viewport.
 *
 * A largura do slot é decidida no hero (`max-w-7xl`, fora do container de
 * texto); aqui só se mantém `w-full` para a captura acompanhar.
 *
 * A captura é informativa — o `alt` vem de `Hero.shotAlt` no idioma ativo.
 */
const SHOT_WIDTH = 1918;
const SHOT_HEIGHT = 1031;

export async function HeroShot() {
  const t = await getTranslations('Hero');

  return (
    <figure className="w-full">
      <Image
        src="/app/hero.png"
        alt={t('shotAlt')}
        width={SHOT_WIDTH}
        height={SHOT_HEIGHT}
        sizes="(min-width: 1312px) 1216px, 100vw"
        priority
        className="block h-auto w-full rounded-2xl"
      />
    </figure>
  );
}
