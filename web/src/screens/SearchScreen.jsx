import React,{useState} from 'react';
import {Icon,Input,Select,Checkbox,Tag,MovieCard} from '../design-system/index.js';
import {MOVIES} from '../data.js';

export function SearchScreen({ctx,mode}){
  const [q,setQ]=useState('');const [sort,setSort]=useState('Best match');const [g,setG]=useState(null);const [hide,setHide]=useState(false);
  let list=MOVIES.filter(m=>(mode!=='watchlist'||ctx.saved.has(m.id))&&(!q||m.title.toLowerCase().includes(q.toLowerCase()))&&(!g||m.genre===g)&&(!hide||!ctx.ratings[m.id]));
  list=[...list].sort(sort==='Best match'?(a,b)=>b.match-a.match:sort==='Highest rated'?(a,b)=>b.avg-a.avg:(a,b)=>b.year-a.year);
  return <div style={{maxWidth:1200,margin:'0 auto',padding:'40px 48px 80px'}}>
    {mode==='watchlist'?<h1 style={{margin:0,font:'800 48px/1.05 var(--font-display)',letterSpacing:'-0.02em'}}>Your watchlist</h1>
      :<Input size="l" iconLeft="magnifying-glass" placeholder="Search movies, people, moods" value={q} onChange={e=>setQ(e.target.value)} autoFocus/>}
    <div style={{display:'flex',alignItems:'center',gap:8,marginTop:20,flexWrap:'wrap'}}>
      {['Sci-Fi','Drama','Thriller','Comedy','Romance'].map(x=><Tag key={x} size="s" selected={g===x} onClick={()=>setG(g===x?null:x)}>{x}</Tag>)}
      <div style={{flex:1}}></div>
      <Checkbox checked={hide} onChange={setHide} label="Hide movies I've rated"/>
      <Select size="s" value={sort} onChange={setSort} options={['Best match','Highest rated','Newest']} style={{width:160}}/>
    </div>
    <div style={{marginTop:20,font:'500 12px/1 var(--font-mono)',color:'var(--text-secondary)'}}>{list.length} {list.length===1?'movie':'movies'}</div>
    {list.length?<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:'28px 16px',marginTop:16}}>
      {list.map(m=><MovieCard key={m.id} width="100%" title={m.title} year={m.year} meta={m.genre} match={m.match} userRating={ctx.ratings[m.id]} saved={ctx.saved.has(m.id)} onSave={()=>ctx.toggleSave(m.id)} onClick={()=>ctx.open(m.id)}/>)}
    </div>:<div style={{marginTop:48,textAlign:'center',color:'var(--text-secondary)'}}>
      <Icon name={mode==='watchlist'?'bookmark-simple':'film-slate'} size={32}/>
      <div style={{marginTop:12,font:'700 20px/1.2 var(--font-display)',color:'var(--text-primary)'}}>{mode==='watchlist'?'Nothing saved yet':'No matches'}</div>
      <div style={{marginTop:6,font:'400 15px/1.5 var(--font-body)'}}>{mode==='watchlist'?'Tap the bookmark on any poster to save it for later.':'Try a different title or clear a filter.'}</div>
    </div>}
  </div>;
}
