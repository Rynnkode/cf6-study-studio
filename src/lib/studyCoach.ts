import type {Progress} from './engine';
import {examWeights,outcomeNames} from '../data/syllabus';
import {questionMap} from '../data/questions';

export type TopicInsight={lo:number;name:string;weight:number;attempts:number;correct:number;unique:number;accuracy:number|null;recencyDays:number|null;priority:number;status:'Start here'|'Practice more'|'Revisit'|'Developing'|'Strong evidence'};
export function topicInsights(p:Progress,now=new Date()):TopicInsight[]{
 const byLo=new Map<number,typeof p.attempts>();
 for(const a of p.attempts){const lo=questionMap.get(a.id)?.lo;if(!lo)continue;const group=byLo.get(lo)||[];group.push(a);byLo.set(lo,group)}
 return outcomeNames.map((name,i)=>{
   const lo=i+1,records=byLo.get(lo)||[],recent=records.slice(-20),correct=recent.filter(a=>a.correct).length;
   const accuracy=recent.length?Math.round(100*correct/recent.length):null;
   const unique=new Set(records.map(a=>a.id)).size;
   const last=records.length?Math.max(...records.map(a=>new Date(a.at).getTime()).filter(Number.isFinite)):NaN;
   const recencyDays=Number.isFinite(last)?Math.max(0,Math.floor((now.getTime()-last)/86400000)):null;
   const weight=examWeights[i];
   // An evidence-weighted heuristic, not a prediction of CII exam outcomes.
   const error=accuracy===null?0.75:(100-accuracy)/100;
   const thin=1-Math.min(1,unique/8);
   const stale=recencyDays===null?1:Math.min(1,recencyDays/21);
   const priority=Math.round(weight*(0.45*error+0.35*thin+0.20*stale)*10)/10;
   const status=records.length===0?'Start here':unique<5?'Practice more':recencyDays!==null&&recencyDays>=14?'Revisit':accuracy!==null&&accuracy>=80&&unique>=8?'Strong evidence':'Developing';
   return {lo,name,weight,attempts:records.length,correct,unique,accuracy,recencyDays,priority,status};
 });
}
export const priorityTopics=(p:Progress,count=4)=>topicInsights(p).sort((a,b)=>b.priority-a.priority||a.lo-b.lo).slice(0,count);
export function weeklyAnswers(p:Progress,now=new Date()){return Array.from({length:7},(_,i)=>{const date=new Date(now);date.setDate(date.getDate()-(6-i));const key=`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;return {day:date.toLocaleDateString('en-GB',{weekday:'short'}),questions:p.attempts.filter(a=>a.at.startsWith(key)).length};});}
