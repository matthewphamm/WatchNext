import React from 'react';
import {Icon} from '../core/Icon.jsx';
export function Checkbox({checked,onChange,label,disabled,style}){
  return <label style={{display:'inline-flex',alignItems:'center',gap:10,cursor:disabled?'not-allowed':'pointer',opacity:disabled?.4:1,font:'400 14px/1.3 var(--font-body)',color:'var(--text-primary)',...style}}>
    <span role="checkbox" aria-checked={!!checked} tabIndex={0} onClick={()=>!disabled&&onChange&&onChange(!checked)} onKeyDown={e=>{if(e.key===' '){e.preventDefault();!disabled&&onChange&&onChange(!checked)}}}
      style={{width:18,height:18,flex:'none',display:'inline-flex',alignItems:'center',justifyContent:'center',borderRadius:'var(--radius-xs)',border:'1px solid '+(checked?'var(--accent)':'var(--text-disabled)'),background:checked?'var(--accent)':'transparent',color:'var(--text-on-accent)',transition:'background var(--dur-fast),border-color var(--dur-fast)'}}>
      {checked&&<Icon name="check" weight="bold" size={12}/>}
    </span>
    {label&&<span onClick={()=>!disabled&&onChange&&onChange(!checked)}>{label}</span>}
  </label>;
}
