import { readFile, writeFile } from 'node:fs/promises';
const css = await readFile('scripts/font-source.css', 'utf8');
let output = '';
for (const match of css.matchAll(/\/\* latin \*\/\s*(@font-face\s*\{[^}]+\})/g)) {
  let rule = match[1];
  const family = rule.includes('Cormorant') ? 'cormorant' : 'dm-sans';
  const style = rule.includes('italic') ? 'italic' : 'normal';
  const url = rule.match(/url\(([^)]+)\)/)[1];
  const name = `${family}-${style}.woff2`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Font download ${response.status}`);
  await writeFile(`site/assets/fonts/${name}`, Buffer.from(await response.arrayBuffer()));
  output += rule.replace(url, `../fonts/${name}`) + '\n';
}
await writeFile('site/assets/css/fonts.css', output);
console.log('Three licensed Latin WOFF2 variable fonts saved locally.');
