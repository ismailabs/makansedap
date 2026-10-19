import {readFile,writeFile,mkdir,access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
import {load} from 'cheerio';
const routes=['/','/menu/','/story/','/gallery/','/visit/'];
const base='https://makansedap.ismailstudio.my';
const hash=b=>createHash('sha256').update(b).digest('hex');
const evidence={checkedAt:new Date().toISOString(),kind:'V2 pre-edit baseline',routes:[],studio:{},redirects:[],browser:[]};
try{await access('qa/v2/baseline-live.json');throw new Error('Baseline already exists. Preserve the original V2 evidence; use a separate capture for later observations.');}catch(error){if(error.code!=='ENOENT')throw error;}
await mkdir('qa/v2/before',{recursive:true});
const locals=new Map(await Promise.all(routes.map(async route=>[route,await readFile('site'+(route==='/'?'/index.html':route+'index.html'))])));
for(const route of routes){
 const r=await fetch(base+route);const b=Buffer.from(await r.arrayBuffer());const $=load(b.toString());
 evidence.routes.push({route,status:r.status,url:r.url,headers:Object.fromEntries(r.headers),bytes:b.length,sha256:hash(b),sourceSha256:hash(locals.get(route)),sourceMatches:b.equals(locals.get(route)),title:$('title').text(),h1:$('h1').text(),canonical:$('link[rel=canonical]').attr('href'),fictionDisclosure:$('.demo-bar').text().trim()});
 if(route==='/menu/')evidence.menuRecords=$('[data-menu-item]').length;
}
const studio=await fetch('https://ismailstudio.my/');const studioHTML=await studio.text();const $=load(studioHTML);
await writeFile('qa/v2/before/studio-source.html',studioHTML);
evidence.studio={url:studio.url,status:studio.status,sha256:hash(studioHTML),title:$('title').text(),links:$('a[href]').toArray().map(el=>({text:$(el).text().trim().replace(/\s+/g,' '),href:$(el).attr('href')}))};
const contactURL='https://wa.me/601163265610';
try{const r=await fetch(contactURL,{redirect:'manual',signal:AbortSignal.timeout(15000)});evidence.studio.contact={url:contactURL,sourceAnchors:evidence.studio.links.filter(l=>l.href===contactURL),status:r.status,location:r.headers.get('location'),scope:'Read-only HTTP request; no message sent.'};}catch(error){evidence.studio.contact={url:contactURL,error:String(error)};}
evidence.oldHostPublicDNS=[];
for(const endpoint of ['https://cloudflare-dns.com/dns-query?name=rasairon.ismailstudio.my&type=A','https://dns.google/resolve?name=rasairon.ismailstudio.my&type=A']){
 try{const r=await fetch(endpoint,{headers:{accept:'application/dns-json'},signal:AbortSignal.timeout(15000)});evidence.oldHostPublicDNS.push({endpoint,status:r.status,result:await r.json()});}catch(error){evidence.oldHostPublicDNS.push({endpoint,error:String(error)});}
}
for(const route of [...routes,'/menu/?category=steaks&from=v2-baseline','/unknown-v2-baseline/?q=one%20two']){
 const old='https://rasairon.ismailstudio.my'+route;
 try{const r=await fetch(old,{redirect:'manual',signal:AbortSignal.timeout(10000)});evidence.redirects.push({url:old,status:r.status,location:r.headers.get('location')});}
 catch(error){evidence.redirects.push({url:old,error:String(error),cause:String(error.cause)});}
}
await writeFile('qa/v2/baseline-live.json',JSON.stringify(evidence,null,2)+'\n');
const b=await chromium.launch();
try{const p=await b.newPage({timezoneId:'Asia/Kuala_Lumpur'});evidence.browserVersion=b.version();for(const route of routes)for(const width of [390,1440]){
 await p.setViewportSize({width,height:900});const errors=[];const listener=e=>errors.push(e.message);p.on('pageerror',listener);const r=await p.goto(base+route);await p.evaluate(async()=>{await document.fonts.ready;for(const i of document.images)i.loading='eager';await Promise.all([...document.images].filter(i=>i.src).map(i=>i.decode().catch(()=>{})));});
 const screenshot=`qa/v2/before/${route==='/'?'home':route.replaceAll('/','')}-${width}.png`;await p.screenshot({path:screenshot,fullPage:true});
 evidence.browser.push({route,width,status:r.status(),screenshot,overflow:await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),errors,brokenImages:await p.locator('img[src]').evaluateAll(es=>es.filter(e=>!e.naturalWidth).map(e=>e.src))});p.off('pageerror',listener);
}}finally{await b.close();}
await writeFile('qa/v2/baseline-live.json',JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify({routes:evidence.routes.map(r=>({route:r.route,status:r.status,sourceMatches:r.sourceMatches,release:r.headers['x-release-commit']})),studio:evidence.studio,browser:evidence.browser.map(r=>({route:r.route,width:r.width,overflow:r.overflow})),redirects:evidence.redirects},null,2));
