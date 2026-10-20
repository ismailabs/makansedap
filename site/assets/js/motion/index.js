// Scene failures leave every task, heading and real link usable.
const pages={'/':'home','/menu/':'menu','/story/':'story','/gallery/':'gallery','/visit/':'visit'};
const page=pages[document.body.dataset.page];
if(page){
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  let scene,native,cleanupScene,cleanupFinale,resume=[],disposed=false;
  const setup=()=>{
    cleanupScene?.();cleanupFinale?.();
    if(!reduce.matches&&scene){cleanupScene=scene.init();cleanupFinale=native.finale();}
  };
  const load=()=>{
    if(reduce.matches||disposed)return;
    if(scene){setup();return;}
    Promise.all([import(`./${page}.js`),import('./native.js')]).then(([pageScene,nativeMotion])=>{
      if(disposed)return;scene=pageScene;native=nativeMotion;setup();if(document.hidden)visibility();document.documentElement.dataset.motion='ready';
    }).catch(()=>{document.documentElement.dataset.motion='fallback';});
  };
  const afterPaint=()=>requestAnimationFrame(()=>requestAnimationFrame(load));
  const preference=()=>{if(reduce.matches)setup();else afterPaint();};
  reduce.addEventListener('change',preference);afterPaint();
  const visibility=()=>{
    if(document.hidden){resume=document.getAnimations().filter(animation=>animation.id==='makansedap-motion'&&animation.playState==='running');resume.forEach(animation=>animation.pause());}
    else{resume.forEach(animation=>animation.play());resume=[];}
  };
  document.addEventListener('visibilitychange',visibility);
  const teardown=event=>{
    if(event.persisted)return;disposed=true;cleanupScene?.();cleanupFinale?.();native?.cancel();
    reduce.removeEventListener('change',preference);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pagehide',teardown);
  };
  window.addEventListener('pagehide',teardown);
}
