import React,{useState} from 'react';
import {Button,Badge,Tabs,Tooltip} from '../design-system/index.js';
import {MOVIES,BY_ID} from '../data.js';
import {PosterRow} from './PosterRow.jsx';

function Hero({m,ctx}){
  return <section style={{position:'relative',height:460,margin:'0',overflow:'hidden',borderBottom:'1px solid var(--border-hairline)',background:'var(--surface-card)'}}>
    <div style={{position:'absolute',right:48,top:40,font:'500 11px/1 var(--font-mono)',color:'var(--text-disabled)'}}>backdrop image · 16:9</div>
    <div style={{position:'absolute',inset:0,background:'var(--hero-protection)'}}></div>
    <div style={{position:'relative',height:'100%',display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:'0 48px 48px',maxWidth:640}}>
      <div style={{font:'600 11px/1 var(--font-body)',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--accent)'}}>Your top match tonight</div>
      <h1 style={{margin:'12px 0 0',font:'800 64px/1.05 var(--font-display)',letterSpacing:'-0.02em'}}>{m.title}</h1>
      <div style={{display:'flex',alignItems:'center',gap:10,marginTop:14,font:'500 13px/1 var(--font-body)',color:'var(--text-secondary)'}}>
        <Tooltip content="Based on 42 of your ratings"><Badge variant="match">{m.match}% match</Badge></Tooltip>
        <span>{m.year}</span><span>·</span><span>{m.cert}</span><span>·</span><span>{m.runtime}</span><span>·</span><span>{m.genre}</span>
      </div>
      <p style={{margin:'16px 0 0',font:'400 17px/1.5 var(--font-body)',color:'var(--text-primary)',maxWidth:520}}>{m.overview}</p>
      <div style={{display:'flex',gap:10,marginTop:24}}>
        <Button size="l" iconLeft="play">Watch trailer</Button>
        <Button size="l" variant="secondary" iconLeft={ctx.saved.has(m.id)?'check':'plus'} onClick={()=>ctx.toggleSave(m.id)}>{ctx.saved.has(m.id)?'On watchlist':'Watchlist'}</Button>
        <Button size="l" variant="ghost" iconLeft="info" onClick={()=>ctx.open(m.id)}>Details</Button>
      </div>
    </div>
  </section>;
}

export function HomeScreen({ctx}){
  const [tab,setTab]=useState('For you');
  const sorted=[...MOVIES].sort((a,b)=>b.match-a.match);
  const rows={
    'For you':[{eyebrow:'Because you loved Arrival',title:'Cerebral sci-fi',ids:['bladerunner','exmachina','annihilation','interstellar','her','dune2','arrival']},{title:'Top matches for you',ids:sorted.slice(0,8).map(m=>m.id)},{eyebrow:'Quiet and devastating',title:'Small dramas you will think about for days',ids:['aftersun','pastlives','moonlight','whiplash','her']}],
    'Trending':[{title:'Trending this week',ids:['dune2','everything','parasite','pastlives','whiplash','interstellar','prisoners']},{title:'Popular with people like you',ids:['sicario','prisoners','annihilation','grandbudapest','aftersun']}],
    'New releases':[{title:'New this month',ids:['dune2','pastlives','aftersun','everything']}]
  }[tab];
  return <div>
    <Hero m={BY_ID.dune2} ctx={ctx}/>
    <div style={{padding:'24px 48px 0'}}><Tabs value={tab} onChange={setTab} items={['For you','Trending','New releases']}/></div>
    {rows.map(r=><PosterRow key={r.title} eyebrow={r.eyebrow} title={r.title} movies={r.ids.map(i=>BY_ID[i])} ctx={ctx}/>)}
    <div style={{height:64}}></div>
  </div>;
}
