const evidenceRoot=process.env.QA_ROOT||'qa/v3/local';
import {chromium} from 'playwright';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {startServer} from './serve.mjs';
const server=await startServer(0),base=`http://127.0.0.1:${server.address().port}`;
const csp=(await readFile('site/_headers','utf8')).split('Content-Security-Policy: ')[1].split('\n')[0].trim();
const browser=await chromium.launch();
await mkdir(evidenceRoot,{recursive:true});
try{
 const context=await browser.newContext();const violations=[];
 await context.route('**/*',async route=>{const response=await route.fetch();await route.fulfill({response,headers:{...response.headers(),'content-security-policy':csp}});});
 const page=await context.newPage();page.on('console',m=>{if(m.type()==='error')violations.push(m.text());});
 for(const route of ['/','/menu/','/story/','/gallery/','/visit/']){assert.equal((await page.goto(base+route)).status(),200);await page.evaluate(()=>document.fonts.ready);}
 await page.locator('#party').selectOption('2');await page.locator('#date').fill(await page.locator('#date').getAttribute('min'));await page.locator('#time').selectOption('19:00');await page.getByRole('button',{name:'Preview reservation'}).click();assert.match(await page.locator('#reservation-result').textContent(),/No reservation has been created/);
 await page.goto(base+'/gallery/');await page.locator('[data-gallery-index="0"]').click();assert.ok(await page.getByRole('dialog').isVisible());await page.keyboard.press('Escape');
 assert.deepEqual(violations,[]);
 await writeFile(`${evidenceRoot}/csp-smoke.json`,JSON.stringify({result:'PASS',scope:'Local browser responses with the exact configured Cloudflare CSP applied via Playwright routing; not hosted verification',routes:5,checks:['styles and fonts load','reservation simulation works','gallery modal works','zero browser console errors'],csp},null,2)+'\n');
 console.log('Exact configured CSP: five routes and interactions pass.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
