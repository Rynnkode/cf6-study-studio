import {useEffect, useMemo, useState, type ReactNode} from 'react';
import {ArrowRight, BookOpen, Check, CheckCircle2, ChevronDown, ChevronLeft, CircleHelp, FileText, Lightbulb, ListChecks, MoveRight, TriangleAlert} from 'lucide-react';
import ConceptLab from './ConceptLab';
import {lessonMicroChecks,type MicroCheck} from '../data/lessonMicroChecks';
import LessonActivities from './LessonActivities';
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
  {key: 'visualise', label: 'Explore', note: 'Interactive tools'},
  {key: 'example', label: 'Example', note: 'Worked case'},
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
  const [revealedTakeaway,setRevealedTakeaway]=useState<number|null>(null);
  const experience = experiences[lesson.lo];

  useEffect(() => {
    setTab('learn');
    setActiveStage(0);
    setActiveDef(lesson.definitions[0]?.[0] ?? '');
    setRevealedTakeaway(null);
  }, [lesson.id]);

  const readingTime = useMemo(() => estimReadingTime(lesson), [lesson]);

  const learnSections = lesson.notes.map((note, index) => ({
    title: experience.learnHeadings[index] ?? `Core idea ${index + 1}`,
    body: note,
  }));

  return (
    <>
      <button type="button" className="text-pine font-bold text-sm inline-flex items-center gap-2 mb-4 min-h-9" onClick={onBack}><ChevronLeft size={17}/> Study programme</button>
      <header className="rounded-[23px] border-2 border-[#d8e5da] bg-gradient-to-br from-white to-[#edf5ee] px-4 py-5 sm:p-7 shadow-[0_8px_24px_rgba(24,69,40,.05)]">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-[#557763]"><span className="rounded-full bg-[#dfece2] px-3 py-1.5">WEEK {lesson.week}</span><span className="rounded-full border border-[#d6e4d9] bg-white px-3 py-1.5">OUTCOME {lesson.lo}</span>{completed&&<span className="rounded-full bg-[#d9eee0] text-[#2b7450] px-3 py-1.5 inline-flex items-center gap-1"><CheckCircle2 size={13}/> Completed</span>}</div>
        <h1 className="text-[26px] sm:text-[35px] font-extrabold text-forest tracking-tight leading-[1.14] mt-3">{lesson.title}</h1>
        <p className="text-sm text-muted leading-6 mt-2">{lesson.intro}</p>
        <div className="border-t border-[#dbe7de] mt-4 pt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold text-[#648272]"><span><BookOpen size={14} className="inline mr-1"/>{readingTime} min estimated read</span><span><Lightbulb size={14} className="inline mr-1"/>{lesson.definitions.length} key definitions</span><span><CircleHelp size={14} className="inline mr-1"/>5 practice questions · {examWeight} indicative exam Qs</span></div>
      </header>
      <nav className="grid grid-cols-4 gap-1.5 sm:gap-3 my-4" aria-label="Lesson sections">
        {tabMeta.map(item=><button type="button" key={item.key} aria-current={tab===item.key?'page':undefined} onClick={()=>setTab(item.key)} className={`min-w-0 rounded-xl border-2 px-1.5 py-3 sm:p-4 text-center sm:text-left transition-colors ${tab===item.key?'bg-[#103f2d] text-white border-[#103f2d] shadow-[0_3px_10px_rgba(14,58,41,.17)]':'bg-white text-forest border-[#dce7df] hover:border-[#89ab94]'}`}><span className="block text-[12px] sm:text-base font-extrabold leading-tight">{item.label}</span><span className={`hidden sm:block text-[11px] mt-1 ${tab===item.key?'text-white/75':'text-muted'}`}>{item.note}</span></button>)}
      </nav>
      {tab === 'learn' && <div className="space-y-4">
        <section className="rounded-[22px] border-2 border-[#dbe6dd] bg-white p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4"><span className="bg-[#edf5ee] text-[#386b4c] rounded-xl p-2.5"><BookOpen size={19}/></span><div><h2 className="font-extrabold text-xl text-forest">Learn the essentials</h2><p className="text-sm text-muted mt-1">Open a section, read the concept, then test what stayed with you.</p></div></div>
          <div className="space-y-2.5">
            {learnSections.map((section,i)=><details key={section.title} className="group rounded-[17px] border-2 border-[#ceddd1] bg-white overflow-hidden" open={i===0}>
              <summary className="cursor-pointer list-none flex items-center justify-between gap-3 p-4 sm:p-5 [&::-webkit-details-marker]:hidden"><div><p className="text-[10px] uppercase tracking-[.16em] font-extrabold text-[#7a9782]">Concept {String(i+1).padStart(2,'0')}</p><h3 className="text-base sm:text-lg font-extrabold text-forest mt-1">{section.title}</h3></div><ChevronDown className="group-open:rotate-180 transition-transform shrink-0 text-[#72927c]" size={18}/></summary>
              <div className="border-t border-[#e2ece4] p-4 sm:p-5 bg-white"><ReadableNote body={section.body}/>{(i===0||i===Math.min(2,learnSections.length-1))&&<InlineCheck key={`${lesson.id}-${i}`} check={lessonMicroChecks[lesson.lo][i===0?0:1]}/>}
                <div className="mt-4 flex flex-wrap items-center gap-2"><button type="button" onClick={()=>setTab('visualise')} className="rounded-xl border-2 border-[#c3d9c9] bg-white text-[#205f3c] px-3 py-2.5 min-h-11 text-xs font-extrabold">Explore this visually →</button></div>
                <button type="button" onClick={()=>setRevealedTakeaway(revealedTakeaway===i?null:i)} className="mt-5 rounded-xl border-2 border-[#a8c9b3] bg-white text-[#1e5839] inline-flex gap-2 items-center px-3 py-2.5 text-xs font-extrabold hover:bg-[#dfeee3]">{revealedTakeaway===i?'Hide':'Reveal'} the takeaway <ChevronDown size={15} className={revealedTakeaway===i?'rotate-180':''}/></button>
                {revealedTakeaway===i&&<p role="status" className="text-sm leading-7 text-forest border-l-4 border-[#6ea882] bg-white px-4 py-3 mt-3 rounded-lg">{lesson.points[i%Math.max(1,lesson.points.length)]||experience.advisorLens}</p>}
              </div>
            </details>)}
          </div>
        </section>
        <div className="grid lg:grid-cols-2 gap-4">
          <section className="rounded-[22px] border-2 border-[#dbe6dd] bg-white p-4 sm:p-6"><h2 className="font-extrabold text-lg text-forest mb-2">Tap a definition</h2><p className="text-xs text-muted mb-3">Select a term to read its explanation.</p><div className="flex flex-wrap gap-2 mb-4">{lesson.definitions.map(([term])=><button type="button" key={term} aria-pressed={activeDef===term} onClick={()=>setActiveDef(term)} className={`px-3 py-2.5 rounded-xl text-xs font-bold border ${activeDef===term?'bg-forest text-white border-forest':'bg-[#f2f7f3] text-pine border-[#dbe6dd]'}`}>{term}</button>)}</div>{lesson.definitions.filter(([term])=>activeDef===term).map(([term,description])=><div key={term} className="rounded-xl bg-[#f5f9f5] border border-[#dce9de] p-4"><strong className="text-forest">{term}</strong><p className="text-sm text-muted mt-2 leading-7">{description}</p></div>)}</section>
          <div className="space-y-3"><InfoCard icon={ListChecks} title="Key points" tone="green">{lesson.points.map(x=><li className="flex gap-2" key={x}><Check size={17} className="shrink-0 mt-1"/>{x}</li>)}</InfoCard><InfoCard icon={TriangleAlert} title="Exam traps" tone="amber">{lesson.traps.map(x=><li className="flex gap-2" key={x}><TriangleAlert size={17} className="shrink-0 mt-1"/>{x}</li>)}</InfoCard></div>
        </div>
        <div className="rounded-[20px] border-2 border-[#bcd5c4] bg-white p-4"><p className="text-[11px] uppercase tracking-wider font-bold text-[#63846e]">Adviser insight</p><p className="text-sm leading-7 text-forest mt-2">{experience.advisorLens}</p></div>
      </div>}
      {tab === 'visualise' && <div className="space-y-4">
        <section className="rounded-[21px] border-2 border-[#d9e6dd] bg-white p-4 sm:p-6"><div className="flex items-center gap-2"><MoveRight size={20} className="text-pine"/><h2 className="font-extrabold text-xl text-forest">How the pieces connect</h2></div><p className="text-sm leading-6 text-muted mt-2 mb-4">{experience.visualIntro}</p>
          <div className="grid grid-cols-3 gap-2">{experience.stages.map((stage,i)=><button type="button" key={stage.title} aria-pressed={activeStage===i} onClick={()=>setActiveStage(i)} className={`rounded-xl border-2 min-w-0 px-2.5 py-3 sm:p-4 text-left ${activeStage===i?'bg-[#103f2d] border-[#103f2d] text-white shadow-sm':'bg-[#f7faf7] border-[#dce6dd] text-forest'}`}><span className="block text-[10px] uppercase tracking-widest opacity-70">Step {i+1}</span><strong className="block text-xs sm:text-sm leading-5 mt-2 break-words">{stage.title}</strong></button>)}</div>
          <div role="status" className="rounded-[15px] bg-white border-2 border-[#cbded0] p-4 mt-3"><p className="text-xs font-extrabold uppercase tracking-widest text-[#699178]">{experience.stages[activeStage].caption}</p><p className="text-sm leading-7 text-forest mt-2">{experience.stages[activeStage].detail}</p></div>
        </section>
        <ConceptLab key={lesson.id} lo={lesson.lo}/>
        <section className="rounded-[22px] border-2 border-[#dbe6dd] bg-white p-4 sm:p-6"><h2 className="text-xl font-extrabold text-forest">{experience.compareTitle}</h2><p className="text-xs text-muted mt-2 mb-4">Important distinctions to take into the exam.</p><div className="space-y-2.5">{experience.compareRows.map(row=><details className="group border border-[#dce7dd] rounded-xl overflow-hidden" key={row.label}><summary className="list-none [&::-webkit-details-marker]:hidden px-4 py-3.5 cursor-pointer flex justify-between items-center gap-2 bg-[#f8fbf8]"><strong className="text-sm text-forest">{row.label}</strong><ChevronDown size={17} className="text-[#6c8d79] shrink-0 group-open:rotate-180"/></summary><div className="grid sm:grid-cols-2 gap-0 border-t border-[#e1e9e1]"><p className="text-sm leading-7 p-4 text-forest">{row.left}</p><p className="text-sm leading-7 p-4 bg-[#f8fbf8] text-forest border-t sm:border-t-0 sm:border-l border-[#e1e9e1]">{row.right}</p></div></details>)}</div></section>
      </div>}
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

      {tab === 'try' && <div className="space-y-4"><section className="rounded-[21px] border-2 border-[#d9e6dd] bg-white p-4 sm:p-6"><p className="text-[11px] tracking-[.17em] uppercase font-extrabold text-[#6e8c77]">Practice before the mock</p><h2 className="text-xl font-extrabold text-forest mt-1">Put it into practice</h2><p className="text-sm text-muted leading-6 mt-2">Try a realistic client decision with instant feedback, then start the graded five-question assessment.</p></section><LessonActivities key={lesson.id} lo={lesson.lo}/><section className="rounded-[21px] border-2 border-[#bdd5c3] bg-white p-4 sm:p-6"><p className="text-[11px] font-extrabold uppercase tracking-wider text-[#6c8a74]">Self-test</p><h3 className="text-lg font-bold text-forest mt-2">{experience.revisionChallenge}</h3><p className="text-sm text-muted leading-6 mt-2">Can you justify your answer and one likely exam trap? Now test your recall with scored questions.</p><button type="button" className="btn-primary mt-4" onClick={onStartCheck}>Start 5-question check <ArrowRight size={16}/></button></section></div>}
      <div className="grid lg:grid-cols-[1fr_auto] gap-3 mt-5 mb-10">
        <button type="button" className={`w-full ${completed ? 'btn-outline' : 'btn-primary'}`} onClick={onToggleComplete}>
          {completed ? <><Check size={18} /> Completed · Mark incomplete</> : <><Check size={18} /> Mark lesson complete</>}
        </button>
        <button type="button" className="btn text-forest hover:bg-sage w-full lg:w-auto" onClick={onBack}>Return to programme</button>
      </div>
    </>
  );
}

