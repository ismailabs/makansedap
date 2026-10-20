import {readFile,writeFile} from 'node:fs/promises';
import {transform} from 'esbuild';
// Optional authoring utility, not a deployment build requirement.
// Keep the authored sources; ship one CSS request with their original cascade order.
const sources=['fonts.css','v3.css'];
const css=(await Promise.all(sources.map(n=>readFile('site/assets/css/'+n,'utf8')))).join('\n');
const output=await transform(css,{loader:'css',minify:true,target:['chrome100','safari16'],legalComments:'none'});
await writeFile('site/assets/css/site.css',output.code);
console.log('Prepared single stylesheet from font definitions and authored V3 CSS.');
