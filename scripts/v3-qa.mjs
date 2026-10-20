import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {load} from 'cheerio';
import {chromium} from 'playwright';
import {startServer} from './serve.mjs';

const baseline='19e44f6c12dc4f5d4676ab9e4a0c76f70d8ea80a';
const root=process.env.QA_ROOT||'qa/v3/scenes';await mkdir(root,{recursive:true});
const server=process.env.V3_BASE?null:await startServer(0);
const base=process.env.V3_BASE||`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch();
const report={at:new Date().toISOString(),base,browser:browser.version(),baseline,checks:[],failures:[],frames:[],limitations:['Physical touch hardware and assistive-technology speech output are not available; touch/forced-colors/reduced-motion are browser emulations.']};
async function test(name,fn){try{const detail=await fn();report.checks.push({name,detail:detail||'PASS'});console.log('PASS',name);}catch(e){report.failures.push({name,error:e.message});console.error('FAIL',name,e.message);}}
const tick=page=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
async function frame(page,name){await tick(page);const path=`${root}/${name}.png`;await page.screenshot({path});report.frames.push({path,at:new Date().toISOString(),scrollY:await page.evaluate(()=>scrollY)});}
async function ready(page,route){await page.goto(base+route,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);}
try{
 await test('Protected baselines, menu group/item identities and all 17 gallery entries equal pre-V3',async()=>{
  const show=f=>execFileSync('git',['show',`${baseline}:${f}`],{encoding:'utf8'});
  for(const f of ['qa/menu-contract.json','qa/menu-descriptions-baseline.json'])assert.equal(execFileSync('git',['hash-object',f],{encoding:'utf8'}).trim(),execFileSync('git',['rev-parse',`${baseline}:${f}`],{encoding:'utf8'}).trim(),'Protected baseline Git blob changed');
  const menuIdentities=s=>{const $=load(s);return {groups:$('[data-menu-group]').toArray().map(e=>({id:$(e).attr('id'),category:$(e).attr('data-menu-group'),heading:$(e).find('h2').text()})),items:$('[data-menu-item]').toArray().map(e=>({id:$(e).attr('id'),category:$(e).attr('data-menu-item')}))};};
  assert.deepEqual(menuIdentities(await readFile('site/menu/index.html','utf8')),menuIdentities(show('site/menu/index.html')));
  const gallery=s=>{const $=load(s);return $('[data-gallery-index]').toArray().map(e=>({id:$(e).attr('data-gallery-index'),full:$(e).attr('data-full'),href:$(e).attr('href'),caption:$(e).attr('data-caption'),category:$(e).attr('data-gallery-category'),alt:$(e).find('img').attr('alt'),heading:$(e).find('h2').text(),text:$(e).find('p').text()}));};
  const entries=gallery(await readFile('site/gallery/index.html','utf8'));assert.equal(entries.length,17);assert.deepEqual(entries,gallery(show('site/gallery/index.html')));
  return {groups:7,items:51,gallery:17,lockedBaselineHashes:await Promise.all(['qa/menu-contract.json','qa/menu-descriptions-baseline.json'].map(async f=>({file:f,sha256:createHash('sha256').update(await readFile(f)).digest('hex')})))};
 });
 for(const width of [390,1440]){
  const context=await browser.newContext({viewport:{width,height:900},hasTouch:width===390,isMobile:width===390,timezoneId:'Asia/Kuala_Lumpur'});
  await context.addInitScript(()=>{
   window.introSamples=[];
   const observer=new MutationObserver(()=>{
    if(document.documentElement?.dataset.motion==='ready'&&document.querySelector('.hero-plate')){
     observer.disconnect();const start=performance.now();
     const focal=matchMedia('(min-width:861px)').matches?'.hero-plate':'.hero-aromatics';
     const sample=()=>{const elapsed=performance.now()-start;window.introSamples.push({elapsedMs:Math.round(elapsed),element:focal,transform:getComputedStyle(document.querySelector(focal)).transform});if(elapsed<1400)requestAnimationFrame(sample);};sample();
    }
   });observer.observe(document,{subtree:true,attributes:true,attributeFilter:['data-motion']});
  });
  const page=await context.newPage();
  await context.tracing.start({screenshots:true,snapshots:true});
  await test(`Home real-time opening filmstrip at ${width}`,async()=>{
   await page.goto(base+'/',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>document.documentElement.dataset.motion==='ready');
   const start=await page.evaluate(()=>performance.now());const transforms=[];
   for(const [state,time] of [['start',0],['mid',450],['end',1200]]){await page.waitForFunction(({start,time})=>performance.now()-start>=time,{start,time},{polling:'raf'});transforms.push(await page.locator(width===1440?'.hero-plate':'.hero-aromatics').evaluate(e=>getComputedStyle(e).transform));await frame(page,`home-opening-${width}-${state}`);}
   await page.waitForFunction(()=>window.introSamples.at(-1)?.elapsedMs>=1400);
   const samples=await page.evaluate(()=>window.introSamples);assert.ok(new Set(samples.map(s=>s.transform)).size>=2);
   return {requestedScreenshotOffsetsMs:[0,450,1200],transforms,browserRafSamples:samples,scope:'Transforms sampled inside the browser from the actual module-ready event; screenshot IPC can arrive later on a loaded host. Full Playwright trace includes real loading frames.'};
  });
  await test(`Home bounded reversible scroll scene + immediate CTA at ${width}`,async()=>{
   await ready(page,'/');await page.waitForFunction(()=>document.documentElement.dataset.motion==='ready');assert.ok(await page.getByRole('link',{name:'Explore Our Menu',exact:true}).isVisible());
   await page.locator('.transform-art').scrollIntoViewIfNeeded();await page.waitForFunction(()=>document.querySelector('.transform-art').dataset.scrollReady==='true');
   const bounds=await page.evaluate(async()=>{const {ScrollTrigger}=await import('/assets/js/vendor/gsap-3.15.0.js');const trigger=ScrollTrigger.getById('home-gather');return {start:trigger.start,end:trigger.end,pins:ScrollTrigger.getAll().filter(t=>t.pin).length};});
   assert.equal(bounds.pins,0);assert.ok(bounds.end>bounds.start);
   const transforms=[];
   for(const [state,n] of [['start',0],['mid',.5],['end',1]]){await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),bounds.start+(bounds.end-bounds.start)*n);await tick(page);transforms.push(await page.locator('.gather-plate').evaluate(e=>getComputedStyle(e).transform));await frame(page,`home-gather-${width}-${state}`);}
   assert.equal(new Set(transforms).size,3);await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),bounds.start);await tick(page);assert.equal(await page.locator('.gather-plate').evaluate(e=>getComputedStyle(e).transform),transforms[0]);
   await page.evaluate(()=>{
    window.finaleSamples=[];
    const observer=new IntersectionObserver(entries=>{if(!entries.some(entry=>entry.isIntersecting))return;observer.disconnect();const start=performance.now();const sample=()=>{const elapsed=performance.now()-start;window.finaleSamples.push({elapsedMs:Math.round(elapsed),opacity:Number(getComputedStyle(document.querySelector('.finale-plate')).opacity)});if(elapsed<1100)requestAnimationFrame(sample);};sample();},{threshold:.15});observer.observe(document.querySelector('.studio-finale'));
   });
   await page.locator('.studio-finale').scrollIntoViewIfNeeded();await frame(page,`studio-${width}-entry`);await page.evaluate(()=>scrollBy({top:100,behavior:'instant'}));await frame(page,`studio-${width}-mid`);await page.waitForFunction(()=>window.finaleSamples.at(-1)?.elapsedMs>=1100);await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));await frame(page,`studio-${width}-end`);
   const finaleSamples=await page.evaluate(()=>window.finaleSamples);assert.ok(finaleSamples.some(sample=>sample.opacity>.1),'Plate must visibly dissolve into the Studio identity');assert.equal(finaleSamples.at(-1).opacity,0);
   assert.ok(await page.locator('.studio-finale a[href="https://ismailstudio.my/"]').isVisible());assert.ok(await page.locator('.studio-finale a[href="https://wa.me/601163265610"]').isVisible());return {bounds,transforms,finaleSamples};
  });
  await test(`Menu functional staging, cancellation and Back at ${width}`,async()=>{
   await ready(page,'/menu/');for(const category of ['starters','steaks','drinks']){await page.locator(`[data-filter="${category}"]`).click();assert.equal(await page.locator('[data-menu-group]:visible').getAttribute('id'),category);assert.equal(await page.locator('#menu-stage-label').textContent(),category==='drinks'?'Drinks':category[0].toUpperCase()+category.slice(1));await frame(page,`menu-${width}-${category}`);}await page.goBack();await page.waitForFunction(()=>document.querySelector('[data-filter="steaks"]').getAttribute('aria-pressed')==='true');assert.equal(await page.locator('#menu-stage-label').textContent(),'Steaks');
  });
  await test(`Story roots/fire/table transition at ${width}`,async()=>{
   await ready(page,'/story/');for(const [state,selector] of [['roots','.story-poster'],['fire','.story-fire'],['table','.story-table']]){await page.locator(selector).scrollIntoViewIfNeeded();await frame(page,`story-${width}-${state}`);}assert.equal(await page.locator('.story-roots h2').textContent(),'Roots.');
  });
  await test(`Gallery filtered decode, failure recovery and focus at ${width}`,async()=>{
   await ready(page,'/gallery/');await page.locator('[data-gallery-filter="interior"]').click();await frame(page,`gallery-${width}-filtered`);const opener=page.locator('[data-gallery-index="1"]');await opener.click();await frame(page,`gallery-${width}-open`);await page.keyboard.press('ArrowRight');await frame(page,`gallery-${width}-next`);await page.keyboard.press('Escape');assert.ok(await opener.evaluate(e=>e===document.activeElement));
   await page.route('**/dining-room.webp',r=>r.abort());await opener.click();await page.waitForFunction(()=>document.querySelector('#gallery-lightbox [role="status"]').textContent.includes('could not'));assert.ok(await page.getByRole('button',{name:'Next image'}).isEnabled());await page.keyboard.press('Escape');await page.unroute('**/dining-room.webp');
  });
  await test(`Visit stage visualization and privacy at ${width}`,async()=>{
   await ready(page,'/visit/');const requests=[];const listen=r=>requests.push({method:r.method(),url:r.url(),body:r.postData()});page.on('request',listen);
   await page.locator('#party').selectOption('1');assert.equal(await page.locator('.table-seat.is-occupied').count(),1);await page.locator('.imaginary-table').scrollIntoViewIfNeeded();await frame(page,`visit-${width}-one-guest`);
   await page.locator('#party').selectOption('8');assert.equal(await page.locator('.table-seat.is-occupied').count(),8);await page.locator('.imaginary-table').scrollIntoViewIfNeeded();await frame(page,`visit-${width}-eight-guests`);
   await page.locator('#date').fill(await page.locator('#date').getAttribute('max'));await page.locator('#time').selectOption('21:00');assert.equal(await page.locator('[data-step][data-complete="true"]').count(),3);await page.getByRole('button',{name:'Preview reservation'}).click();await frame(page,`visit-${width}-preview`);assert.match(await page.locator('#reservation-result').textContent(),/No reservation has been created/);assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0);assert.deepEqual(await context.cookies(),[]);assert.ok(requests.every(r=>r.method==='GET'&&!r.body&&new URL(r.url).origin===new URL(base).origin));page.off('request',listen);return {requests};
  });
  await context.tracing.stop({path:`${root}/interactions-${width}.zip`});await context.close();
 }
 await test('Reduced motion, live preference change, forced colors and module failure retain every task',async()=>{
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});const page=await context.newPage();
  for(const route of ['/','/menu/','/story/','/gallery/','/visit/']){await ready(page,route);assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');assert.ok(await page.locator('h1').isVisible());}
  await ready(page,'/menu/');await page.locator('[data-filter="steaks"]').click();assert.equal(await page.locator('#menu-stage-label').textContent(),'Steaks');
  await page.emulateMedia({reducedMotion:'no-preference',forcedColors:'active'});await ready(page,'/');await page.waitForFunction(()=>document.documentElement.dataset.motion==='ready');await page.emulateMedia({reducedMotion:'reduce'});await tick(page);assert.equal(await page.locator('.gather-plate').evaluate(e=>e.style.transform),'');await page.keyboard.press('Tab');assert.ok(await page.locator(':focus').isVisible());
  await page.route('**/motion/**',r=>r.abort());await ready(page,'/menu/');await page.locator('[data-filter="starters"]').click();assert.equal(await page.locator('[data-menu-item]:visible').count(),7);await ready(page,'/visit/');assert.ok(await page.locator('#party').isEnabled());await context.close();
 });
}finally{report.result=report.failures.length?'FAIL':'PASS';await writeFile(`${root}/results.json`,JSON.stringify(report,null,2)+'\n');await browser.close();if(server)await new Promise(r=>server.close(r));}
console.log(`${report.checks.length} V3 checks passed; ${report.failures.length} failed.`);if(report.failures.length)process.exitCode=1;
