import {move,cancel} from './native.js';
export function init() {
  const stage = document.querySelector('.menu-stage img');
  // Functional staging is in main.js, including reduced-motion and module failure.
  const update = () => {
    const button = document.querySelector('[data-filter][aria-pressed="true"]');
    if (!button) return;
    move(stage,[{transform:'translateY(18px) scale(1.04)'},{transform:'none'}]);
  };
  document.addEventListener('menu:change',update);
  return () => {document.removeEventListener('menu:change',update);cancel();};
}
