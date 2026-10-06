import React from 'react';
import {IconButton} from '../design-system/index.js';

export function NavBar({screen,go,ratedCount}){
  const links=[['home','For you'],['search','Search'],['watchlist','Watchlist'],['rate','Rate movies']];
  return <header style={{position:'sticky',top:0,zIndex:20,height:64,display:'flex',alignItems:'center',gap:40,padding:'0 48px',background:'rgba(22,29,46,.82)',backdropFilter:'saturate(140%) blur(16px)',borderBottom:'1px solid var(--border-hairline)'}}>
    <a onClick={()=>go('home')} style={{cursor:'pointer',font:'800 24px/1 var(--font-display)',letterSpacing:'-0.03em',color:'var(--text-primary)'}}>Watch<span style={{color:'var(--accent)'}}>Next</span></a>
    <nav style={{display:'flex',gap:28,flex:1}}>{links.map(([k,l])=>{const a=screen===k||(k==='home'&&screen==='detail');
      return <a key={k} onClick={()=>go(k)} style={{position:'relative',cursor:'pointer',height:64,display:'flex',alignItems:'center',font:'600 14px/1 var(--font-body)',color:a?'var(--text-primary)':'var(--text-secondary)'}}>{l}{k==='rate'&&ratedCount<5&&<span style={{marginLeft:6,width:6,height:6,borderRadius:'50%',background:'var(--accent)'}}></span>}{a&&<span style={{position:'absolute',left:0,right:0,bottom:-1,height:2,background:'var(--accent)',borderRadius:2}}></span>}</a>;})}</nav>
    <div style={{display:'flex',alignItems:'center',gap:8}}>
      <IconButton icon="magnifying-glass" label="Search" onClick={()=>go('search')}/>
      <IconButton icon="bell" label="Notifications"/>
      <span style={{width:32,height:32,borderRadius:'50%',background:'var(--surface-raised)',border:'1px solid var(--border-hairline)',display:'flex',alignItems:'center',justifyContent:'center',font:'600 12px/1 var(--font-body)',marginLeft:4}}>MP</span>
    </div>
  </header>;
}
