/**
 * Verifica o fundo da navbar: blur perceptível, véu escuro no topo dissolvendo
 * até a base e nenhuma borda no header.
 * Uso: node scripts/tmp-nav-effect.mjs [url]
 */
import { chromium } from '@playwright/test';

const base = process.argv[2] ?? 'http://localhost:3121';
const WIDTH = 1280;
const BANDS = [
  { name: 'topo', y: 0, height: 16 },
  { name: 'meio', y: 24, height: 16 },
  { name: 'base', y: 52, height: 12 },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: WIDTH, height: 900 } });
const analyzer = await browser.newPage();
let failed = false;

await page.goto(`${base}/pt-BR`, { waitUntil: 'networkidle' });

const state = await page.evaluate(() => {
  const header = document.querySelector('header');
  const layer = header.querySelector('div[aria-hidden="true"]');
  const style = getComputedStyle(layer);
  const borders = [];
  for (const element of [header, ...header.querySelectorAll('*')]) {
    const computed = getComputedStyle(element);
    const widths = ['Top', 'Right', 'Bottom', 'Left'].map(
      (side) => parseFloat(computed[`border${side}Width`]) || 0,
    );
    if (widths.some((width) => width > 0)) borders.push(`${element.tagName.toLowerCase()} ${widths.join('/')}`);
  }

  return {
    scrollY: window.scrollY,
    opacity: style.opacity,
    filter: style.backdropFilter,
    background: style.backgroundImage.includes('linear-gradient'),
    mask: style.maskImage.includes('linear-gradient'),
    height: Math.round(layer.getBoundingClientRect().height),
    borders,
  };
});

const alwaysOn = state.scrollY === 0 && state.opacity === '1';
const layerOk = state.filter === 'blur(8px)' && state.background && state.mask && state.height === 64;
const bordersOk = state.borders.length === 0;
if (!alwaysOn || !layerOk || !bordersOk) failed = true;

console.log(
  `${alwaysOn ? '✓' : '✗'} sempre ativo no topo da página: opacidade=${state.opacity} scrollY=${state.scrollY}`,
);
console.log(
  `${layerOk ? '✓' : '✗'} camada: filtro=${state.filter} véu=${state.background} máscara=${state.mask} altura=${state.height}px`,
);
console.log(`${bordersOk ? '✓' : '✗'} bordas dentro do header: ${state.borders.length}`);

// Cor dos links da navbar: precisam usar o token mais claro (`--foreground`).
const colors = await page.evaluate(() => {
  const nav = document.querySelector('header nav[aria-label]');
  const trigger = nav?.querySelector('button');
  const anchors = [...(nav?.querySelectorAll('a[href]') ?? [])];
  const guide = anchors.find((anchor) => anchor.textContent?.trim());
  const github = [...document.querySelectorAll('header a[href]')].find((anchor) =>
    anchor.getAttribute('aria-label')?.toLowerCase().includes('github'),
  );

  return {
    token: getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim(),
    trigger: trigger ? getComputedStyle(trigger).color : null,
    guide: guide ? getComputedStyle(guide).color : null,
    github: github ? getComputedStyle(github).color : null,
  };
});

const colorOk =
  colors.trigger === 'rgb(236, 236, 241)' &&
  colors.guide === 'rgb(236, 236, 241)' &&
  colors.github === 'rgb(236, 236, 241)';
if (!colorOk) failed = true;
console.log(
  `${colorOk ? '✓' : '✗'} cor dos links (token ${colors.token}): ` +
    `menu=${colors.trigger} guia=${colors.guide} github=${colors.github}`,
);

// Mede só o que passa atrás da barra: esconde os rótulos do menu.
await page.evaluate(() => {
  document.querySelectorAll('header .container-page').forEach((element) => {
    element.style.visibility = 'hidden';
  });
  window.scrollTo(0, 1200);
});
await page.waitForTimeout(250);

async function bandStats(y, height) {
  const buffer = await page.screenshot({ clip: { x: 0, y, width: WIDTH, height } });
  return analyzer.evaluate(async (data) => {
    const image = new Image();
    image.src = `data:image/png;base64,${data}`;
    await image.decode();
    const canvas = new OffscreenCanvas(image.width, image.height);
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    const { data: pixels } = context.getImageData(0, 0, image.width, image.height);

    let luma = 0;
    let edges = 0;
    let count = 0;
    for (let y = 0; y < image.height; y += 1) {
      for (let x = 0; x < image.width - 1; x += 1) {
        const i = (y * image.width + x) * 4;
        const a = pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114;
        const b = pixels[i + 4] * 0.299 + pixels[i + 5] * 0.587 + pixels[i + 6] * 0.114;
        luma += (a + b) / 2;
        edges += Math.abs(a - b);
        count += 1;
      }
    }
    return { luma: luma / count, edges: edges / count };
  }, buffer.toString('base64'));
}

async function setOpacity(value) {
  await page.evaluate((next) => {
    document.querySelector('header div[aria-hidden="true"]').style.opacity = next;
  }, value);
  await page.waitForTimeout(120);
}

const rows = [];
for (const band of BANDS) {
  await setOpacity('0');
  const without = await bandStats(band.y, band.height);
  await setOpacity('');
  const withLayer = await bandStats(band.y, band.height);
  rows.push({ name: band.name, delta: withLayer.luma - without.luma, edges: 1 - withLayer.edges / without.edges });
}

for (const row of rows) {
  console.log(
    `  ${row.name.padEnd(5)} luminância ${row.delta >= 0 ? '+' : ''}${row.delta.toFixed(2)} ` +
      `borda ${(row.edges * 100).toFixed(0)}% menor`,
  );
}

const [top, middle, bottom] = rows;
const darkerAtTop = top.delta < -2;
const gradual = top.delta < middle.delta && middle.delta < bottom.delta;
const clearAtBottom = Math.abs(bottom.delta) < 2;
const blurred = top.edges > 0.2;
if (!darkerAtTop || !gradual || !clearAtBottom || !blurred) failed = true;

console.log(
  `${darkerAtTop && gradual && clearAtBottom ? '✓' : '✗'} véu gradual: ` +
    `topo ${top.delta.toFixed(2)} < meio ${middle.delta.toFixed(2)} < base ${bottom.delta.toFixed(2)}`,
);
console.log(`${blurred ? '✓' : '✗'} blur no topo: ${(top.edges * 100).toFixed(0)}% menos borda`);

await page.screenshot({ path: '.next/nav-effect.png', clip: { x: 0, y: 0, width: WIDTH, height: 200 } });
await browser.close();

if (failed) {
  console.error('\nFalha na verificação do fundo da navbar.');
  process.exit(1);
}
console.log('\nOK: blur visível, véu mais escuro no topo dissolvendo até 0 na base.');
