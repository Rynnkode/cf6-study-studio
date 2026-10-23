import {useEffect, useMemo, useState, type ReactNode} from 'react';
import {ArrowRight, BookOpen, Check, CheckCircle2, ChevronLeft, CircleHelp, FileText, Lightbulb, ListChecks, MoveRight, Sparkles, TriangleAlert} from 'lucide-react';
import type {Lesson} from '../data/syllabus';

export type PremiumLessonViewProps = {
  lesson: Lesson;
  examWeight: number;
  completed: boolean;
  onBack: () => void;
  onStartCheck: () => void;
  onToggleComplete: () => void;
};

type LessonStage = {title: string; caption: string; detail: string};
type CompareRow = {label: string; left: string; right: string};
type MicroStep = {title: string; detail: string};
type LessonExperience = {
  strapline: string;
  visualIntro: string;
  learnHeadings: string[];
  stages: LessonStage[];
  compareTitle: string;
  compareRows: CompareRow[];
  imageTitle: string;
  imagePoints: string[];
  workedSteps: MicroStep[];
  revisionChallenge: string;
  advisorLens: string;
};

type TabKey = 'learn' | 'visualise' | 'example' | 'try';

const experiences: Record<number, LessonExperience> = {
  1: {
    strapline: 'Know when the mortgage rulebook applies, then show how suitable advice is evidenced.',
    visualIntro: 'This outcome is about spotting the regulatory perimeter first, then moving through disclosure, advice and record-keeping in a compliant order.',
    learnHeadings: ['Start with scope', 'Move into advice duties', 'Finish with evidence'],
    stages: [
      {title: 'Is it regulated?', caption: 'Check the perimeter', detail: 'Identify borrower type, security, occupancy and whether the arrangement falls inside regulated mortgage business. Never assume every property-backed loan is treated the same.'},
      {title: 'What are you doing?', caption: 'Advice, arranging or lending', detail: 'The customer journey changes depending on whether the firm advises, arranges or lends. That determines disclosure, suitability and record obligations.'},
      {title: 'Why this product?', caption: 'Suitability narrative', detail: 'Show why the recommendation meets needs, affordability and risk tolerance. The audit trail matters as much as the conclusion.'},
    ],
    compareTitle: 'Regulation check',
    compareRows: [
      {label: 'Focus', left: 'Regulated mortgage contract', right: 'Unregulated / outside scope'},
      {label: 'Main test', left: 'Individual/trustees + land + dwelling use', right: 'Falls outside key conditions or exemption applies'},
      {label: 'Adviser task', left: 'Assess suitability and disclosures', right: 'Still communicate clearly but do not misstate FCA status'},
    ],
    imageTitle: 'Advice journey',
    imagePoints: ['Perimeter check', 'Fact-find', 'Recommend', 'Explain risks', 'Record rationale'],
    workedSteps: [
      {title: 'Customer asks for a second charge', detail: 'Do not label it “just a personal loan”. First establish whether the secured arrangement is regulated and what advice rules apply.'},
      {title: 'Gather relevant facts', detail: 'Understand borrowing purpose, affordability, credit profile, repayment plan and any vulnerability issues.'},
      {title: 'Explain why the recommendation fits', detail: 'A cheap rate alone is not enough—show why the product structure meets the customer’s needs.'},
    ],
    revisionChallenge: 'List three facts you would need before deciding whether a secured loan is inside the mortgage conduct rules.',
    advisorLens: 'The premium answer is not “I know the rule”. It is “I know how to apply the rule, explain the risk and evidence the recommendation.”',
  },
  2: {
    strapline: 'See the purchase from offer through to completion and understand where legal commitment really starts.',
    visualIntro: 'The exam often checks whether you can distinguish accepted offers, exchange, completion and the specific roles of solicitor, lender and surveyor.',
    learnHeadings: ['Offer and negotiation', 'Legal work and exchange', 'Completion and registration'],
    stages: [
      {title: 'Offer accepted', caption: 'Progress but not binding', detail: 'In England and Wales an accepted offer does not usually create a binding contract. The buyer can still withdraw before exchange, although costs may already have been incurred.'},
      {title: 'Conveyancing', caption: 'Investigate title and risk', detail: 'The conveyancer checks title, searches, enquiries and transfer documents. This legal work protects the buyer and lender before contracts are exchanged.'},
      {title: 'Exchange to completion', caption: 'Contract then ownership', detail: 'Exchange creates binding obligations. Completion is the money-and-keys stage, then registration follows.'},
    ],
    compareTitle: 'Key milestones',
    compareRows: [
      {label: 'Accepted offer', left: 'Commercial agreement', right: 'Not yet a binding contract in England & Wales'},
      {label: 'Exchange', left: 'Binding obligations start', right: 'Deposit and completion date matter'},
      {label: 'Completion', left: 'Funds transfer and ownership passes', right: 'Registration follows after completion'},
    ],
    imageTitle: 'Buying chain map',
    imagePoints: ['Buyer', 'Seller', 'Broker', 'Lender', 'Conveyancer', 'Land Registry'],
    workedSteps: [
      {title: 'Survey reveals defects', detail: 'Before exchange the buyer may renegotiate or withdraw in England and Wales because legal commitment has not yet started.'},
      {title: 'Chain delays', detail: 'A linked transaction can hold up exchange because several purchases need to align.'},
      {title: 'Auction purchase', detail: 'At a traditional auction obligations arise much faster, so finance and legal checks should be done in advance.'},
    ],
    revisionChallenge: 'Explain the difference between exchange and completion in one sentence each.',
    advisorLens: 'Advisers help clients plan timing, expectations and costs—not just the mortgage application.',
  },
  3: {
    strapline: 'Separate value from condition and know why lenders value differently from buyers.',
    visualIntro: 'This outcome becomes much easier when you visualise three distinct questions: What is the property worth? What condition is it in? Can the lender rely on it as security?',
    learnHeadings: ['Valuation purpose', 'Survey depth', 'Defects and lending impact'],
    stages: [
      {title: 'Value', caption: 'Security for the lender', detail: 'A mortgage valuation supports the lender’s security decision. It is not designed to give the buyer a full defects diagnosis.'},
      {title: 'Condition', caption: 'Survey for the buyer', detail: 'A Level 2 or Level 3 survey explores condition in more detail. Older, altered or unusual homes generally need deeper investigation.'},
      {title: 'Lending outcome', caption: 'Shortfall, retention or decline', detail: 'The lender may reduce the advance, impose conditions or retain part of the loan if the property raises concerns.'},
    ],
    compareTitle: 'Valuation vs survey',
    compareRows: [
      {label: 'Who it primarily protects', left: 'Valuation: lender', right: 'Survey: buyer'},
      {label: 'Main purpose', left: 'Estimate market/security value', right: 'Identify condition and defects'},
      {label: 'Common outcome', left: 'Down valuation / retention', right: 'Repair insight / negotiation evidence'},
    ],
    imageTitle: 'Property risk picture',
    imagePoints: ['Market value', 'Construction type', 'Movement', 'Damp / timber', 'Environmental risk'],
    workedSteps: [
      {title: 'Price exceeds valuation', detail: 'If the lender values the property at less than the agreed price, borrowing is based on the lower relevant figure.'},
      {title: 'Non-standard construction', detail: 'Even if habitable, unusual construction can reduce marketability and therefore lender appetite.'},
      {title: 'Retention', detail: 'A lender may withhold part of the advance until essential works are completed.'},
    ],
    revisionChallenge: 'Why can the purchase price, valuation and market value differ?',
    advisorLens: 'Good advice prepares the client for both property risk and funding consequences.',
  },
  4: {
    strapline: 'Different borrower types create different evidence needs, structures and risk conversations.',
    visualIntro: 'Think of this topic as a client-type map: income pattern, deposit source, property use and support arrangements all change the conversation.',
    learnHeadings: ['Borrower profile', 'Evidence and support', 'Risk and structure'],
    stages: [
      {title: 'Profile the client', caption: 'Income, age and purpose', detail: 'First-time buyers, contractors, self-employed applicants and older borrowers each raise different underwriting questions.'},
      {title: 'Verify support', caption: 'Deposit gifts and guarantors', detail: 'Gifted deposits, guarantors or joint arrangements need source checks and clear explanation of responsibilities.'},
      {title: 'Match structure to need', caption: 'Term, ownership and liability', detail: 'The recommendation should fit future affordability, ownership aims and the true level of risk being accepted.'},
    ],
    compareTitle: 'Common client differences',
    compareRows: [
      {label: 'Self-employed', left: 'Variable income evidence', right: 'May use accounts, SA302s or trading history'},
      {label: 'Gifted deposit', left: 'Source must be understood', right: 'Gift should not disguise repayable debt'},
      {label: 'Guarantor support', left: 'Can strengthen case', right: 'Does not remove affordability checks'},
    ],
    imageTitle: 'Client profile board',
    imagePoints: ['Income stability', 'Deposit source', 'Credit history', 'Property type', 'Retirement plans'],
    workedSteps: [
      {title: 'Contractor with strong recent month', detail: 'Do not annualise the best month blindly—look for sustainable verified income.'},
      {title: 'Parent offers guarantee', detail: 'Explain the liability clearly. “Helping out” can become a real financial obligation.'},
      {title: 'Joint borrower / sole owner', detail: 'Clarify ownership, affordability and long-term implications, not just lender acceptance.'},
    ],
    revisionChallenge: 'Name four areas you would investigate more deeply for a self-employed applicant.',
    advisorLens: 'A premium answer links customer facts to both underwriting evidence and advice suitability.',
  },
  5: {
    strapline: 'Macro conditions feed through into rates, lender appetite and the client’s payment resilience.',
    visualIntro: 'This lesson makes more sense as a chain: economic conditions affect lender funding, which affects products, which then affects affordability and remortgage risk.',
    learnHeadings: ['Macro indicators', 'Transmission into mortgage pricing', 'Customer impact'],
    stages: [
      {title: 'Economic backdrop', caption: 'Inflation, growth and jobs', detail: 'Inflation, wages, house prices, employment and credit availability shape the mortgage market backdrop.'},
      {title: 'Funding and products', caption: 'Not just Bank Rate', detail: 'Bank Rate matters, but fixed pricing is also influenced by funding costs and market expectations such as swap rates.'},
      {title: 'Borrower resilience', caption: 'Payment stress and remortgage risk', detail: 'Higher rates can tighten affordability and create payment shock when a fixed deal ends.'},
    ],
    compareTitle: 'Cause and effect',
    compareRows: [
      {label: 'Inflation rises', left: 'Pressure on policy and funding costs', right: 'Mortgage pricing may increase'},
      {label: 'Credit tightens', left: 'Lenders may reduce appetite', right: 'Eligibility can narrow even without the same price change'},
      {label: 'Fixed deal expires', left: 'Payment may jump', right: 'Advice should revisit resilience before the switch'},
    ],
    imageTitle: 'Rate-shock pathway',
    imagePoints: ['Economy', 'Funding', 'Products', 'Affordability', 'Arrears risk'],
    workedSteps: [
      {title: 'Customer nearing end of fixed rate', detail: 'Review likely payment change before the deal ends, not after the customer hits the reversion rate.'},
      {title: 'Bank Rate falls but fixes remain high', detail: 'Do not assume products move one-for-one. Funding markets and expectations can lead to different outcomes.'},
      {title: 'Affordability stress', detail: 'Discuss resilience, overpayments and term implications when rates are volatile.'},
    ],
    revisionChallenge: 'How can fixed rates move differently from Bank Rate?',
    advisorLens: 'Economic context matters because advice should prepare the client for plausible payment changes, not just today’s quote.',
  },
  6: {
    strapline: 'Suitability is broader than passing affordability; it is about clear, inclusive and evidenced advice.',
    visualIntro: 'The strongest answers show a full advice loop: collect facts, assess suitability, communicate clearly, adapt for vulnerability and keep a proper record.',
    learnHeadings: ['Fact-find thoroughly', 'Assess affordability and suitability', 'Communicate and evidence'],
    stages: [
      {title: 'Fact-find', caption: 'Collect relevant client circumstances', detail: 'Objectives, income, expenditure, future changes, dependants and rate-risk appetite all shape a suitable recommendation.'},
      {title: 'Judge the fit', caption: 'Payment + product structure', detail: 'A mortgage can be technically affordable yet still unsuitable if fees, ERCs, term or flexibility do not fit the customer’s plans.'},
      {title: 'Support understanding', caption: 'Vulnerability and explanation', detail: 'Adjust communication for vulnerability, explain risks clearly and keep an audit trail for why other options were not chosen.'},
    ],
    compareTitle: 'What makes advice suitable?',
    compareRows: [
      {label: 'Affordability', left: 'Can the client sustain the payments?', right: 'Includes foreseeable changes, not just today’s salary'},
      {label: 'Product fit', left: 'Does the structure solve the need?', right: 'Rate, term, flexibility, fees and ERCs all matter'},
      {label: 'Communication', left: 'Has the client understood?', right: 'Especially important where vulnerability is present'},
    ],
    imageTitle: 'Suitability triangle',
    imagePoints: ['Facts', 'Fit', 'Understanding', 'Evidence', 'Alternatives considered'],
    workedSteps: [
      {title: 'Client wants cheapest initial rate', detail: 'If they plan to move soon, a long fixed deal with heavy ERCs may be unsuitable despite the cheap headline price.'},
      {title: 'Income multiple temptation', detail: 'Do not treat a simple multiple as the whole affordability assessment.'},
      {title: 'Vulnerable customer', detail: 'Adjust pace and explanation style while keeping the customer’s autonomy central.'},
    ],
    revisionChallenge: 'What is the difference between affordability and suitability?',
    advisorLens: 'The premium adviser explains not only what they recommended, but why alternatives were less appropriate.',
  },
  7: {
    strapline: 'The purchase cost is wider than deposit plus repayment, and whole-deal comparison matters.',
    visualIntro: 'Use this lesson like a budgeting diagram: entry costs, ongoing costs and switching costs all need to be seen together.',
    learnHeadings: ['Up-front buying costs', 'Tax and jurisdiction', 'Whole-deal remortgage comparison'],
    stages: [
      {title: 'Entry costs', caption: 'Not just deposit', detail: 'Valuation, survey, legal work, searches, insurance, removals and possibly broker or lender fees all need to be budgeted.'},
      {title: 'Tax layer', caption: 'Jurisdiction matters', detail: 'England/Northern Ireland, Scotland and Wales use different property transaction tax systems. Thresholds and reliefs can change.'},
      {title: 'Whole-deal view', caption: 'Compare incentives and charges', detail: 'A product with an arrangement fee or early repayment charge can be worse overall than a product with a slightly higher rate.'},
    ],
    compareTitle: 'Headline rate vs whole deal',
    compareRows: [
      {label: 'Initial rate', left: 'May look attractive', right: 'Could hide high fees or restrictive terms'},
      {label: 'Fees added to loan', left: 'Reduces immediate cash need', right: 'Increases borrowing and interest over time'},
      {label: 'Incentives', left: 'Cashback / free legals may help', right: 'Need comparing against the full product cost'},
    ],
    imageTitle: 'Cost stack',
    imagePoints: ['Deposit', 'Fees', 'Tax', 'Insurance', 'Moving costs'],
    workedSteps: [
      {title: 'Fee-added product', detail: 'Explain that adding a fee to the loan may improve cash flow now but increases interest and balance.'},
      {title: 'Jurisdiction trap', detail: 'Do not apply SDLT logic to Wales or Scotland without checking the correct tax regime.'},
      {title: 'Remortgage incentives', detail: 'A “free legals” deal can still be poor value if the reversion or fees are weak overall.'},
    ],
    revisionChallenge: 'Name five non-price costs a homebuyer should budget for.',
    advisorLens: 'Customers remember when advisers help them avoid nasty surprise costs—not just when they find a rate.',
  },
  8: {
    strapline: 'Protection planning sits alongside the mortgage because the repayment plan depends on income, life and health resilience.',
    visualIntro: 'A premium mortgage recommendation considers what happens if earnings stop, death occurs or serious illness changes the household plan.',
    learnHeadings: ['Risk to the mortgage', 'Match cover to need', 'Explain limitations clearly'],
    stages: [
      {title: 'Identify the risk', caption: 'Death, illness, loss of income', detail: 'Mortgage affordability today does not solve what happens if earnings stop or the family loses financial support.'},
      {title: 'Choose the cover type', caption: 'Life, CI and IP', detail: 'Each product solves a different problem. The recommendation should connect the cover type to the customer’s actual protection gap.'},
      {title: 'Explain structure and limits', caption: 'Term, deferred period and exclusions', detail: 'Clients should understand how the policy works, what it pays and where important restrictions lie.'},
    ],
    compareTitle: 'Protection fit',
    compareRows: [
      {label: 'Life cover', left: 'Pays on death', right: 'Useful for clearing debt or supporting dependants'},
      {label: 'Critical illness cover', left: 'Pays on covered diagnosis', right: 'Scope depends on definitions and policy wording'},
      {label: 'Income protection', left: 'Replaces part of earnings', right: 'Deferred period, occupation definition and benefit cap matter'},
    ],
    imageTitle: 'Protection gap board',
    imagePoints: ['Mortgage balance', 'Family costs', 'Savings runway', 'Employer benefits', 'State support'],
    workedSteps: [
      {title: 'Single applicant with little sick pay', detail: 'Income protection may be central because mortgage payments rely heavily on continued earnings.'},
      {title: 'Family with children', detail: 'Life cover can protect the mortgage and preserve household stability.'},
      {title: 'Overconfidence in employer cover', detail: 'Always check duration and amount; short sick pay may leave a major gap.'},
    ],
    revisionChallenge: 'When might income protection be more relevant than critical illness cover?',
    advisorLens: 'The strongest advice links the mortgage to the client’s wider financial resilience.',
  },
  9: {
    strapline: 'Further borrowing and transfers need a fresh suitability assessment, not automatic acceptance.',
    visualIntro: 'This topic is about change: the client is altering an existing arrangement, so revisit purpose, cost, affordability and alternatives.',
    learnHeadings: ['Why the customer wants change', 'Compare routes', 'Explain risks and implications'],
    stages: [
      {title: 'Clarify the purpose', caption: 'Home improvement, debt or move', detail: 'The intended use of extra borrowing shapes product options and the advice discussion.'},
      {title: 'Compare routes', caption: 'Further advance, remortgage, porting', detail: 'Existing lender options and external remortgage alternatives should be compared on a whole-deal basis.'},
      {title: 'Reassess suitability', caption: 'New payments and new risks', detail: 'A previously suitable mortgage may not remain suitable once extra borrowing or a property move is introduced.'},
    ],
    compareTitle: 'Common routes',
    compareRows: [
      {label: 'Further advance', left: 'May retain existing loan', right: 'Can involve a separate rate or sub-account'},
      {label: 'Remortgage', left: 'Potentially better overall terms', right: 'May trigger fees or ERCs'},
      {label: 'Porting', left: 'Move current product to new home', right: 'Still subject to lender approval and affordability'},
    ],
    imageTitle: 'Decision route map',
    imagePoints: ['Purpose', 'Existing deal', 'ERCs', 'New affordability', 'Flexibility'],
    workedSteps: [
      {title: 'Home-improvement borrowing', detail: 'Check whether increasing borrowing on the mortgage is better than other forms of finance and whether the term remains appropriate.'},
      {title: 'Porting assumption', detail: 'A portable mortgage is not an unconditional promise—it still depends on the lender’s criteria and the new case.'},
      {title: 'Switching costs', detail: 'A slightly lower rate can be wiped out by charges and ERCs.'},
    ],
    revisionChallenge: 'What should be compared before recommending a further advance over a remortgage?',
    advisorLens: 'Treat changes to an existing mortgage as a fresh advice event, not a quick admin exercise.',
  },
  10: {
    strapline: 'Debt consolidation can simplify finances, but it can also increase long-term cost and put the home at greater risk.',
    visualIntro: 'This outcome is easier when you map short-term relief against long-term risk. The client may improve monthly cash flow while worsening total cost or secured exposure.',
    learnHeadings: ['Why clients consider consolidation', 'Benefit vs risk', 'How to explain suitability'],
    stages: [
      {title: 'Cash-flow pressure', caption: 'The immediate appeal', detail: 'Consolidation can reduce the monthly outgoings by spreading debt over a longer term or a lower rate.'},
      {title: 'Structural risk', caption: 'Unsecured debt becomes secured', detail: 'Moving short-term unsecured debt onto a mortgage can increase risk to the home and extend repayment for many years.'},
      {title: 'Advice judgement', caption: 'Suitability and alternatives', detail: 'You must consider behaviour, long-term cost and whether other solutions are more appropriate.'},
    ],
    compareTitle: 'Consolidation trade-off',
    compareRows: [
      {label: 'Monthly payment', left: 'Often falls', right: 'Because term may lengthen'},
      {label: 'Total interest', left: 'Can rise materially', right: 'Even if the rate is lower'},
      {label: 'Security risk', left: 'Debt may feel more manageable', right: 'But the home is now more exposed'},
    ],
    imageTitle: 'Cost-over-time picture',
    imagePoints: ['Current debts', 'New mortgage balance', 'Longer term', 'Total cost', 'Home at risk'],
    workedSteps: [
      {title: 'Client wants “one easy payment”', detail: 'Explore whether simplicity is the real need or whether budgeting, terming and debt advice should also be discussed.'},
      {title: 'Rate-focused thinking', detail: 'A lower mortgage rate does not automatically mean the debt consolidation is better overall.'},
      {title: 'Suitability rationale', detail: 'If recommended, explain clearly why it is appropriate and what long-term consequences the client accepts.'},
    ],
    revisionChallenge: 'Why can debt consolidation lower monthly cost but still be a poor long-term outcome?',
    advisorLens: 'This is one of the clearest topics where “cheaper now” can still mean “worse advice”.',
  },
  11: {
    strapline: 'Arrears management is about early action, fairness and understanding the lender’s options before repossession is considered.',
    visualIntro: 'Think of arrears as a customer journey. The key learning is what should happen before matters escalate and what options may reduce harm.',
    learnHeadings: ['Spot difficulty early', 'Consider forbearance', 'Understand escalation'],
    stages: [
      {title: 'Payment strain appears', caption: 'Early intervention', detail: 'Encouraging customers to engage early can widen the options and reduce overall harm.'},
      {title: 'Forbearance options', caption: 'Temporary support measures', detail: 'Lenders may consider term extension, payment arrangements or other forms of tailored support depending on circumstances.'},
      {title: 'Escalation', caption: 'Repossession as last resort', detail: 'Repossession is serious and usually follows unsuccessful attempts to resolve the difficulty.'},
    ],
    compareTitle: 'Support before repossession',
    compareRows: [
      {label: 'Early contact', left: 'More options available', right: 'Helps prevent arrears from compounding'},
      {label: 'Forbearance', left: 'Can ease short-term pressure', right: 'Must still be suitable and realistic'},
      {label: 'Repossession', left: 'Last-resort enforcement', right: 'Major consequences for the household'},
    ],
    imageTitle: 'Arrears pathway',
    imagePoints: ['Missed payment', 'Contact', 'Assessment', 'Support option', 'Escalation risk'],
    workedSteps: [
      {title: 'Customer misses payments after rate rise', detail: 'The best time to act is early, before arrears become entrenched.'},
      {title: 'Temporary income dip', detail: 'A realistic short-term solution may help more than ignoring the issue.'},
      {title: 'Repossession misconception', detail: 'Explain that it is serious, costly and typically not the lender’s first step.'},
    ],
    revisionChallenge: 'Why is early communication so important in arrears cases?',
    advisorLens: 'Supportive, practical advice can materially change the client’s outcome long before formal enforcement.',
  },
  12: {
    strapline: 'State support and official schemes help some borrowers, but criteria and interactions must be understood accurately.',
    visualIntro: 'Treat this topic as an eligibility map. The exam often tests whether you know that support exists, what it broadly aims to do, and that current rules should be verified.',
    learnHeadings: ['Recognise support categories', 'Match to the client’s situation', 'Avoid outdated assumptions'],
    stages: [
      {title: 'Identify the client need', caption: 'Affordability, deposit or hardship', detail: 'Some schemes support access to homeownership, while others relate to broader welfare or housing support.'},
      {title: 'Check broad eligibility', caption: 'Criteria and interactions', detail: 'Household circumstances, earnings, benefits and tenure can all affect whether support is relevant.'},
      {title: 'Verify the live rules', caption: 'Rules change over time', detail: 'Support arrangements may evolve, so live primary sources should be checked when dealing with real clients.'},
    ],
    compareTitle: 'Support types',
    compareRows: [
      {label: 'Homeownership schemes', left: 'May help with access or structure', right: 'Still require suitability and lender acceptance'},
      {label: 'State benefits / support', left: 'Can affect affordability context', right: 'May be limited or conditional'},
      {label: 'Adviser role', left: 'Flag relevance and signpost', right: 'Avoid overstating guaranteed eligibility'},
    ],
    imageTitle: 'Support map',
    imagePoints: ['Housing cost help', 'Deposit support', 'Income context', 'Eligibility', 'Verification'],
    workedSteps: [
      {title: 'Client asks about a scheme they heard online', detail: 'Clarify the broad purpose first, then check the up-to-date official detail before giving reliance-based guidance.'},
      {title: 'Affordability with benefits', detail: 'Understand how income sources are treated and whether they are sustainable or accepted.'},
      {title: 'Outdated thresholds', detail: 'Do not present old limits or tax figures as current facts.'},
    ],
    revisionChallenge: 'What is the safest way to discuss changeable official support schemes in an exam or client conversation?',
    advisorLens: 'Be accurate about the existence and purpose of support, and careful about live eligibility details.',
  },
  13: {
    strapline: 'Tenure, ownership rights and legal structure shape the mortgage advice conversation.',
    visualIntro: 'This lesson becomes clearer when you compare ownership forms and think about how legal rights affect security, transfer and borrowing.',
    learnHeadings: ['Tenure and ownership basics', 'Rights and restrictions', 'Advice implications'],
    stages: [
      {title: 'Identify the legal structure', caption: 'Freehold, leasehold or other', detail: 'Different ownership structures create different rights, obligations and lender considerations.'},
      {title: 'Understand the restrictions', caption: 'Lease terms, rights and obligations', detail: 'Length of lease, service costs or legal limitations can influence both value and mortgageability.'},
      {title: 'Connect it to the mortgage', caption: 'Security and customer understanding', detail: 'The borrower should understand what they are buying and any implications for the lender’s security.'},
    ],
    compareTitle: 'Ownership comparison',
    compareRows: [
      {label: 'Freehold', left: 'Ownership of property and land', right: 'Typically fewer time-limited tenure issues'},
      {label: 'Leasehold', left: 'Right to occupy for a term', right: 'Lease length and obligations can matter a lot'},
      {label: 'Joint arrangements', left: 'Need clarity of rights and liability', right: 'Advice implications go beyond the mortgage payment'},
    ],
    imageTitle: 'Tenure picture board',
    imagePoints: ['Ownership rights', 'Lease term', 'Costs', 'Restrictions', 'Marketability'],
    workedSteps: [
      {title: 'Shortening lease', detail: 'A lease issue may affect both value and lender appetite.'},
      {title: 'Customer focuses only on the flat', detail: 'Bring attention back to tenure, obligations and the broader legal package being bought.'},
      {title: 'Joint ownership discussion', detail: 'Clarify ownership rights as well as the shared debt commitment.'},
    ],
    revisionChallenge: 'Why can tenure affect both suitability and mortgageability?',
    advisorLens: 'Understanding the property’s legal structure helps avoid nasty surprises later in the process.',
  },
  14: {
    strapline: 'Product features should be compared through certainty, flexibility, reversion risk and long-term cost.',
    visualIntro: 'This is one of the biggest CF6 topics. Visualise it as a product family tree rather than a long list of definitions.',
    learnHeadings: ['Product families', 'Feature comparison', 'Choosing the right fit'],
    stages: [
      {title: 'Rate family', caption: 'Fixed, tracker, discount, variable', detail: 'Start by grouping products by how the rate behaves over time.'},
      {title: 'Feature layer', caption: 'Caps, collars, offsets and portability', detail: 'Then add secondary features that change flexibility or the way interest is calculated.'},
      {title: 'Customer fit', caption: 'Certainty vs flexibility', detail: 'The best product depends on the customer’s priorities, time horizon and tolerance for payment change.'},
    ],
    compareTitle: 'Product behaviour',
    compareRows: [
      {label: 'Fixed rate', left: 'Payment certainty for set period', right: 'May have less flexibility and stronger ERCs'},
      {label: 'Tracker / variable', left: 'Can move with reference rate or lender discretion', right: 'Less certainty for payment planning'},
      {label: 'Offset / flexible', left: 'May improve cash efficiency or control', right: 'Structure needs proper explanation'},
    ],
    imageTitle: 'Mortgage product map',
    imagePoints: ['Certainty', 'Rate movement', 'Fees', 'ERCs', 'Flexibility'],
    workedSteps: [
      {title: 'Customer wants certainty', detail: 'A fixed-rate product often fits, but check ERCs and likely moving plans.'},
      {title: 'Customer holds large savings', detail: 'An offset arrangement may be relevant, provided the client understands how the benefit works.'},
      {title: 'Headline rate trap', detail: 'A discount or tracker may start low but expose the client to later uncertainty.'},
    ],
    revisionChallenge: 'How would you explain the difference between a fixed, tracker and discount mortgage to a client?',
    advisorLens: 'The premium answer is about matching product behaviour to client need, not just reciting definitions.',
  },
  15: {
    strapline: 'Repayment methods determine whether the balance reduces now or depends on a separate strategy later.',
    visualIntro: 'The easiest way to remember this topic is to compare what happens to the capital over time under each method.',
    learnHeadings: ['How repayment differs', 'Interest-only risk', 'Strategy and review'],
    stages: [
      {title: 'Repayment mortgage', caption: 'Capital falls gradually', detail: 'Each monthly instalment generally includes both interest and capital, so the balance reduces over time.'},
      {title: 'Interest-only mortgage', caption: 'Capital usually stays', detail: 'The monthly payment covers interest only, so the original capital normally remains unless repaid separately.'},
      {title: 'Repayment strategy', caption: 'Plan must be credible', detail: 'Where capital is not automatically repaid, the borrower needs a suitable and realistic repayment route.'},
    ],
    compareTitle: 'Repayment structure',
    compareRows: [
      {label: 'Monthly payment', left: 'Repayment: higher', right: 'Interest-only: lower initially'},
      {label: 'Balance over time', left: 'Repayment: reduces', right: 'Interest-only: usually unchanged'},
      {label: 'End-of-term risk', left: 'Repayment: lower capital risk', right: 'Interest-only: requires a separate plan'},
    ],
    imageTitle: 'Balance-over-time picture',
    imagePoints: ['Monthly payment', 'Capital path', 'End balance', 'Strategy', 'Review risk'],
    workedSteps: [
      {title: 'Client attracted by lower monthly payment', detail: 'Interest-only can look easier, but the adviser must address how the capital will actually be repaid.'},
      {title: 'Illustrative payment difference', detail: 'A repayment mortgage may cost more per month because it is reducing the debt, not simply the interest bill.'},
      {title: 'Repayment strategy review', detail: 'The existence, suitability and monitoring of the repayment method are central.'},
    ],
    revisionChallenge: 'Why is an interest-only mortgage not simply a “cheaper mortgage”?',
    advisorLens: 'The crucial issue is not the smaller payment; it is what happens to the capital at the end.',
  },
  16: {
    strapline: 'Applied advice pulls the whole syllabus together: client facts, product fit, risks, explanations and recommendation rationale.',
    visualIntro: 'This is the synthesis lesson. A strong answer moves from facts to recommendation logically, explaining not just the choice but also the trade-offs.',
    learnHeadings: ['Read the client case', 'Compare the options', 'Explain and conclude'],
    stages: [
      {title: 'Client picture', caption: 'Objectives and constraints', detail: 'Start by identifying priorities, vulnerabilities, affordability and likely future changes.'},
      {title: 'Option assessment', caption: 'Product, term and structure', detail: 'Compare the realistic alternatives and test which best balances cost, certainty and flexibility.'},
      {title: 'Recommendation story', caption: 'Explain why this is suitable', detail: 'Pull together the reasons, risks and rejected alternatives in a clear customer-facing explanation.'},
    ],
    compareTitle: 'What the final answer should show',
    compareRows: [
      {label: 'Facts', left: 'Customer objectives and circumstances', right: 'Not just numbers—also future plans and risks'},
      {label: 'Analysis', left: 'Compare relevant options', right: 'Show why one route is stronger'},
      {label: 'Recommendation', left: 'Clear and suitable conclusion', right: 'Explain the trade-offs and key warnings'},
    ],
    imageTitle: 'Advice synthesis board',
    imagePoints: ['Needs', 'Affordability', 'Product fit', 'Risks', 'Recommendation'],
    workedSteps: [
      {title: 'Case study approach', detail: 'Underline key client facts first so the recommendation is built from evidence rather than intuition.'},
      {title: 'Balance priorities', detail: 'The right solution often requires a trade-off between rate certainty, cost and flexibility.'},
      {title: 'Conclude clearly', detail: 'Finish with a recommendation the client could understand, not a list of disconnected facts.'},
    ],
    revisionChallenge: 'What three reasons make a recommendation suitable in a typical client case?',
    advisorLens: 'This is the lesson where you think like a professional adviser rather than a memorising student.',
  },
};

