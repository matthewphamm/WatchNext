import React from 'react';
const PH='https://unpkg.com/@phosphor-icons/core@2.1.1/assets/';
export function Icon({name,size=20,weight='regular',color='currentColor',style,...rest}){
  const file=weight==='regular'?name:name+'-'+weight;
  const url='url('+PH+weight+'/'+file+'.svg)';
  return <span aria-hidden="true" {...rest} style={{display:'inline-block',width:size,height:size,flex:'none',background:color,WebkitMask:url+' center/contain no-repeat',mask:url+' center/contain no-repeat',...style}}/>;
}
