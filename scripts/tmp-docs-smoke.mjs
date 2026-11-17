import { chromium } from '@playwright/test';

const base = process.env.BASE ?? 'http://127.0.0.1:3113';
const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
};

const browser = await chromium.launch();
const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
await desktop.grantPermissions(['clipboard-read', 'clipboard-write']);
const page = await desktop.newPage();

// 1. Entrada da documentação
await page.goto(`${base}/pt-BR/docs`, { waitUntil: 'networkidle' });
check('título da entrada', (await page.locator('h1').innerText()) === 'Visão geral', await page.title());
const groups = await page.locator('aside nav[aria-label="Documentação"] button').allInnerTexts();
check('seis grupos do nav.json', (await page.locator('aside nav[aria-label="Documentação"] button').count()) === 6, groups.join(' | '));
check('página atual marcada', (await page.locator('aside a[aria-current="page"]').innerText()).includes('Visão geral'));

// 2. Instalação: hierarquia, listas aninhadas, tabelas, código
await page.goto(`${base}/pt-BR/docs/installation`, { waitUntil: 'networkidle' });
check('h1 da instalação', (await page.locator('h1').innerText()) === 'Instalação');

const article = page.locator('article');
const downloadLinks = article.locator('a[href*="/releases/download/"]');
const downloadCount = await downloadLinks.count();
const hrefs = await downloadLinks.evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href') ?? ''));
check('links reais da release', downloadCount >= 5, `${downloadCount} arquivos`);
check(
  'URLs do GitHub',
  hrefs.every((href) => href.startsWith('https://github.com/Hyska-Software/ZylaraAi/releases/download/')),
);
check('versão publicada visível', /v\d+\.\d+\.\d+/.test(await article.innerText()), (await article.innerText()).match(/v\d+\.\d+\.\d+/)?.[0] ?? '—');
check('tamanhos dos arquivos', /\d+(\.\d+)? (MB|KB)/.test(await article.innerText()));
check('nome do arquivo por linha', hrefs.some((href) => href.includes('Zylara-Setup') && href.includes('windows-x64')));
check(
  'checksums e notas da versão',
  (await article.locator('a', { hasText: 'Somas SHA-256' }).count()) === 1 &&
    (await article.locator('a', { hasText: 'Notas da versão' }).count()) === 1,
);

const headings = await page.locator('article h2').allInnerTexts();
check('seções ## viram h2', headings.length >= 7, headings.join(' | '));
check('h3 presente', (await page.locator('article h3').count()) >= 2);
check('lista aninhada', (await page.locator('article ol li ul').count()) >= 1);
check('tabelas', (await page.locator('article table').count()) >= 4);
check('blocos de código', (await page.locator('article pre code').count()) >= 4, String(await page.locator('article pre code').count()));
check('sem marcação crua', !(await article.innerText()).includes('**'));

// 3. Âncoras e índice
const tocItems = await page.locator('nav[aria-label="Nesta página"] a').allInnerTexts();
check('índice "Nesta página"', tocItems.length >= 7, `${tocItems.length} itens`);
const anchorOk = await page.locator('article h2#windows').count();
check('âncora do h2', anchorOk === 1);
await page.goto(`${base}/pt-BR/docs/permissions-and-approvals#sandbox-de-comandos-do-docker`, { waitUntil: 'networkidle' });
check('âncora entre páginas', (await page.locator('#sandbox-de-comandos-do-docker').count()) === 1);

// 4. Busca (Ctrl K)
await page.goto(`${base}/pt-BR/docs`, { waitUntil: 'networkidle' });
await page.keyboard.press('Control+k');
await page.waitForSelector('dialog[open]');
await page.locator('dialog input').fill('docker');
const options = await page.locator('dialog [role="option"]').count();
check('busca encontra páginas', options >= 1, `${options} resultados`);
await page.keyboard.press('Enter');
await page.waitForFunction(() => location.pathname.startsWith('/pt-BR/docs/'));
check('busca navega', page.url().includes('/pt-BR/docs/'));

// 5. Grupos recolhem
await page.goto(`${base}/pt-BR/docs`, { waitUntil: 'networkidle' });
const group = page.locator('aside nav[aria-label="Documentação"] button').first();
await group.click();
check('grupo recolhe', (await group.getAttribute('aria-expanded')) === 'false');
check('itens somem', (await page.locator('aside a[href="/pt-BR/docs/introduction"]').count()) === 0);
await group.click();

// 6. Pager e idioma
const nextLink = page.locator('nav[aria-label="Navegação entre páginas"] a').first();
check('pager aponta para o próximo', (await nextLink.innerText()).includes('O que é o Zylara'), await nextLink.innerText());
await page.goto(`${base}/zh-CN/docs/code-workbench`, { waitUntil: 'networkidle' });
check('mesma página em outro idioma', (await page.locator('h1').innerText()) === '工作台');
check('chrome localizado', (await page.locator('button[aria-label="打开搜索"]').count()) === 1);

// 7. Mobile
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
const mpage = await mobile.newPage();
await mpage.goto(`${base}/pt-BR/docs/first-steps`, { waitUntil: 'networkidle' });
const toggle = mpage.getByRole('button', { name: 'Primeiros passos' });
await toggle.click();
check('menu móvel abre', (await toggle.getAttribute('aria-expanded')) === 'true');
check(
  'sem overflow horizontal',
  await mpage.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
  String(await mpage.evaluate(() => `${document.documentElement.scrollWidth} / ${window.innerWidth}`)),
);

await browser.close();

const failed = results.filter((result) => !result.ok);
console.log(`\n${results.length - failed.length}/${results.length} verificações passaram.`);
process.exit(failed.length === 0 ? 0 : 1);