const tabMeta: Array<{key: TabKey; label: string; note: string}> = [
  {key: 'learn', label: 'Learn', note: 'Chunked notes'},
  {key: 'visualise', label: 'Visualise', note: 'Charts & flows'},
  {key: 'example', label: 'Worked example', note: 'Apply the topic'},
  {key: 'try', label: 'Try it', note: 'Active recall'},
];

const estimReadingTime = (lesson: Lesson) => {
  const words = [lesson.intro, lesson.example, ...lesson.notes, ...lesson.points, ...lesson.traps, ...lesson.definitions.flat()].join(' ').split(/\s+/).filter(Boolean).length;
  return Math.max(4, Math.round(words / 165));
};

export function PremiumLessonView({lesson, examWeight, completed, onBack, onStartCheck, onToggleComplete}: PremiumLessonViewProps) {
  const [tab, setTab] = useState<TabKey>('learn');
  const [activeStage, setActiveStage] = useState(0);
  const [activeDef, setActiveDef] = useState(lesson.definitions[0]?.[0] ?? '');
  const experience = experiences[lesson.lo];

  useEffect(() => {
    setTab('learn');
    setActiveStage(0);
    setActiveDef(lesson.definitions[0]?.[0] ?? '');
  }, [lesson.id]);

  const readingTime = useMemo(() => estimReadingTime(lesson), [lesson]);

  const learnSections = lesson.notes.map((note, index) => ({
    title: experience.learnHeadings[index] ?? `Core idea ${index + 1}`,
    body: note,
  }));

  return (
    <>
      <button className="text-pine font-bold text-sm flex items-center gap-2 mb-5" onClick={onBack}>
        <ChevronLeft size={17} /> All lessons
      </button>

      <section className="rounded-[28px] border border-[#d6e4d8] bg-gradient-to-br from-[#ffffff] via-[#fbfdfb] to-[#eef5ef] p-5 md:p-7 shadow-[0_12px_40px_rgba(43,77,56,.08)]">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <span className="chip bg-sage text-pine">Week {lesson.week} • Learning outcome {lesson.lo}</span>
          <span className="text-sm text-muted">{examWeight} indicative standalone exam questions</span>
        </div>

        <div className="mt-5 grid lg:grid-cols-[1.4fr_.9fr] gap-5 items-start">
          <div>
            <p className="label mb-3">Premium lesson experience</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-forest leading-tight">{lesson.title}</h1>
            <p className="text-lg text-muted mt-3 leading-8">{lesson.intro}</p>
            <p className="text-sm text-forest/85 mt-4 rounded-2xl bg-white/80 border border-[#dce7de] p-4 leading-7">
              <Sparkles size={15} className="inline mr-2 text-[#4e916e]" />
              {experience.strapline}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <MetricCard label="Reading time" value={`${readingTime} min`} />
            <MetricCard label="Definitions" value={`${lesson.definitions.length}`} />
            <MetricCard label="Knowledge check" value="5 questions" />
            <MetricCard label="Revision level" value={completed ? 'Complete' : 'Open'} tone={completed ? 'success' : 'neutral'} />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-5">
        {tabMeta.map(item => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={`rounded-[22px] border px-4 py-4 text-left transition ${tab === item.key ? 'bg-forest text-white border-forest shadow-lg' : 'bg-white border-[#dfe7df] text-forest hover:border-[#96b79f]'}`}
          >
            <div className="font-extrabold text-lg">{item.label}</div>
            <div className={`text-xs mt-1 ${tab === item.key ? 'text-white/80' : 'text-muted'}`}>{item.note}</div>
          </button>
        ))}
      </div>

      {tab === 'learn' && (
        <div className="space-y-5 mt-5">
          <section className="card p-5 md:p-7">
            <div className="flex items-start gap-3 mb-4">
              <div className="rounded-2xl bg-sage text-pine p-3"><BookOpen size={20} /></div>
              <div>
                <h2 className="section-title">Learn the core ideas</h2>
                <p className="text-sm text-muted mt-1">Tap into the topic in digestible chunks rather than one long wall of text.</p>
              </div>
            </div>
            <div className="space-y-4">
              {learnSections.map(section => (
                <article key={section.title} className="rounded-2xl border border-[#e3ebe3] bg-[#fbfcfb] p-4 md:p-5">
                  <div className="flex items-center gap-2"><span className="chip bg-sage text-pine">Focus</span><h3 className="font-extrabold text-forest">{section.title}</h3></div>
                  <p className="text-[15px] leading-8 text-ink mt-3">{section.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="grid lg:grid-cols-[1.1fr_.9fr] gap-5">
            <div className="card p-5 md:p-7">
              <div className="flex items-start gap-3 mb-4">
                <div className="rounded-2xl bg-sage text-pine p-3"><FileText size={20} /></div>
                <div>
                  <h2 className="section-title">Definitions you should recognise</h2>
                  <p className="text-sm text-muted mt-1">Use the buttons to focus on one term at a time.</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap mb-4">
                {lesson.definitions.map(([term]) => (
                  <button key={term} onClick={() => setActiveDef(term)} className={`chip ${activeDef === term ? 'bg-forest text-white' : 'bg-sage text-pine'}`}>{term}</button>
                ))}
              </div>
              {lesson.definitions.map(([term, description]) => activeDef === term ? (
                <div key={term} className="rounded-2xl border border-[#dfe7df] bg-[#fbfdfb] p-5">
                  <h3 className="font-extrabold text-forest text-lg">{term}</h3>
                  <p className="text-sm text-muted leading-7 mt-2">{description}</p>
                </div>
              ) : null)}
            </div>

            <div className="space-y-5">
              <InfoCard icon={ListChecks} title="Remember these" tone="green">
                {lesson.points.map(point => (
                  <li key={point} className="flex gap-2"><Check size={16} className="shrink-0 mt-1 text-[#3d815b]" /> <span>{point}</span></li>
                ))}
              </InfoCard>

              <InfoCard icon={TriangleAlert} title="Common exam traps" tone="amber">
                {lesson.traps.map(point => (
                  <li key={point} className="flex gap-2"><TriangleAlert size={16} className="shrink-0 mt-1 text-[#a8742a]" /> <span>{point}</span></li>
                ))}
              </InfoCard>

              <div className="card p-5 bg-gradient-to-br from-[#f3f8f4] to-white border-[#dce7de]">
                <p className="label mb-2">Advisor lens</p>
                <h3 className="font-extrabold text-forest text-lg">Why this matters in real advice</h3>
                <p className="text-sm text-muted mt-3 leading-7">{experience.advisorLens}</p>
              </div>
            </div>
          </section>
        </div>
      )}

      {tab === 'visualise' && (
        <div className="space-y-5 mt-5">
          <section className="card p-5 md:p-7 bg-gradient-to-br from-[#fbfdfb] to-[#f1f6f2] border-[#dbe7dd]">
            <h2 className="section-title">Visualise the idea</h2>
            <p className="text-sm text-muted mt-2 leading-7">{experience.visualIntro}</p>
          </section>

          <section className="card p-5 md:p-7">
            <div className="flex items-start gap-3 mb-5">
              <div className="rounded-2xl bg-sage text-pine p-3"><MoveRight size={20} /></div>
              <div>
                <h2 className="section-title">How it works</h2>
                <p className="text-sm text-muted mt-1">Follow the three stages. Tap a stage to reveal its role.</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {experience.stages.map((stage, index) => (
                <button key={stage.title} onClick={() => setActiveStage(index)} className={`rounded-[22px] border p-4 text-left transition ${activeStage === index ? 'bg-forest text-white border-forest shadow-md' : 'bg-white border-[#dfe7df] text-forest hover:border-[#98b7a2]'}`}>
                  <div className="text-xs uppercase tracking-[.2em] font-bold opacity-80">Step {index + 1}</div>
                  <div className="font-extrabold text-2xl mt-3 leading-tight">{stage.title}</div>
                  <div className={`text-sm mt-2 ${activeStage === index ? 'text-white/80' : 'text-muted'}`}>{stage.caption}</div>
                </button>
              ))}
            </div>
            <div className="rounded-[24px] border border-[#dfe7df] bg-[#fbfdfb] p-5 md:p-6 mt-4">
              <p className="label">Expanded explanation</p>
              <h3 className="font-extrabold text-forest text-2xl mt-2">{experience.stages[activeStage].title}</h3>
              <p className="text-sm text-muted mt-3 leading-8">{experience.stages[activeStage].detail}</p>
            </div>
          </section>

          <div className="grid xl:grid-cols-[1.05fr_.95fr] gap-5">
            <section className="card p-5 md:p-7">
              <div className="flex items-start gap-3 mb-5">
                <div className="rounded-2xl bg-sage text-pine p-3"><Sparkles size={20} /></div>
                <div>
                  <h2 className="section-title">{experience.compareTitle}</h2>
                  <p className="text-sm text-muted mt-1">A simple comparison makes the exam differences much easier to remember.</p>
                </div>
              </div>
              <div className="space-y-3">
                {experience.compareRows.map(row => (
                  <div key={row.label} className="rounded-2xl border border-[#dfe7df] overflow-hidden">
                    <div className="bg-[#f4f8f4] px-4 py-3 font-bold text-forest text-sm">{row.label}</div>
                    <div className="grid md:grid-cols-2">
                      <div className="p-4 text-sm leading-7 border-b md:border-b-0 md:border-r border-[#e5ece5] bg-white"><span className="font-semibold text-forest">Left view:</span> {row.left}</div>
                      <div className="p-4 text-sm leading-7 bg-[#fbfdfb]"><span className="font-semibold text-forest">Right view:</span> {row.right}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="card p-5 md:p-7">
              <div className="flex items-start gap-3 mb-5">
                <div className="rounded-2xl bg-sage text-pine p-3"><Lightbulb size={20} /></div>
                <div>
                  <h2 className="section-title">Illustration panel</h2>
                  <p className="text-sm text-muted mt-1">This is a custom visual anchor to make the topic feel intentional rather than text-only.</p>
                </div>
              </div>
              <div className="rounded-[26px] p-5 border border-[#dbe6dc] bg-gradient-to-br from-[#14543a] via-[#1f6949] to-[#275f4b] text-white overflow-hidden relative">
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
                <div className="absolute -left-10 bottom-2 h-24 w-24 rounded-full bg-white/5" />
                <p className="text-xs uppercase tracking-[.25em] text-white/70">{experience.imageTitle}</p>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {experience.imagePoints.map((point, index) => (
                    <div key={point} className="rounded-2xl bg-white/10 backdrop-blur p-4 border border-white/10">
                      <div className="text-[11px] uppercase tracking-[.22em] text-white/60">Point {index + 1}</div>
                      <div className="font-bold mt-2 leading-6">{point}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl bg-white/10 p-4 text-sm text-white/90 leading-7">
                  <strong>Memory cue:</strong> Talk yourself through the pathway from top left to bottom right as if you were explaining it to a client.
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {tab === 'example' && (
        <div className="space-y-5 mt-5">
          <section className="card p-5 md:p-7">
            <div className="flex items-start gap-3 mb-4">
              <div className="rounded-2xl bg-sage text-pine p-3"><FileText size={20} /></div>
              <div>
                <h2 className="section-title">Worked mortgage example</h2>
                <p className="text-sm text-muted mt-1">Use the scenario below to turn knowledge into advice reasoning.</p>
              </div>
            </div>
            <div className="rounded-[22px] border-l-4 border-[#6da185] bg-sage p-5 md:p-6 leading-8 text-[15px] text-ink">{lesson.example}</div>
          </section>

          <section className="card p-5 md:p-7">
            <div className="flex items-start gap-3 mb-5">
              <div className="rounded-2xl bg-sage text-pine p-3"><ListChecks size={20} /></div>
              <div>
                <h2 className="section-title">How to work through it</h2>
                <p className="text-sm text-muted mt-1">Follow the advisory logic rather than jumping straight to an answer.</p>
              </div>
            </div>
            <div className="space-y-4">
              {experience.workedSteps.map((step, index) => (
                <div key={step.title} className="rounded-[22px] border border-[#e2e9e2] bg-[#fbfcfb] p-4 md:p-5 flex gap-4 items-start">
                  <div className="h-10 w-10 rounded-full bg-forest text-white flex items-center justify-center text-sm font-black shrink-0">{index + 1}</div>
                  <div>
                    <h3 className="font-extrabold text-forest">{step.title}</h3>
                    <p className="text-sm text-muted leading-7 mt-2">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-5">
            <InfoCard icon={CircleHelp} title="Revision prompt" tone="blue">
              <li className="leading-7">{experience.revisionChallenge}</li>
            </InfoCard>
            <InfoCard icon={CheckCircle2} title="Takeaway" tone="green">
              <li className="leading-7">Explain the answer in your own words before checking your notes again.</li>
              <li className="leading-7">If you can justify the recommendation clearly, you probably understand the topic.</li>
            </InfoCard>
          </div>
        </div>
      )}

      {tab === 'try' && (
        <div className="space-y-5 mt-5">
          <section className="card p-5 md:p-7">
            <div className="flex items-start gap-3 mb-4">
              <div className="rounded-2xl bg-sage text-pine p-3"><CircleHelp size={20} /></div>
              <div>
                <h2 className="section-title">Active recall steps</h2>
                <p className="text-sm text-muted mt-1">Use these prompts before starting the formal five-question check.</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {experience.stages.map((stage, index) => (
                <div key={stage.title} className="rounded-[22px] border border-[#dfe7df] bg-[#fbfcfb] p-5">
                  <div className="text-xs uppercase tracking-[.2em] text-muted font-bold">Prompt {index + 1}</div>
                  <h3 className="font-extrabold text-forest text-xl mt-3">{stage.title}</h3>
                  <p className="text-sm text-muted leading-7 mt-3">Without looking back, explain why <strong>{stage.title.toLowerCase()}</strong> matters in this lesson.</p>
                </div>
              ))}
            </div>
          </section>

          <section className="card p-5 md:p-7 bg-gradient-to-br from-[#f8fbf8] to-white border-[#dbe5dc]">
            <p className="label mb-2">Self-check challenge</p>
            <h2 className="section-title">Speak the answer out loud</h2>
            <p className="text-sm text-muted mt-2 leading-7">{experience.revisionChallenge}</p>
            <div className="rounded-[20px] bg-white border border-[#e1e8e1] p-4 mt-4 text-sm leading-7 text-ink">
              If you struggle, go back to <strong>Learn</strong> for the chunked notes or <strong>Visualise</strong> for the flow and comparison view. Then try again before taking the marked check.
            </div>
            <div className="flex flex-wrap gap-3 mt-5">
              <button type="button" className="btn-primary" onClick={onStartCheck}>Start 5-question check <ArrowRight size={16} /></button>
              <button type="button" className="btn-outline" onClick={onToggleComplete}>{completed ? <><Check size={17} /> Mark incomplete</> : <><Check size={17} /> Mark lesson complete</>}</button>
            </div>
          </section>
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_auto] gap-3 mt-5 mb-10">
        <button type="button" className={`w-full ${completed ? 'btn-outline' : 'btn-primary'}`} onClick={onToggleComplete}>
          {completed ? <><Check size={18} /> Completed · Mark incomplete</> : <><Check size={18} /> Mark lesson complete</>}
        </button>
        <button type="button" className="btn text-forest hover:bg-sage w-full lg:w-auto" onClick={onBack}>Return to programme</button>
      </div>
    </>
  );
}

function MetricCard({label, value, tone = 'neutral'}: {label: string; value: string; tone?: 'neutral' | 'success'}) {
  return (
    <div className={`rounded-[24px] border p-4 ${tone === 'success' ? 'bg-[#eef6f0] border-[#cfe0d2]' : 'bg-white border-[#dfe7df]'}`}>
      <div className="text-[11px] uppercase tracking-[.2em] text-muted font-bold">{label}</div>
      <div className="text-3xl font-black text-forest mt-3">{value}</div>
    </div>
  );
}

function InfoCard({icon: Icon, title, tone, children}: {icon: typeof CircleHelp; title: string; tone: 'green' | 'amber' | 'blue'; children: ReactNode}) {
  const tones = {
    green: 'bg-[#f5faf6] border-[#dce7de] text-[#295f40]',
    amber: 'bg-[#fff9ef] border-[#f0e1bc] text-[#7b5b21]',
    blue: 'bg-[#f3f8fc] border-[#dbe6f4] text-[#2a5679]',
  } as const;

  return (
    <section className={`card p-5 ${tones[tone]}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-2xl bg-white/80 p-2.5"><Icon size={18} /></div>
        <h2 className="font-extrabold text-lg">{title}</h2>
      </div>
      <ul className="space-y-3 text-sm leading-7">{children}</ul>
    </section>
  );
}
