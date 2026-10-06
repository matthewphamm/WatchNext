import React,{useState} from 'react';
export function Tooltip({content,placement='top',children,open,style}){
  const [h,setH]=useState(false);const show=open??h;
  const pos=placement==='bottom'?{top:'calc(100% + 8px)'}:{bottom:'calc(100% + 8px)'};
  return <span style={{position:'relative',display:'inline-flex',...style}} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} onFocus={()=>setH(true)} onBlur={()=>setH(false)}>
    {children}
    <span role="tooltip" style={{position:'absolute',left:'50%',...pos,transform:'translateX(-50%) translateY('+(show?0:placement==='bottom'?-4:4)+'px)',opacity:show?1:0,pointerEvents:'none',whiteSpace:'nowrap',padding:'6px 10px',background:'var(--wn-ivory)',color:'var(--text-on-accent)',borderRadius:'var(--radius-s)',font:'500 12px/1.3 var(--font-body)',boxShadow:'var(--shadow-2)',transition:'opacity var(--dur-fast),transform var(--dur-fast) var(--ease-out)',zIndex:50}}>{content}</span>
  </span>;
}
