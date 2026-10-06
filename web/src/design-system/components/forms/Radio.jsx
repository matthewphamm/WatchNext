import React from 'react';
export function Radio({checked,onChange,label,disabled,name,value,style}){
  const pick=()=>!disabled&&onChange&&onChange(value);
  return <label onClick={pick} style={{display:'inline-flex',alignItems:'center',gap:10,cursor:disabled?'not-allowed':'pointer',opacity:disabled?.4:1,font:'400 14px/1.3 var(--font-body)',color:'var(--text-primary)',...style}}>
    <span role="radio" aria-checked={!!checked} tabIndex={0} onKeyDown={e=>{if(e.key===' '){e.preventDefault();pick()}}}
      style={{width:18,height:18,flex:'none',display:'inline-flex',alignItems:'center',justifyContent:'center',borderRadius:'50%',border:'1px solid '+(checked?'var(--accent)':'var(--text-disabled)'),transition:'border-color var(--dur-fast)'}}>
      <span style={{width:8,height:8,borderRadius:'50%',background:'var(--accent)',transform:checked?'scale(1)':'scale(0)',transition:'transform var(--dur-fast) var(--ease-out)'}}/>
    </span>
    {label&&<span>{label}</span>}
  </label>;
}
