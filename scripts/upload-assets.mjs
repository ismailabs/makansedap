import {readFile} from 'node:fs/promises';import path from 'node:path';
if(process.stdin.isTTY)process.stdin.setRawMode(true);
console.log('Ready for upload session on stdin (input hidden).');
const session=await new Promise(resolve=>{let input='';const handler=chunk=>{input+=chunk;try{const v=JSON.parse(input.trim());process.stdin.off('data',handler);if(process.stdin.isTTY)process.stdin.setRawMode(false);process.stdin.pause();resolve(v);}catch{}};process.stdin.on('data',handler);});
const manifest=JSON.parse(await readFile('.tmp/asset-manifest.json','utf8'));
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'application/javascript','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.woff2':'font/woff2','.txt':'text/plain','.xml':'application/xml'};
let completion=session.jwt;
for(const [i,bucket] of session.buckets.entries()){
for(let attempt=1;attempt<=3;attempt++){
const boundary='----makansedap-'+Date.now();const parts=[];
for(const hash of bucket){const entry=Object.entries(manifest).find(([p,d])=>d.hash===hash);if(!entry)throw Error('Unknown hash');const [p]=entry;const b=await readFile('site'+p);parts.push(`--${boundary}\r\nContent-Disposition: form-data; name="${hash}"\r\nContent-Type: ${types[path.extname(p)]||'application/octet-stream'}\r\n\r\n${b.toString('base64')}\r\n`);}
parts.push(`--${boundary}--\r\n`);
const r=await fetch('https://api.cloudflare.com/client/v4/accounts/44214a829e2337ca50cf40e4cd827cba/workers/assets/upload?base64=true',{method:'POST',headers:{Authorization:`Bearer ${session.jwt}`,'Content-Type':`multipart/form-data; boundary=${boundary}`},body:parts.join('')});const data=await r.json();
if(!r.ok||!data.success){console.error(`Bucket ${i+1} attempt ${attempt}: HTTP ${r.status}`);if(r.status>=500&&attempt<3)continue;throw Error(JSON.stringify({status:r.status,errors:data.errors}));}
if(data.result?.jwt)completion=data.result.jwt;console.error(`Bucket ${i+1}/${session.buckets.length} uploaded`);break;
}}
console.log(JSON.stringify({jwt:completion}));
