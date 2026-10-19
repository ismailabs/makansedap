import {readFile,writeFile} from 'node:fs/promises';
// Optional authoring utility, not a deployment build requirement.
// Keep the authored sources; ship one CSS request with their original cascade order.
const sources=['fonts.css','v2.css'];
const css=(await Promise.all(sources.map(n=>readFile('site/assets/css/'+n,'utf8')))).join('\n');
await writeFile('site/assets/css/site.css',css.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s+/g,' ').trim()+'\n');
console.log('Prepared single stylesheet from font definitions and authored V2 CSS.');
