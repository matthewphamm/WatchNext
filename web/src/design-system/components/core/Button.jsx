import React,{useState} from 'react';
import {Icon} from './Icon.jsx';
const SIZES={s:{h:32,px:12,fs:13,ic:16,gap:6},m:{h:40,px:16,fs:14,ic:18,gap:8},l:{h:48,px:22,fs:15,ic:20,gap:10}};
export function Button({variant='primary',size='m',iconLeft,iconRight,disabled,fullWidth,children,style,...rest}){
  const [h,setH]=useState(false);const [p,setP]=useState(false);
  const hv=h&&!disabled;const s=SIZES[size]||SIZES.m;
  const v={
    primary:{bg:hv?'var(--accent-hover)':'var(--accent)',fg:'var(--text-on-accent)',bd:'transparent'},
    secondary:{bg:hv?'var(--surface-raised)':'var(--surface-card)',fg:'var(--text-primary)',bd:'var(--border-hairline)'},
    ghost:{bg:hv?'var(--surface-hover)':'transparent',fg:'var(--text-primary)',bd:'transparent'},
    danger:{bg:hv?'var(--error-subtle)':'transparent',fg:'var(--error)',bd:'var(--error)'}
  }[variant]||{};
  return <button disabled={disabled} onMouseEnter={()=>setH(true)} onMouseLeave={()=>{setH(false);setP(false)}} onMouseDown={()=>setP(true)} onMouseUp={()=>setP(false)} {...rest}
    style={{display:'inline-flex',alignItems:'center',justifyContent:'center',gap:s.gap,height:s.h,padding:'0 '+s.px+'px',width:fullWidth?'100%':undefined,border:'1px solid '+v.bd,borderRadius:'var(--radius-control)',background:v.bg,color:v.fg,font:'600 '+s.fs+'px/1 var(--font-body)',letterSpacing:'.01em',cursor:disabled?'not-allowed':'pointer',opacity:disabled?.4:1,transform:p&&!disabled?'scale(.97)':'none',transition:'background var(--dur-fast) var(--ease-out),transform var(--dur-fast) var(--ease-out)',whiteSpace:'nowrap',...style}}>
    {iconLeft&&<Icon name={iconLeft} size={s.ic} weight={variant==='primary'?'fill':'regular'}/>}{children}{iconRight&&<Icon name={iconRight} size={s.ic}/>}
  </button>;
}
