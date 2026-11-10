/**
 * Prova visual de que o filtro realmente deforma os pixels.
 *
 * Captura a mesma região duas vezes — com o filtro em repouso e com o filtro
 * ativo — e conta quantos pixels mudaram. Comparar a contagem com o total diz
 * se a distorção é visível ou se é só um atributo mudando no DOM.
 *
 * A decodificação acontece no próprio navegador (canvas), para não adicionar
 * dependência só de teste.
 *
 * Uso: node scripts/check-wordmark-pixels.mjs [url]
 */
import { chromium } from '@playwright/test';

const url = process.argv[2] ?? 'http://localhost:3120/pt-BR';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(url, { waitUntil: 'networkidle' });

await page.evaluate(() =>
  document.querySelector('footer')?.scrollIntoView({ block: 'end', behavior: 'instant' }),
);
await page.waitForTimeout(400);

const clip = await page.evaluate(() => {
  const rect = document.querySelector('footer [data-wordmark]').getBoundingClientRect();
  return {
    x: Math.max(0, Math.floor(rect.x)),
    y: Math.max(0, Math.floor(rect.y)),
    width: Math.floor(rect.width),
    height: Math.floor(rect.height),
  };
});

// Longe: filtros em zero.
await page.mouse.move(5, 5);
await page.waitForTimeout(350);
const calmShot = (await page.screenshot({ clip })).toString('base64');

// Perto: filtros ativos no meio da palavra.
const boxes = await page.$$eval('footer [data-wordmark] g > text', (nodes) =>
  nodes.map((node) => {
    const rect = node.getBoundingClientRect();
    return { centerX: rect.left + rect.width / 2, centerY: rect.top + rect.height / 2 };
  }),
);
await page.mouse.move(boxes[2].centerX, boxes[2].centerY);
await page.waitForTimeout(350);
const distortedShot = (await page.screenshot({ clip })).toString('base64');

// Compara os dois recortes dentro do navegador, via canvas.
const diff = await page.evaluate(
  async ([calmA, distortedA]) => {
    const load = (base64) =>
      new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = `data:image/png;base64,${base64}`;
      });

    const toData = async (base64) => {
      const image = await load(base64);
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      context.drawImage(image, 0, 0);
      return {
        width: image.width,
        height: image.height,
        data: context.getImageData(0, 0, image.width, image.height).data,
      };
    };

    const a = await toData(calmA);
    const b = await toData(distortedA);

    if (a.width !== b.width || a.height !== b.height) {
      return { error: 'tamanhos diferentes' };
    }

    let changed = 0;
    let maxDelta = 0;
    for (let i = 0; i < a.data.length; i += 4) {
      const delta =
        Math.abs(a.data[i] - b.data[i]) +
        Math.abs(a.data[i + 1] - b.data[i + 1]) +
        Math.abs(a.data[i + 2] - b.data[i + 2]);
      if (delta > 24) changed += 1;
      if (delta > maxDelta) maxDelta = delta;
    }

    return {
      width: a.width,
      height: a.height,
      changed,
      total: a.width * a.height,
      maxDelta,
    };
  },
  [calmShot, distortedShot],
);

await browser.close();

if (diff.error) {
  console.error(`✗ ${diff.error}`);
  process.exit(1);
}

const ratio = (diff.changed / diff.total) * 100;
console.log(`recorte: ${diff.width}×${diff.height} = ${diff.total} px`);
console.log(`pixels alterados: ${diff.changed} (${ratio.toFixed(2)}% da área)`);
console.log(`delta máximo de cor: ${diff.maxDelta}/765`);

if (ratio < 0.5) {
  console.error('✗ a distorção não altera pixels suficientes para ser visível');
  process.exit(1);
}

console.log('OK: a distorção altera a renderização de fato.');
