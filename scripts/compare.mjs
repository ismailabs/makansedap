import sharp from 'sharp';import {mkdir} from 'node:fs/promises';
await mkdir('qa/comparisons',{recursive:true});
const panels={home:{left:10,top:8,width:789,height:554},menu:{left:1057,top:10,width:468,height:550},story:{left:10,top:574,width:488,height:441},gallery:{left:509,top:574,width:495,height:441},visit:{left:1015,top:574,width:511,height:441}};
for(const [page,rect]of Object.entries(panels)){
 const parts=[];
 for(const [i,src]of [`qa/baseline/${page}-1440.png`,`qa/screenshots/${page}-1440.png`,`qa/screenshots/${page}-390.png`].entries()){
 const meta=await sharp(src).metadata();const b=await sharp(src).extract({left:0,top:0,width:meta.width,height:Math.min(meta.height,i===2?844:1000)}).resize({width:i===2?240:570,height:430,fit:'contain',background:'#25251f'}).png().toBuffer();parts.push({input:b,left:[0,580,1160][i],top:40});}
 const board=await sharp('MakanSedap-Codex-Handoff/assets/concept-board.png').extract(rect).resize({width:570,height:430,fit:'contain',background:'#25251f'}).png().toBuffer();parts.push({input:board,left:0,top:500});
 const mobile=await sharp(`qa/baseline/${page}-390.png`).extract({left:0,top:0,width:390,height:844}).resize({width:240,height:430,fit:'contain',background:'#25251f'}).png().toBuffer();parts.push({input:mobile,left:580,top:500});
 const label=Buffer.from('<svg width="1410" height="960"><style>text{fill:#f7efdf;font:18px Arial}</style><text x="15" y="27">ORIGINAL DESKTOP</text><text x="595" y="27">MAKANSEDAP DESKTOP</text><text x="1170" y="27">MOBILE</text><text x="15" y="490">CONCEPT BOARD (visual inspiration)</text><text x="595" y="490">ORIGINAL MOBILE</text></svg>');
 await sharp({create:{width:1410,height:960,channels:3,background:'#25251f'}}).composite([...parts,{input:label,left:0,top:0}]).jpeg({quality:86}).toFile(`qa/comparisons/${page}.jpg`);
}
console.log('Five comparison boards saved.');
