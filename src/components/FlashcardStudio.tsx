import {useState, type ReactNode} from 'react';
import {ArrowRight, BookOpen, CheckCircle2, ChevronDown, Layers3, RotateCcw, Shuffle, Trash2} from 'lucide-react';
import {cards, dueCards, type CardProgress, type Progress, type Rating} from '../lib/engine';
import {lessons, outcomeNames} from '../data/syllabus';
import {questionMap} from '../data/questions';
import {shuffleUnique} from '../lib/flashcardSession';

type Mode = 'due' | 'all' | 'random';
type Props = {
  progress: Progress;
  onGrade:(id:string, rating:Rating)=>void;
  onReset:(ids:string[])=>void;
  onOpenLesson:(lessonId:string)=>void;
};
const ratings: Array<{name:Rating;meaning:string;style:string}> = [
  {name:'Again',meaning:'10 minutes',style:'border-[#edc2b7] bg-[#fff0ec] text-[#8c3828]'},
  {name:'Hard',meaning:'Short interval',style:'border-[#efdbb1] bg-[#fff7e6] text-[#745219]'},
  {name:'Good',meaning:'Normal review',style:'border-[#bdd7c4] bg-[#edf7ef] text-[#236241]'},
  {name:'Easy',meaning:'Longer interval',style:'border-[#144b36] bg-[#174b37] text-white'},
];
const countMastered=(progress:Record<string,CardProgress>)=>Object.values(progress).filter(v=>v.reps>=3 && v.lastRating!=='Again').length;

