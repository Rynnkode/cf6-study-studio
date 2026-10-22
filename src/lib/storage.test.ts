import {describe,it,expect} from 'vitest';
import {freshProgress} from './engine';
import {mergeProgress} from './storage';
describe('backup validation',()=>{
 it('round-trips progress state',()=>{const p=freshProgress();p.completed=['lo1','lo2'];p.examDate='2027-01-20';const imported=mergeProgress(JSON.parse(JSON.stringify(p)));expect(imported.completed).toEqual(['lo1','lo2']);expect(imported.examDate).toBe('2027-01-20')});
 it('rejects incompatible backups',()=>{expect(()=>mergeProgress({version:4})).toThrow();expect(()=>mergeProgress({version:1})).toThrow()});
});
