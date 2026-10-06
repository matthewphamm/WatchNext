import React,{useState} from 'react';
import {Icon} from '../core/Icon.jsx';
export function Tag({selected,onClick,icon,onRemove,size='m',children,style}){
  const [h,setH]=useState(false);const hh=size==='s'?28:36;
  return <span role={onClick?'button':undefined} tabIndex={onClick?0:undefined} onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{display:'inline-flex',alignItems:'center',gap:6,height:hh,padding:size==='s'?'0 10px':'0 14px',borderRadius:'var(--radius-pill)',background:selected?'var(--accent-subtle)':h&&onClick?'var(--surface-raised)':'var(--surface-card)',border:'1px solid '+(selected?'var(--accent)':'var(--border-hairline)'),color:selected?'var(--accent)':'var(--text-primary)',font:'500 '+(size==='s'?13:14)+'px/1 var(--font-body)',cursor:onClick?'pointer':'default',userSelect:'none',whiteSpace:'nowrap',transition:'background var(--dur-fast),border-color var(--dur-fast),color var(--dur-fast)',...style}}>
    {selected&&!icon&&<Icon name="check" weight="bold" size={14}/>}{icon&&<Icon name={icon} size={16}/>}{children}
    {onRemove&&<span onClick={e=>{e.stopPropagation();onRemove()}} style={{display:'inline-flex',cursor:'pointer',color:'var(--text-secondary)'}}><Icon name="x" size={14}/></span>}
  </span>;
}
