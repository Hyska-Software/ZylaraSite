import { chromium } from '@playwright/test';

const base = 'http://localhost:3210';
const browser = await chromium.launch();
const errors = [];

const desktop = await browser.newPage({ viewport: { width: 1280, height: 900 } });
desktop.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text());
});
desktop.on('pageerror', (error) => errors.push(String(error)));

await desktop.goto(`${base}/pt-BR`, { waitUntil: 'networkidle' });

for (const label of ['Recursos', 'Como funciona', 'Por que Zylara', 'FAQ']) {
  const trigger = desktop.getByRole('button', { name: label, exact: true });
  await trigger.click();
  const panelId = await trigger.getAttribute('aria-controls');
  const panel = desktop.locator(`#${panelId}`);
  await panel.waitFor({ state: 'visible' });
  const links = await panel.locator('a').evaluateAll((anchors) =>
    anchors.map((anchor) => `${anchor.textContent?.trim()} -> ${anchor.getAttribute('href')}`),
  );
  console.log(`\n[desktop] ${label}`);
  for (const link of links) console.log(`  ${link}`);
  await desktop.keyboard.press('Escape');
}

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on('pageerror', (error) => errors.push(String(error)));
await mobile.goto(`${base}/pt-BR/faq`, { waitUntil: 'networkidle' });
await mobile.getByRole('button', { name: 'Abrir menu' }).click();

const groups = mobile.locator('nav[aria-label="Mobile"] details');
const groupCount = await groups.count();
for (let index = 0; index < groupCount; index += 1) {
  const group = groups.nth(index);
  const summary = group.locator('summary');
  const title = (await summary.innerText()).trim();
  await summary.click();
  const links = await group.locator('a').evaluateAll((anchors) =>
    anchors.map((anchor) => `${anchor.textContent?.trim()} -> ${anchor.getAttribute('href')}`),
  );
  console.log(`\n[mobile] ${title}`);
  for (const link of links) console.log(`  ${link}`);
}

console.log(`\nconsole errors: ${errors.length}`);
for (const error of errors) console.log(`  ${error}`);

await browser.close();
