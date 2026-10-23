import {describe,it,expect} from 'vitest';
import {shuffleUnique,resetCardRecords} from './flashcardSession';
describe('Flashcard session tools',()=>{
 it('selects ten unique random flashcard IDs without modifying original pool',()=>{const ids=Array.from({length:50},(_,i)=>`card-${i}`);const selection=shuffleUnique(ids,10,()=>.456);expect(selection).toHaveLength(10);expect(new Set(selection).size).toBe(10);expect(ids[0]).toBe('card-0')});
 it('does not create duplicates even if input repeats',()=>{const selection=shuffleUnique(['a','a','b','c','c'],10,()=>.5);expect(selection).toHaveLength(3);expect(new Set(selection).size).toBe(3)});
 it('resets only selected card ratings, preserving lessons and mock results',()=>{const before={cards:{a:{due:'x'},b:{due:'y'}},completed:['lo1'],history:[{score:5}]};const after=resetCardRecords(before,['a']);expect(after.cards).toEqual({b:{due:'y'}});expect(after.completed).toEqual(before.completed);expect(after.history).toEqual(before.history);expect(before.cards.a).toEqual({due:'x'})});
});
