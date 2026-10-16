import {chromium} from 'playwright';
import sharp from 'sharp';
import {readFile,writeFile} from 'node:fs/promises';
import {startServer} from './serve.mjs';
const logo='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 110" role="img" aria-label="MakanSedap"><path d="M28 72C9 54 34 39 34 18c23 24 4 36 11 46 13-9 17-21 15-30 21 29 6 51-16 51" fill="none" stroke="#B99562" stroke-width="2.5" stroke-linecap="round"/><text x="91" y="52" font-family="Georgia,serif" font-size="36" fill="#F5EFE5" letter-spacing="4">MakanSedap</text><text x="94" y="78" font-family="Arial,sans-serif" font-size="9" letter-spacing="2.2" fill="#B99562">MALAYSIAN FUSION RESTAURANT</text></svg>';
await writeFile('site/assets/icons/logo.svg',logo+'\n');
for(const [file,size] of [['favicon-32.png',32],['apple-touch-icon.png',180]])await sharp('site/favicon.svg').resize(size,size).png().toFile('site/'+file);
const server=await startServer(0);const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
 const response=await page.goto(base);
 if(response.status()!==200)throw new Error(`Preview HTTP ${response.status()}`);
 await page.setContent(`<html><head><link rel="stylesheet" href="${base}/assets/css/fonts.css"><style>*{box-sizing:border-box}body{margin:0;background:#161411;color:#f5efe5;font-family:'DM Sans'}img{position:absolute;width:1200px;height:630px;object-fit:cover}main{position:relative;z-index:1;padding:55px 65px;height:630px;background:linear-gradient(90deg,#151411f5,#151411bb 45%,#15141111)}.brand{font:500 30px 'Cormorant Garamond';letter-spacing:0}.eyebrow{font-size:12px;letter-spacing:3px;color:#d9b883;margin-top:70px}h1{font:500 76px/1.02 'Cormorant Garamond';margin:20px 0}em{color:#e7cfa9}.footer{position:absolute;bottom:45px;font-size:13px;color:#d3c0a4;letter-spacing:1px}</style></head><body><img src="${base}/assets/images/hero-ribeye.webp"><main><div class="brand">MakanSedap</div><div class="eyebrow">KUALA LUMPUR · MALAYSIAN STEAKHOUSE</div><h1>Good Food.<br><em>Brings Us Closer.</em></h1><div class="footer">A FICTIONAL RESTAURANT CONCEPT · BY ISMAIL</div></main></body></html>`);
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});
 await page.screenshot({path:'site/assets/images/social-preview.png'});
 await page.setViewportSize({width:1440,height:1000});await page.goto(base);await page.evaluate(async()=>{await document.fonts.ready;await document.querySelector('.hero-photo img').decode();});await page.screenshot({path:'qa/home-first-desktop.png'});
 await page.setViewportSize({width:390,height:844});await page.goto(base);await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:'qa/home-first-mobile.png'});
}finally{await browser.close();await new Promise(r=>server.close(r));}
console.log('Logo, PNG icons, photographic social card, and first browser screenshots saved.');
