import {chromium} from 'playwright';
import sharp from 'sharp';
import {writeFile,mkdir} from 'node:fs/promises';
import {startServer} from './serve.mjs';
const server=await startServer(0),base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 await mkdir('qa/inspection',{recursive:true});
 for(const [route,name] of [['/','home'],['/menu/','menu'],['/story/','story'],['/gallery/','gallery'],['/visit/','visit']]){
  for(const width of [1440,390]){
   await page.setViewportSize({width,height:width===1440?1000:844});await page.goto(base+route);
   await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].filter(i=>i.loading!=='lazy'&&i.src).map(i=>i.decode()));});
   await page.screenshot({path:`qa/inspection/${name}-${width}.png`});
  }
 }
 await page.goto(base);await page.evaluate(()=>document.fonts.ready);
 const client=await page.context().newCDPSession(page);await client.send('DOM.enable');await client.send('CSS.enable');
 const {root}=await client.send('DOM.getDocument');const fonts={};
 for(const selector of ['h1','.hero-lede']){const {nodeId}=await client.send('DOM.querySelector',{nodeId:root.nodeId,selector});fonts[selector]=(await client.send('CSS.getPlatformFontsForNode',{nodeId})).fonts;}
 await writeFile('qa/rendered-fonts.json',JSON.stringify(fonts,null,2)+'\n');
 await page.goto(base+'/visit/');await page.locator('#party').selectOption('2');await page.locator('#date').fill(await page.locator('#date').getAttribute('min'));await page.locator('#time').selectOption('19:00');await page.getByRole('button',{name:'Preview reservation'}).click();await page.locator('.reservation-panel').screenshot({path:'qa/inspection/reservation-confirmation.png'});
 await page.setViewportSize({width:320,height:568});await page.goto(base+'/gallery/');await page.locator('[data-gallery-index="0"]').click();await page.locator('.lightbox-image').evaluate(i=>i.decode());await page.screenshot({path:'qa/inspection/lightbox-320.png'});
 const tiles=[];
 for(const [i,name] of ['home','menu','story','gallery','visit'].entries())tiles.push({input:await sharp(`qa/inspection/${name}-1440.png`).resize(360).toBuffer(),left:i*360,top:0});
 await sharp({create:{width:1800,height:250,channels:3,background:'#1c1b19'}}).composite(tiles).png().toFile('qa/desktop-comparison.png');
 console.log('Visual inspection screenshots and actual rendered font names captured.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
