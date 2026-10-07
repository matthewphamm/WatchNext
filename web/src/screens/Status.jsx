import React from 'react';
import {Button,Icon} from '../design-system/index.js';

export function ErrorState({message="Couldn't load picks.",onRetry}){
  return <div style={{padding:'64px 48px',textAlign:'center',color:'var(--text-secondary)'}}>
    <Icon name="warning-circle" size={32} color="var(--error)"/>
    <div style={{marginTop:12,font:'700 20px/1.2 var(--font-display)',color:'var(--text-primary)'}}>{message}</div>
    <div style={{marginTop:6,font:'400 15px/1.5 var(--font-body)'}}>Check that the WatchNext API is running, then try again.</div>
    <Button variant="secondary" iconLeft="arrow-clockwise" style={{marginTop:20}} onClick={onRetry}>Retry</Button>
  </div>;
}

export function PosterSkeleton({count=8,width=180}){
  return <div style={{display:'flex',gap:16,overflow:'hidden',padding:'6px 48px 10px'}}>
    {Array.from({length:count},(_,i)=><div key={i} style={{width,flex:'none'}}>
      <div style={{aspectRatio:'2/3',borderRadius:'var(--radius-poster)',background:'var(--surface-card)',border:'1px solid var(--border-hairline)'}}/>
      <div style={{marginTop:10,height:12,width:'70%',borderRadius:4,background:'var(--surface-card)'}}/>
    </div>)}
  </div>;
}
