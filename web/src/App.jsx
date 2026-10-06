import React,{useState,useEffect,useRef} from 'react';
import {Button,Dialog,StarRating,Toast} from './design-system/index.js';
import {BY_ID} from './data.js';
import {NavBar} from './screens/NavBar.jsx';
import {HomeScreen} from './screens/HomeScreen.jsx';
import {DetailScreen} from './screens/DetailScreen.jsx';
import {RateScreen} from './screens/RateScreen.jsx';
import {SearchScreen} from './screens/SearchScreen.jsx';

const load=(k,d)=>{try{return localStorage.getItem(k)||d}catch{return d}};
const save=(k,v)=>{try{localStorage.setItem(k,v)}catch{}};

export function App(){
  const [screen,setScreen]=useState(()=>load('wn-screen','home'));
  const [id,setId]=useState(()=>{const i=load('wn-id','dune2');return BY_ID[i]?i:'dune2';});
  const [saved,setSaved]=useState(new Set(['arrival','pastlives']));
  const [ratings,setRatings]=useState({arrival:5,whiplash:4});
  const [toast,setToast]=useState(null);
  const [ask,setAsk]=useState(null);const [askVal,setAskVal]=useState(0);
  useEffect(()=>{save('wn-screen',screen);save('wn-id',id);},[screen,id]);
  const tRef=useRef();
  const notify=(variant,text,undo)=>{clearTimeout(tRef.current);setToast({variant,text,undo});tRef.current=setTimeout(()=>setToast(null),3200);};
  const go=s=>{setScreen(s);window.scrollTo(0,0);};
  const ctx={saved,ratings,go,notify,
    open:i=>{setId(i);go('detail');},
    toggleSave:i=>{const had=saved.has(i);setSaved(s=>{const t=new Set(s);had?t.delete(i):t.add(i);return t;});notify('success',had?'Removed from your watchlist.':'Added to your watchlist.');},
    rate:(i,v,quiet)=>{const prev=ratings[i];setRatings(r=>({...r,[i]:v}));if(!quiet&&v)notify('rating','Rated '+BY_ID[i].title+' '+v+(v===1?' star.':' stars.'),()=>setRatings(r=>({...r,[i]:prev})));},
    askRate:i=>{setAsk(i);setAskVal(ratings[i]||0);}
  };
  const n=Object.values(ratings).filter(Boolean).length;
  return <div style={{minHeight:'100vh'}}>
    <NavBar screen={screen} go={go} ratedCount={n}/>
    {screen==='home'&&<HomeScreen ctx={ctx}/>}
    {screen==='detail'&&<DetailScreen id={id} ctx={ctx}/>}
    {screen==='rate'&&<RateScreen ctx={ctx}/>}
    {screen==='search'&&<SearchScreen ctx={ctx}/>}
    {screen==='watchlist'&&<SearchScreen ctx={ctx} mode="watchlist"/>}
    <Dialog open={!!ask} onClose={()=>setAsk(null)} width={420} title={ask?'How was '+BY_ID[ask].title+'?':''}
      actions={<><Button variant="ghost" onClick={()=>setAsk(null)}>Skip</Button><Button disabled={!askVal} onClick={()=>{ctx.rate(ask,askVal);setAsk(null);}}>Save rating</Button></>}>
      <div style={{marginBottom:14}}>Your rating tunes tonight's picks.</div><StarRating value={askVal} onChange={setAskVal} size={34}/>
    </Dialog>
    {toast&&<div style={{position:'fixed',left:'50%',bottom:24,transform:'translateX(-50%)',zIndex:200}}><Toast variant={toast.variant} action={toast.undo?'Undo':undefined} onAction={()=>{toast.undo();setToast(null);}} onClose={()=>setToast(null)}>{toast.text}</Toast></div>}
  </div>;
}
