import React,{useState} from 'react';
import {Icon} from '../core/Icon.jsx';
export function Input({label,helper,error,iconLeft,size='m',disabled,style,inputStyle,...rest}){
  const [f,setF]=useState(false);const h={s:32,m:40,l:48}[size]||40;
  const bd=error?'var(--error)':f?'var(--accent)':'var(--border-hairline)';
  return <label style={{display:'flex',flexDirection:'column',gap:6,opacity:disabled?.5:1,...style}}>
    {label&&<span style={{font:'500 13px/1 var(--font-body)',color:'var(--text-secondary)'}}>{label}</span>}
    <span style={{display:'flex',alignItems:'center',gap:8,height:h,padding:'0 12px',background:'var(--surface-input)',border:'1px solid '+bd,borderRadius:'var(--radius-control)',boxShadow:f?'0 0 0 3px var(--accent-subtle)':'none',transition:'border-color var(--dur-fast),box-shadow var(--dur-fast)'}}>
      {iconLeft&&<Icon name={iconLeft} size={18} color="var(--text-secondary)"/>}
      <input disabled={disabled} onFocus={()=>setF(true)} onBlur={()=>setF(false)} {...rest} style={{flex:1,minWidth:0,height:'100%',background:'transparent',border:0,outline:'none',boxShadow:'none',color:'var(--text-primary)',font:'400 15px/1 var(--font-body)',...inputStyle}}/>
    </span>
    {(error||helper)&&<span style={{font:'400 12px/1.4 var(--font-body)',color:error?'var(--error)':'var(--text-secondary)'}}>{error||helper}</span>}
  </label>;
}
