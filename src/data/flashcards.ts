import {standaloneQuestions} from './questions';
import {lessons} from './syllabus';
export interface FlashCard {id:string; lo:number; front:string; back:string}
// Recall prompts and concise answers are original, taken from the app's own authored learning content.
export const flashcards:FlashCard[]=[
  ...lessons.flatMap(lesson=>lesson.definitions.map(([term,meaning],i)=>({id:`def-${lesson.lo}-${i}`,lo:lesson.lo,front:`Define: ${term}`,back:meaning}))),
  ...standaloneQuestions.map(q=>({id:`recall-${q.id}`,lo:q.lo,front:q.stem,back:q.options[q.correct]}))
];
