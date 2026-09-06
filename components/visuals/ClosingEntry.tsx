'use client'
import { useState } from 'react'
export function ClosingEntry(){const [choice,setChoice]=useState('');const options=[['EXPLORE','#atis'],['INVESTIGATE','#provenance'],['PARTICIPATE','#interest-form']];return <div className="closing-entry">{options.map(([label,href])=><a key={label} className={choice===label?'is-selected':''} href={href} onClick={()=>setChoice(label)}>{label}<span>→</span></a>)}{choice&&<p className="annotation">ENTRY SELECTED // {choice} // the field responds through the next question</p>}</div>}
