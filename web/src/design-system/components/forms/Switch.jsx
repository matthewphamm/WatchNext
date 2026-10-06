import React from 'react';
export function Switch({checked,onChange,label,disabled,style}){
  const t=()=>!disabled&&onChange&&onChange(!checked);
  return <label style={{display:'inline-flex',alignItems:'center',gap:10,cursor:disabled?'not-allowed':'pointer',opacity:disabled?.4:1,font:'400 14px/1.3 var(--font-body)',color:'var(--text-primary)',...style}}>
    <span role="switch" aria-checked={!!checked} tabIndex={0} onClick={t} onKeyDown={e=>{if(e.key===' '){e.preventDefault();t()}}}
      style={{position:'relative',width:36,height:20,flex:'none',borderRadius:999,background:checked?'var(--accent)':'var(--surface-raised)',border:'1px solid '+(checked?'var(--accent)':'var(--border-hairline)'),transition:'background var(--dur-base) var(--ease-out)'}}>
      <span style={{position:'absolute',top:2,left:checked?18:2,width:14,height:14,borderRadius:'50%',background:checked?'var(--text-on-accent)':'var(--text-secondary)',transition:'left var(--dur-base) var(--ease-out)'}}/>
    </span>
    {label&&<span onClick={t}>{label}</span>}
  </label>;
}