function InlineCheck({check}:{check:MicroCheck}){
 const [answer,setAnswer]=useState<boolean|null>(null);
 return <div className="mt-5 rounded-2xl border-2 border-[#bdd7c5] bg-[#f9fcfa] p-4 sm:p-5">
  <p className="text-[11px] font-extrabold uppercase tracking-[.16em] text-[#3d7150]">Quick understanding check</p>
  <h4 className="font-extrabold text-[#173e2a] mt-2 text-sm sm:text-base leading-7">{check.prompt}</h4>
  <div className="grid grid-cols-2 gap-2 mt-3">{[true,false].map(v=><button type="button" key={String(v)} aria-pressed={answer===v} onClick={()=>setAnswer(v)} className={`border-2 rounded-xl py-3 font-extrabold text-sm ${answer===v?'bg-[#123f2b] border-[#123f2b] text-white':'bg-white border-[#bed5c5] text-[#22583a] hover:border-[#599775]'}`}>{v?'True':'False'}</button>)}</div>
  {answer!==null&&<div role="status" className={`mt-3 rounded-xl border-2 p-3 text-sm leading-6 ${answer===check.answer?'border-[#a7d1b5] bg-white text-[#245a3b]':'border-[#e4c99f] bg-[#fffaf3] text-[#704d22]'}`}><strong className="block mb-1">{answer===check.answer?'Correct — well remembered':'Not quite — here is why'}</strong>{check.why}</div>}
 </div>
}
function ReadableNote({body}:{body:string}){
  const match=body.match(/^(.{20,180}?[.!?])\s+(.+)$/s);
  return <p className="text-[15px] leading-[1.78] text-[#20382b] break-words">{match?<><strong className="font-extrabold text-[#143f2b]">{match[1]}</strong>{' '}{match[2]}</>:body}</p>
}
function InfoCard({icon: Icon, title, tone, children}: {icon: typeof CircleHelp; title: string; tone: 'green' | 'amber' | 'blue'; children: ReactNode}) {
  const tones = {
    green: 'bg-white border-2 border-[#bad5c2] text-[#214d36]',
    amber: 'bg-[#fffbf2] border-2 border-[#e7c98b] text-[#624619]',
    blue: 'bg-white border-2 border-[#bfcfe2] text-[#224c69]',
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
