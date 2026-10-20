import {chromium} from 'playwright';
import sharp from 'sharp';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {startServer} from './serve.mjs';
const root='qa/v3/reference-mockups';await mkdir(root,{recursive:true});
const server=await startServer(0,{root:'MakanSedap-V3-Codex-Handoff'});
const browser=await chromium.launch();
const receipt={at:new Date().toISOString(),browser:browser.version(),scope:'Provided reference HTML rendered in a browser. These are art-direction references, not the implementation or production.',captures:[]};
try{
 for(const width of [390,1440])for(const name of ['home','menu','story','gallery','visit']){
  const page=await browser.newPage({viewport:{width,height:900}});
  await page.goto(`http://127.0.0.1:${server.address().port}/mockups/${name}.html`,{waitUntil:'networkidle'});
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(image=>image.decode()));});
  const file=`${root}/${name}-${width}.webp`;
  await sharp(await page.screenshot({fullPage:true})).webp({quality:82}).toFile(file);
  receipt.captures.push({name,width,file,referenceHtmlSha256:createHash('sha256').update(await readFile(`MakanSedap-V3-Codex-Handoff/mockups/${name}.html`)).digest('hex')});
  await page.close();
 }
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));await writeFile(`${root}/receipt.json`,JSON.stringify(receipt,null,2)+'\n');}
console.log(`${receipt.captures.length} supplied reference mockups rendered; not production evidence.`);
