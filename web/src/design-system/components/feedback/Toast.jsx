import React from 'react';
import {Icon} from '../core/Icon.jsx';
const V={info:{ic:'info',c:'var(--text-primary)'},success:{ic:'check-circle',c:'var(--success)'},error:{ic:'warning-circle',c:'var(--error)'},rating:{ic:'star',c:'var(--accent)'}};
export function Toast({variant='info',children,action,onAction,onClose,style}){
  const v=V[variant]||V.info;
  return <div role="status" style={{display:'flex',alignItems:'center',gap:12,minHeight:48,padding:'10px 12px 10px 14px',background:'var(--surface-raised)',border:'1px solid var(--border-hairline)',borderRadius:'var(--radius-m)',boxShadow:'var(--shadow-2)',font:'500 14px/1.35 var(--font-body)',color:'var(--text-primary)',maxWidth:420,...style}}>
    <Icon name={v.ic} weight="fill" size={18} color={v.c}/>
    <span style={{flex:1}}>{children}</span>
    {action&&<button onClick={onAction} style={{border:0,background:'transparent',padding:'4px 6px',color:'var(--accent)',font:'600 13px/1 var(--font-body)',cursor:'pointer'}}>{action}</button>}
    {onClose&&<button aria-label="Dismiss" onClick={onClose} style={{display:'flex',border:0,background:'transparent',padding:4,color:'var(--text-secondary)',cursor:'pointer'}}><Icon name="x" size={16}/></button>}
  </div>;
}
