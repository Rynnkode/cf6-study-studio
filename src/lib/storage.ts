import Dexie,{type Table} from 'dexie';
import {freshProgress,type Progress} from './engine';
interface Saved{key:string;value:Progress}
class StudyDB extends Dexie {progress!:Table<Saved,string>;constructor(){super('CF6StudyStudio');this.version(1).stores({progress:'key'})}}
export const db=new StudyDB();
export async function readProgress():Promise<Progress>{try {const x=await db.progress.get('personal');return x?.value?mergeProgress(x.value):freshProgress()}catch(e){console.error('Read failed',e);throw new Error('Saved progress could not be read. Do not reset or clear your browser data.')}}
export function mergeProgress(v:unknown):Progress{if(!v||typeof v!=='object'||Array.isArray(v))throw new Error('Invalid progress file');const x=v as Partial<Progress>;if(x.version!==1||!Array.isArray(x.completed)||!Array.isArray(x.attempts)||!Array.isArray(x.history)||!x.cards||typeof x.cards!=='object'||!x.mistakes||typeof x.mistakes!=='object')throw new Error('Incompatible or invalid backup');return {...freshProgress(),...x,active:x.active||null}}
export async function writeProgress(p:Progress){await db.progress.put({key:'personal',value:p})}
export function exportBackup(p:Progress):Blob{return new Blob([JSON.stringify({app:'CF6StudyStudio',exportedAt:new Date().toISOString(),progress:p},null,2)],{type:'application/json'})}
export async function importBackup(file:File):Promise<Progress>{if(file.size>8_000_000)throw new Error('Backup exceeds 8 MB');const x=JSON.parse(await file.text());if(x?.app!=='CF6StudyStudio')throw new Error('This is not a CF6 Study Studio backup');return mergeProgress(x.progress)}
