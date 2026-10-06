import React from 'react';
import {Button,MovieCard} from '../design-system/index.js';

export function PosterRow({eyebrow,title,movies,ctx,size='m'}){
  return <section style={{marginTop:40}}>
    <div style={{display:'flex',alignItems:'flex-end',gap:16,padding:'0 48px',marginBottom:14}}>
      <div style={{flex:1}}>{eyebrow&&<div style={{font:'600 11px/1 var(--font-body)',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--accent)',marginBottom:8}}>{eyebrow}</div>}
      <h2 style={{margin:0,font:'700 22px/1.2 var(--font-display)',letterSpacing:'-0.01em'}}>{title}</h2></div>
      <Button variant="ghost" size="s" iconRight="caret-right">See all</Button>
    </div>
    <div style={{display:'flex',gap:16,overflowX:'auto',padding:'6px 48px 10px',scrollbarWidth:'none'}}>
      {movies.map(m=><MovieCard key={m.id} size={size} title={m.title} year={m.year} meta={m.genre} match={m.match} userRating={ctx.ratings[m.id]} saved={ctx.saved.has(m.id)} onSave={()=>ctx.toggleSave(m.id)} onClick={()=>ctx.open(m.id)}/>)}
    </div>
  </section>;
}
