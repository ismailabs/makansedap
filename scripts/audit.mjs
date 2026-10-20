const evidenceRoot=process.env.QA_ROOT||'qa/v3/local';
import {chromium} from 'playwright';
import lighthouse from 'lighthouse';
import {writeFile,mkdir} from 'node:fs/promises';
import {startServer} from './serve.mjs';
import net from 'node:net';
// Reserve a fresh port: a stale external CDP listener must not receive this audit.
const probe=net.createServer();await new Promise(r=>probe.listen(0,'127.0.0.1',r));const debugPort=probe.address().port;await new Promise(r=>probe.close(r));
const server=await startServer(0);
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true,args:[`--remote-debugging-port=${debugPort}`]});
await mkdir(`${evidenceRoot}/lighthouse`,{recursive:true});
const results=[];
try{
 for(let run=1;run<=Number(process.env.AUDIT_RUNS||1);run++)for(const route of [...(process.env.AUDIT_ROUTES?process.env.AUDIT_ROUTES.split(','):['/','/menu/','/story/','/gallery/','/visit/']),...(run===1&&process.env.AUDIT_EXTRA_ROUTES?process.env.AUDIT_EXTRA_ROUTES.split(','):[])]){
  const {lhr,report,artifacts}=await lighthouse(base+route,{port:debugPort,output:'json',logLevel:'error',maxWaitForLoad:45000,onlyCategories:['performance','accessibility','best-practices','seo']});
  const name=route==='/'?'home':route.replaceAll('/','');
  await writeFile(`${evidenceRoot}/lighthouse/${name}-${run}.json`,report);
  if(run===1&&artifacts?.Trace)await writeFile(`${evidenceRoot}/lighthouse/${name}-trace.json`,JSON.stringify(artifacts.Trace));
  const result={route,fetchTime:lhr.fetchTime,version:lhr.lighthouseVersion,userAgent:lhr.environment.hostUserAgent,mode:'Lighthouse default mobile simulated throttling, local HTTP',scores:Object.fromEntries(Object.entries(lhr.categories).map(([k,v])=>[k,Math.round(v.score*100)])),metrics:Object.fromEntries(['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index'].map(k=>[k,lhr.audits[k].numericValue])),failedAudits:Object.values(lhr.audits).filter(a=>a.score!==null&&a.score<1).map(a=>({id:a.id,title:a.title,score:a.score,displayValue:a.displayValue}))};
  result.run=run;results.push(result);console.log(JSON.stringify({run,route,scores:result.scores,metrics:result.metrics}));
 }
}finally{await browser.close();await new Promise(r=>server.close(r));await writeFile(`${evidenceRoot}/lighthouse-summary.json`,JSON.stringify(results,null,2)+'\n');}
