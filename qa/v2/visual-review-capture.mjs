import {chromium} from 'playwright';
import sharp from 'sharp';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const dir='qa/v2',routes=['/','/menu/','/story/','/gallery/','/visit/'];
await mkdir(dir,{recursive:true});
const observations=[];
const hash=buffer=>createHash('sha256').update(buffer).digest('hex');
const sourceHashes={stylesheet:hash(await readFile('site/assets/css/site.css')),routes:Object.fromEntries(await Promise.all(routes.map(async route=>[route,hash(await readFile('site'+(route==='/'?'/index.html':route+'index.html')))])))};
const browser=await chromium.launch();
const browserVersion=browser.version();
try{
 const page=await browser.newPage({timezoneId:'Asia/Kuala_Lumpur'});
 for(const route of routes)for(const width of [390,1440]){
  const name=route==='/'?'home':route.replaceAll('/','');
  await page.setViewportSize({width,height:900});const response=await page.goto('http://localhost:8000'+route);
  await page.evaluate(async()=>{await document.fonts.ready;for(const i of document.images)i.loading='eager';await Promise.all([...document.images].filter(i=>i.src).map(i=>i.decode().catch(()=>{})));});
  const first=`${dir}/visual-review-${name}-${width}-viewport.png`,full=`${dir}/visual-review-${name}-${width}-full.png`;
  await page.screenshot({path:first});await page.screenshot({path:full,fullPage:true});
  observations.push({route,width,status:response.status(),first,full,...await page.evaluate(()=>({h1:document.querySelector('h1').textContent,documentHeight:document.documentElement.scrollHeight,overflow:document.documentElement.scrollWidth>innerWidth,brokenImages:[...document.images].filter(i=>i.src&&!i.naturalWidth).map(i=>i.src),fontFamily:getComputedStyle(document.querySelector('h1')).fontFamily,studioLinks:[...document.querySelectorAll('a')].filter(a=>/^https:\/\/(ismailstudio\.my|wa\.me)/.test(a.href)).map(a=>({text:a.textContent.trim(),href:a.href}))}))});
 }
}finally{await browser.close();}
const svgLabel=(label,w,h=38)=>Buffer.from(`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#302239"/><text x="14" y="25" fill="#fff" font-family="Arial" font-size="17">${label}</text></svg>`);
const cells=[];let y=0;
for(const route of routes){
 const name=route==='/'?'home':route.replaceAll('/','');
 const row=[];
 for(const [i,width]of[1440,390].entries()){
  const panelWidth=i===0?800:260,panelHeight=i===0?500:600;
  const img=await sharp(`${dir}/visual-review-${name}-${width}-viewport.png`).resize({width:panelWidth,height:panelHeight,fit:'contain',background:'#eee'}).toBuffer();
  row.push({input:img,left:i===0?0:820,top:38});
  row.push({input:svgLabel(`${name.toUpperCase()} / ${width}px`,panelWidth),left:i===0?0:820,top:0});
 }
 const board=await sharp({create:{width:1080,height:638,channels:3,background:'#fff'}}).composite(row).png().toBuffer();
 await sharp(board).toFile(`${dir}/visual-review-${name}-first-view.png`);
 cells.push({input:board,left:0,top:y});y+=658;
 const compare=[];let x=0;
 for(const phase of ['before','after'])for(const width of [1440,390]){
  const file=phase==='before'?`${dir}/before/${name}-${width}.png`:`${dir}/visual-review-${name}-${width}-viewport.png`;
  const panelWidth=width===1440?600:260,panelHeight=600;
  const {height}=await sharp(file).metadata();const source=await sharp(file).extract({left:0,top:0,width,height:Math.min(900,height)}).toBuffer();
  const img=await sharp(source).resize({width:panelWidth,height:panelHeight,fit:'contain',background:'#eee'}).toBuffer();
  compare.push({input:img,left:x,top:38});compare.push({input:svgLabel(`${phase.toUpperCase()} / ${name} / ${width}px`,panelWidth),left:x,top:0});x+=panelWidth+20;
 }
 await sharp({create:{width:x-20,height:638,channels:3,background:'#fff'}}).composite(compare).png().toFile(`${dir}/visual-review-${name}-comparison.png`);
}
await sharp({create:{width:1080,height:y-20,channels:3,background:'#fff'}}).composite(cells).png().toFile(`${dir}/visual-review-contact-sheet.png`);
await writeFile(`${dir}/visual-review-observations.json`,JSON.stringify({checkedAt:new Date().toISOString(),scope:'Independent visual review; localhost:8000; all lazy images made eager and decoded before capture',browserVersion,sourceHashes,observations},null,2)+'\n');
for(const [name,y]of[['menu',850],['visit',900],['home',4100],['gallery',6500],['story',2650]]){const file=`${dir}/visual-review-${name}-390-full.png`,metadata=await sharp(file).metadata();await sharp(file).extract({left:0,top:Math.min(y,metadata.height-900),width:390,height:900}).toFile(`${dir}/visual-review-${name}-390-detail.png`);}
console.log(JSON.stringify(observations.map(o=>({route:o.route,width:o.width,height:o.documentHeight,overflow:o.overflow,brokenImages:o.brokenImages.length})),null,2));
