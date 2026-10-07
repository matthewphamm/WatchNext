import React,{useState,useEffect,useRef} from 'react';
import {Button,Dialog,StarRating,Toast} from './design-system/index.js';
import {NavBar} from './screens/NavBar.jsx';
import {HomeScreen} from './screens/HomeScreen.jsx';
import {DetailScreen} from './screens/DetailScreen.jsx';
import {RateScreen} from './screens/RateScreen.jsx';
import {SearchScreen} from './screens/SearchScreen.jsx';

// Ratings, watchlist and dismissed movies live in this browser and are sent with each API request.
const load=(k,d)=>{try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch{return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
const stars=v=>v+(v===1?' star.':' stars.');

export function App(){
  const [screen,setScreen]=useState(()=>load('wn-screen','home'));
  const [id,setId]=useState(()=>load('wn-id',null));
  const [ratings,setRatings]=useState(()=>load('wn-ratings',{}));
  const [saved,setSaved]=useState(()=>new Set(load('wn-saved',[])));
  const [dismissed,setDismissed]=useState(()=>new Set(load('wn-dismissed',[])));
  const [toast,setToast]=useState(null);
  const [ask,setAsk]=useState(null);const [askVal,setAskVal]=useState(0);
  useEffect(()=>{save('wn-screen',screen==='detail'&&id==null?'home':screen);save('wn-id',id);},[screen,id]);
  useEffect(()=>save('wn-ratings',ratings),[ratings]);
  useEffect(()=>save('wn-saved',[...saved]),[saved]);
  useEffect(()=>save('wn-dismissed',[...dismissed]),[dismissed]);
  const tRef=useRef();
  const notify=(variant,text,undo)=>{clearTimeout(tRef.current);setToast({variant,text,undo});tRef.current=setTimeout(()=>setToast(null),3200);};
  const go=s=>{setScreen(s);window.scrollTo(0,0);};
  const setRating=(mid,v)=>setRatings(r=>{const t={...r};if(v)t[mid]=v;else delete t[mid];return t;});
  const ctx={ratings,saved,dismissed,go,notify,
    open:i=>{setId(i);go('detail');},
    toggleSave:i=>{const had=saved.has(i);setSaved(s=>{const t=new Set(s);had?t.delete(i):t.add(i);return t;});notify('success',had?'Removed from your watchlist.':'Added to your watchlist.');},
    rate:(m,v,quiet)=>{const prev=ratings[m.id];setRating(m.id,v);if(!quiet&&v)notify('rating','Rated '+m.title+' '+stars(v),()=>setRating(m.id,prev));},
    dismiss:m=>{setDismissed(s=>new Set(s).add(m.id));notify('info',"Got it. We won't suggest "+m.title+' again.',()=>setDismissed(s=>{const t=new Set(s);t.delete(m.id);return t;}));},
    askRate:m=>{setAsk(m);setAskVal(ratings[m.id]||0);}
  };
  const n=Object.keys(ratings).length;
  const current=screen==='detail'&&id==null?'home':screen;
  return <div style={{minHeight:'100vh'}}>
    <NavBar screen={current} go={go} ratedCount={n}/>
    {current==='home'&&<HomeScreen ctx={ctx}/>}
    {current==='detail'&&<DetailScreen id={id} ctx={ctx}/>}
    {current==='rate'&&<RateScreen ctx={ctx}/>}
    {current==='search'&&<SearchScreen ctx={ctx}/>}
    {current==='watchlist'&&<SearchScreen ctx={ctx} mode="watchlist"/>}
    <Dialog open={!!ask} onClose={()=>setAsk(null)} width={420} title={ask?'How was '+ask.title+'?':''}
      actions={<><Button variant="ghost" onClick={()=>setAsk(null)}>Skip</Button><Button disabled={!askVal} onClick={()=>{ctx.rate(ask,askVal);setAsk(null);}}>Save rating</Button></>}>
      <div style={{marginBottom:14}}>Your rating tunes tonight's picks.</div><StarRating value={askVal} onChange={setAskVal} size={34}/>
    </Dialog>
    {toast&&<div style={{position:'fixed',left:'50%',bottom:24,transform:'translateX(-50%)',zIndex:200}}><Toast variant={toast.variant} action={toast.undo?'Undo':undefined} onAction={()=>{toast.undo();setToast(null);}} onClose={()=>setToast(null)}>{toast.text}</Toast></div>}
  </div>;
}
