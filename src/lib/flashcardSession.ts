/** Select up to count distinct cards, preserving stable IDs; injection enables deterministic tests. */
export function shuffleUnique(ids:string[],count=10,random:()=>number=Math.random):string[]{
 const copy=[...new Set(ids)];
 for(let i=copy.length-1;i>0;i--){const j=Math.min(i,Math.max(0,Math.floor(random()*(i+1))));[copy[i],copy[j]]=[copy[j],copy[i]];}
 return copy.slice(0,Math.max(0,Math.floor(count)));
}
/** Remove only selected card scheduling records; preserve all other persisted study state. */
export function resetCardRecords<T extends {cards:Record<string,unknown>}>(progress:T,ids:string[]):T{
 const removal=new Set(ids);const cards={...progress.cards};
 for(const id of removal)delete cards[id];
 return {...progress,cards};
}
