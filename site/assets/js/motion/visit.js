import {move,cancel} from './native.js';
export function init() {
  move(document.querySelector('.table-surface'),[{transform:'rotate(-20deg) scale(.85)'},{transform:'none'}],900);
  const update=()=>move(document.querySelector('.table-count'),[{transform:'scale(.9)'},{transform:'none'}],250);
  document.addEventListener('booking:change',update);
  return ()=>{document.removeEventListener('booking:change',update);cancel();};
}
