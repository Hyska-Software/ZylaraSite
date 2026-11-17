import { getTranslations } from 'next-intl/server';
import { AnimatedZylara } from '@/components/brand/AnimatedZylara';
import { ExternalButtonLink } from '@/components/ui/Button';
import { DownloadCta } from '@/components/ui/DownloadCta';
import { HeroProviders } from '@/components/sections/HeroProviders';
import { HeroShot } from '@/components/sections/HeroShot';
import { getLatestRelease } from '@/lib/releases';
import { site } from '@/lib/site';

/**
 * Dobra inicial — uma coluna centrada, na ordem em que o olho decide:
 * promessa (título + subtítulo), ação (download e GitHub), alcance (linhas de
 * modelos) e, por fim, a captura do app. O título abre a dobra: sem pill de
 * eyebrow, sem chip de versão. A imagem fecha a dobra em vez de dividi-la:
 * nenhuma coluna de texto compete com ela, e a chamada fica no eixo central,
 * onde o clique acontece.
 *
 * Versão publicada, licença e o aviso de beta saíram daqui: são informação de
 * `/download` (e do rodapé), e pills no meio da dobra competiam com os dois
 * botões. O hero não promete nada que a página de download não confirme.
 *
 * O `bg-grid` continua sendo o único enfeite de fundo — o gradiente radial dele
 * já desvanece antes da captura, então a metade de baixo fica limpa.
 */
export async function Hero() {
  const t = await getTranslations('Hero');
  const release = await getLatestRelease();

  return (
    <section className="relative overflow-hidden pt-16 pb-14 md:pt-24 md:pb-20">
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 opacity-60" />

      <div className="container-page relative flex flex-col items-center text-center">
        <h1 className="text-4xl font-semibold tracking-tighter text-foreground md:text-5xl lg:text-6xl">
          {t('title')}
          <br />
          <span className="text-accent">{t('titleAccent')}</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-foreground-muted">{t('subtitle')}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <DownloadCta release={release} />
          <ExternalButtonLink href={site.repoUrl} size="lg" variant="secondary">
            {t('ctaSecondary')}
          </ExternalButtonLink>
        </div>

        <HeroProviders />
      </div>

      {/* A captura sai do container de texto e ocupa a largura da página (com
          respiro): é o elemento maior da dobra e precisa se ler como tela, não
          como ilustração de coluna. `max-w-7xl` = 1280px, o mesmo eixo visual do
          cabeçalho em telas grandes. */}
      <div className="relative mx-auto mt-14 w-full max-w-7xl px-5 md:mt-16 md:px-8">
        <AnimatedZylara size={72} className="absolute -top-10 right-6 z-10 hidden lg:block" />
        <HeroShot />
      </div>
    </section>
  );
}
