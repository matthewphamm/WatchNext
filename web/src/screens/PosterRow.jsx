import React from 'react';
import {MovieCard} from '../design-system/index.js';

export function PosterRow({eyebrow,title,movies,ctx,size='m'}){
  if(!movies.length) return null;
  return <section style={{marginTop:40,animation:'wn-fade-in var(--dur-slow) var(--ease-out)'}}>
    <div style={{display:'flex',alignItems:'flex-end',gap:16,padding:'0 48px',marginBottom:14}}>
      <div style={{flex:1}}>{eyebrow&&<div style={{font:'600 11px/1 var(--font-body)',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--accent)',marginBottom:8}}>{eyebrow}</div>}
      <h2 style={{margin:0,font:'700 22px/1.2 var(--font-display)',letterSpacing:'-0.01em'}}>{title}</h2></div>
    </div>
    <div style={{display:'flex',gap:16,overflowX:'auto',padding:'6px 48px 10px',scrollbarWidth:'none'}}>
      {movies.map(m=><MovieCard key={m.id} size={size} posterUrl={m.poster} title={m.title} year={m.year} meta={m.genres[0]} match={m.match} userRating={ctx.ratings[m.id]} saved={ctx.saved.has(m.id)} onSave={()=>ctx.toggleSave(m.id)} onClick={e=>ctx.open(m,e)}/>)}
    </div>
  </section>;
}
