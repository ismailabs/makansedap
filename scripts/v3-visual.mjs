import {chromium} from 'playwright';
import sharp from 'sharp';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {startServer} from './serve.mjs';
const root=process.env.QA_ROOT||'qa/v3/visual-final';await mkdir(root,{recursive:true});
const server=process.env.V3_BASE?null:await startServer(0);const base=process.env.V3_BASE||`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch();const receipt={at:new Date().toISOString(),base,browser:browser.version(),gitHead:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),sourceHashes:[],captures:[],boards:[]};
try{
 for(const width of [390,768,1440])for(const route of ['/','/menu/','/story/','/gallery/','/visit/']){
  const name=route==='/'?'home':route.replaceAll('/','');const page=await browser.newPage({viewport:{width,height:900},hasTouch:width===390,timezoneId:'Asia/Kuala_Lumpur'});
  await page.goto(base+route,{waitUntil:'networkidle'});await page.evaluate(async()=>{await document.fonts.ready;for(const i of document.images)i.loading='eager';await Promise.all([...document.images].filter(i=>i.src).map(i=>i.decode()));});
  const height=await page.evaluate(()=>document.documentElement.scrollHeight);
  // Visit each native scroll scene before the whole-page capture; no lazy blank bands.
  for(let y=0;y<height;y+=600){await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));}
  // Capture the settled Studio identity, not an accidental halfway dissolve.
  await page.evaluate(async()=>{await Promise.all(document.getAnimations().filter(animation=>animation.id==='makansedap-motion').map(animation=>animation.finished.catch(()=>{})));});
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  const png=await page.screenshot({fullPage:true});const full=`${root}/${name}-${width}.webp`;await sharp(png).webp({quality:84}).toFile(full);
  const fold=`${root}/${name}-${width}-fold.webp`;await sharp(png).extract({left:0,top:0,width,height:Math.min(900,height)}).webp({quality:90}).toFile(fold);
  receipt.captures.push({route,width,height,full,fold});
  if(width!==768){
   const old=`qa/v3/baseline/local-${name}-${width}.png`;const oldBytes=await readFile(old);const oldMeta=await sharp(oldBytes).metadata();
   const panelWidth=width===390?390:720;const panelHeight=width===390?900:450;
   const before=await sharp(oldBytes).extract({left:0,top:0,width,height:Math.min(900,oldMeta.height)}).resize(panelWidth,panelHeight,{fit:'contain',background:'#170f19'}).toBuffer();
   const after=await sharp(png).extract({left:0,top:0,width,height:Math.min(900,height)}).resize(panelWidth,panelHeight,{fit:'contain',background:'#170f19'}).toBuffer();
   const board=`${root}/${name}-${width}-V2-before-V3-after.webp`;
   await sharp({create:{width:panelWidth*2,height:panelHeight+40,channels:3,background:'#170f19'}}).composite([{input:Buffer.from(`<svg width="${panelWidth*2}" height="40"><text x="16" y="27" font-family="Arial" font-size="16" fill="#f6edda">V2 — fresh local baseline</text><text x="${panelWidth+16}" y="27" font-family="Arial" font-size="16" fill="#f3b448">V3 — actual implementation</text></svg>`),left:0,top:0},{input:before,left:0,top:40},{input:after,left:panelWidth,top:40}]).webp({quality:87}).toFile(board);receipt.boards.push(board);
  }
  const file='site'+(route==='/'?'/':route)+'index.html';receipt.sourceHashes.push({route,width,sha256:createHash('sha256').update(await readFile(file)).digest('hex')});await page.close();
 }
}finally{await writeFile(`${root}/receipt.json`,JSON.stringify(receipt,null,2)+'\n');await browser.close();if(server)await new Promise(r=>server.close(r));}
console.log(`${receipt.captures.length} actual full-page captures and ${receipt.boards.length} fresh before/after boards.`);
