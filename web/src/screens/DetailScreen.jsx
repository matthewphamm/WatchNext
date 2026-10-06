import React from 'react';
import {Button,IconButton,Icon,Card,Badge,StarRating,MovieCard} from '../design-system/index.js';
import {MOVIES,BY_ID} from '../data.js';
import {PosterRow} from './PosterRow.jsx';

export function DetailScreen({id,ctx}){
  const m=BY_ID[id];const r=ctx.ratings[id]||0;const saved=ctx.saved.has(id);
  const more=MOVIES.filter(x=>x.genre===m.genre&&x.id!==id).slice(0,6);
  return <div>
    <section style={{position:'relative',height:300,background:'var(--surface-card)',borderBottom:'1px solid var(--border-hairline)'}}>
      <div style={{position:'absolute',right:48,top:24,font:'500 11px/1 var(--font-mono)',color:'var(--text-disabled)'}}>backdrop image · 16:9</div>
      <div style={{position:'absolute',inset:0,background:'linear-gradient(0deg,#0B0F1A 0%,rgba(11,15,26,0) 80%)'}}></div>
      <div style={{position:'absolute',left:48,top:20}}><Button variant="ghost" size="s" iconLeft="caret-left" onClick={()=>ctx.go('home')}>Back</Button></div>
    </section>
    <div style={{display:'flex',gap:40,padding:'0 48px',marginTop:-160,position:'relative'}}>
      <MovieCard title={m.title} size="l" width={240} style={{pointerEvents:'none'}}/>
      <div style={{flex:1,paddingTop:110,maxWidth:720}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}><Badge variant="match">{m.match}% match</Badge>{saved&&<Badge variant="success" icon="check">On watchlist</Badge>}</div>
        <h1 style={{margin:'12px 0 0',font:'800 48px/1.05 var(--font-display)',letterSpacing:'-0.02em'}}>{m.title}</h1>
        <div style={{marginTop:10,font:'500 14px/1 var(--font-body)',color:'var(--text-secondary)'}}>{m.year} · {m.cert} · {m.runtime} · {m.genre}</div>
        <p style={{margin:'18px 0 0',font:'400 17px/1.5 var(--font-body)'}}>{m.overview}</p>
        <div style={{display:'flex',gap:10,marginTop:24}}>
          <Button iconLeft="play" size="l">Watch trailer</Button>
          <Button variant="secondary" size="l" iconLeft={saved?'check':'plus'} onClick={()=>ctx.toggleSave(id)}>{saved?'On watchlist':'Watchlist'}</Button>
          <Button variant="secondary" size="l" iconLeft="eye" onClick={()=>ctx.askRate(id)}>I've seen it</Button>
          <IconButton icon="thumbs-down" label="Not for me" variant="surface" size="l" onClick={()=>ctx.notify('info','Got it. Fewer movies like '+m.title+'.')}/>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginTop:32}}>
          <Card>
            <div style={{font:'600 11px/1 var(--font-body)',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--text-secondary)'}}>Your rating</div>
            <div style={{marginTop:14}}><StarRating value={r} onChange={v=>ctx.rate(id,v)} size={30}/></div>
            <div style={{marginTop:10,font:'400 13px/1.4 var(--font-body)',color:'var(--text-secondary)'}}>{r?'Thanks. Your picks are updated.':'Rate it to sharpen your picks.'}</div>
          </Card>
          <Card>
            <div style={{font:'600 11px/1 var(--font-body)',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--text-secondary)'}}>Why we picked this</div>
            <ul style={{margin:'14px 0 0',padding:0,listStyle:'none',display:'flex',flexDirection:'column',gap:10,font:'400 14px/1.35 var(--font-body)'}}>
              <li style={{display:'flex',gap:8}}><Icon name="star" weight="fill" size={16} color="var(--accent)" style={{marginTop:1}}/>You rated Arrival 5 stars</li>
              <li style={{display:'flex',gap:8}}><Icon name="clock" size={16} color="var(--text-secondary)" style={{marginTop:1}}/>You finish long films on weekends</li>
              <li style={{display:'flex',gap:8}}><Icon name="user" size={16} color="var(--text-secondary)" style={{marginTop:1}}/>Loved by 8 people with your taste</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
    {more.length>0&&<PosterRow title="More like this" movies={more} ctx={ctx} size="s"/>}
    <div style={{height:64}}></div>
  </div>;
}
