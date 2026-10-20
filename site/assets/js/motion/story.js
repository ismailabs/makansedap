import {move,cancel} from './native.js';
import {watchScene} from './scroll.js';
export function init(){
  const image=document.querySelector('.story-poster figure img');
  move(image,[{transform:'translateY(30px) rotate(0deg)'},{transform:getComputedStyle(image).transform}],900);
  const cleanupScroll=watchScene('.story-fire',(gsap,ScrollTrigger,{desktop})=>{
    gsap.fromTo('.fire-lines',{y:desktop?100:35,rotation:-12},{y:-35,rotation:8,ease:'none',scrollTrigger:{id:'story-fire',trigger:'.story-fire',start:'top bottom',end:'bottom top',scrub:true}});
    gsap.fromTo('.fire-art>img:first-child',{scale:1.16,x:25},{scale:1,x:0,ease:'none',scrollTrigger:{trigger:'.story-fire',start:'top bottom',end:'bottom top',scrub:true}});
  });
  return()=>{cleanupScroll();cancel();};
}
