export type BalancePoint={year:number;balance:number;interest:number;principal:number};
export type Projection={payment:number;paymentWithExtra:number;months:number;interest:number;totalPaid:number;points:BalancePoint[]};
export function payment(principal:number,annualPct:number,termYears:number){
 if(!Number.isFinite(principal)||!Number.isFinite(annualPct)||!Number.isFinite(termYears)||principal<0||annualPct<0||termYears<=0)return NaN;
 const n=Math.round(termYears*12),r=annualPct/1200;
 return r===0?principal/n:principal*r/(1-Math.pow(1+r,-n));
}
export function project(principal:number,annualPct:number,termYears:number,monthlyExtra=0):Projection{
 const regular=payment(principal,annualPct,termYears);
 if(!Number.isFinite(regular)||!Number.isFinite(monthlyExtra)||monthlyExtra<0) return {payment:NaN,paymentWithExtra:NaN,months:0,interest:NaN,totalPaid:NaN,points:[]};
 const r=annualPct/1200;let balance=principal,interest=0,months=0,yearInterest=0,yearPrincipal=0;
 const points:BalancePoint[]=[{year:0,balance:principal,interest:0,principal:0}];
 while(balance>0.005&&months<Math.ceil(termYears*12)+1){
   const charge=balance*r;const paid=Math.min(balance+charge,regular+monthlyExtra);
   const principalPaid=Math.max(0,paid-charge);
   interest+=charge;yearInterest+=charge;yearPrincipal+=principalPaid;
   balance=Math.max(0,balance-principalPaid);months++;
   if(months%12===0||balance<=0.005){points.push({year:Math.ceil(months/12),balance,interest:yearInterest,principal:yearPrincipal});yearInterest=0;yearPrincipal=0}
 }
 return {payment:regular,paymentWithExtra:regular+monthlyExtra,months,interest,totalPaid:principal+interest,points};
}
export const ltv=(balance:number,value:number)=>value>0?100*balance/value:NaN;
export function wholeYears(months:number){const y=Math.floor(months/12),m=months%12;return `${y}y ${m}m`}
