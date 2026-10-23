export type MicroCheck = {prompt:string;answer:boolean;why:string};
// Original, unofficial active-recall prompts; stable content IDs correspond to the existing 16 outcomes.
export const lessonMicroChecks:Record<number,[MicroCheck,MicroCheck]>={
 1:[
 {prompt:'Every loan secured on a residential property is automatically a regulated mortgage contract.',answer:false,why:'The regulatory perimeter depends on the borrower, dwelling use, security and exceptions. Establish scope before applying mortgage conduct rules.'},
 {prompt:'A recommendation should be based on client suitability, not merely the lowest headline mortgage rate.',answer:true,why:'Cost matters, but term, affordability, flexibility, product restrictions and future needs all inform suitability.'}],
 2:[
 {prompt:'In England and Wales, accepting a buyer’s offer normally creates a binding property sale contract.',answer:false,why:'An accepted offer is generally not binding until exchange of contracts in England and Wales.'},
 {prompt:'Completion and exchange of contracts are different milestones.',answer:true,why:'Exchange usually makes the agreement binding; completion is when money and ownership are transferred.'}],
 3:[
 {prompt:'A lender’s mortgage valuation is a substitute for a detailed buyer’s building survey.',answer:false,why:'The valuation focuses on security value. A buyer’s survey investigates condition and defects more fully.'},
 {prompt:'A down valuation can mean the buyer needs a bigger cash deposit even though the agreed price has not changed.',answer:true,why:'Lenders often calculate an LTV-based maximum advance using the relevant valuation basis, which can reduce the mortgage amount.'}],
 4:[
 {prompt:'A guarantor automatically removes the need for borrower affordability assessment.',answer:false,why:'Borrowing still needs to be assessed under the lender’s criteria, and a guarantor may assume a substantial liability.'},
 {prompt:'Uneven self-employed income should be investigated using verifiable, sustainable evidence.',answer:true,why:'The strongest recent month is not necessarily representative of future income or acceptable underwriting evidence.'}],
 5:[
 {prompt:'A fixed mortgage rate must always change by exactly the same amount as Bank Rate.',answer:false,why:'Fixed rates also reflect funding markets and rate expectations; pricing need not move one-for-one with Bank Rate.'},
 {prompt:'A household can face payment shock when a fixed-rate deal expires, even if it never missed a payment.',answer:true,why:'When the contractual fixed period ends the available new or reversion rate may be different.'}],
 6:[
 {prompt:'A mortgage that passes lender affordability checks is necessarily suitable for the client.',answer:false,why:'Suitability also depends on objectives, expected moves, term, fees, penalties, future risks and communication.'},
 {prompt:'An adviser should explain early repayment charges when those penalties could affect the client’s plans.',answer:true,why:'Significant restrictions and costs are central to the client’s understanding and the suitability rationale.'}],
 7:[
 {prompt:'Adding a product fee to mortgage borrowing may increase the total interest paid.',answer:true,why:'The financed fee increases the amount outstanding and can accrue interest over the loan term.'},
 {prompt:'The same property transaction tax rules apply throughout England, Wales and Scotland.',answer:false,why:'Different regimes apply: SDLT in England/Northern Ireland, LTT in Wales and LBTT in Scotland; rates and reliefs may change.'}],
 8:[
 {prompt:'Critical illness policies automatically cover any medical diagnosis.',answer:false,why:'Payment depends on the policy wording, defined conditions, exclusions and contractual definitions.'},
 {prompt:'A deferred period is an important factor when discussing income protection.',answer:true,why:'It sets the waiting period before eligible benefits can begin and should be considered against sick pay and savings.'}],
 9:[
 {prompt:'A mortgage described as portable is guaranteed to transfer to any property without further checks.',answer:false,why:'Porting is normally subject to lender acceptance of the borrower’s circumstances and the new property.'},
 {prompt:'Further advance and remortgage options should be compared using fees, ERCs and overall suitability.',answer:true,why:'Headline rates alone do not tell the full borrowing-cost or flexibility story.'}],
 10:[
 {prompt:'Lower monthly payments always mean debt consolidation costs less overall.',answer:false,why:'A longer term can increase total interest, and unsecured debts may become secured against the home.'},
 {prompt:'Consolidating credit card debt into a mortgage can put the home at additional risk.',answer:true,why:'The formerly unsecured debt becomes part of the mortgage security and non-payment can have serious consequences.'}],
 11:[
 {prompt:'Borrowers should contact lenders early when they expect to struggle with repayments.',answer:true,why:'Early contact often gives more scope to assess tailored support and reduces the risk of compounding arrears.'},
 {prompt:'Repossession should automatically be a lender’s first response to one missed payment.',answer:false,why:'Firms should consider fair treatment, appropriate support and forbearance; repossession is a serious last-resort outcome.'}],
 12:[
 {prompt:'A shared ownership affordability illustration should ignore rent on the unsold share.',answer:false,why:'All housing costs matter, including the mortgage, rent and relevant service or estate charges.'},
 {prompt:'Eligibility and detailed terms of official homeownership schemes can change over time.',answer:true,why:'Always distinguish a scheme’s broad purpose from changeable eligibility and current terms.'}],
 13:[
 {prompt:'Lease length can affect lender appetite and marketability of a flat.',answer:true,why:'A short lease can reduce a lender’s acceptable security value or cause an outright decline.'},
 {prompt:'Beneficial tenants in common automatically inherit one another’s shares by survivorship.',answer:false,why:'Each beneficial owner has a distinct share which normally passes through the estate rather than survivorship.'}],
 14:[
 {prompt:'A tracker mortgage rate can move when its contractual reference rate moves.',answer:true,why:'A tracker follows the benchmark specified in its contract, subject to any applicable terms such as collars.'},
 {prompt:'The mortgage with the lowest initial rate must always be the best recommendation.',answer:false,why:'Compare fees, total cost, reversion risk, flexibility, early repayment charges and client plans.'}],
 15:[
 {prompt:'Standard interest-only payments automatically reduce the mortgage principal each month.',answer:false,why:'They generally pay interest only; a separate credible repayment strategy is needed for the capital.'},
 {prompt:'A repayment mortgage normally reduces the capital balance over its term.',answer:true,why:'Each scheduled instalment generally includes interest and capital, reducing the amount owed if payments are made as planned.'}],
 16:[
 {prompt:'An adviser can ignore expected retirement income when a mortgage extends beyond retirement.',answer:false,why:'Future sustainable affordability is important when the mortgage term overlaps retirement.'},
 {prompt:'A suitable recommendation should explain why the chosen option fits and why major alternatives are less appropriate.',answer:true,why:'A clear rationale shows the reasoning from client needs and risks to recommendation and rejected alternatives.'}]
};
