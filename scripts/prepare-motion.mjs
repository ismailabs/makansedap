import {build} from 'esbuild';
import {mkdir,writeFile} from 'node:fs/promises';
await mkdir('site/assets/js/vendor',{recursive:true});
await build({stdin:{contents:"export { gsap } from 'gsap'; export { ScrollTrigger } from 'gsap/ScrollTrigger';",resolveDir:process.cwd()},bundle:true,format:'esm',minify:true,legalComments:'inline',outfile:'site/assets/js/vendor/gsap-3.15.0.js',target:['es2022']});
await writeFile('site/assets/js/vendor/GSAP-LICENSE.txt',`GSAP 3.15.0 and ScrollTrigger\nCopyright 2008-2026 GreenSock / Webflow. All rights reserved.\nStandard No Charge License: https://gsap.com/standard-license\nVerified 20 October 2026: permitted use on websites, web applications and digital interfaces.\nNot licensed for competing visual no-code animation builders. Original notices retained in bundle.\nThe npm package does not ship a standalone LICENSE file; this notice links to its declared license.\n`);
console.log('Bundled pinned GSAP 3.15.0 + ScrollTrigger, with license, for same-origin CSP.');
