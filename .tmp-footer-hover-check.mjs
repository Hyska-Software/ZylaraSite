/**
 * Verificação descartável do hover dos links do footer.
 * Uso: node .tmp-footer-hover-check.mjs [url]
 */
import { chromium } from '@playwright/test';

const url = process.argv[2] ?? 'http://localhost:3120/pt-BR';
const browser = await chromium.launch();
const errors = [];
const ok = [];
const check = (condition, label, detail = '') => {
  (condition ? ok : errors).push(detail ? `${label} — ${detail}` : label);
};

const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() =>
  document.querySelector('footer')?.scrollIntoView({ block: 'end', behavior: 'instant' }),
);
await page.waitForTimeout(300);

const target = page.getByRole('link', { name: 'Termos de Serviço', exact: true });
check((await target.count()) === 1, 'nome acessível único para "Termos de Serviço"');

const info = await target.evaluate((anchor) => {
  const words = [...anchor.querySelectorAll('.footer-link__word')];
  const box = anchor.getBoundingClientRect();
  return {
    words: words.length,
    copiesPerWord: words.map((w) => w.querySelectorAll('.footer-link__copy').length),
    ghostHidden: words.map((w) =>
      w.querySelector('.footer-link__copy--ghost')?.getAttribute('aria-hidden'),
    ),
    ghostSelect: words.map((w) =>
      getComputedStyle(w.querySelector('.footer-link__copy--ghost')).userSelect,
    ),
    wordHeights: words.map((w) => w.getBoundingClientRect().height),
    lineHeights: words.map((w) => parseFloat(getComputedStyle(w).lineHeight)),
    steps: words.map((w) => w.style.getPropertyValue('--roll-step')),
    anchor: { width: box.width, height: box.height },
  };
});

check(info.words === 3, 'três janelas de palavra', `words=${info.words}`);
check(
  info.copiesPerWord.every((n) => n === 2),
  'duas cópias por palavra',
  `copies=${info.copiesPerWord}`,
);
check(
  info.ghostHidden.every((v) => v === 'true'),
  'cópia fantasma com aria-hidden',
  `${info.ghostHidden}`,
);
check(
  info.ghostSelect.every((v) => v === 'none'),
  'cópia fantasma fora da seleção',
  `${info.ghostSelect}`,
);
check(
  info.wordHeights.every((h, i) => Math.abs(h - info.lineHeights[i]) < 0.6),
  'janela com exatamente uma linha de altura',
  `heights=${info.wordHeights.map((h) => h.toFixed(2))} line=${info.lineHeights}`,
);
check(
  info.steps.join(',') === '0,1,2',
  'stagger por palavra',
  `steps=${info.steps.join(',')}`,
);

const tracks = () =>
  target.evaluate((anchor) =>
    [...anchor.querySelectorAll('.footer-link__word')].map((word) => {
      const track = word.querySelector('.footer-link__track');
      return {
        wordTop: word.getBoundingClientRect().top,
        height: word.getBoundingClientRect().height,
        trackTop: track.getBoundingClientRect().top,
        transform: getComputedStyle(track).transform,
        color: getComputedStyle(word.querySelector('.footer-link__copy')).color,
      };
    }),
  );

const rest = await tracks();
check(
  rest.every((w) => Math.abs(w.trackTop - w.wordTop) < 0.6),
  'em repouso o trilho fica no topo da janela',
  `${rest.map((w) => (w.trackTop - w.wordTop).toFixed(2))}`,
);

await target.hover();
await page.waitForTimeout(400);
const hovered = await tracks();
check(
  hovered.every((w) => Math.abs(w.trackTop - (w.wordTop - w.height)) < 0.6),
  'no hover o trilho sobe exatamente uma linha',
  `${hovered.map((w) => (w.trackTop - (w.wordTop - w.height)).toFixed(2))}`,
);

const copies = await target.evaluate((anchor) =>
  [...anchor.querySelectorAll('.footer-link__word')].map((word) => {
    const wordBox = word.getBoundingClientRect();
    const [restCopy, ghostCopy] = word.querySelectorAll('.footer-link__copy');
    const ghostBox = ghostCopy.getBoundingClientRect();
    const restBox = restCopy.getBoundingClientRect();
    return {
      ghostCoversWindow:
        Math.abs(ghostBox.top - wordBox.top) < 0.6 &&
        Math.abs(ghostBox.bottom - wordBox.bottom) < 0.6,
      restAbove: restBox.bottom <= wordBox.top + 0.6,
    };
  }),
);
check(
  copies.every((c) => c.ghostCoversWindow),
  'no hover a cópia em foreground preenche a janela',
  JSON.stringify(copies),
);
check(
  copies.every((c) => c.restAbove),
  'a cópia em repouso fica fora da janela',
  JSON.stringify(copies),
);

const ghostColor = await target.evaluate((anchor) =>
  getComputedStyle(anchor.querySelector('.footer-link__copy--ghost')).color,
);
check(ghostColor === 'rgb(236, 236, 241)', 'cópia que entra usa foreground', ghostColor);

const hoverBox = await target.evaluate((anchor) => {
  const box = anchor.getBoundingClientRect();
  return { width: box.width, height: box.height };
});
check(
  Math.abs(hoverBox.width - info.anchor.width) < 0.5 &&
    Math.abs(hoverBox.height - info.anchor.height) < 0.5,
  'sem deslocamento de layout no hover',
  `${JSON.stringify(info.anchor)} -> ${JSON.stringify(hoverBox)}`,
);

