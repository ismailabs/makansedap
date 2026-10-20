import sharp from 'sharp';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
const root='qa/v3/comparisons';await mkdir(root,{recursive:true});
const receipt={at:new Date().toISOString(),scope:'Actual browser captures. V1 is historical evidence from source 656d42e (17 October 2026), V2 is the fresh pre-V3 capture, V3 is the current implementation. Reference mockup illustration boards are not used as production screenshots.',boards:[]};
for(const width of [390,1440])for(const name of ['home','menu','story','gallery','visit'])for(const mode of ['fold','full']){
 const paths=[`qa/screenshots/${name}-${width}.png`,`qa/v3/baseline/local-${name}-${width}.png`,`qa/v3/visual-final/${name}-${width}.webp`];
 const panelWidth=width===390?390:480;const panels=[];let maxHeight=0;
 for(const path of paths){let input=sharp(await readFile(path));const meta=await input.metadata();if(mode==='fold')input=input.extract({left:0,top:0,width:meta.width,height:Math.min(900,meta.height)});const bytes=await input.resize({width:panelWidth}).webp({quality:82}).toBuffer();const resized=await sharp(bytes).metadata();maxHeight=Math.max(maxHeight,resized.height);panels.push(bytes);}
 const labels=['V1 — historical 17 Oct','V2 — fresh baseline','V3 — actual implementation'];
 const header=Buffer.from(`<svg width="${panelWidth*3}" height="42">${labels.map((label,i)=>`<text x="${i*panelWidth+12}" y="27" font-family="Arial" font-size="15" fill="${i===2?'#f3b448':'#f6edda'}">${label}</text>`).join('')}</svg>`);
 const file=`${root}/${name}-${width}-${mode}-V1-V2-V3.webp`;
 await sharp({create:{width:panelWidth*3,height:maxHeight+42,channels:3,background:'#170f19'}}).composite([{input:header,left:0,top:0},...panels.map((input,i)=>({input,left:i*panelWidth,top:42}))]).webp({quality:84}).toFile(file);receipt.boards.push({file,width,mode,sources:paths});
}
await writeFile(`${root}/receipt.json`,JSON.stringify(receipt,null,2)+'\n');console.log(`${receipt.boards.length} labelled three-generation comparison boards.`);
