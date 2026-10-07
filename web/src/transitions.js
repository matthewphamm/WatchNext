import {flushSync} from 'react-dom';

const reducedMotion=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Apply a screen change inside a View Transition so the page crossfades and any element
 * with a matching view-transition-name morphs between screens. Falls back to an instant
 * update where the API isn't supported or the visitor prefers reduced motion.
 * `shared` is an element from the old screen to morph (e.g. the clicked poster).
 */
export function navigate(update,shared){
  if(!document.startViewTransition||reducedMotion()){update();return;}
  if(shared){
    // Names must be unique: release the current detail poster's name before claiming it.
    document.querySelectorAll('[data-vt-poster]').forEach(el=>{el.style.viewTransitionName='none';});
    shared.style.viewTransitionName='wn-poster';
  }
  const transition=document.startViewTransition(()=>flushSync(update));
  transition.finished.finally(()=>{if(shared) shared.style.viewTransitionName='';});
}
