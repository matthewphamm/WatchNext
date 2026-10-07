import React,{useState} from 'react';
import {Button,Badge,Card,Tabs,Tooltip} from '../design-system/index.js';
import {api,useApi,trailerUrl} from '../api.js';
import {PosterRow} from './PosterRow.jsx';
import {ErrorState,PosterSkeleton} from './Status.jsx';

const TABS={'For you':'for_you','Popular':'popular','Newest':'newest'};

function Hero({m,ctx}){
  const n=Object.keys(ctx.ratings).length;const saved=ctx.saved.has(m.id);
  return <section style={{position:'relative',height:460,margin:'0',overflow:'hidden',borderBottom:'1px solid var(--border-hairline)',background:'var(--surface-card)'}}>
    <div style={{position:'absolute',right:48,top:40,font:'500 11px/1 var(--font-mono)',color:'var(--text-disabled)'}}>backdrop image · 16:9</div>
    <div style={{position:'absolute',inset:0,background:'var(--hero-protection)'}}></div>
    <div style={{position:'relative',height:'100%',display:'flex',flexDirection:'column',justifyContent:'flex-end',padding:'0 48px 48px',maxWidth:720}}>
      <div style={{font:'600 11px/1 var(--font-body)',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--accent)'}}>Your top match tonight</div>
      <h1 style={{margin:'12px 0 0',font:'800 64px/1.05 var(--font-display)',letterSpacing:'-0.02em'}}>{m.title}</h1>
      <div style={{display:'flex',alignItems:'center',gap:10,marginTop:14,font:'500 13px/1 var(--font-body)',color:'var(--text-secondary)'}}>
        <Tooltip content={n?'Based on '+n+' of your ratings':'Rate movies to personalize this score'}><Badge variant="match">{m.match}% match</Badge></Tooltip>
        {m.year&&<><span>{m.year}</span><span>·</span></>}<span>{m.genres.join(', ')}</span>
      </div>
      {m.tags.length>0&&<p style={{margin:'16px 0 0',font:'400 17px/1.5 var(--font-body)',color:'var(--text-primary)',maxWidth:520}}>Viewers call it {m.tags.slice(0,4).join(', ')}.</p>}
      <div style={{display:'flex',gap:10,marginTop:24}}>
        <Button size="l" iconLeft="play" onClick={()=>window.open(trailerUrl(m),'_blank','noopener')}>Watch trailer</Button>
        <Button size="l" variant="secondary" iconLeft={saved?'check':'plus'} onClick={()=>ctx.toggleSave(m.id)}>{saved?'On watchlist':'Watchlist'}</Button>
        <Button size="l" variant="ghost" iconLeft="info" onClick={()=>ctx.open(m.id)}>Details</Button>
      </div>
    </div>
  </section>;
}

export function HomeScreen({ctx}){
  const [tab,setTab]=useState('For you');
  const {data,error,retry}=useApi(()=>api.home(ctx),[ctx.ratings,ctx.dismissed]);
  const n=Object.keys(ctx.ratings).length;
  if(error&&!data) return <ErrorState onRetry={retry}/>;
  return <div>
    {data?.hero?<Hero m={data.hero} ctx={ctx}/>:<section style={{height:460,background:'var(--surface-card)',borderBottom:'1px solid var(--border-hairline)'}}/>}
    {n<5&&<div style={{padding:'24px 48px 0'}}><Card style={{display:'flex',alignItems:'center',gap:16}}>
      <div style={{flex:1}}>
        <div style={{font:'700 18px/1.2 var(--font-display)'}}>Rate 5 movies you've seen</div>
        <div style={{marginTop:4,font:'400 14px/1.4 var(--font-body)',color:'var(--text-secondary)'}}>Your picks get sharper with every rating. {n?n+' down, '+(5-n)+' to go.':''}</div>
      </div>
      <Button variant="secondary" iconRight="arrow-right" onClick={()=>ctx.go('rate')}>Rate movies</Button>
    </Card></div>}
    <div style={{padding:'24px 48px 0'}}><Tabs value={tab} onChange={setTab} items={Object.keys(TABS)}/></div>
    {data?data.rows[TABS[tab]].map(r=><PosterRow key={r.title} eyebrow={r.eyebrow} title={r.title} movies={r.movies} ctx={ctx}/>)
      :<div style={{marginTop:40}}><PosterSkeleton/></div>}
    <div style={{height:64}}></div>
  </div>;
}
