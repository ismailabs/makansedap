import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {startServer} from './serve.mjs';

const routes=['/','/menu/','/story/','/gallery/','/visit/'];
const widths=[320,375,390,768,1024,1440,1920];
const destinations=['https://ismailstudio.my/','https://wa.me/601163265610'];
const server=process.env.EXTENDED_BASE?null:await startServer(0);
const base=(process.env.EXTENDED_BASE||`http://127.0.0.1:${server.address().port}`).replace(/\/$/,'');
const mode=process.env.EXTENDED_BASE?'hosted':'local';
const evidenceRoot=`qa/v2/extended-${mode}`;
await mkdir(evidenceRoot,{recursive:true});
const evidence={date:new Date().toISOString(),base,mode,checks:[],failures:[],screenshots:[],scope:'Automated browser checks; 200% text is CSS text enlargement, not a claim of OS/browser zoom or full accessibility compliance.'};
const browser=await chromium.launch();
const context=await browser.newContext({timezoneId:'Asia/Kuala_Lumpur',viewport:{width:390,height:844}});
const page=await context.newPage();
async function test(name,fn){
 try{const detail=await fn();evidence.checks.push({name,detail:detail||'PASS'});console.log('PASS',name);}
 catch(error){evidence.failures.push({name,error:error.message});console.error('FAIL',name,error.message);}
}
async function screenshot(name,{fullPage=true}={}){
 const file=`${evidenceRoot}/${name}.png`;await page.screenshot({path:file,fullPage});evidence.screenshots.push(file);
}
const dayAfter=(value,amount)=>{const date=new Date(value+'T12:00:00Z');date.setUTCDate(date.getUTCDate()+amount);return date.toISOString().slice(0,10);};
try{
 await test('Every route exposes only the two verified Studio conversion destinations',async()=>{
  for(const route of routes){
   await page.goto(base+route);
   const links=await page.locator('a[href^="https:"],a[href^="mailto:"],a[href^="tel:"]').evaluateAll(elements=>elements.map(element=>({href:element.href,name:(element.getAttribute('aria-label')||element.textContent).trim(),target:element.target,rel:element.rel})));
   assert.ok(links.every(link=>destinations.includes(link.href)),`Unexpected external destination on ${route}: ${JSON.stringify(links)}`);
   for(const destination of destinations)assert.ok(links.some(link=>link.href===destination&&link.name.length>0),`Missing named conversion link ${destination} on ${route}`);
   for(const link of links.filter(link=>link.target==='_blank'))assert.match(link.rel,/\bnoopener\b/,`Unsafe new-tab link ${link.href}`);
  }
  return {destinations,sourceEvidence:'qa/v2/before/studio-source.html; exact WhatsApp link appears on the verified Studio site'};
 });
 await test('Mobile navigation and keyboard skip link remain usable',async()=>{
  await page.setViewportSize({width:320,height:780});await page.goto(base+'/');
  await page.keyboard.press('Tab');const skip=page.locator(':focus');assert.match(await skip.textContent(),/skip/i);
  const target=await skip.getAttribute('href');assert.ok(target?.startsWith('#'));await page.keyboard.press('Enter');assert.equal(new URL(page.url()).hash,target);
  const toggle=page.locator('button[aria-controls="primary-nav"]');await toggle.click();assert.equal(await toggle.getAttribute('aria-expanded'),'true');
  await screenshot('navigation-open-320',{fullPage:false});await page.keyboard.press('Escape');assert.ok(await toggle.evaluate(element=>element===document.activeElement));
 });
 await test('Menu clicks create shareable categories and browser Back/Forward restores filters',async()=>{
  await page.goto(base+'/menu/');
  await page.locator('[data-filter="steaks"]').click();assert.equal(new URL(page.url()).hash,'#steaks');assert.equal(await page.locator('[data-menu-item]:visible').count(),6);
  await page.locator('[data-filter="drinks"]').click();assert.equal(new URL(page.url()).hash,'#drinks');assert.equal(await page.locator('[data-menu-item]:visible').count(),8);
  await page.goBack();await page.waitForFunction(()=>document.querySelector('[data-filter="steaks"]').getAttribute('aria-pressed')==='true');assert.equal(await page.locator('[data-menu-item]:visible').count(),6);
  await page.goForward();await page.waitForFunction(()=>document.querySelector('[data-filter="drinks"]').getAttribute('aria-pressed')==='true');assert.equal(await page.locator('[data-menu-item]:visible').count(),8);
  await screenshot('menu-filter-drinks-320');
 });
 await test('All category deep links, dish deep links after filtering and unknown fragments',async()=>{
  for(const [category,count] of [['starters',7],['steaks',6],['grill',8],['malaysian',10],['sides',7],['desserts',5],['drinks',8]]){
   await page.goto(base+'/menu/#'+category);assert.equal(await page.locator('[data-menu-item]:visible').count(),count);assert.equal(await page.locator(`[data-filter="${category}"]`).getAttribute('aria-pressed'),'true');
  }
  await page.locator('[data-filter="steaks"]').click();await page.evaluate(()=>{location.hash='item-beef-rendang-rice';});
  await page.waitForFunction(()=>!document.querySelector('#item-beef-rendang-rice').closest('[data-menu-group]').hidden);assert.ok(await page.locator('#item-beef-rendang-rice').isVisible());
  await page.goto(base+'/menu/#v2-unknown-fragment');assert.equal(await page.locator('[data-menu-item]:visible').count(),51);
 });
 await test('Every filtered gallery wraps within the visible set and restores keyboard focus',async()=>{
  await page.setViewportSize({width:390,height:844});
  for(const category of ['food','interior','details','all']){
   await page.goto(base+'/gallery/');await page.locator(`[data-gallery-filter="${category}"]`).click();
   const visible=page.locator('[data-gallery-index]:visible');const entries=await visible.evaluateAll(elements=>elements.map(element=>({index:Number(element.dataset.galleryIndex),full:new URL(element.dataset.full,location.href).href})));
   assert.ok(entries.length>1);const opener=visible.first();await opener.focus();await page.keyboard.press('Enter');
   const dialog=page.getByRole('dialog');assert.ok(await dialog.isVisible());
   const assertImage=async entry=>{assert.equal(await page.locator('.lightbox-image').evaluate(element=>element.src),entry.full);assert.match(await page.locator('#lightbox-counter').textContent(),new RegExp(`^${String(entry.index+1).padStart(2,'0')}`));};
   await assertImage(entries[0]);await page.getByRole('button',{name:'Previous image'}).click();await assertImage(entries.at(-1));
   await page.getByRole('button',{name:'Next image'}).click();await assertImage(entries[0]);
   for(let index=1;index<entries.length;index++){await page.keyboard.press('ArrowRight');await assertImage(entries[index]);}
   await page.keyboard.press('ArrowRight');await assertImage(entries[0]);
   const close=page.getByRole('button',{name:'Close gallery'});await close.focus();await page.keyboard.press('Shift+Tab');assert.ok(await page.getByRole('button',{name:'Next image'}).evaluate(element=>element===document.activeElement));
   await page.keyboard.press('Tab');assert.ok(await close.evaluate(element=>element===document.activeElement));
   await screenshot(`gallery-${category}-dialog-390`,{fullPage:false});await page.keyboard.press('Escape');assert.ok(!await dialog.isVisible());assert.ok(await opener.evaluate(element=>element===document.activeElement));
  }
 });
 await test('Reservation demo validates party/date/time boundaries without transmitting or storing data',async()=>{
  await page.goto(base+'/visit/');await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('#reservation-form input[type="text"],#reservation-form input[type="email"],#reservation-form input[type="tel"],#reservation-form textarea').count(),0);
  const bounds=await page.locator('#date').evaluate(element=>({min:element.min,max:element.max,today:new Intl.DateTimeFormat('en-CA',{year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}));
  assert.equal(bounds.min,dayAfter(bounds.today,1));assert.equal(bounds.max,dayAfter(bounds.min,179));
  const requests=[];const track=request=>requests.push({method:request.method(),url:request.url(),body:request.postData()});page.on('request',track);
  try{
   const submit=page.getByRole('button',{name:'Preview reservation'});
   await page.locator('#party').selectOption('2');await page.locator('#time').selectOption('19:00');
   for(const date of [dayAfter(bounds.min,-1),dayAfter(bounds.max,1)]){await page.locator('#date').fill(date);await submit.click();assert.match(await page.locator('#reservation-error').textContent(),/tomorrow|180 days/);assert.equal(await page.locator('#date').getAttribute('aria-invalid'),'true');}
   await page.locator('#date').fill(bounds.min);
   for(const value of ['0','9','1.5']){await page.locator('#party').evaluate((element,value)=>{element.add(new Option('Invalid test value',value));element.value=value;},value);await submit.click();assert.match(await page.locator('#reservation-error').textContent(),/party size/);}
   await page.locator('#party').selectOption('2');await page.locator('#time').evaluate(element=>{element.add(new Option('Invalid test time','12:00'));element.value='12:00';});await submit.click();assert.match(await page.locator('#reservation-error').textContent(),/illustrative time slot/);
   for(const [party,date,time] of [['1',bounds.min,'17:30'],['8',bounds.max,'21:00']]){
    await page.locator('#party').selectOption(party);await page.locator('#date').fill(date);await page.locator('#time').selectOption(time);await submit.click();
    assert.match(await page.locator('#reservation-result').textContent(),/This is a portfolio demonstration\. No reservation has been created\./);assert.match(await page.locator('#reservation-result').textContent(),/nothing was submitted or stored/);assert.ok(await page.locator('#reservation-result').evaluate(element=>element===document.activeElement));
   }
   await screenshot('reservation-demo-result-390',{fullPage:false});
   assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0);assert.equal((await context.cookies()).length,0);
   assert.ok(requests.every(request=>request.method==='GET'&&new URL(request.url).origin===new URL(base).origin&&/\.(webp|woff2)$/.test(new URL(request.url).pathname)),`Unexpected transmission: ${JSON.stringify(requests)}`);
  }finally{page.off('request',track);}
  return {bounds,requests};
 });
 for(const width of widths)await test(`All five routes at 200% text: ${width}px`,async()=>{
  await page.setViewportSize({width,height:900});
  const issues=[];
  for(const route of routes){
   await page.goto(base+route);await page.evaluate(()=>document.fonts.ready);
   const enlarged=await page.evaluate(()=>{
    const textElements=[...document.querySelectorAll('body *')].filter(element=>!['SCRIPT','STYLE','NOSCRIPT','SVG','PATH'].includes(element.tagName)&&([...element.childNodes].some(node=>node.nodeType===Node.TEXT_NODE&&node.textContent.trim())||['INPUT','SELECT','TEXTAREA'].includes(element.tagName)));
    const sizes=textElements.map(element=>({element,size:parseFloat(getComputedStyle(element).fontSize)}));
    for(const {element,size} of sizes)element.style.fontSize=`${size*2}px`;
    return sizes.length;
   });assert.ok(enlarged>20);
   const dimensions=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:innerWidth}));
   if(dimensions.scroll>dimensions.viewport){const elements=await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(element=>{const rect=element.getBoundingClientRect();return rect.width>0&&rect.right>innerWidth+1;}).slice(0,8).map(element=>({tag:element.tagName,class:element.className,text:element.textContent.trim().slice(0,65),right:Math.round(element.getBoundingClientRect().right)})));issues.push({route,...dimensions,elements});}
   assert.ok(await page.locator('h1').isVisible());
   if(width===320||width===768)await screenshot(`${route==='/'?'home':route.replaceAll('/','')}-text200-${width}`);
  }
  assert.deepEqual(issues,[],`200% text overflow at ${width}px`);
 });
 await test('No-JavaScript content, useful links and explicitly disabled booking controls',async()=>{
  const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:800}});const fallback=await nojs.newPage();
  try{
   for(const route of routes){await fallback.goto(base+route);assert.ok(await fallback.getByRole('navigation',{name:'Primary navigation'}).isVisible());assert.ok(await fallback.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
   await fallback.goto(base+'/menu/');assert.equal(await fallback.locator('[data-menu-item]:visible').count(),51);
   await fallback.goto(base+'/gallery/');const links=await fallback.locator('[data-gallery-index]').evaluateAll(elements=>elements.map(element=>element.getAttribute('href')));assert.equal(links.length,17);assert.ok(links.every(href=>href?.endsWith('.webp')));
   await fallback.goto(base+'/visit/');for(const id of ['party','date','time'])assert.ok(await fallback.locator('#'+id).isDisabled());assert.ok(await fallback.getByRole('button',{name:'Preview reservation'}).isDisabled());
  }finally{await nojs.close();}
 });
 await test('Reduced motion and failed images preserve navigation and meal discovery',async()=>{
  await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});
  await page.route('**/*.webp',route=>route.abort());
  try{
   await page.goto(base+'/');assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');assert.ok(await page.getByRole('link',{name:'Explore Our Menu',exact:true}).isVisible());assert.ok(await page.locator('h1').isVisible());assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await screenshot('home-images-blocked-390');
   await page.goto(base+'/menu/');assert.equal(await page.locator('[data-menu-item]:visible').count(),51);
  }finally{await page.unroute('**/*.webp');await page.emulateMedia({reducedMotion:'no-preference'});}
 });
 await test('Missing routes return a real HTTP 404 rather than the homepage',async()=>{
  for(const route of ['/v2-missing-route/','/assets/v2-missing-image.webp']){const response=await fetch(base+route);assert.equal(response.status,404);}
 });
 await test('CSP retains same-origin assets and blocks connections, forms and embedding',async()=>{
  const headers=await readFile('site/_headers','utf8');
  for(const directive of ["default-src 'self'","script-src 'self'","style-src 'self'","font-src 'self'","img-src 'self'","connect-src 'none'","form-action 'none'","base-uri 'none'","frame-ancestors 'none'"])assert.ok(headers.includes(directive),`Missing CSP ${directive}`);
  assert.ok(!/unsafe-inline|unsafe-eval|https:\/\//.test(headers));
 });
 evidence.browser=browser.version();
}finally{
 await browser.close();if(server)await new Promise(resolve=>server.close(resolve));
 await writeFile(`qa/v2/extended-${mode}-results.json`,JSON.stringify(evidence,null,2)+'\n');
}
console.log(`${evidence.checks.length} extended checks passed; ${evidence.failures.length} failed.`);
if(evidence.failures.length)process.exitCode=1;
