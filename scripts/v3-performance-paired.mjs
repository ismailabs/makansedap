import {chromium} from 'playwright';
import lighthouse from 'lighthouse';
import net from 'node:net';
import {mkdir,writeFile,readFile,access} from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {startServer} from './serve.mjs';
const root=process.env.QA_ROOT||'qa/v3/performance-paired';await mkdir(root+'/lighthouse',{recursive:true});
const baseSha='19e44f6c12dc4f5d4676ab9e4a0c76f70d8ea80a';
const baselineRoot=path.resolve('.tmp/v3-baseline-site');
let missingBaseline=false;try{await access(baselineRoot);}catch(error){if(error.code!=='ENOENT')throw error;missingBaseline=true;}
if(missingBaseline){
 const files=execFileSync('git',['ls-tree','-r','--name-only',baseSha,'site'],{encoding:'utf8'}).trim().split('\n');
 for(const file of files){const target=path.resolve(baselineRoot,file.slice('site/'.length));assert.ok(target.startsWith(baselineRoot+path.sep));await mkdir(path.dirname(target),{recursive:true});await writeFile(target,execFileSync('git',['show',`${baseSha}:${file}`],{maxBuffer:20*1024*1024}));}
}
for(const file of ['index.html','menu/index.html','story/index.html','gallery/index.html','visit/index.html','assets/css/site.css','assets/js/main.js']){
 const old=execFileSync('git',['show',`${baseSha}:site/${file}`],{encoding:'utf8'}).replaceAll('\r\n','\n');
 assert.equal((await readFile('.tmp/v3-baseline-site/'+file,'utf8')).replaceAll('\r\n','\n'),old,'Baseline copy differs: '+file);
}
const before=await startServer(0,{root:'.tmp/v3-baseline-site'}),after=await startServer(0);
const urls={before:`http://127.0.0.1:${before.address().port}`,after:`http://127.0.0.1:${after.address().port}`};
const probe=net.createServer();await new Promise(r=>probe.listen(0,'127.0.0.1',r));const port=probe.address().port;await new Promise(r=>probe.close(r));
const browser=await chromium.launch({headless:true,args:[`--remote-debugging-port=${port}`]});
const results=[];const receipt={at:new Date().toISOString(),browser:browser.version(),baseline:baseSha,mode:'Interleaved V2/V3 on the same host/browser, identical gzip HTTP server, default Lighthouse simulated mobile throttling. Order alternates each run. No other browser QA runs concurrently.',results};
try{
 for(let run=1;run<=3;run++)for(const route of ['/','/menu/','/gallery/'])for(const variant of run%2?['before','after']:['after','before']){
  const {lhr,report,artifacts}=await lighthouse(urls[variant]+route,{port,output:'json',logLevel:'error',maxWaitForLoad:45000,onlyCategories:['performance','accessibility','best-practices','seo']});
  const name=route==='/'?'home':route.replaceAll('/','');await writeFile(`${root}/lighthouse/${name}-${variant}-${run}.json`,report);
  if(run===1&&artifacts?.Trace)await writeFile(`${root}/lighthouse/${name}-${variant}-trace.json`,JSON.stringify(artifacts.Trace));
  const result={run,route,variant,fetchTime:lhr.fetchTime,scores:Object.fromEntries(Object.entries(lhr.categories).map(([key,value])=>[key,Math.round(value.score*100)])),metrics:Object.fromEntries(['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index'].map(key=>[key,lhr.audits[key].numericValue]))};results.push(result);console.log(JSON.stringify(result));
 }
 receipt.result='COMPLETE';
}catch(error){receipt.result='INCOMPLETE';receipt.error=error.message;throw error;}
finally{await browser.close();await new Promise(r=>before.close(r));await new Promise(r=>after.close(r));await writeFile(`${root}/results.json`,JSON.stringify(receipt,null,2)+'\n');}
