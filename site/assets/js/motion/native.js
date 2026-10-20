// Native feedback for routes that do not need the GSAP scroll engine.
const current=new WeakMap();
export function move(element,keyframes,duration=350){
  if(!element||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  current.get(element)?.cancel();
  const animation=element.animate(keyframes,{duration,easing:'cubic-bezier(.2,.7,.2,1)'});
  animation.id='makansedap-motion';current.set(element,animation);return animation;
}
export function cancel(root=document){root.getAnimations({subtree:true}).filter(animation=>animation.id==='makansedap-motion').forEach(animation=>animation.cancel());}
export function finale(){
  const target=document.querySelector('.studio-finale');
  if(!target)return()=>{};
  const observer=new IntersectionObserver(entries=>{
    if(!entries.some(entry=>entry.isIntersecting))return;
    const orbit=target.querySelector('.studio-orbit');
    move(orbit,[{transform:'rotate(-85deg) scale(.78)'},{transform:getComputedStyle(orbit).transform}],900);
    move(target.querySelector('.finale-plate'),[{opacity:1,transform:'rotate(10deg) scale(1.12)'},{opacity:0,transform:'rotate(-12deg) scale(.85)'}],900);
    move(target.querySelector('.craft-line'),[{transform:'translateX(35px)'},{transform:'translateX(0)'}],900);
    observer.disconnect();
  },{threshold:.15});observer.observe(target);
  return()=>{observer.disconnect();cancel(target);};
}
