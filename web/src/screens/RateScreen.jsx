import React,{useState} from 'react';
import {Button,Tag,StarRating,MovieCard} from '../design-system/index.js';
import {api,useApi,GENRES} from '../api.js';
import {ErrorState} from './Status.jsx';

export function RateScreen({ctx}){
  const [g,setG]=useState(new Set());
  const {data,error,retry}=useApi(()=>api.onboarding([...g]),[g]);
  const n=Object.keys(ctx.ratings).length;const goal=5;
  return <div style={{maxWidth:1200,margin:'0 auto',padding:'48px 48px 80px'}}>
    <div style={{display:'flex',alignItems:'flex-end',gap:24}}>
      <div style={{flex:1}}>
        <div style={{font:'600 11px/1 var(--font-body)',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--accent)'}}>Tune your picks</div>
        <h1 style={{margin:'12px 0 0',font:'800 48px/1.05 var(--font-display)',letterSpacing:'-0.02em'}}>Rate a few movies you've seen</h1>
        <p style={{margin:'12px 0 0',font:'400 17px/1.5 var(--font-body)',color:'var(--text-secondary)'}}>Skip anything you haven't watched. Every rating makes the next pick better.</p>
      </div>
      <div style={{width:220}}>
        <div style={{display:'flex',justifyContent:'space-between',font:'500 12px/1 var(--font-mono)',color:'var(--text-secondary)'}}><span>{Math.min(n,goal)} / {goal} rated</span>{n>=goal&&<span style={{color:'var(--success)'}}>Unlocked</span>}</div>
        <div style={{marginTop:8,height:4,borderRadius:4,background:'var(--surface-raised)'}}><div style={{height:4,borderRadius:4,width:Math.min(100,n/goal*100)+'%',background:'var(--accent)',transition:'width var(--dur-slow) var(--ease-out)'}}></div></div>
        <Button fullWidth size="l" disabled={n<goal} iconRight="arrow-right" style={{marginTop:14}} onClick={()=>ctx.go('home')}>See my picks</Button>
      </div>
    </div>
    <div style={{display:'flex',gap:8,marginTop:32,flexWrap:'wrap'}}>{GENRES.map(x=><Tag key={x} selected={g.has(x)} onClick={()=>setG(s=>{const t=new Set(s);t.has(x)?t.delete(x):t.add(x);return t;})}>{x}</Tag>)}</div>
    {error&&!data?<ErrorState message="Couldn't load movies to rate." onRetry={retry}/>
      :<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:'28px 16px',marginTop:28,opacity:data?1:.4}}>
      {(data||[]).map(m=><div key={m.id}><MovieCard width="100%" title={m.title} year={m.year} meta={m.genres[0]}/>
        <div style={{marginTop:8}}><StarRating value={ctx.ratings[m.id]||0} onChange={v=>ctx.rate(m,v,true)} size={20}/></div></div>)}
    </div>}
  </div>;
}
