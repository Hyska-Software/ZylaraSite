'use client';

import { useEffect, useId, useRef } from 'react';
import { cn } from '@/lib/cn';

/**
 * Wordmark "ZYLARA" que se deforma sob o cursor.
 *
 * O efeito é **distorção de geometria**, não deslocamento de blocos: cada letra
 * é um `<text>` dentro de um `<g>` com um filtro de `feTurbulence` +
 * `feDisplacementMap`. O `scale` do mapa cresce conforme o ponteiro se
 * aproxima, então as bordas das letras esticam e quebram (o "derretido" da
 * referência) e voltam ao normal quando o cursor sai.
 *
 * Por que um filtro por letra: em SVG, `filter` não se aplica a `<tspan>` de
 * forma confiável. Um `<g>` por letra resolve e ainda permite intensidade
 * diferente para cada uma — é isso que dá o efeito localizado.
 *
 * Layout: as letras são medidas e posicionadas uma vez, no carregamento da
 * fonte. O avanço de cada letra é `(largura + tracking)`, e o conjunto recebe
 * um único transform `translate(...) scale(...)` calculado a partir da caixa de
 * tinta das letras já posicionadas. Escalar apenas o grupo externo e transladar
 * **depois** da escala é o que mantém a palavra inteira dentro do viewBox — foi
 * um translate aplicado antes da escala que jogava a base das letras para fora
 * e cortava o wordmark. A palavra preenche o viewBox e fica centralizada.
 *
 * Custo: filtros SVG são caros, então o handler só trabalha quando o ponteiro
 * está perto do wordmark e escreve dentro de `requestAnimationFrame`.
 * `prefers-reduced-motion` mantém o texto intacto.
 */

const WORD = 'ZYLARA';
const LETTERS = [...WORD];

/** Deslocamento máximo do filtro, em unidades do viewBox. */
const MAX_SHIFT = 46;

/** Alcance do efeito, em px de tela a partir do centro de cada letra. */
const RADIUS = 280;

/** Folga do corte do filtro, em % da caixa da letra. */
const FILTER_MARGIN = 30;

/** Corpo da fonte em unidades do viewBox (define a altura das letras). */
const FONT_SIZE = 168;

/** Espaço entre letras, em unidades do viewBox antes da escala. */
const TRACKING = 10;

const VB_WIDTH = 1000;
const VB_HEIGHT = 200;

