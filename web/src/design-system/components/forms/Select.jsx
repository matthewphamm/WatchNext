import React,{useState} from 'react';
import {Icon} from '../core/Icon.jsx';
export function Select({label,options=[],value,onChange,size='m',disabled,style,...rest}){
  const [f,setF]=useState(false);const h={s:32,m:40,l:48}[size]||40;
  return <label style={{display:'flex',flexDirection:'column',gap:6,opacity:disabled?.5:1,...style}}>
    {label&&<span style={{font:'500 13px/1 var(--font-body)',color:'var(--text-secondary)'}}>{label}</span>}
    <span style={{position:'relative',display:'flex',alignItems:'center'}}>
      <select value={value} disabled={disabled} onChange={e=>onChange&&onChange(e.target.value)} onFocus={()=>setF(true)} onBlur={()=>setF(false)} {...rest}
        style={{appearance:'none',WebkitAppearance:'none',width:'100%',height:h,padding:'0 36px 0 12px',background:'var(--surface-input)',border:'1px solid '+(f?'var(--accent)':'var(--border-hairline)'),borderRadius:'var(--radius-control)',color:'var(--text-primary)',font:'500 14px/1 var(--font-body)',outline:'none',cursor:'pointer'}}>
        {options.map(o=>{const op=typeof o==='string'?{value:o,label:o}:o;return <option key={op.value} value={op.value}>{op.label}</option>;})}
      </select>
      <Icon name="caret-down" size={16} color="var(--text-secondary)" style={{position:'absolute',right:12,pointerEvents:'none'}}/>
    </span>
  </label>;
}