const timings = await target.evaluate((anchor) => {
  const track = anchor.querySelector('.footer-link__track');
  const style = getComputedStyle(track);
  return { duration: style.transitionDuration, easing: style.transitionTimingFunction };
});
check(timings.duration === '0.2s', 'duração de 200ms', timings.duration);
check(timings.easing.includes('cubic-bezier'), 'easing ease-out-soft', timings.easing);

await page.mouse.move(5, 5);
await page.waitForTimeout(400);
const returned = await tracks();
check(
  returned.every((w) => Math.abs(w.trackTop - w.wordTop) < 0.6),
  'ao sair o texto volta ao repouso',
  `${returned.map((w) => (w.trackTop - w.wordTop).toFixed(2))}`,
);

// Foco por teclado: a segunda passada de Tab chega em outro link e deve revelar a cópia.
await target.focus();
await page.keyboard.press('Tab');
await page.waitForTimeout(300);
const focusState = await page.evaluate(() => {
  const active = document.activeElement;
  const track = active?.querySelector?.('.footer-link__track');
  return {
    visible: active?.matches?.(':focus-visible') ?? false,
    transform: track ? getComputedStyle(track).transform : null,
    text: active?.querySelector?.('.footer-link__word')?.textContent ?? '',
  };
});
check(
  focusState.visible && focusState.transform !== 'none',
  'focus-visible também dispara a rolagem',
  `${focusState.text} :: ${focusState.transform}`,
);

// Ícone externo: sobe e ganha foreground junto com o texto.
const external = page.locator('footer a.footer-link[target="_blank"]').first();
const iconState = (locator) =>
  locator.evaluate((anchor) => {
    const icon = anchor.querySelector('svg');
    const style = getComputedStyle(icon);
    return { translate: style.translate, transform: style.transform, color: style.color };
  });
const iconRest = await iconState(external);
await external.hover();
await page.waitForTimeout(300);
const iconHover = await iconState(external);
check(
  iconRest.translate !== iconHover.translate || iconRest.transform !== iconHover.transform,
  'seta externa se desloca no hover',
  `${iconRest.translate} / ${iconRest.transform} -> ${iconHover.translate} / ${iconHover.transform}`,
);
check(
  iconHover.color === 'rgb(236, 236, 241)',
  'seta externa fica em foreground',
  iconHover.color,
);

// Sem overflow e linha dupla preservada em coluna estreita (768px → colunas de ~133px).
await page.setViewportSize({ width: 768, height: 900 });
await page.waitForTimeout(300);
const narrow = await page.evaluate(() => {
  const anchor = [...document.querySelectorAll('footer a.footer-link')].find((node) =>
    node.textContent.trim().startsWith('Política'),
  );
  const label = anchor.querySelector('span');
  const words = [...anchor.querySelectorAll('.footer-link__word')];
  const rows = new Set(words.map((w) => Math.round(w.getBoundingClientRect().top)));
  return {
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    rows: rows.size,
    labelHeight: label.getBoundingClientRect().height,
    windowHeights: words.map((w) => w.getBoundingClientRect().height),
  };
});
check(narrow.overflow <= 1, 'sem overflow horizontal a 390px', `overflow=${narrow.overflow}`);
check(narrow.rows === 2, 'rótulo longo quebra em duas linhas', `rows=${narrow.rows}`);
check(
  narrow.windowHeights.every((h, i) => Math.abs(h - narrow.windowHeights[0]) < 0.6),
  'janelas continuam com uma linha cada',
  `${narrow.windowHeights}`,
);

// prefers-reduced-motion: nenhuma transformação, só a troca de cor.
const reduced = await browser.newPage({
  viewport: { width: 1280, height: 900 },
  reducedMotion: 'reduce',
});
await reduced.goto(url, { waitUntil: 'networkidle' });
await reduced.evaluate(() =>
  document.querySelector('footer')?.scrollIntoView({ block: 'end', behavior: 'instant' }),
);
await reduced.waitForTimeout(250);
const reducedTarget = reduced.getByRole('link', { name: 'Termos de Serviço', exact: true });
const reducedRest = await reducedTarget.evaluate((anchor) => ({
  transform: getComputedStyle(anchor.querySelector('.footer-link__track')).transform,
  color: getComputedStyle(anchor.querySelector('.footer-link__copy')).color,
}));
await reducedTarget.hover();
await reduced.waitForTimeout(250);
const reducedHover = await reducedTarget.evaluate((anchor) => ({
  transform: getComputedStyle(anchor.querySelector('.footer-link__track')).transform,
  color: getComputedStyle(anchor.querySelector('.footer-link__copy')).color,
}));
check(
  reducedHover.transform === 'none',
  'reduced-motion sem transformação',
  `${reducedRest.transform} -> ${reducedHover.transform}`,
);
check(
  reducedRest.color !== reducedHover.color && reducedHover.color === 'rgb(236, 236, 241)',
  'reduced-motion mantém a troca de cor',
  `${reducedRest.color} -> ${reducedHover.color}`,
);
await reduced.close();

await browser.close();

for (const line of ok) console.log(`✓ ${line}`);
for (const line of errors) console.log(`✗ ${line}`);
console.log(`\n${ok.length} ok, ${errors.length} falha(s)`);
process.exit(errors.length === 0 ? 0 : 1);
