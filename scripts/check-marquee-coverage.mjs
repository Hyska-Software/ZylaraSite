/**
 * Checagem de layout da nuvem de provedores: garante que nenhum espaço vazio
 * apareça na faixa, em várias larguras de tela.
 *
 * Uso: node scripts/check-marquee-coverage.mjs [url]
 * Requer o servidor de produção rodando (npm run start).
 */
import { chromium } from '@playwright/test';

const url = process.argv[2] ?? 'http://localhost:3117/pt-BR';

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1440, height: 900 },
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'ultrawide', width: 2560, height: 1440 },
];

const browser = await chromium.launch();
let failed = false;

for (const viewport of VIEWPORTS) {
  const page = await browser.newPage({ viewport });

  // Sem `reducedMotion`: queremos medir a faixa animada, não o fallback estático.
  await page.goto(url, { waitUntil: 'networkidle' });

  const report = await page.evaluate(() => {
    const section = document.querySelector('section[aria-labelledby="providers-label"]');
    if (!section) return { error: 'seção de provedores não encontrada' };

    const lists = [...section.querySelectorAll('ul')].filter(
      (ul) => ul.querySelectorAll('li').length > 4,
    );
    const railEl = lists[0];
    if (!railEl) return { error: 'trilho de marcas não encontrado' };

    // A faixa anda -50% do trilho: cada metade (um <ul>) precisa cobrir a viewport.
    const halfWidth = Math.round(railEl.getBoundingClientRect().width);
    const viewportWidth = window.innerWidth;
    const railRect = railEl.parentElement.getBoundingClientRect();

    // Maior vão horizontal entre pills dentro da metade.
    const items = [...railEl.querySelectorAll('li')];
    let maxGap = 0;
    let prevRight = null;
    for (const item of items) {
      const rect = item.getBoundingClientRect();
      if (prevRight !== null) maxGap = Math.max(maxGap, rect.left - prevRight);
      prevRight = rect.right;
    }

    return {
      viewportWidth,
      halfWidth,
      railHeight: Math.round(railRect.height),
      pills: items.length,
      maxGap: Math.round(maxGap),
      // Cobertura: sobra de metade em relação à viewport.
      surplus: halfWidth - viewportWidth,
    };
  });

  if (report.error) {
    console.error(`✗ ${viewport.name} (${viewport.width}px): ${report.error}`);
    failed = true;
  } else {
    // Sem buraco quando a metade é mais larga que a tela e os vãos são normais.
    const covered = report.surplus >= 0;
    const gapOk = report.maxGap <= 40;
    const ok = covered && gapOk;
    if (!ok) failed = true;

    console.log(
      `${ok ? '✓' : '✗'} ${viewport.name.padEnd(10)} ${String(report.viewportWidth).padStart(4)}px  ` +
        `metade=${String(report.halfWidth).padStart(5)}px  ` +
        `sobra=${String(report.surplus).padStart(6)}px  ` +
        `pills=${String(report.pills).padStart(2)}  ` +
        `maior vão=${String(report.maxGap).padStart(3)}px  ` +
        `altura=${report.railHeight}px`,
    );
  }

  await page.screenshot({
    path: `.next/marquee-${viewport.name}.png`,
    clip: { x: 0, y: 0, width: viewport.width, height: 400 },
  });
  await page.close();
}

await browser.close();

if (failed) {
  console.error('\nFalha: a faixa deixa espaço vazio em pelo menos uma largura de tela.');
  process.exit(1);
}
console.log('\nOK: a faixa preenche a largura em todas as viewports testadas.');
