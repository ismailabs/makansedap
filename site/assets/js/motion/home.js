import {move,cancel} from './native.js';
import {watchScene} from './scroll.js';
export function init(){
  const desktop=matchMedia('(min-width:861px)').matches;
  const opening=[];
  // Keep the mobile LCP plate still. Two smaller planes carry the same arrival
  // without delaying the focal image or forcing a synchronous layout read.
  const parts=(desktop?[
    ['.hero-plate','translate(75px,20px) rotate(19deg)','rotate(9deg)',600],
    ['.hero-aromatics','translate(-25px,-40px) rotate(-8deg)','rotate(25deg)',850]
  ]:[
    ['.hero-aromatics','translate(-12px,-16px) rotate(15deg)','rotate(25deg)',500],
    ['.hero-side','translate(-12px,12px) rotate(-26deg)','rotate(-18deg)',350]
  ]).map(([selector,from,to,duration])=>({element:document.querySelector(selector),from,to,duration}));
  for(const {element,from,to,duration} of parts)opening.push(move(element,[{transform:from},{transform:to}],duration));
  const settle=()=>opening.forEach(animation=>{if(animation?.playState==='running')animation.finish();});
  window.addEventListener('wheel',settle,{once:true,passive:true});
  window.addEventListener('touchstart',settle,{once:true,passive:true});
  const cleanupScroll=watchScene('.transform-art',(gsap,ScrollTrigger,{desktop})=>{
    const gather=gsap.timeline({scrollTrigger:{id:'home-gather',trigger:'.transform-art',start:'top 95%',end:'bottom 25%',scrub:true},defaults:{ease:'none'}});
    gather.fromTo('.gather-aromatics',{x:desktop?-65:-20,y:-25,rotation:-26},{x:10,y:35,rotation:5},0)
      .fromTo('.gather-plate',{x:desktop?60:20,y:70,scale:.8,rotation:25},{x:0,y:0,scale:1,rotation:5},0)
      .fromTo('.gather-orbit',{rotation:-40,scale:.85},{rotation:40,scale:1},0);
  });
  return()=>{cleanupScroll();window.removeEventListener('wheel',settle);window.removeEventListener('touchstart',settle);cancel();};
}
