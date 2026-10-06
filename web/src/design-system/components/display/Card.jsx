import React,{useState} from 'react';
export function Card({padding=20,interactive,raised,children,style,...rest}){
  const [h,setH]=useState(false);const hv=interactive&&h;
  return <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} {...rest}
    style={{background:raised||hv?'var(--surface-raised)':'var(--surface-card)',border:'1px solid var(--border-hairline)',borderRadius:'var(--radius-card)',padding,boxShadow:raised?'var(--shadow-2)':'none',cursor:interactive?'pointer':undefined,transition:'background var(--dur-fast) var(--ease-out)',...style}}>{children}</div>;
}
