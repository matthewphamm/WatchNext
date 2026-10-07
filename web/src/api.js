import {useEffect,useState} from 'react';

async function request(path,body){
  const res=await fetch('/api'+path,body===undefined?undefined:{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  if(!res.ok) throw new Error(res.status+' '+res.statusText);
  return res.json();
}

const profile=({ratings,dismissed})=>({ratings,exclude:[...dismissed]});

export const api={
  home:p=>request('/home',profile(p)),
  movie:(id,p)=>request('/movies/'+id,profile(p)),
  search:(query,p)=>request('/search',{...query,...profile(p)}),
  onboarding:genres=>request('/onboarding?genres='+encodeURIComponent(genres.join(','))+'&limit=20')
};

/** Run an async loader whenever deps change. Keeps the last data while reloading. */
export function useApi(load,deps){
  const [state,setState]=useState({data:null,error:null,loading:true});
  const [attempt,setAttempt]=useState(0);
  useEffect(()=>{
    let live=true;
    setState(s=>({...s,loading:true,error:null}));
    load().then(data=>live&&setState({data,error:null,loading:false}),error=>live&&setState(s=>({...s,error,loading:false})));
    return ()=>{live=false;};
  },[...deps,attempt]);
  return {...state,retry:()=>setAttempt(a=>a+1)};
}

export const trailerUrl=m=>'https://www.youtube.com/results?search_query='+encodeURIComponent(m.title+' '+(m.year||'')+' trailer');
export const GENRES=['Action','Adventure','Animation','Comedy','Crime','Drama','Horror','Romance','Sci-Fi','Thriller'];
