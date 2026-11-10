/**
 * Checagem do wordmark distorcido do footer.
 *
 * Cobre layout e efeito:
 * 1. as 6 letras estão em ordem, sem sobreposição, com espaçamento uniforme;
 * 2. a palavra fica centralizada no container, nos dois eixos, e inteira dentro
 *    do viewBox (sem a base cortada);
 * 3. em repouso os filtros estão em `scale=0`;
 * 4. com o cursor perto, a letra mais próxima é a mais distorcida;
 * 5. ao sair, tudo volta a `scale=0`;
 * 6. `prefers-reduced-motion` mantém os filtros em zero.
 *
 * Uso: node scripts/check-footer-wordmark.mjs [url]
 * Requer o servidor de produção rodando (npm run start).
 */
import { chromium } from '@playwright/test';

const url = process.argv[2] ?? 'http://localhost:3120/pt-BR';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(url, { waitUntil: 'networkidle' });

/** Escalas dos filtros, na ordem das letras. */
const scales = () =>
  page.$$eval('footer [data-wordmark] feDisplacementMap', (nodes) =>
    nodes.map((node) => Number(node.getAttribute('scale') ?? '0')),
  );

/**
 * Caixas das letras e do container do wordmark.
 *
 * Duas medidas diferentes, de propósito:
 * - `advance`: posições por avanço (`x` do atributo + `measureText().width`),
 *   que é o que garante espaçamento uniforme e ausência de colisão;
 * - `ink`: caixa de tinta (`actualBoundingBox*`), que é o que o componente usa
 *   para enquadrar no viewBox e o que precisa ficar sem corte.
 *
 * `getBoundingClientRect()` de `<text>` serve para nenhuma das duas: devolve a
 * caixa de linha (ascent + descent da fonte), bem mais alta que as letras.
 */
const geometry = () =>
  page.evaluate(() => {
    const svg = document.querySelector('footer [data-wordmark]');
    const svgRect = svg.getBoundingClientRect();
    const nodes = [...svg.querySelectorAll('g > text')];

    const style = getComputedStyle(nodes[0]);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;

    const letters = nodes.map((node) => {
      const metrics = context.measureText(node.textContent ?? '');
      const matrix = node.getScreenCTM();
      const origin = Number(node.getAttribute('x') ?? 0);
      const baseline = Number(node.getAttribute('y') ?? 0);

      // Unidades do SVG → px de tela (escala uniforme, sem rotação).
      const toX = (x) => matrix.a * x + matrix.e;
      const toY = (y) => matrix.d * y + matrix.f;

      const inkLeft = toX(origin - metrics.actualBoundingBoxLeft);
      const inkRight = toX(origin + metrics.actualBoundingBoxRight);
      const inkTop = toY(baseline - metrics.actualBoundingBoxAscent);
      const inkBottom = toY(baseline + metrics.actualBoundingBoxDescent);

      return {
        text: node.textContent,
        advanceLeft: toX(origin),
        advanceRight: toX(origin + metrics.width),
        inkLeft,
        inkRight,
        inkTop,
        inkBottom,
        centerX: (inkLeft + inkRight) / 2,
        centerY: (inkTop + inkBottom) / 2,
      };
    });

    return {
      svg: {
        left: svgRect.left,
        right: svgRect.right,
        top: svgRect.top,
        bottom: svgRect.bottom,
        width: svgRect.width,
        height: svgRect.height,
      },
      letters,
    };
  });

const rest = await scales();
console.log(`filtros encontrados: ${rest.length} | escalas em repouso: [${rest.join(', ')}]`);

if (rest.length !== 6) {
  console.error('✗ esperava 6 filtros (um por letra)');
  process.exit(1);
}
if (rest.some((value) => value !== 0)) {
  console.error('✗ o wordmark não começa intacto');
  process.exit(1);
}

// O footer fica abaixo da dobra.
await page.evaluate(() =>
  document.querySelector('footer')?.scrollIntoView({ block: 'end', behavior: 'instant' }),
);
await page.waitForTimeout(400);

const { svg, letters } = await geometry();
console.log(`letras: ${letters.map((l) => l.text).join('')}`);
console.log(
  `tinta: ${letters.map((l) => `${l.text}=${Math.round(l.inkRight - l.inkLeft)}px@${Math.round(l.inkLeft)}`).join(' ')}`,
);

// 1. Ordem e ausência de sobreposição — pela caixa de tinta, que é o que o
//    olho vê. Side bearings iguais entre glifos deixam os vãos visuais
//    constantes; aqui só se proíbe colisão entre letras vizinhas.
let overlaps = 0;
const gaps = [];
for (let i = 1; i < letters.length; i += 1) {
  const gap = letters[i].inkLeft - letters[i - 1].inkRight;
  gaps.push(gap);
  if (gap < -1) overlaps += 1;
}
console.log(`vãos de tinta: [${gaps.map((g) => g.toFixed(1)).join(', ')}]`);

if (overlaps > 0) {
  console.error(`✗ ${overlaps} par(es) de letras se sobrepõem`);
  process.exit(1);
}

// 2. Espaçamento uniforme: os avanços (não a tinta) precisam ser regulares.
const advances = letters.map((l) => l.advanceRight - l.advanceLeft);
const tracking = [];
for (let i = 1; i < letters.length; i += 1) {
  tracking.push(letters[i].advanceLeft - letters[i - 1].advanceRight);
}
const spread = Math.max(...tracking) - Math.min(...tracking);
console.log(
  `avanços: [${advances.map((a) => a.toFixed(1)).join(', ')}] | tracking: [${tracking.map((g) => g.toFixed(2)).join(', ')}] spread=${spread.toFixed(2)}px`,
);

