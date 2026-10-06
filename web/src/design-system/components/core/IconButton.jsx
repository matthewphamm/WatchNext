import React,{useState} from 'react';
import {Icon} from './Icon.jsx';
const SZ={s:32,m:40,l:48};
export function IconButton({icon,label,variant='ghost',size='m',active,round,disabled,style,...rest}){
  const [h,setH]=useState(false);const hv=h&&!disabled;const d=SZ[size]||40;
  const v={
    ghost:{bg:hv?'var(--surface-hover)':'transparent',fg:active?'var(--accent)':'var(--text-primary)',bd:'transparent'},
    surface:{bg:hv?'var(--surface-raised)':'var(--surface-card)',fg:active?'var(--accent)':'var(--text-primary)',bd:'var(--border-hairline)'},
    overlay:{bg:hv?'rgba(31,40,64,.9)':'rgba(11,15,26,.6)',fg:active?'var(--accent)':'var(--text-primary)',bd:'rgba(232,230,225,.16)'},
    primary:{bg:hv?'var(--accent-hover)':'var(--accent)',fg:'var(--text-on-accent)',bd:'transparent'}
  }[variant]||{};
  return <button aria-label={label} title={label} disabled={disabled} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} {...rest}
    style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:d,height:d,padding:0,border:'1px solid '+v.bd,borderRadius:round?'50%':'var(--radius-control)',background:v.bg,color:v.fg,cursor:disabled?'not-allowed':'pointer',opacity:disabled?.4:1,backdropFilter:variant==='overlay'?'blur(8px)':undefined,transition:'background var(--dur-fast) var(--ease-out),color var(--dur-fast)',flex:'none',...style}}>
    <Icon name={icon} size={Math.round(d*0.5)} weight={active?'fill':'regular'}/>
  </button>;
}
