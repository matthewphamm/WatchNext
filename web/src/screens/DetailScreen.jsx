import React,{useCallback,useRef,useState} from 'react';
import {Button,IconButton,Icon,Card,Badge,StarRating,Tag} from '../design-system/index.js';
import {api,useApi,trailerUrl} from '../api.js';
import {PosterRow} from './PosterRow.jsx';
import {Backdrop,ErrorState} from './Status.jsx';

const REASON_ICONS={similar:['star','fill','var(--accent)'],people:['users','regular','var(--text-secondary)'],genre:['film-slate','regular','var(--text-secondary)'],stats:['chart-bar','regular','var(--text-secondary)']};

// The poster spans the details column (match badge to rating cards), keeping its 2:3 shape.
const POSTER_MIN_H=240,POSTER_MAX_H=480;

function DetailPoster({m,height}){
  const h=Math.min(POSTER_MAX_H,Math.max(POSTER_MIN_H,height||360));
  return <div style={{width:Math.round(h*2/3),height:h,flex:'none',position:'relative',borderRadius:'var(--radius-poster)',overflow:'hidden',background:'var(--surface-raised)',border:'1px solid var(--border-hairline)',boxShadow:'var(--shadow-2)'}}>
    {m.poster?<img src={m.poster} alt={m.title} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
      :<div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:10,padding:16,color:'var(--text-disabled)',textAlign:'center'}}><Icon name="film-slate" size={28}/><span style={{font:'700 15px/1.15 var(--font-display)',color:'var(--text-secondary)',textWrap:'balance'}}>{m.title}</span></div>}
  </div>;
}

export function DetailScreen({id,ctx}){
  const {data,error,retry}=useApi(()=>api.movie(id,ctx),[id,ctx.ratings,ctx.dismissed]);
  const [infoHeight,setInfoHeight]=useState(null);
  const observer=useRef(null);
  const infoRef=useCallback(el=>{
    observer.current?.disconnect();
    if(!el) return;
    observer.current=new ResizeObserver(([entry])=>setInfoHeight(entry.contentRect.height));
    observer.current.observe(el);
  },[]);
  if(error&&!data) return <ErrorState message="Couldn't load this movie." onRetry={retry}/>;
  if(!data) return <section style={{height:300,background:'var(--surface-card)',borderBottom:'1px solid var(--border-hairline)'}}/>;
  const m=data.movie;const r=ctx.ratings[id]||0;const saved=ctx.saved.has(id);
  return <div>
    <section style={{position:'relative',height:300,background:'var(--surface-card)',borderBottom:m.backdrop?'none':'1px solid var(--border-hairline)'}}>
      <Backdrop src={m.backdrop} labelTop={24}/>
      <div style={{position:'absolute',inset:0,background:'linear-gradient(0deg,#0B0F1A 0%,rgba(11,15,26,0) 80%)'}}></div>
      <div style={{position:'absolute',left:48,top:20}}><Button variant="ghost" size="s" iconLeft="caret-left" onClick={()=>ctx.go('home')}>Back</Button></div>
    </section>
    <div style={{display:'flex',alignItems:'flex-start',gap:40,padding:'110px 48px 0',marginTop:-160,position:'relative'}}>
      <DetailPoster m={m} height={infoHeight}/>
      <div ref={infoRef} style={{flex:1,maxWidth:720}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}><Badge variant="match">{m.match}% match</Badge>{saved&&<Badge variant="success" icon="check">On watchlist</Badge>}</div>
        <h1 style={{margin:'12px 0 0',font:'800 48px/1.05 var(--font-display)',letterSpacing:'-0.02em'}}>{m.title}</h1>
        <div style={{marginTop:10,font:'500 14px/1 var(--font-body)',color:'var(--text-secondary)'}}>{[m.year,m.genres.join(', ')].filter(Boolean).join(' · ')}</div>
        {m.tags.length>0&&<div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:18}}>{m.tags.map(t=><Tag key={t} size="s">{t}</Tag>)}</div>}
        <div style={{display:'flex',gap:10,marginTop:24}}>
          <Button iconLeft="play" size="l" onClick={()=>window.open(trailerUrl(m),'_blank','noopener')}>Watch trailer</Button>
          <Button variant="secondary" size="l" iconLeft={saved?'check':'plus'} onClick={()=>ctx.toggleSave(id)}>{saved?'On watchlist':'Watchlist'}</Button>
          <Button variant="secondary" size="l" iconLeft="eye" onClick={()=>ctx.askRate(m)}>I've seen it</Button>
          <IconButton icon="thumbs-down" label="Not for me" variant="surface" size="l" onClick={()=>ctx.dismiss(m)}/>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginTop:32}}>
          <Card>
            <div style={{font:'600 11px/1 var(--font-body)',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--text-secondary)'}}>Your rating</div>
            <div style={{marginTop:14}}><StarRating value={r} onChange={v=>ctx.rate(m,v)} size={30}/></div>
            <div style={{marginTop:10,font:'400 13px/1.4 var(--font-body)',color:'var(--text-secondary)'}}>{r?'Thanks. Your picks are updated.':'Rate it to sharpen your picks.'}</div>
          </Card>
          <Card>
            <div style={{font:'600 11px/1 var(--font-body)',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--text-secondary)'}}>Why we picked this</div>
            <ul style={{margin:'14px 0 0',padding:0,listStyle:'none',display:'flex',flexDirection:'column',gap:10,font:'400 14px/1.35 var(--font-body)'}}>
              {data.reasons.map(x=>{const [icon,weight,color]=REASON_ICONS[x.kind]||REASON_ICONS.stats;
                return <li key={x.text} style={{display:'flex',gap:8}}><Icon name={icon} weight={weight} size={16} color={color} style={{marginTop:1}}/>{x.text}</li>;})}
            </ul>
          </Card>
        </div>
      </div>
    </div>
    <PosterRow title="More like this" movies={data.similar} ctx={ctx} size="s"/>
    <div style={{height:64}}></div>
  </div>;
}