if (spread > 1) {
  console.error('✗ o tracking entre letras não é uniforme');
  process.exit(1);
}

// 3. Centralização horizontal pela tinta: é a borda visível que precisa casar
//    com as laterais do svg (os side bearings das glifos ficam de fora).
const wordLeft = Math.min(...letters.map((l) => l.inkLeft)) - svg.left;
const wordRight = svg.right - Math.max(...letters.map((l) => l.inkRight));
const wordWidth = Math.max(...letters.map((l) => l.inkRight)) - Math.min(...letters.map((l) => l.inkLeft));
console.log(
  `margens: esquerda=${wordLeft.toFixed(1)}px direita=${wordRight.toFixed(1)}px | palavra=${wordWidth.toFixed(0)}px de ${svg.width.toFixed(0)}px`,
);

if (Math.abs(wordLeft - wordRight) > 4) {
  console.error('✗ a palavra não está centralizada');
  process.exit(1);
}
if (wordWidth < svg.width * 0.9) {
  console.error('✗ a palavra não preenche a largura disponível');
  process.exit(1);
}

// 3b. Enquadramento vertical: nada de corte na base nem sobra desigual.
const inkTop = Math.min(...letters.map((l) => l.inkTop));
const inkBottom = Math.max(...letters.map((l) => l.inkBottom));
const wordTop = inkTop - svg.top;
const wordBottom = svg.bottom - inkBottom;
const inkHeight = inkBottom - inkTop;
console.log(
  `folgas verticais: topo=${wordTop.toFixed(1)}px base=${wordBottom.toFixed(1)}px | tinta=${inkHeight.toFixed(0)}px de ${svg.height.toFixed(0)}px`,
);

const clipped = letters.filter((l) => l.inkTop < svg.top - 1.5 || l.inkBottom > svg.bottom + 1.5);
if (clipped.length > 0) {
  console.error(`✗ ${clipped.length} letra(s) estão fora do viewBox (base cortada)`);
  process.exit(1);
}
if (Math.abs(wordTop - wordBottom) > 4) {
  console.error('✗ o wordmark não está centralizado na vertical');
  process.exit(1);
}
if (inkHeight < svg.height * 0.8) {
  console.error(`✗ o wordmark ocupa só ${((inkHeight / svg.height) * 100).toFixed(0)}% da altura do svg`);
  process.exit(1);
}
console.log('✓ wordmark inteiro e centralizado na vertical');

// 4. Efeito sob o cursor.
const middle = letters[2];
await page.mouse.move(middle.centerX, middle.centerY);
await page.waitForTimeout(250);
const active = await scales();
console.log(`escalas com o cursor em ${middle.text}: [${active.map((v) => v.toFixed(1)).join(', ')}]`);

const peak = active.indexOf(Math.max(...active));
if (Math.max(...active) === 0) {
  console.error('✗ nenhuma letra distorceu');
  process.exit(1);
}
if (peak !== 2) {
  console.error(`✗ a letra mais distorcida deveria ser a do meio (2), foi ${peak}`);
  process.exit(1);
}
if (!(active[2] > active[0] && active[2] > active[5])) {
  console.error('✗ o efeito não decai com a distância');
  process.exit(1);
}
console.log(`✓ ${middle.text} é a mais distorcida e o efeito decai nas pontas`);

// 5. Volta ao neutro.
await page.mouse.move(5, 5);
await page.waitForTimeout(350);
const after = await scales();
if (after.some((value) => value !== 0)) {
  console.error(`✗ não voltou ao neutro: [${after.join(', ')}]`);
  process.exit(1);
}
console.log('✓ volta ao estado intacto ao sair');

// 6. Modo reduzido.
const reduced = await browser.newPage({
  viewport: { width: 1280, height: 900 },
  reducedMotion: 'reduce',
});
await reduced.goto(url, { waitUntil: 'networkidle' });
await reduced.evaluate(() =>
  document.querySelector('footer')?.scrollIntoView({ block: 'end', behavior: 'instant' }),
);
await reduced.waitForTimeout(250);
const reducedBox = await reduced.$$eval('footer [data-wordmark] text', (nodes) => {
  const rect = nodes[2].getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
});
await reduced.mouse.move(reducedBox.x, reducedBox.y);
await reduced.waitForTimeout(250);
const reducedScales = await reduced.$$eval('footer [data-wordmark] feDisplacementMap', (nodes) =>
  nodes.map((node) => Number(node.getAttribute('scale') ?? '0')),
);
await reduced.close();

if (reducedScales.some((value) => value !== 0)) {
  console.error(`✗ o modo reduzido deveria desligar o efeito: [${reducedScales.join(', ')}]`);
  process.exit(1);
}
console.log('✓ prefers-reduced-motion mantém o texto intacto');

await page.mouse.move(middle.centerX, middle.centerY);
await page.waitForTimeout(250);
const shot = await page.evaluate(() => {
  const rect = document.querySelector('footer [data-wordmark]').getBoundingClientRect();
  return {
    x: Math.max(0, Math.floor(rect.x)),
    y: Math.max(0, Math.floor(rect.y)),
    width: Math.floor(rect.width),
    height: Math.floor(rect.height),
  };
});
await page.screenshot({ path: '.next/wordmark-distorted.png', clip: shot });

await browser.close();
console.log('\nOK: wordmark distorcido com layout correto.');
