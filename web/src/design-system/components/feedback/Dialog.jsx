import React from 'react';
import {IconButton} from '../core/IconButton.jsx';
export function Dialog({open,onClose,title,children,actions,width=480,inline,style}){
  if(!open) return null;
  const panel=<div role="dialog" aria-modal="true" style={{width,maxWidth:'100%',background:'var(--surface-card)',border:'1px solid var(--border-hairline)',borderRadius:'var(--radius-xl)',boxShadow:'var(--shadow-3)',overflow:'hidden',...style}} onClick={e=>e.stopPropagation()}>
    <div style={{display:'flex',alignItems:'flex-start',gap:12,padding:'20px 20px 0 24px'}}>
      <h2 style={{flex:1,margin:'6px 0 0',font:'700 22px/1.2 var(--font-display)',letterSpacing:'-0.01em',color:'var(--text-primary)'}}>{title}</h2>
      {onClose&&<IconButton icon="x" label="Close" size="s" onClick={onClose}/>}
    </div>
    <div style={{padding:'12px 24px 24px',font:'400 15px/1.5 var(--font-body)',color:'var(--text-secondary)'}}>{children}</div>
    {actions&&<div style={{display:'flex',justifyContent:'flex-end',gap:8,padding:'16px 24px',borderTop:'1px solid var(--border-hairline)',background:'rgba(11,15,26,.35)'}}>{actions}</div>}
  </div>;
  if(inline) return panel;
  return <div onClick={onClose} style={{position:'fixed',inset:0,zIndex:100,display:'flex',alignItems:'center',justifyContent:'center',padding:24,background:'var(--surface-overlay)',backdropFilter:'blur(6px)'}}>{panel}</div>;
}