export default function FlashcardStudio({progress,onGrade,onReset,onOpenLesson}:Props){
  const [lo,setLo]=useState(0);
  const [mode,setMode]=useState<Mode>('due');
  const [sessionIds,setSessionIds]=useState<string[]>(()=>dueCards(progress).map(c=>c.id));
  const [position,setPosition]=useState(0);
  const [revealed,setRevealed]=useState(false);
  const [rated,setRated]=useState<Record<string,Rating>>({});
  const [resetMenu,setResetMenu]=useState(false);
  const allTopic=cards.filter(card=>lo===0||card.lo===lo);
  const dueTopic=dueCards(progress,lo||undefined);
  const active=sessionIds[position] ? cards.find(card=>card.id===sessionIds[position]) : undefined;
  const isComplete=position>=sessionIds.length;
  const reviewed=Object.keys(progress.cards).length;
  const selectedLesson=active ? lessons.find(l=>l.lo===active.lo):undefined;
  const linkedQuestion=active?.id.startsWith('recall-')?questionMap.get(active.id.slice(7)):undefined;
  const dueCount=dueCards(progress).length;

  function start(nextMode:Mode, nextLo=lo){
    const relevant=cards.filter(card=>nextLo===0||card.lo===nextLo);
    let picks=nextMode==='due' ? relevant.filter(c=>!progress.cards[c.id] || new Date(progress.cards[c.id].due).getTime()<=Date.now()).map(c=>c.id)
      :nextMode==='all'? relevant.map(c=>c.id):shuffleUnique(relevant.map(c=>c.id),10);
    // The card IDs form a fixed session so grading cannot silently reorder or skip later cards.
    if(nextMode==='due')picks=[...picks].sort((a,b)=>{
      const da=progress.cards[a]?.due??'';const db=progress.cards[b]?.due??'';
      return da.localeCompare(db);
    });
    setMode(nextMode);setLo(nextLo);setSessionIds(picks);setPosition(0);setRated({});setRevealed(false);
  }
  function choose(rating:Rating){
    if(!active || rated[active.id])return;
    onGrade(active.id,rating);
    setRated(previous=>({...previous,[active.id]:rating}));
    setRevealed(false);
    setPosition(previous=>previous+1);
  }
  function skip(){if(position<sessionIds.length){setPosition(v=>v+1);setRevealed(false)}}
  function reset(ids:string[],label:string){
    if(!ids.length){setResetMenu(false);return}
    if(!window.confirm(`Reset ${ids.length} ${label} flashcard review record${ids.length===1?'':'s'}? This clears only flashcard ratings and schedules. Your mocks, lessons and other progress will remain.`))return;
    onReset(ids);
    setResetMenu(false);
    // A reset should create a fresh review session, not keep stale completed cards on screen.
    setSessionIds([]);setPosition(0);setRevealed(false);setRated({});
  }
  const ratedCount=Object.keys(rated).length;

  return <div className="space-y-4 sm:space-y-5">
    <header className="rounded-[24px] border-2 border-[#cbded0] bg-gradient-to-br from-[#f9fcfa] via-white to-[#edf5ef] p-4 sm:p-7 shadow-[0_10px_26px_rgba(24,61,43,.06)]">
      <div className="flex flex-wrap gap-3 items-start justify-between">
        <div className="min-w-0"><p className="text-[11px] uppercase tracking-[.18em] font-extrabold text-[#53765f]">Spaced repetition · all syllabus outcomes</p><h1 className="text-[28px] sm:text-4xl font-extrabold text-forest mt-1 tracking-tight">Flashcard Studio</h1><p className="text-sm leading-6 mt-2 text-[#4c6656]">Recall a concept, reveal the answer, then choose how well you remembered it.</p></div>
        <span className="rounded-xl border border-[#c9ddcf] bg-white px-3 py-2 text-xs font-bold text-[#24583c]"><Layers3 size={15} className="inline mr-1"/>{cards.length} cards in library</span>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-5">
        <SmallStat label="Due today" value={dueCount}/>
        <SmallStat label="Reviewed" value={reviewed}/>
        <SmallStat label="Strong recall" value={countMastered(progress.cards)}/>
      </div>
    </header>

    <section className="rounded-[21px] border-2 border-[#d7e4d9] bg-white p-3 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4"><h2 className="font-extrabold text-forest text-lg">Choose your session</h2><div className="relative"><button type="button" aria-expanded={resetMenu} onClick={()=>setResetMenu(v=>!v)} className="inline-flex items-center gap-2 border border-[#d2ddd3] text-[#6b442a] rounded-xl px-3 py-2.5 text-xs font-bold bg-[#fffaf4] hover:bg-[#fcf0df]"><RotateCcw size={15}/> Reset cards <ChevronDown size={14}/></button>
        {resetMenu&&<div className="absolute right-0 top-full mt-2 z-20 min-w-[230px] rounded-2xl bg-white shadow-xl border-2 border-[#d7e1d7] p-2">{active&&progress.cards[active.id]&&<button type="button" className="w-full text-left px-3 py-3 text-sm rounded-xl hover:bg-[#faf6ee]" onClick={()=>reset([active.id],'current')}>Reset current card</button>}<button type="button" className="w-full text-left px-3 py-3 text-sm rounded-xl hover:bg-[#faf6ee]" onClick={()=>reset(allTopic.filter(c=>progress.cards[c.id]).map(c=>c.id),lo?'this topic’s':'selected')}>Reset {lo?'this topic':'selected topic cards'} ({allTopic.filter(c=>progress.cards[c.id]).length})</button><button type="button" className="w-full text-left px-3 py-3 text-sm rounded-xl hover:bg-[#fff0ed] text-[#873b30] font-bold flex gap-2 items-center" onClick={()=>reset(Object.keys(progress.cards),'all') }><Trash2 size={15}/> Reset all flashcards ({reviewed})</button></div>}
        </div></div>
      <label className="block mb-3 text-xs font-extrabold text-[#3d604a]" htmlFor="flash-topic">Syllabus topic</label>
      <select id="flash-topic" className="w-full text-sm bg-[#f8fbf8] border-2 border-[#d9e5db] rounded-xl px-3 py-3 text-forest font-semibold" value={lo} onChange={e=>start(mode,Number(e.target.value))}>
        <option value={0}>All 16 learning outcomes</option>{outcomeNames.map((title,i)=><option value={i+1} key={title}>LO {i+1} · {title}</option>)}
      </select>
      <div className="grid grid-cols-3 gap-2 mt-4" role="group" aria-label="Flashcard study mode">
        <ModeButton active={mode==='due'} onClick={()=>start('due')} icon={<RotateCcw size={16}/>} title="Due review" caption={`${dueTopic.length} due`}/>
        <ModeButton active={mode==='random'} onClick={()=>start('random')} icon={<Shuffle size={16}/>} title="10 random" caption="Fresh mix"/>
        <ModeButton active={mode==='all'} onClick={()=>start('all')} icon={<Layers3 size={16}/>} title="All cards" caption={`${allTopic.length} cards`}/>
      </div>
      <p className="text-xs leading-5 text-[#5b7162] mt-3">Random sessions draw up to 10 different cards without duplicates. Ratings always update your normal spaced-repetition schedule.</p>
    </section>

    {isComplete ? <section className="rounded-[22px] border-2 border-[#cfe0d3] bg-white text-center p-7 sm:p-10">
      <div className="h-14 w-14 rounded-2xl bg-[#e6f2e9] text-[#286e48] flex items-center justify-center mx-auto"><CheckCircle2 size={29}/></div>
      <h2 className="text-2xl font-extrabold text-forest mt-4">{sessionIds.length===0?'No cards in this session':'Session finished'}</h2>
      <p className="text-sm text-[#536c5c] leading-6 mt-2">{sessionIds.length===0 ? 'There are no cards to review here right now. Switch to all cards or start a random set.' : `You rated ${ratedCount} of ${sessionIds.length} cards. Your review schedule has been saved.`}</p>
      <div className="flex justify-center flex-wrap gap-2 mt-5"><button type="button" onClick={()=>start('random')} className="btn-primary"><Shuffle size={17}/> New random 10</button><button type="button" onClick={()=>start('due')} className="btn-outline">Review due cards</button></div>
    </section> : active && <section className="rounded-[22px] border-2 border-[#cbded0] bg-white p-4 sm:p-6 shadow-[0_10px_30px_rgba(16,54,34,.055)]">
      <div className="flex flex-wrap gap-3 items-center justify-between"><span className="rounded-full px-3 py-1.5 bg-[#e8f3e9] text-[#285e41] text-xs font-extrabold">LO {active.lo} · {outcomeNames[active.lo-1]}</span><span className="text-xs text-[#587260] font-bold">Card {position+1} of {sessionIds.length}</span></div>
      <div className="h-2.5 rounded-full bg-[#e5ece6] mt-4 overflow-hidden"><div className="h-full bg-[#27714d] rounded-full transition-[width]" style={{width:`${Math.round(position/sessionIds.length*100)}%`}}/></div>
      <button type="button" aria-expanded={revealed} aria-label={revealed?'Hide flashcard answer':'Reveal flashcard answer'} className={`relative w-full mt-4 min-h-[248px] sm:min-h-[284px] rounded-[22px] p-6 sm:p-9 text-center flex flex-col items-center justify-center transition-colors border-2 ${revealed?'border-[#bfd9c6] bg-[#e9f4ec]':'border-[#c5dfcc] bg-gradient-to-br from-[#edf7ef] to-[#f9fcf9]'}`} onClick={()=>setRevealed(v=>!v)}>
        <span className="text-[11px] uppercase tracking-[.2em] font-extrabold text-[#447455]">{revealed?'Answer':'Question'}</span>
        <h2 className="text-[19px] sm:text-[24px] leading-[1.5] font-extrabold text-[#183e2d] mt-5 max-w-2xl break-words">{revealed?active.back:active.front}</h2>
        <span className="mt-6 rounded-xl border border-[#bdd7c3] bg-white px-4 py-2.5 font-bold text-sm text-[#205e3e]">{revealed?'Tap to see question':'Tap to reveal answer'} <ArrowRight size={15} className="inline ml-1"/></span>
      </button>
      {revealed&&linkedQuestion&&<details className="rounded-xl border-2 border-[#d1e3d4] bg-white mt-3 p-4 group"><summary className="cursor-pointer list-none flex items-center justify-between gap-2 text-sm font-extrabold text-[#225c3a] [&::-webkit-details-marker]:hidden">Why is this the right answer? <ChevronDown className="group-open:rotate-180 transition-transform shrink-0" size={16}/></summary><p className="mt-3 text-sm leading-7 text-[#294538]">{linkedQuestion.explanation}</p></details>}
      <div className="flex flex-wrap justify-between items-center gap-3 py-3 border-b border-[#e2ebe4]"><button type="button" onClick={skip} className="text-xs font-bold text-[#536b5a] hover:text-forest px-2 py-2 min-h-10">Skip this card <ArrowRight size={15} className="inline"/></button>
        {selectedLesson&&<button type="button" onClick={()=>onOpenLesson(selectedLesson.id)} className="inline-flex gap-1.5 items-center rounded-xl border-2 border-[#bfd9c7] bg-white text-[#20593b] px-3 py-2.5 min-h-11 text-xs font-extrabold hover:bg-[#edf7ef]"><BookOpen size={16}/> Study lesson: LO {active.lo} <ArrowRight size={14}/></button>}
      </div>
      <div className="mt-4"><p className="text-sm font-extrabold text-forest mb-3">{revealed?'How well did you remember?':'Reveal the answer to rate your recall.'}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">{ratings.map(r=><button type="button" disabled={!revealed} key={r.name} onClick={()=>choose(r.name)} className={`rounded-xl border-2 px-3 py-3 min-h-[70px] text-center transition disabled:opacity-35 ${r.style}`}><span className="block font-extrabold text-sm">{r.name}</span><span className="block text-[11px] mt-1 font-semibold opacity-80">{r.meaning}</span></button>)}</div>
      </div>
    </section>}
    <footer className="text-xs leading-6 text-[#5c6d60] pb-6">Your flashcard reviews are saved locally on this device. <strong className="text-forest">Reset clears card ratings only</strong> and cannot be undone without importing a JSON backup. The “Study lesson” button opens the relevant learning outcome.</footer>
  </div>
}

function SmallStat({label,value}:{label:string;value:number}){return <div className="border border-[#d7e6da] bg-white rounded-xl px-3 py-3"><div className="text-[10px] sm:text-xs text-[#627a69] uppercase tracking-wide font-bold">{label}</div><div className="text-xl sm:text-2xl font-black text-forest mt-1">{value}</div></div>}
function ModeButton({active,onClick,icon,title,caption}:{active:boolean;onClick:()=>void;icon:ReactNode;title:string;caption:string}){return <button type="button" aria-pressed={active} onClick={onClick} className={`flex flex-col gap-1 items-start justify-center min-h-[87px] rounded-xl p-2.5 sm:p-3 border-2 text-left transition-colors ${active?'bg-[#174b37] border-[#174b37] text-white':'bg-[#f8fbf8] border-[#d7e5da] text-[#224e37] hover:border-[#7ea88a]'}`}><span className="flex items-center gap-1.5 text-xs sm:text-sm font-extrabold">{icon}{title}</span><span className={`text-[11px] ${active?'text-white/80':'text-[#657a6c]'}`}>{caption}</span></button>}
