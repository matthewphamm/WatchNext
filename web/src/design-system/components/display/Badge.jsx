import React from 'react';
import {Icon} from '../core/Icon.jsx';
const V={
  match:{bg:'var(--accent)',fg:'var(--text-on-accent)',bd:'transparent'},
  matchSubtle:{bg:'var(--accent-subtle)',fg:'var(--accent)',bd:'rgba(242,179,61,.35)'},
  neutral:{bg:'var(--surface-raised)',fg:'var(--text-primary)',bd:'var(--border-hairline)'},
  overlay:{bg:'rgba(11,15,26,.72)',fg:'var(--text-primary)',bd:'rgba(232,230,225,.14)'},
  success:{bg:'var(--success-subtle)',fg:'var(--success)',bd:'transparent'},
  error:{bg:'var(--error-subtle)',fg:'var(--error)',bd:'transparent'}
};
export function Badge({variant='neutral',icon,children,style}){
  const v=V[variant]||V.neutral;const mono=variant==='match'||variant==='matchSubtle';
  return <span style={{display:'inline-flex',alignItems:'center',gap:4,height:22,padding:'0 7px',borderRadius:'var(--radius-xs)',background:v.bg,color:v.fg,border:'1px solid '+v.bd,font:mono?'500 12px/1 var(--font-mono)':'600 11px/1 var(--font-body)',letterSpacing:mono?0:'.06em',textTransform:mono?'none':'uppercase',whiteSpace:'nowrap',backdropFilter:variant==='overlay'?'blur(6px)':undefined,...style}}>
    {icon&&<Icon name={icon} size={12} weight="fill"/>}{children}
  </span>;
}
