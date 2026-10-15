import sharp from 'sharp';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
// Optional authoring tool: node scripts/optimize-images.mjs path/to/source-manifest.json
// Manifest entries: {name, path}. Source PNGs need not ship with the static site.
const sources=JSON.parse(await readFile(process.argv[2],'utf8'));
const records=[];
for(const {name,path} of sources){
 for(const width of [640,960,1536]){
  const file=`site/assets/images/${name}${width===1536?'':`-${width}`}.webp`;
  const info=await sharp(path).resize(width).webp({quality:width===1536?80:72,effort:6}).toFile(file);
  records.push({file,width:info.width,height:info.height,bytes:info.size});
 }
}
await writeFile('docs/image-manifest.json',JSON.stringify(records,null,2)+'\n');
await mkdir('qa',{recursive:true});
const tiles=await Promise.all(sources.map(async({name},i)=>{
 const label=Buffer.from(`<svg width="300" height="32"><rect width="300" height="32" fill="#181612"/><text x="10" y="22" fill="#f5efe5" font-size="15">${name}</text></svg>`);
 const tile=await sharp(`site/assets/images/${name}-640.webp`).resize(300,200).extend({bottom:32,background:'#181612'}).composite([{input:label,top:200,left:0}]).toBuffer();
 return {input:tile,left:(i%3)*300,top:Math.floor(i/3)*232};
}));
await sharp({create:{width:900,height:Math.ceil(sources.length/3)*232,channels:3,background:'#181612'}}).composite(tiles).jpeg({quality:85}).toFile('qa/asset-contact-sheet.jpg');
console.log(`${sources.length} original images, ${records.length} responsive variants, ${records.reduce((n,r)=>n+r.bytes,0)} bytes total.`);
