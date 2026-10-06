import React from 'react';
export function Tabs({items=[],value,onChange,variant='underline',style}){
  const its=items.map(i=>typeof i==='string'?{value:i,label:i}:i);
  if(variant==='pill') return <div role="tablist" style={{display:'inline-flex',gap:2,padding:3,background:'var(--surface-card)',border:'1px solid var(--border-hairline)',borderRadius:'var(--radius-m)',...style}}>
    {its.map(i=>{const a=i.value===value;return <button key={i.value} role="tab" aria-selected={a} onClick={()=>onChange&&onChange(i.value)} style={{height:32,padding:'0 14px',border:0,borderRadius:'var(--radius-s)',background:a?'var(--surface-raised)':'transparent',color:a?'var(--text-primary)':'var(--text-secondary)',font:'600 13px/1 var(--font-body)',cursor:'pointer',transition:'background var(--dur-fast),color var(--dur-fast)'}}>{i.label}{i.count!=null&&<span style={{marginLeft:6,font:'500 11px/1 var(--font-mono)',color:'var(--text-secondary)'}}>{i.count}</span>}</button>;})}
  </div>;
  return <div role="tablist" style={{display:'flex',gap:28,borderBottom:'1px solid var(--border-hairline)',...style}}>
    {its.map(i=>{const a=i.value===value;return <button key={i.value} role="tab" aria-selected={a} onClick={()=>onChange&&onChange(i.value)} style={{position:'relative',height:44,padding:0,border:0,background:'transparent',color:a?'var(--text-primary)':'var(--text-secondary)',font:'600 15px/1 var(--font-body)',cursor:'pointer',transition:'color var(--dur-fast)'}}>{i.label}{i.count!=null&&<span style={{marginLeft:6,font:'500 12px/1 var(--font-mono)',color:'var(--text-secondary)'}}>{i.count}</span>}<span style={{position:'absolute',left:0,right:0,bottom:-1,height:2,borderRadius:2,background:'var(--accent)',transform:a?'scaleX(1)':'scaleX(0)',transition:'transform var(--dur-base) var(--ease-out)'}}/></button>;})}
  </div>;
}
