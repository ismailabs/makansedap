import {chromium} from 'playwright';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {startServer} from './serve.mjs';
const server=process.env.FOCUS_BASE?null:await startServer(0);
const base=process.env.FOCUS_BASE||`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch();const page=await browser.newPage();const checks=[];
try{
 for(const [route,selector] of [['/','.demo-bar a[href="https://ismailstudio.my/"]'],['/','.studio-note a[href="https://ismailstudio.my/"]'],['/','.opening-copy .btn-dark'],['/gallery/','.nav [aria-current]'],['/gallery/','[data-gallery-filter="food"]'],['/gallery/','[data-gallery-index="0"]'],['/gallery/','.lightbox-next']]){
  await page.goto(base+route);await page.evaluate(()=>document.fonts.ready);
  if(selector==='.lightbox-next')await page.locator('[data-gallery-index="0"]').click();
  await page.keyboard.press('Tab');
  const target=page.locator(selector);assert.equal(await target.count(),1);await target.focus();
  assert.ok(await target.evaluate(e=>e.matches(':focus-visible')));
  const colors=await target.evaluate(e=>{const c=getComputedStyle(e);let parent=e.parentElement;while(parent&&getComputedStyle(parent).backgroundColor==='rgba(0, 0, 0, 0)')parent=parent.parentElement;return {outline:c.outlineColor,outlineWidth:c.outlineWidth,background:parent?getComputedStyle(parent).backgroundColor:getComputedStyle(document.body).backgroundColor};});
  const lum=s=>{const c=s.match(/[\d.]+/g).slice(0,3).map(Number).map(x=>x/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;};
  const a=lum(colors.outline),b=lum(colors.background),contrast=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
  assert.ok(parseFloat(colors.outlineWidth)>=3);assert.ok(contrast>=3,`${route} ${selector}: ${contrast}`);
  checks.push({route,selector,...colors,contrast:Number(contrast.toFixed(2))});
 }
 await writeFile(`qa/v2/focus-contrast-${server?'local':'production'}.json`,JSON.stringify({checkedAt:new Date().toISOString(),base,result:'PASS',checks,scope:'Browser-computed focus outline against adjacent parent background for seven representative controls; complements keyboard tests, not full accessibility certification.'},null,2)+'\n');
 console.log(`${checks.length} focus contrast checks pass; all >= 3:1.`);
}finally{await browser.close();if(server)await new Promise(r=>server.close(r));}
