import {move,cancel} from './native.js';
export function init() {
  // Keep the primary image settled for the first paint; the secondary plane carries the entrance.
  const images=[...document.querySelectorAll('.journal-lead img:last-child')].map(image=>({image,transform:getComputedStyle(image).transform}));
  images.forEach(({image,transform})=>move(image,[{transform:'translateY(30px) rotate(0deg)'},{transform}],850));
  // Filtering is functional immediately; decorate only the visible image field.
  const update=()=>document.querySelectorAll('.gallery-tile:not([hidden]) .gallery-frame').forEach(frame=>move(frame,[{transform:'translateY(10px)'},{transform:'none'}],300));
  const controls=document.querySelector('.gallery-filters');
  controls.addEventListener('click',update);
  return ()=>{controls.removeEventListener('click',update);cancel();};
}
