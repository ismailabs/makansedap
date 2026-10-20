// Load the scroll engine only when its scene enters the viewport.
export function watchScene(selector,setup){
  const target=document.querySelector(selector);if(!target)return()=>{};
  let disposed=false,media,resume=[];
  const visibility=()=>{
    if(!media)return;
    const {gsap,ScrollTrigger}=media.engine;
    if(document.hidden){resume=gsap.globalTimeline.getChildren(false,true,true).filter(animation=>!animation.paused());resume.forEach(animation=>animation.pause());ScrollTrigger.disable(false);}
    else{ScrollTrigger.enable();resume.forEach(animation=>animation.resume());resume=[];}
  };
  const observer=new IntersectionObserver(entries=>{
    if(!entries.some(entry=>entry.isIntersecting))return;observer.disconnect();
    import('../vendor/gsap-3.15.0.js').then(({gsap,ScrollTrigger})=>{
      if(disposed)return;gsap.registerPlugin(ScrollTrigger);
      media=gsap.matchMedia();media.engine={gsap,ScrollTrigger};
      media.add({desktop:'(min-width:861px)',mobile:'(max-width:860px)',reduce:'(prefers-reduced-motion: reduce)'},context=>{
        if(context.conditions.reduce)return;return setup(gsap,ScrollTrigger,context.conditions);
      });
      document.fonts.ready.then(()=>{if(!disposed)ScrollTrigger.refresh();});
      document.addEventListener('visibilitychange',visibility);
      if(document.hidden)visibility();
      target.dataset.scrollReady='true';
    }).catch(()=>{target.dataset.scrollReady='fallback';});
  });observer.observe(target);
  return()=>{disposed=true;observer.disconnect();media?.revert();document.removeEventListener('visibilitychange',visibility);};
}
