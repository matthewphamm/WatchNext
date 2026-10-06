import React,{useState} from 'react';
import {Icon} from '../core/Icon.jsx';
export function StarRating({value=0,max=5,onChange,size=20,showValue,style}){
  const [hv,setHv]=useState(null);const shown=hv??value;const ro=!onChange;
  return <span style={{display:'inline-flex',alignItems:'center',gap:size>=20?4:2,...style}} onMouseLeave={()=>setHv(null)}>
    {Array.from({length:max},(_,i)=>{const n=i+1;const full=shown>=n;const half=!full&&shown>=n-0.5;
      return <span key={n} onMouseEnter={()=>!ro&&setHv(n)} onClick={()=>!ro&&onChange(n===value?0:n)} style={{position:'relative',display:'inline-flex',cursor:ro?'default':'pointer',transform:!ro&&hv===n?'scale(1.15)':'none',transition:'transform var(--dur-fast) var(--ease-out)'}}>
        <Icon name="star" weight={full?'fill':'regular'} size={size} color={full?'var(--accent)':'var(--text-disabled)'}/>
        {half&&<Icon name="star-half" weight="fill" size={size} color="var(--accent)" style={{position:'absolute',inset:0}}/>}
      </span>;})}
    {showValue&&<span style={{marginLeft:6,font:'500 '+Math.max(12,size*0.65)+'px/1 var(--font-mono)',color:'var(--text-secondary)'}}>{value?value.toFixed(1):'—'}</span>}
  </span>;
}
