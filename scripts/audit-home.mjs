import {chromium} from 'playwright';
import lighthouse from 'lighthouse';
import {writeFile} from 'node:fs/promises';
import {startServer} from './serve.mjs';
// Three unchanged repetitions investigate the anomalous initial homepage blocking time.
const server=await startServer(0),base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({args:['--remote-debugging-port=9223']});
const runs=[];
try{
 for(let i=0;i<3;i++){
  const {lhr}=await lighthouse(base+'/',{port:9223,logLevel:'error',onlyCategories:['performance','accessibility','best-practices','seo']});
  const run={run:i+1,date:lhr.fetchTime,performance:lhr.categories.performance.score*100,lcp:lhr.audits['largest-contentful-paint'].numericValue,tbt:lhr.audits['total-blocking-time'].numericValue,cls:lhr.audits['cumulative-layout-shift'].numericValue,mainThread:lhr.audits['mainthread-work-breakdown'].details.items};
  runs.push(run);console.log(JSON.stringify(run));
 }
}finally{await browser.close();await new Promise(r=>server.close(r));await writeFile('qa/home-performance-variance.json',JSON.stringify({note:'Three unchanged sequential Lighthouse mobile runs, same settings as five-page audit; no score filtering',runs},null,2)+'\n');}
