import assert from 'node:assert/strict';import redirect from './redirect-worker.mjs';import site from './worker.mjs';
for(const path of ['/','/menu/','/story/?source=old&tag=a%20b','/assets/images/hero-ribeye.webp']){
 const r=await redirect.fetch(new Request('https://rasairon.ismailstudio.my'+path));assert.equal(r.status,301);assert.equal(r.headers.get('location'),'https://makansedap.ismailstudio.my'+path);
}
assert.equal((await redirect.fetch(new Request('https://other.ismailstudio.my/'))).status,404);
const upstream=new Response('<h1>Asset</h1>',{headers:{'Content-Type':'text/html','X-Robots-Tag':'noindex'}});let forwarded;
const r=await site.fetch(new Request('https://makansedap.ismailstudio.my/menu/'),{RELEASE_COMMIT:'verified-test',ASSETS:{fetch:async req=>{forwarded=req.url;return upstream;}}});
assert.equal(forwarded,'https://makansedap.ismailstudio.my/menu/');assert.equal(await r.text(),'<h1>Asset</h1>');assert.equal(r.headers.get('x-robots-tag'),null);assert.equal(r.headers.get('x-release-commit'),'verified-test');assert.match(r.headers.get('content-security-policy'),/form-action 'none'/);console.log('Worker headers, asset passthrough and exact-host path/query redirect tests passed.');
