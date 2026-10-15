import {chromium,firefox,webkit} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import {readFile,writeFile,mkdir,access} from 'node:fs/promises';
import {load} from 'cheerio';
import assert from 'node:assert/strict';
import path from 'node:path';
import {startServer} from './serve.mjs';
const routes=['/','/menu/','/story/','/gallery/','/visit/'];
const widths=[320,375,390,568,768,860,1024,1440,1920];
const checks=[],failures=[],limitations=[],consoleErrors=[],networkFailures=[];
const record=(name,detail)=>checks.push({name,detail});
const root=path.resolve('site');
await mkdir('qa/screenshots',{recursive:true});
const server=await startServer(0);
const base=`http://127.0.0.1:${server.address().port}`;
let browser;
async function test(name,fn){try{const result=await fn();if(result?.unavailable){limitations.push({name,reason:result.unavailable});console.log('UNAVAILABLE',name);return;}record(name,result||'PASS');console.log('PASS',name);}catch(e){failures.push({name,error:e.message});console.error('FAIL',name,e.message);}}
try{
 const menu=load(await readFile('site/menu/index.html','utf8'));
 const actual=menu('[data-menu-item]').toArray().map(el=>({category:menu(el).closest('[data-menu-group]').find('h2').text(),name:menu(el).find('h3').text(),price:menu(el).find('.menu-price').text()}));
 await test('Locked menu: exact 51 names, categories, prices and descriptions',async()=>{
  assert.deepEqual(actual,JSON.parse(await readFile('qa/menu-contract.json','utf8')));
  assert.equal(menu('[data-menu-item]').length,51);
  for(const el of menu('[data-menu-item]').toArray())assert.ok(menu(el).find('p').text().length>10);
 });
 const titles=new Set(),descs=new Set();
 for(const route of routes)await test(`Source, assets, links and metadata ${route}`,async()=>{
  const file=path.join(root,route,'index.html'),$=load(await readFile(file,'utf8'));
  assert.equal($('h1').length,1);assert.equal($('main').length,1);assert.equal($('nav[aria-label="Primary navigation"]').length,1);
  assert.equal($('meta[name="robots"]').attr('content'),'noindex, follow');
  assert.match($('.demo-bar').text(),/fictional restaurant/i);
  assert.match($('.demo-bar').text(),/No real restaurant, orders or reservations/);
  titles.add($('title').text());descs.add($('meta[name="description"]').attr('content'));
  assert.ok($('meta[property="og:image"]').attr('content'));assert.ok($('meta[property="og:title"]').attr('content'));
  assert.equal($('link[rel="canonical"]').length,0,'Unverified canonical host');
  for(const el of $('[href],[src],[srcset],[data-full]').toArray()){
   for(const attr of ['href','src','data-full','srcset']){
    const value=$(el).attr(attr);if(!value)continue;
    for(const entry of attr==='srcset'?value.split(',').map(s=>s.trim().split(' ')[0]):[value]){
     const url=new URL(entry,base+route);
     if(url.origin!==base){assert.equal(url.origin,'https://www.ismailstudio.my');continue;}
     let local=path.join(root,decodeURIComponent(url.pathname));if(url.pathname.endsWith('/'))local=path.join(local,'index.html');
     await access(local);
     if(url.hash){const target=load(await readFile(local,'utf8'));assert.ok(target(`[id="${decodeURIComponent(url.hash.slice(1))}"]`).length,`Broken fragment ${entry}`);}
    }
   }
  }
 });
 await test('Unique page titles and descriptions',()=>{assert.equal(titles.size,5);assert.equal(descs.size,5);});
 browser=await chromium.launch({headless:true});
 const context=await browser.newContext({timezoneId:'Asia/Kuala_Lumpur'});
 const page=await context.newPage();
 page.on('pageerror',e=>consoleErrors.push(e.message));
 page.on('response',r=>{if(r.status()>=400)networkFailures.push(`${r.status()} ${r.url()}`);});
 const axe=[];
 for(const route of routes){
  for(const width of widths)await test(`HTTP/render/overflow ${route} ${width}px`,async()=>{
   await page.setViewportSize({width,height:width===568?320:900});
   const response=await page.goto(base+route);assert.equal(response.status(),200);assert.match(response.headers()['x-robots-tag'],/noindex/);
   await page.evaluate(()=>document.fonts.ready);
   const dimensions=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
   assert.ok(dimensions.scroll<=dimensions.client,JSON.stringify(dimensions));
   assert.ok(await page.locator('.demo-bar').isVisible());assert.ok(await page.locator('h1').isVisible());
   if(width===390||width===1440){
    await page.evaluate(async()=>{for(const img of document.images){if(img.loading==='lazy')img.loading='eager';}await Promise.all([...document.images].filter(i=>i.src).map(i=>i.decode().catch(()=>{})));});
    const broken=await page.locator('img[src]').evaluateAll(images=>images.filter(i=>!i.naturalWidth).map(i=>i.src));assert.deepEqual(broken,[]);
    await page.screenshot({path:`qa/screenshots/${route==='/'?'home':route.replaceAll('/','')}-${width}.png`,fullPage:true});
    const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
    const names=await new AxeBuilder({page}).withRules(['label-content-name-mismatch']).analyze();
    result.violations.push(...names.violations);
    axe.push({route,width,violations:result.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
   }
  });
 }
 await writeFile('qa/axe-results.json',JSON.stringify(axe,null,2)+'\n');
 await test('Axe WCAG A/AA scans: all five pages desktop and mobile',()=>{assert.deepEqual(axe.filter(r=>r.violations.length),[]);});
 await test('Actual webfonts loaded',async()=>{
  await page.goto(base);await page.evaluate(()=>document.fonts.ready);
  const fonts=await page.evaluate(()=>({display:document.fonts.check('500 32px "Cormorant Garamond"'),body:document.fonts.check('400 16px "DM Sans"'),loaded:[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family)}));
  assert.ok(fonts.display&&fonts.body);assert.ok(fonts.loaded.some(f=>f.includes('Cormorant')));assert.ok(fonts.loaded.some(f=>f.includes('DM Sans')));return fonts;
 });
 await test('All desktop navigation links and ISMAIL destinations',async()=>{
  await page.setViewportSize({width:1440,height:900});
  for(const [label,route] of [['Menu','/menu/'],['Our Story','/story/'],['Gallery','/gallery/'],['Visit','/visit/'],['Home','/']]){
   await page.getByRole('navigation',{name:'Primary navigation'}).getByRole('link',{name:label,exact:true}).click();assert.equal(new URL(page.url()).pathname,route);
  }
  const links=await page.locator('a[href^="https:"]').evaluateAll(es=>es.map(e=>e.href));assert.ok(links.length>=3);assert.ok(links.every(x=>x==='https://www.ismailstudio.my/'));
 });
 await test('Mobile navigation keyboard, Escape, resize and route selection',async()=>{
  await page.setViewportSize({width:320,height:780});await page.goto(base);
  const button=page.locator('button[aria-controls="primary-nav"]');assert.equal(await button.getAttribute('aria-label'),'Open navigation');await button.focus();await page.keyboard.press('Enter');assert.equal(await button.getAttribute('aria-expanded'),'true');assert.equal(await button.getAttribute('aria-label'),'Close navigation');
  await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').textContent(),'Home');
  await page.keyboard.press('Escape');assert.equal(await button.getAttribute('aria-expanded'),'false');assert.ok(await button.evaluate(e=>e===document.activeElement));
  await button.click();await page.getByRole('navigation').getByRole('link',{name:'Menu',exact:true}).click();assert.equal(new URL(page.url()).pathname,'/menu/');
  await page.setViewportSize({width:1440,height:900});assert.ok(await page.getByRole('navigation').isVisible());
 });
 await test('Every menu filter, count, announcement, keyboard and deep link',async()=>{
  await page.goto(base+'/menu/');
  for(const [id,count] of [['starters',7],['steaks',6],['grill',8],['malaysian',10],['sides',7],['desserts',5],['drinks',8],['all',51]]){
   const filter=page.locator(`[data-filter="${id}"]`);await filter.focus();await page.keyboard.press('Enter');assert.equal(await page.locator('[data-menu-item]:visible').count(),count);assert.equal(await filter.getAttribute('aria-pressed'),'true');assert.match(await page.locator('#filter-status').textContent(),new RegExp(`Showing ${count} menu`));
  }
  await page.goto(base+'/menu/#steaks');assert.equal(await page.locator('[data-menu-item]:visible').count(),6);
  await page.goto(base+'/menu/#item-beef-rendang-rice');assert.ok(await page.locator('#item-beef-rendang-rice').isVisible());
 });
 await test('Gallery open, next, previous, arrows, focus containment, Escape and return',async()=>{
  await page.goto(base+'/gallery/');const opener=page.locator('[data-gallery-index="2"]');await opener.focus();await page.keyboard.press('Enter');
  const dialog=page.getByRole('dialog');assert.ok(await dialog.isVisible());assert.match(await page.locator('#lightbox-counter').textContent(),/^03/);
  await page.getByRole('button',{name:'Next image'}).click();assert.match(await page.locator('#lightbox-counter').textContent(),/^04/);
  await page.getByRole('button',{name:'Previous image'}).click();await page.keyboard.press('ArrowLeft');assert.match(await page.locator('#lightbox-counter').textContent(),/^02/);
  await page.keyboard.press('ArrowRight');assert.match(await page.locator('#lightbox-counter').textContent(),/^03/);
  for(let i=0;i<8;i++){await page.keyboard.press('Tab');assert.ok(await page.evaluate(()=>document.activeElement.closest('dialog')!==null));}
  await page.keyboard.press('Escape');assert.ok(!await dialog.isVisible());assert.ok(await opener.evaluate(e=>e===document.activeElement));
  await opener.click();await page.getByRole('button',{name:'Close gallery'}).click();assert.ok(!await dialog.isVisible());
 });
 await test('Reservation errors, future date, simulation and zero submission/storage',async()=>{
  await page.goto(base+'/visit/');const requests=[];const listen=r=>requests.push(r.url());page.on('request',listen);
  await page.getByRole('button',{name:'Preview reservation'}).click();assert.match(await page.locator('#reservation-error').textContent(),/party size/);
  await page.locator('#party').selectOption('2');await page.getByRole('button',{name:'Preview reservation'}).click();assert.match(await page.locator('#reservation-error').textContent(),/future date/);
  await page.locator('#date').fill('2020-01-01');await page.getByRole('button',{name:'Preview reservation'}).click();assert.match(await page.locator('#reservation-error').textContent(),/tomorrow/);
  await page.locator('#date').fill(await page.locator('#date').getAttribute('min'));await page.getByRole('button',{name:'Preview reservation'}).click();assert.match(await page.locator('#reservation-error').textContent(),/time slot/);
  await page.locator('#time').selectOption('19:00');await page.getByRole('button',{name:'Preview reservation'}).click();assert.match(await page.locator('#reservation-result').textContent(),/This is a portfolio demonstration\. No reservation has been created\./);
  assert.ok(await page.locator('#reservation-result').evaluate(e=>e===document.activeElement));
  assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0);assert.equal((await context.cookies()).length,0);
  assert.ok(requests.every(url=>/\.(webp|woff2)$/.test(new URL(url).pathname)),`Unexpected request ${requests}`);page.off('request',listen);
 });
 await test('No-JS all routes, navigation, 51 menu entries, image links, disabled demo',async()=>{
  const ctx=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:800}});const p=await ctx.newPage();
  for(const route of routes){await p.goto(base+route);assert.ok(await p.getByRole('navigation').isVisible());assert.ok(await p.locator('h1').isVisible());}
  await p.goto(base+'/menu/');assert.equal(await p.locator('[data-menu-item]:visible').count(),51);
  await p.goto(base+'/gallery/');const link=p.locator('[data-gallery-index="0"]');assert.match(await link.getAttribute('href'),/\.webp$/);
  await p.goto(base+'/visit/');assert.ok(await p.locator('#party').isDisabled());assert.ok(await p.getByRole('button',{name:'Preview reservation'}).isDisabled());await ctx.close();
 });
 await test('Reduced motion, 200% text sizing and image failure layout',async()=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base);assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');
  await page.setViewportSize({width:768,height:900});
  for(const route of routes){await page.goto(base+route);await page.addStyleTag({content:'html{font-size:200%}'});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Text zoom overflow ${route}`);}
  await page.route('**/*.webp',r=>r.abort());await page.goto(base);assert.ok(await page.locator('h1').isVisible());assert.ok(await page.getByRole('link',{name:'Explore Our Menu'}).isVisible());await page.unroute('**/*.webp');
 });
 await test('No JavaScript exceptions or HTTP asset failures',()=>{assert.deepEqual(consoleErrors,[]);assert.deepEqual(networkFailures,[]);});
 for(const [name,engine] of [['Firefox',firefox],['WebKit',webkit]])await test(`${name}: direct routes, menu and modal smoke`,async()=>{
  let b;try{b=await engine.launch();}catch(e){if(e.message.includes('spawn UNKNOWN'))return {unavailable:e.message.split('\n')[0]};throw e;}try{const p=await b.newPage({viewport:{width:390,height:844}});for(const route of routes){const r=await p.goto(base+route);assert.equal(r.status(),200);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
  await p.goto(base+'/menu/');await p.locator('[data-filter="steaks"]').click();assert.equal(await p.locator('[data-menu-item]:visible').count(),6);
  await p.goto(base+'/gallery/');await p.locator('[data-gallery-index="0"]').click();assert.ok(await p.getByRole('dialog').isVisible());await p.keyboard.press('Escape');assert.ok(!await p.getByRole('dialog').isVisible());return b.version();}finally{await b.close();}
 });
 record('Browser version',browser.version());
}finally{
 if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));
  await writeFile('qa/results.json',JSON.stringify({date:new Date().toISOString(),environment:{platform:process.platform,node:process.version,transport:'direct local HTTP',timezone:'Asia/Kuala_Lumpur'},checks,failures,limitations},null,2)+'\n');
}
console.log(`${checks.length} passed; ${failures.length} failed.`);if(failures.length)process.exitCode=1;
