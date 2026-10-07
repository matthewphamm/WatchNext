import React,{useEffect,useState} from 'react';
import {Icon,Input,Select,Checkbox,Tag,MovieCard} from '../design-system/index.js';
import {api,useApi,GENRES} from '../api.js';
import {ErrorState} from './Status.jsx';

const SORTS={'Best match':'match','Highest rated':'rating','Most rated':'popular','Newest':'newest'};

export function SearchScreen({ctx,mode}){
  const watchlist=mode==='watchlist';
  const [q,setQ]=useState('');const [debounced,setDebounced]=useState('');
  const [sort,setSort]=useState('Best match');const [g,setG]=useState(null);const [hide,setHide]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setDebounced(q),250);return ()=>clearTimeout(t);},[q]);
  const query={q:debounced,genre:g,sort:SORTS[sort],hide_rated:hide,ids:watchlist?[...ctx.saved]:null};
  const {data,error,retry}=useApi(()=>watchlist&&!ctx.saved.size?Promise.resolve({total:0,movies:[]}):api.search(query,ctx),
    [debounced,g,sort,hide,watchlist,watchlist&&ctx.saved,ctx.ratings,ctx.dismissed]);
  const list=data?.movies||[];
  return <div style={{maxWidth:1200,margin:'0 auto',padding:'40px 48px 80px'}}>
    {watchlist?<h1 style={{margin:0,font:'800 48px/1.05 var(--font-display)',letterSpacing:'-0.02em'}}>Your watchlist</h1>
      :<Input size="l" iconLeft="magnifying-glass" placeholder="Search by title" value={q} onChange={e=>setQ(e.target.value)} autoFocus/>}
    <div style={{display:'flex',alignItems:'center',gap:8,marginTop:20,flexWrap:'wrap'}}>
      {GENRES.map(x=><Tag key={x} size="s" selected={g===x} onClick={()=>setG(g===x?null:x)}>{x}</Tag>)}
      <div style={{flex:1}}></div>
      <Checkbox checked={hide} onChange={setHide} label="Hide movies I've rated"/>
      <Select size="s" value={sort} onChange={setSort} options={Object.keys(SORTS)} style={{width:160}}/>
    </div>
    {error&&!data?<ErrorState message="Couldn't load movies." onRetry={retry}/>:<>
    <div style={{marginTop:20,font:'500 12px/1 var(--font-mono)',color:'var(--text-secondary)'}}>{data?(data.total>list.length?'Showing '+list.length+' of '+data.total.toLocaleString()+' movies':data.total+' '+(data.total===1?'movie':'movies')):' '}</div>
    {list.length||!data?<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:'28px 16px',marginTop:16}}>
      {list.map(m=><MovieCard key={m.id} width="100%" posterUrl={m.poster} title={m.title} year={m.year} meta={m.genres[0]} match={m.match} userRating={ctx.ratings[m.id]} saved={ctx.saved.has(m.id)} onSave={()=>ctx.toggleSave(m.id)} onClick={()=>ctx.open(m.id)}/>)}
    </div>:<div style={{marginTop:48,textAlign:'center',color:'var(--text-secondary)'}}>
      <Icon name={watchlist?'bookmark-simple':'film-slate'} size={32}/>
      <div style={{marginTop:12,font:'700 20px/1.2 var(--font-display)',color:'var(--text-primary)'}}>{watchlist?'Nothing saved yet':'No matches'}</div>
      <div style={{marginTop:6,font:'400 15px/1.5 var(--font-body)'}}>{watchlist?'Tap the bookmark on any poster to save it for later.':'Try a different title or clear a filter.'}</div>
    </div>}</>}
  </div>;
}
