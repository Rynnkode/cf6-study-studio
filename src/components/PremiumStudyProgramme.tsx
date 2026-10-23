import {useEffect, useMemo, useState} from 'react';
import {ArrowRight, BookOpen, CheckCircle2, ChevronDown, CircleDot, Filter, Search, Sparkles} from 'lucide-react';
import {lessons, examWeights} from '../data/syllabus';

type Props={completed:string[];search:string;onSearch:(s:string)=>void;onOpen:(id:string)=>void};
type FilterMode='all'|'todo'|'complete';
export default function PremiumStudyProgramme({completed,search,onSearch,onOpen}:Props){
 const [filter,setFilter]=useState<FilterMode>('all');
 const [openWeeks,setOpenWeeks]=useState<number[]>(()=>{
   const first=lessons.find(l=>!completed.includes(l.id));return [first?.week??1];
 });
 const filtered=useMemo(()=>lessons.filter(l=>{
   const matches=`${l.title} ${l.intro} ${l.notes.join(' ')} ${l.definitions.flat().join(' ')}`.toLowerCase().includes(search.trim().toLowerCase());
   return matches&&(filter==='all'||(filter==='todo'&&!completed.includes(l.id))||(filter==='complete'&&completed.includes(l.id)));
 }),[completed,search,filter]);
 useEffect(()=>{if(search.trim())setOpenWeeks([1,2,3,4,5,6])},[search]);
 const done=lessons.filter(l=>completed.includes(l.id)).length;
 const percent=Math.round(done/lessons.length*100);
 const next=lessons.find(l=>!completed.includes(l.id));
 return <div className="space-y-5 sm:space-y-6">
   <header className="rounded-[24px] border-2 border-[#d8e6db] bg-gradient-to-br from-white to-[#ecf5ed] p-5 sm:p-7">
     <p className="text-[11px] uppercase tracking-[.21em] font-extrabold text-[#64816f]">Six-week study roadmap</p>
     <h1 className="text-3xl sm:text-4xl font-extrabold text-forest mt-2">Build your knowledge, step by step.</h1>
     <p className="text-sm text-muted leading-6 mt-3">Sixteen learning outcomes, grouped into flexible weeks. Open any topic whenever you like.</p>
     <div className="grid sm:grid-cols-[1fr_auto] items-center gap-4 mt-5 rounded-[20px] bg-white border border-[#dce8dd] px-4 py-4">
       <div><div className="flex items-baseline gap-2"><span className="text-3xl font-black text-forest">{done}</span><span className="text-sm font-bold text-muted">of 16 complete</span></div><div className="h-2.5 rounded-full bg-[#e4ece5] mt-3 overflow-hidden"><div className="h-full rounded-full bg-[#40855a]" style={{width:`${percent}%`}}/></div></div>
       <div className="sm:text-right"><span className="font-black text-forest text-2xl">{percent}%</span><p className="text-xs text-muted mt-1">Programme progress</p></div>
     </div>
     {next&&<button type="button" onClick={()=>onOpen(next.id)} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#174b39] text-white px-4 py-3 min-h-11 text-sm font-bold hover:bg-[#286549]"><Sparkles size={16}/> Continue: {next.title}<ArrowRight size={15}/></button>}
   </header>
   <div className="rounded-[22px] border-2 border-[#dce7df] bg-white p-3 sm:p-4">
     <label className="flex items-center gap-2 rounded-xl border border-[#dfe7e1] bg-[#fbfcfb] px-3 py-2"><Search size={17} className="text-[#6e917c]"/><input type="search" value={search} onChange={e=>onSearch(e.target.value)} aria-label="Search learning outcomes" placeholder="Search lessons, topics, definitions…" className="w-full min-w-0 bg-transparent outline-none text-sm py-1.5"/></label>
     <div className="mt-3 flex items-center gap-2 overflow-x-auto" role="group" aria-label="Filter lessons"><Filter size={15} className="text-muted shrink-0 mr-1"/>{([{value:'all',label:'All 16'},{value:'todo',label:'To study'},{value:'complete',label:'Completed'}] as const).map(opt=><button key={opt.value} type="button" aria-pressed={filter===opt.value} onClick={()=>setFilter(opt.value)} className={`shrink-0 rounded-full px-3 py-2 min-h-9 text-xs font-extrabold border ${filter===opt.value?'bg-forest border-forest text-white':'bg-white border-[#dbe6dd] text-pine'}`}>{opt.label}</button>)}</div>
   </div>
   {Array.from({length:6},(_,idx)=>idx+1).map(week=>{
    const all=lessons.filter(l=>l.week===week);
    const visible=filtered.filter(l=>l.week===week);
    if(!visible.length)return null;
    const isOpen=openWeeks.includes(week);
    const weekDone=all.filter(l=>completed.includes(l.id)).length;
    return <section key={week} className="rounded-[24px] border-2 border-[#dbe6de] bg-white overflow-hidden shadow-[0_6px_24px_rgba(22,52,34,.035)]">
      <button type="button" onClick={()=>setOpenWeeks(w=>w.includes(week)?w.filter(n=>n!==week):[...w,week])} aria-expanded={isOpen} aria-controls={`cf6-week-${week}`} className="w-full px-4 py-4 sm:px-5 flex items-center gap-3 text-left hover:bg-[#f7faf7]">
        <span className="h-11 w-11 rounded-[13px] flex items-center justify-center bg-[#e8f2e9] font-black text-pine shrink-0">{String(week).padStart(2,'0')}</span>
        <span className="min-w-0 flex-1"><span className="block text-lg font-extrabold text-forest">Week {week}</span><span className="block text-xs text-muted mt-1">{weekDone} of {all.length} lessons complete</span></span>
        <span className="w-14 h-1.5 bg-[#e0ebe2] rounded-full overflow-hidden hidden sm:block"><span className="block h-full rounded-full bg-[#41865d]" style={{width:`${Math.round(100*weekDone/all.length)}%`}}/></span>
        <ChevronDown size={20} className={`text-pine transition-transform ${isOpen?'rotate-180':''}`}/>
      </button>
      {isOpen&&<div id={`cf6-week-${week}`} className="border-t border-[#e4ece6] p-2 sm:p-3"><div className="grid lg:grid-cols-2 gap-2">{visible.map(l=>{
       const complete=completed.includes(l.id);
       return <button type="button" key={l.id} onClick={()=>onOpen(l.id)} className="text-left rounded-[17px] border border-[#e0e8e1] hover:border-[#85ae94] hover:bg-[#f6faf6] transition-colors px-4 py-4 flex gap-3 items-start">
         <span className={`mt-1 shrink-0 rounded-lg h-9 w-9 flex items-center justify-center ${complete?'bg-[#e0f1e5] text-[#3a8254]':'bg-[#e9f0e9] text-pine'}`}>{complete?<CheckCircle2 size={20}/>:<BookOpen size={19}/>}</span>
         <span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-[#6c8575]">LO {l.lo}<span className="text-[#b8c8bb]">•</span>{examWeights[l.lo-1]} indicative exam Qs</span><strong className="block text-base font-extrabold text-forest leading-snug mt-1">{l.title}</strong><span className="block text-sm text-muted leading-5 line-clamp-2 mt-1">{l.intro}</span><span className="inline-flex items-center text-xs font-extrabold text-pine mt-3 gap-1">{complete?'Revisit lesson':'Open lesson'} <ArrowRight size={14}/></span></span>
       </button>})}</div></div>}
    </section>
   })}
   {!filtered.length&&<div className="rounded-2xl border border-[#dce7df] bg-white p-8 text-center"><CircleDot size={25} className="mx-auto text-[#70967f]"/><p className="font-bold text-forest mt-2">Nothing matches that filter</p><p className="text-sm text-muted mt-2">Try a different search or show all lessons.</p><button type="button" onClick={()=>{onSearch('');setFilter('all')}} className="mt-4 rounded-xl bg-forest text-white px-4 py-3 text-sm font-bold">Show all lessons</button></div>}
 </div>
}
