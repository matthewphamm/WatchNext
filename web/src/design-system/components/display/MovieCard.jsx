import React,{useState} from 'react';
import {Icon} from '../core/Icon.jsx';
import {Badge} from './Badge.jsx';
import {StarRating} from './StarRating.jsx';
const W={s:140,m:180,l:220};
export function MovieCard({title,year,meta,posterUrl,match,userRating,saved,onSave,onClick,size='m',width,style}){
  const [h,setH]=useState(false);const w=width||W[size]||180;
  return <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} onClick={onClick} style={{width:w,flex:'none',cursor:onClick?'pointer':'default',...style}}>
    <div style={{position:'relative',aspectRatio:'2/3',borderRadius:'var(--radius-poster)',overflow:'hidden',background:'var(--surface-raised)',border:'1px solid var(--border-hairline)',transform:h?'translateY(-4px)':'none',boxShadow:h?'var(--shadow-3)':'var(--shadow-1)',outline:h?'1px solid rgba(242,179,61,.5)':'none',transition:'transform var(--dur-base) var(--ease-out),box-shadow var(--dur-base) var(--ease-out)'}}>
      {posterUrl?<img src={posterUrl} alt={title} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}}/>
        :<div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:10,padding:16,color:'var(--text-disabled)',textAlign:'center'}}><Icon name="film-slate" size={28}/><span style={{font:'700 15px/1.15 var(--font-display)',color:'var(--text-secondary)',textWrap:'balance'}}>{title}</span></div>}
      <div style={{position:'absolute',inset:0,background:'var(--poster-protection)',opacity:h?1:0,transition:'opacity var(--dur-base)'}}/>
      {match!=null&&<Badge variant="match" style={{position:'absolute',top:8,left:8}}>{match}%</Badge>}
      {onSave&&<button aria-label={saved?'Remove from watchlist':'Add to watchlist'} onClick={e=>{e.stopPropagation();onSave()}} style={{position:'absolute',top:6,right:6,width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'50%',border:'1px solid rgba(232,230,225,.16)',background:'rgba(11,15,26,.6)',backdropFilter:'blur(8px)',color:saved?'var(--accent)':'var(--text-primary)',cursor:'pointer',opacity:h||saved?1:0,transition:'opacity var(--dur-base)'}}><Icon name="bookmark-simple" weight={saved?'fill':'regular'} size={16}/></button>}
      {userRating>0&&<div style={{position:'absolute',left:8,bottom:8,opacity:h?1:.95}}><StarRating value={userRating} size={12}/></div>}
    </div>
    <div style={{padding:'10px 2px 0'}}>
      <div style={{font:'600 14px/1.3 var(--font-body)',color:h?'var(--text-primary)':'var(--text-primary)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{title}</div>
      {(year||meta)&&<div style={{marginTop:3,font:'400 12px/1.3 var(--font-body)',color:'var(--text-secondary)',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{[year,meta].filter(Boolean).join(' · ')}</div>}
    </div>
  </div>;
}
