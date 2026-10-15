import {chromium} from 'playwright';
import lighthouse from 'lighthouse';
import {writeFile,mkdir} from 'node:fs/promises';
import {startServer} from './serve.mjs';
const server=await startServer(0);
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true,args:['--remote-debugging-port=9223']});
await mkdir('qa/lighthouse',{recursive:true});
const results=[];
try{
 for(const route of ['/','/menu/','/story/','/gallery/','/visit/']){
  const {lhr,report}=await lighthouse(base+route,{port:9223,output:'json',logLevel:'error',onlyCategories:['performance','accessibility','best-practices','seo']});
  const name=route==='/'?'home':route.replaceAll('/','');
  await writeFile(`qa/lighthouse/${name}.json`,report);
  const result={route,fetchTime:lhr.fetchTime,version:lhr.lighthouseVersion,userAgent:lhr.environment.hostUserAgent,mode:'Lighthouse default mobile simulated throttling, local HTTP',scores:Object.fromEntries(Object.entries(lhr.categories).map(([k,v])=>[k,Math.round(v.score*100)])),metrics:Object.fromEntries(['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index'].map(k=>[k,lhr.audits[k].numericValue])),failedAudits:Object.values(lhr.audits).filter(a=>a.score!==null&&a.score<1).map(a=>({id:a.id,title:a.title,score:a.score,displayValue:a.displayValue}))};
  results.push(result);console.log(JSON.stringify(result));
 }
}finally{await browser.close();await new Promise(r=>server.close(r));await writeFile('qa/lighthouse-summary.json',JSON.stringify(results,null,2)+'\n');}
