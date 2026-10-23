import {describe,it,expect} from 'vitest';
import {payment,project,ltv} from './mortgageLab';
describe('mortgage lab',()=>{
 it('handles zero rate and repayments',()=>{expect(payment(120000,0,10)).toBeCloseTo(1000);expect(payment(200000,4.5,25)).toBeCloseTo(1111.66,0)});
 it('overpayments reduce total interest and months',()=>{const normal=project(200000,5,25),extra=project(200000,5,25,150);expect(extra.months).toBeLessThan(normal.months);expect(extra.interest).toBeLessThan(normal.interest);expect(extra.points.at(-1)?.balance).toBe(0)});
 it('calculates LTV and rejects invalid values',()=>{expect(ltv(225000,300000)).toBe(75);expect(Number.isNaN(payment(-5,4,20))).toBe(true)});
});
