/** Plain-language learning prompts mapped to the CII CF6 June 2026 syllabus.
 * These are original revision summaries, not quoted exam questions or an official checklist. */
export type CoverageItem = {code:string;title:string;understand:string;examTrap:string};
export const syllabusUrl='https://media.umbraco.io/ciigroup-dxp/ewpb05xv/cf6_mortgage_advice_examination_syllabus.pdf';
export const officialCoverage:Record<number,CoverageItem[]>={
1:[
 {code:'1.1',title:'Which secured loans are regulated?',understand:'Distinguish first- and second-charge lending and establish whether the particular transaction falls under mortgage regulation before applying the rules.',examTrap:'A product name alone does not decide whether MCOB applies.'},
 {code:'1.2',title:'Mortgage conduct requirements',understand:'Link MCOB disclosure, affordability, responsible lending, advice and ongoing treatment requirements to the relevant stage of the transaction.',examTrap:'A lender accepting an application does not prove the adviser met suitability obligations.'},
 {code:'1.3',title:'Apply rules to a client',understand:'Identify the customer, security, loan purpose, adviser activity and any vulnerable-customer needs before recommending a course of action.',examTrap:'Start with the facts and regulatory scope, not the cheapest rate.'}],
2:[
 {code:'2.1',title:'England and Wales: offer to completion',understand:'Explain offer, legal enquiries, searches, survey, contract exchange, completion and registration, and distinguish the roles of conveyancer, surveyor, lender and agent.',examTrap:'An accepted offer is usually not legally binding until exchange.'},
 {code:'2.2',title:'Scottish property purchase',understand:'Recognise the Home Report, formal written offers and the binding missives process, and distinguish this from exchange of contracts in England and Wales.',examTrap:'Do not apply the English exchange/completion sequence unchanged in Scotland.'},
 {code:'2.3',title:'Auction transactions',understand:'Understand the effect of bidding, deposit and completion deadlines and why searches, surveys and funding should be arranged before bidding.',examTrap:'A winning bid can create a binding obligation before standard mortgage underwriting is complete.'}],
3:[
 {code:'3.1',title:'Valuation versus survey',understand:'Compare lender valuation, condition report and detailed building survey; distinguish lender security decisions from buyer protection.',examTrap:'A mortgage valuation is not a comprehensive structural survey for the buyer.'},
 {code:'3.2',title:'Value and report findings',understand:'Assess location, condition, comparables, local marketability and title/lease issues in a valuation report.',examTrap:'Purchase price and market value can differ.'},
 {code:'3.3',title:'Property defects',understand:'Explain structural movement, damp, roof defects, non-standard construction and when specialist reports or retention may follow.',examTrap:'Repairs and specialist reports can affect both advance size and security suitability.'}],
4:[
 {code:'4.1',title:'Borrower types',understand:'Distinguish first-time buyers, movers, self-employed, joint borrowers, later-life applicants and people with irregular income.',examTrap:'Income headline figures are not a substitute for verified sustainable earnings.'},
 {code:'4.2',title:'Tailor borrowing solutions',understand:'Relate term, repayment strategy, property type, deposit, flexibility and retirement plans to each borrower profile.',examTrap:'The longest available term is not automatically suitable.'},
 {code:'4.3',title:'Additional security and guarantors',understand:'Explain gifted deposits, guarantees, third-party charges and the risks and documentation they introduce.',examTrap:'A guarantor may be exposed to a serious enforceable liability.'},
 {code:'4.4',title:'Barriers to borrowing',understand:'Identify credit history, debt commitments, unacceptable security, income evidence and affordability shortfalls.',examTrap:'A deposit that meets LTV rules cannot override an affordability failure.'}],
5:[
 {code:'5.1',title:'Economic and market context',understand:'Connect inflation, Bank Rate, lenders’ funding costs, house prices, credit availability and economic stress to fixed and variable mortgage products.',examTrap:'A tracker tied to Bank Rate and a lender-set variable rate need not move together.'}],
6:[
 {code:'6.1',title:'Role of a mortgage adviser',understand:'Gather evidence, clarify objectives, explain options, document recommendations and communicate transparently.',examTrap:'An adviser’s duty does not end when a lender gives a decision in principle.'},
 {code:'6.2',title:'Ethics and customer outcomes',understand:'Use clear, fair explanations, avoid conflicts of interest and account for foreseeable harm and additional support needs.',examTrap:'Suitability is not simply selecting the lowest advertised rate.'},
 {code:'6.3',title:'Affordability',understand:'Verify sustainable income, debts, commitments, living costs and foreseeable changes; estimate realistic budget headroom and stress payments.',examTrap:'Gross income multiples alone are not a complete affordability test.'},
 {code:'6.4',title:'Evidence suitability',understand:'Consider cost, rate risk, restrictions, repayment method, term, support needs and a plausible exit strategy.',examTrap:'Passing a lender’s criteria is not the same as a suitable recommendation.'}],
7:[
 {code:'7.1',title:'Transaction fees and charges',understand:'Compare survey, valuation, legal, arrangement, broker, exit and early repayment charges across purchase and remortgage choices.',examTrap:'Compare total relevant-period cost, not only the initial monthly payment.'},
 {code:'7.2',title:'Taxes and ownership costs',understand:'Identify where SDLT, LTT and LBTT may apply and how tax depends on jurisdiction, property price and buyer status.',examTrap:'Tax thresholds and rates change; verify the exam-year tables rather than memorising obsolete examples.'}],
8:[
 {code:'8.1',title:'Protection cover and lender interest',understand:'Contrast life cover, critical illness, income protection, buildings insurance and unemployment-related cover by triggers, exclusions, benefit and term.',examTrap:'A life policy does not generally provide income when the insured survives but cannot work.'},
 {code:'8.2',title:'Protection sales regulation',understand:'Understand disclosure, demands-and-needs assessment, appropriate recommendations and what protection a lender can or cannot require.',examTrap:'Do not assume every recommended protection product is a compulsory mortgage condition.'}],
9:[
 {code:'9.1',title:'Raising additional finance',understand:'Compare further advance, second charge and full remortgage against additional LTV, affordability, interest, fees and existing product conditions.',examTrap:'Do not refinance a valuable existing fixed rate without costing the impact.'},
 {code:'9.2',title:'Transfers, amendments and redemption',understand:'Explain product transfer, porting, transfer of equity, deeds, consent and redemption processes and associated costs.',examTrap:'Portability is subject to fresh assessment and does not guarantee a new advance.'}],
10:[
 {code:'10.1',title:'Debt consolidation trade-offs',understand:'Compare total lifetime repayment cost, mortgage term, unsecured versus secured risk, affordability and alternatives.',examTrap:'Lower monthly instalments can increase total interest and put the home at risk.'}],
11:[
 {code:'11.1',title:'Borrower rights and remedies',understand:'Explain early contact, repayment proposals, budgeting, independent support and how lenders should treat customers in arrears.',examTrap:'Repossession is not the first response to a missed payment.'},
 {code:'11.2',title:'Lender arrears options',understand:'Understand forbearance, term adjustment, interest-only arrangements where appropriate, enforcement and records.',examTrap:'A temporary arrangement must be assessed for long-term sustainability.'},
 {code:'11.3',title:'Repossession framework',understand:'Recognise court process, pre-action expectations, proportionate treatment and last-resort enforcement.',examTrap:'Missing one payment does not automatically transfer ownership to the lender.'}],
12:[
 {code:'12.1',title:'Assistance for financial difficulty',understand:'Know the broad purpose and eligibility considerations of available state help and mortgage interest support.',examTrap:'Support for Mortgage Interest is generally recoverable as a loan, not free repayment of the mortgage.'},
 {code:'12.2',title:'Government-backed purchase schemes',understand:'Compare the principles of shared ownership and jurisdiction-specific homebuyer assistance; check live scheme eligibility.',examTrap:'Do not assume a scheme operates everywhere in the UK or is open to all applicants.'}],
13:[
 {code:'13.1',title:'Tenure, title and rights',understand:'Distinguish freehold, leasehold, commonhold, joint tenancy and tenancy in common, and identify title, lease length and restrictive-covenant implications.',examTrap:'Co-ownership legal/beneficial arrangements can affect survivorship and inheritance.'}],
14:[
 {code:'14.1',title:'Mortgage product structures',understand:'Compare residential, buy-to-let, offset, flexible, fixed-interest and other product structures and repayment terms.',examTrap:'Product structure and capital repayment method are different dimensions.'},
 {code:'14.2',title:'Interest-rate arrangements',understand:'Contrast fixed, discounted, tracker, capped and lender-set variable rates, fees and early repayment charges.',examTrap:'The lowest initial quoted rate may not be cheapest for the intended holding period.'}],
15:[
 {code:'15.1',title:'Repayment choices',understand:'Calculate repayment and interest-only instalments, explore overpayments, term changes and mixed strategies.',examTrap:'An interest-only payment excludes capital repayment.'},
 {code:'15.2',title:'Long-term obligations',understand:'Assess acceptable interest-only repayment plans, maturity risk and the effect of changes in rates and income.',examTrap:'Future house-price growth is not a guaranteed capital repayment strategy.'}],
16:[
 {code:'16.1a',title:'Analyse a complete client fact-find',understand:'Combine income, spending, deposit, credit, property security, life plans, protection and lender criteria.',examTrap:'A single apparently attractive fact rarely establishes an overall recommendation.'},
 {code:'16.1b',title:'Recommend and justify',understand:'Calculate LTV and borrowing costs, rule out ineligible options and explain product suitability with evidence.',examTrap:'Eliminate criteria failures before ranking eligible products on price.'},
 {code:'16.1c',title:'Assess change and risk',understand:'Test likely moves, job changes, retirement, rate changes, ERCs and an adequate capital repayment strategy.',examTrap:'The correct choice for today can be wrong once foreseeable events are considered.'}]
};