export function DistortedWordmark({ className }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const layoutRef = useRef<SVGGElement>(null);
  const letterRefs = useRef<(SVGTextElement | null)[]>([]);
  const mapRefs = useRef<(SVGFEDisplacementMapElement | null)[]>([]);

  // `useId` pode conter ":" (inválido em url(#...)), então é sanitizado.
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');

  // Layout: mede as letras e distribui ao longo do viewBox.
  useEffect(() => {
    const group = layoutRef.current;
    if (!group) return;
    let alive = true;
    let canvas: HTMLCanvasElement | null = null;

    /**
     * Caixa de tinta da palavra, em unidades não escaladas.
     *
     * `getBBox()` de `<text>` devolve a caixa da linha (ascent + descent da
     * fonte), bem mais alta que as letras — centralizar por ela encolhe o
     * wordmark e deixa as margens tortas. `measureText` expõe
     * `actualBoundingBox*`, que é a tinta de fato; o canvas resolve a mesma
     * família já carregada, então as métricas batem com o SVG.
     */
    const inkBox = (nodes: SVGTextElement[]) => {
      canvas ??= document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return null;

      const style = getComputedStyle(nodes[0]!);
      context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;

      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      for (const node of nodes) {
        const metrics = context.measureText(node.textContent ?? '');
        const ascent = metrics.actualBoundingBoxAscent;
        const descent = metrics.actualBoundingBoxDescent;

        // Navegadores sem `actualBoundingBox*` caem no fallback de quem chama.
        if (!Number.isFinite(ascent) || !Number.isFinite(descent)) return null;

        const origin = Number(node.getAttribute('x') ?? 0);
        const baseline = Number(node.getAttribute('y') ?? 0);

        minX = Math.min(minX, origin - metrics.actualBoundingBoxLeft);
        maxX = Math.max(maxX, origin + metrics.actualBoundingBoxRight);
        minY = Math.min(minY, baseline - ascent);
        maxY = Math.max(maxY, baseline + descent);
      }

      return { minX, minY, maxX, maxY };
    };

    const layout = () => {
      if (!alive) return;

      const letters = letterRefs.current.slice(0, LETTERS.length);
      if (letters.some((node) => !node)) return;

      const widths = letters.map((node) => node!.getComputedTextLength());
      if (widths.some((width) => width === 0)) return;

      // Posiciona cada letra em unidades não escaladas; a escala fica no grupo
      // externo, então o cursor e o desenho usam a mesma unidade.
      let cursor = 0;
      letters.forEach((node, index) => {
        node!.setAttribute('x', cursor.toFixed(2));
        cursor += widths[index]! + TRACKING;
      });

      // Fallback: sem métrica de tinta, usa a caixa de avanço e a de linha.
      const box = inkBox(letters as SVGTextElement[]) ?? {
        minX: 0,
        minY: 0,
        maxX: cursor - TRACKING,
        maxY: FONT_SIZE,
      };

      const boxWidth = box.maxX - box.minX;
      const boxHeight = box.maxY - box.minY;
      if (!(boxWidth > 0) || !(boxHeight > 0)) return;

      // `contain`: a palavra inteira cabe no viewBox nos dois eixos. Aplicar o
      // translate depois da escala é o que mantém a centralização vertical —
      // deslocar antes da escala encolhe junto e joga a base fora do viewBox.
      const scale = Math.min(VB_WIDTH / boxWidth, VB_HEIGHT / boxHeight);
      if (!Number.isFinite(scale) || !(scale > 0)) return;

      const translateX = (VB_WIDTH - boxWidth * scale) / 2 - box.minX * scale;
      const translateY = (VB_HEIGHT - boxHeight * scale) / 2 - box.minY * scale;

      group.setAttribute(
        'transform',
        `translate(${translateX.toFixed(2)} ${translateY.toFixed(2)}) scale(${scale.toFixed(5)})`,
      );
    };

    layout();

    // Refaz quando a fonte real chega (a métrica muda) e ao redimensionar.
    document.fonts?.ready.then(() => layout());
    window.addEventListener('resize', layout);

    return () => {
      alive = false;
      window.removeEventListener('resize', layout);
    };
  }, []);

  // Interação: intensidade do displacement por proximidade do ponteiro.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let near = false;

    const reset = () => {
      for (const map of mapRefs.current) map?.setAttribute('scale', '0');
    };

    const paint = () => {
      frame = 0;
      if (!near) return;

      for (let index = 0; index < LETTERS.length; index += 1) {
        const letter = letterRefs.current[index];
        const map = mapRefs.current[index];
        if (!letter || !map) continue;

        const box = letter.getBoundingClientRect();
        if (box.width === 0) continue;

        const distance = Math.hypot(
          box.left + box.width / 2 - pointerX,
          box.top + box.height / 2 - pointerY,
        );

        // Decaimento quadrático: força total no centro, zero na borda do raio.
        const falloff = Math.max(0, 1 - distance / RADIUS);
        map.setAttribute('scale', (falloff * falloff * MAX_SHIFT).toFixed(2));
      }
    };

    const schedule = () => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(paint);
    };

    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;

      // Early-out: longe do wordmark, nenhum trabalho por frame.
      const box = svg.getBoundingClientRect();
      const distance = Math.hypot(
        box.left + box.width / 2 - pointerX,
        box.top + box.height / 2 - pointerY,
      );

      if (distance >= box.width / 2 + RADIUS + 160) {
        if (near) {
          near = false;
          if (frame !== 0) {
            window.cancelAnimationFrame(frame);
            frame = 0;
          }
          reset();
        }
        return;
      }

      near = true;
      schedule();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
      data-wordmark=""
      className={cn('block w-full select-none', className)}
      style={{ overflow: 'visible' }}
    >
      <defs>
        {LETTERS.map((letter, index) => (
          <filter
            key={`f-${letter}-${index}`}
            id={`${uid}-d${index}`}
            x={`-${FILTER_MARGIN}%`}
            y={`-${FILTER_MARGIN}%`}
            width={`${100 + FILTER_MARGIN * 2}%`}
            height={`${100 + FILTER_MARGIN * 2}%`}
            colorInterpolationFilters="sRGB"
          >
            {/* Ruído alongado na horizontal: manchas largas, bordas derretidas. */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.005 0.013"
              numOctaves={2}
              seed={index * 13 + 7}
              result="noise"
            />
            <feDisplacementMap
              ref={(node) => {
                mapRefs.current[index] = node;
              }}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        ))}
      </defs>

      <g ref={layoutRef}>
        {LETTERS.map((letter, index) => (
          <text
            key={`${letter}-${index}`}
            ref={(node) => {
              letterRefs.current[index] = node;
            }}
            x="0"
            y={FONT_SIZE}
            filter={`url(#${uid}-d${index})`}
            fill="currentColor"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: `${FONT_SIZE}px`,
              fontWeight: 700,
            }}
          >
            {letter}
          </text>
        ))}
      </g>
    </svg>
  );
}
