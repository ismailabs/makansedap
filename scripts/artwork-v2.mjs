import {chromium} from 'playwright';
import {startServer} from './serve.mjs';
// Local browser typesetting of existing project imagery and licensed fonts.
const server=await startServer(0),base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
 await page.goto(base);
 await page.setContent(`<html lang="en"><head><meta charset="utf-8"><link rel="stylesheet" href="${base}/assets/css/fonts.css"><style>*{box-sizing:border-box}body{margin:0;background:#e8eddc;color:#302239;font-family:'DM Sans',sans-serif}.copy{padding:48px 55px;width:700px}.brand{font:600 43px 'Cormorant Garamond',serif;letter-spacing:-1px}h1{font-size:73px;font-weight:500;line-height:1.05;letter-spacing:-5px;margin:76px 0 27px}p{font-size:17px;max-width:32ch;line-height:1.6}.photo{position:absolute;top:45px;right:45px;width:430px;height:470px;object-fit:cover}.dish{position:absolute;right:330px;bottom:62px;width:210px;height:160px;object-fit:cover;border:8px solid #e8eddc;transform:rotate(-6deg)}.footer{position:absolute;bottom:35px;left:55px;font-size:13px}.tag{position:absolute;right:70px;bottom:55px;background:#f4d985;color:#302239;padding:12px 20px;font-size:14px}</style></head><body><div class="copy"><div class="brand">MakanSedap</div><h1>Good food.<br>Better company.</h1><p>Malaysian flavour, fire-led cooking, and a table to share.</p></div><img class="photo" src="${base}/assets/images/dining-room-960.webp" alt=""><img class="dish" src="${base}/assets/images/nasi-lemak-640.webp" alt=""><div class="tag">An imagined supper club</div><div class="footer">Fictional restaurant concept · Design &amp; development by ISMAIL Studio</div></body></html>`);
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));});
 await page.screenshot({path:'site/assets/images/social-preview.png'});
}finally{await browser.close();await new Promise(r=>server.close(r));}
console.log('V2 social preview generated from existing project assets.');
