export type Field={key:string;label:string;type?:'text'|'date'|'number'|'textarea'|'select';options?:string[]};
export type Module={id:string;name:string;short:string;description:string;fields:Field[]};
const f=(key:string,label:string,type:Field['type']='text',options?:string[]):Field=>({key,label,type,options});
export const modules:Module[]=[
{id:'agreements',name:'MDA & project agreements',short:'Agreements',description:'Track clauses, proposed changes, negotiated positions and compliance.',fields:[f('agreement','Agreement / instrument'),f('clause','Article or clause'),f('obligation','Obligation or proposed wording','textarea'),f('counterparty','Responsible party'),f('evidence','Evidence reference or URL')]},
{id:'land',name:'Land & community rights',short:'Land rights',description:'Document customary claims, consultations, consent and affected communities.',fields:[f('claimType','Claim type','select',['Customary land','Resettlement','Compensation','Access','Consultation']),f('affectedGroup','Affected group'),f('parcel','Location / parcel reference'),f('consultation','Consultation record','textarea'),f('remedy','Requested remedy','textarea')]},
{id:'employment',name:'Employment commitments',short:'Employment',description:'Monitor hiring targets, job postings, actual recruitment and local participation.',fields:[f('position','Role / occupation'),f('target','Local hiring target','number'),f('actual','People hired','number'),f('employer','Employer / contractor'),f('period','Reporting period'),f('evidence','Evidence reference')]},
{id:'workforce',name:'Community workforce & talent registry',short:'Workforce',description:'Two-tier registry matching certified professionals and recommending non-credentialed citizens for TVET skills development.',fields:[f('track','Talent Track','select',['Track A: Certified Professional / Skilled Artisan','Track B: Workforce Development / Apprenticeship Candidate']),f('occupation','Primary trade / occupation / discipline'),f('qualification','Highest Degree / Qualification / Certificate'),f('institution','School / Institute / Training Center'),f('desiredTrade','Desired Trade to Learn (for TVET Track)','select',['Heavy Machinery Operator','Industrial Pipe Welder & Fabricator','Drill & Blast Assistant','Industrial Solar & Electrical','Concession Safety & Security','Mine Camp Catering & Hospitality','Forestry, Reforestation & River Monitor','Supply Chain & Warehouse Logistics','Other']),f('experience','Years of experience (0 for trainees)','number'),f('availability','Availability','select',['Available now','Within 30 days','Available for Next Training Cohort']),f('contact','Contact number / WhatsApp'),f('endorsement','Community / Clan Endorsement (Chief / Elder)'),f('recommendationStatus','GGCDC Recommendation Status','select',['Registered Candidate','Recommended for TVET Sponsorship','Verified by GGAA Technical Desk','Endorsed for Concessionaire Direct Hire','Employed at Mine Site']),f('proofDocument','Uploaded Proof Document (Degree / Cert / ID)'),f('skills','Skills, tools or practical experience summary','textarea'),f('consent','Consent to share profile with concessionaires & TVET institutes','select',['Yes','No']),f('consentDate','Consent date','date')]},
{id:'procurement',name:'Local procurement',short:'Procurement',description:'Track tender opportunities, local-content commitments and award outcomes.',fields:[f('buyer','Buyer'),f('category','Goods / services category'),f('deadline','Submission deadline','date'),f('estimatedValue','Estimated value'),f('awardee','Awardee'),f('localContent','Local-content requirement')]},
{id:'suppliers',name:'Supplier development',short:'Suppliers',description:'Map local firms, readiness gaps, training and bid participation.',fields:[f('sector','Sector'),f('registration','Business registration / tax status'),f('capacity','Products / capacity','textarea'),f('contact','Business contact'),f('readiness','Readiness','select',['Needs support','Prequalified','Bid ready']),f('support','Support needed','textarea')]},
{id:'skills',name:'Skills transfer',short:'Skills',description:'Plan training, apprenticeships, certification and placement outcomes.',fields:[f('provider','Training provider'),f('trade','Trade / course'),f('places','Seats','number'),f('startDate','Start date','date'),f('completion','Completion / certification criteria'),f('outcome','Placement outcome')]},
{id:'environment',name:'Environmental safeguards',short:'Environment',description:'Register risks, monitoring readings, incidents and corrective actions.',fields:[f('topic','Safeguard topic','select',['Water','Air / dust','Forest','Biodiversity','Waste','Tailings','Health and safety']),f('location','Site / location'),f('observation','Observation','textarea'),f('standard','Applicable standard / permit'),f('correctiveAction','Corrective action','textarea'),f('verification','Verification evidence')]},
{id:'infrastructure',name:'Corridor infrastructure',short:'Infrastructure',description:'Monitor rail, port, roads, power and shared-use commitments.',fields:[f('asset','Asset type','select',['Rail','Port','Road','Power','Water','Other']),f('route','Route / location'),f('milestone','Milestone'),f('publicAccess','Community / public access provision'),f('budget','Budget / funding'),f('evidence','Evidence reference')]},
{id:'benefits',name:'Community benefits',short:'Benefits',description:'Track funds, projects, eligibility, disbursement and delivery.',fields:[f('benefitType','Benefit type'),f('amount','Committed amount'),f('recipient','Beneficiary / community'),f('disbursement','Disbursement date','date'),f('deliverable','Deliverable / outcome'),f('proof','Payment / delivery proof')]},
{id:'grievances',name:'Grievances & remedies',short:'Grievances',description:'Log concerns, assign response, protect confidentiality and record resolution.',fields:[f('category','Category'),f('channel','Intake channel'),f('confidentiality','Confidentiality','select',['Standard','Restricted']),f('requestedRemedy','Requested remedy','textarea'),f('response','Response / action','textarea'),f('closedDate','Resolved date','date')]},
{id:'transparency',name:'Disclosure & transparency',short:'Transparency',description:'Track documents requested, publication, disclosure gaps and decisions.',fields:[f('document','Document / dataset'),f('requestDate','Request date','date'),f('holder','Document holder'),f('publication','Publication URL'),f('disclosureStatus','Disclosure status','select',['Requested','Received','Published','Withheld']),f('reason','Reason / follow-up')]},
{id:'monitoring',name:'Implementation monitoring',short:'Monitoring',description:'Inspect commitments, indicators, deadlines and independently verified progress.',fields:[f('indicator','Indicator'),f('baseline','Baseline'),f('target','Target'),f('actual','Current result'),f('period','Period'),f('verification','Verification method / source')]},
{id:'governance',name:'Council governance',short:'Governance',description:'Organize meetings, resolutions, representation and conflicts of interest.',fields:[f('meetingDate','Meeting date','date'),f('body','Committee / working group'),f('decision','Decision or resolution','textarea'),f('participants','Participants / representation'),f('conflict','Conflict declaration'),f('minutes','Minutes reference')]}
];
export const statuses=['Draft','Under review','In progress','Awaiting response','Verified','Closed'];
export const counties=['Grand Gedeh','Sinoe','River Gee','Maryland','Grand Kru','Montserrado','Other'];

export interface StakeholderPillar {
  id: string;
  name: string;
  category: string;
  leadStakeholders: string;
  seatAllocation: string;
  description: string;
  coreResponsibilities: string[];
}

export const stakeholderPillars: StakeholderPillar[] = [
  {
    id: 'affected-communities',
    name: 'Affected Communities & Customary Landowners',
    category: 'Ground Level & Land Rights',
    leadStakeholders: 'Putu Jarwodee, Pennoken, Tiama, Gbarzon, Konobo, Cavalla Customary Clan Councils',
    seatAllocation: 'Direct Representation (Primary Voice)',
    description: 'Direct customary owners, residential host communities, and agrarian families living adjacent to mine pits, haul corridors, and tailings sites. Retain unalienable legal rights to land and Free Prior & Informed Consent (FPIC).',
    coreResponsibilities: ['Verify customary boundaries', 'Review resettlement & compensation protocols', 'Sign off on community development agreements', 'Monitor local hiring and grievance redress']
  },
  {
    id: 'traditional-leadership',
    name: 'Traditional Leadership & Council of Chiefs',
    category: 'Cultural & Custodial Governance',
    leadStakeholders: 'Paramount Chiefs, Clan Chiefs, Town Chiefs, Council of Elders',
    seatAllocation: 'Custodial Advisory Seats',
    description: 'Historical custodians of land, heritage, and customary conflict mediation across Grand Gedeh County.',
    coreResponsibilities: ['Ensure cultural heritage preservation', 'Facilitate peace and community mediation', 'Validate traditional boundaries', 'Bridge district councils with county assembly']
  },
  {
    id: 'women-leadership',
    name: 'Women Leadership & Rural Women Networks',
    category: 'Gender Equity & Community Welfare',
    leadStakeholders: 'Grand Gedeh Rural Women Association, Market Women Union, Young Women Leaders Forum',
    seatAllocation: 'Designated Voting Seats',
    description: 'Grassroots leaders championing maternal health, family livelihood security, fair resettlement compensation, and women employment quotas.',
    coreResponsibilities: ['Audit gender quotas in mining employment', 'Monitor water and environmental safety affecting households', 'Ensure fair financial disbursement of community funds', 'Advocate for market access and micro-enterprise grants']
  },
  {
    id: 'youth-students',
    name: 'Youth Leadership & Student Caucus',
    category: 'Next Generation & Workforce',
    leadStakeholders: 'Grand Gedeh County Youth Caucus, Grand Gedeh Student Union, Vocational Trainee Alliances',
    seatAllocation: 'Designated Voting Seats',
    description: 'Energetic advocates focusing on technical training, apprenticeship access, youth hiring ratios, and athletic/educational infrastructure.',
    coreResponsibilities: ['Mobilize local youth for workforce registry enrollment', 'Monitor hiring fairness and eliminate kickbacks', 'Liaise with technical institutes for skills training', 'Track scholarship fund distribution']
  },
  {
    id: 'pwd-vulnerable',
    name: 'Persons with Disabilities (PWD) & Vulnerable Groups',
    category: 'Social Inclusion & Accessibility',
    leadStakeholders: 'Grand Gedeh Association of the Disabled, Elderly Care Alliances, Vulnerable Family Liaisons',
    seatAllocation: 'Special Representative Seats',
    description: 'Ensuring that mining impacts and economic benefits proactively include citizens with physical, visual, auditory, and cognitive disabilities.',
    coreResponsibilities: ['Audit physical accessibility of shared infrastructure', 'Guarantee dedicated social welfare fund allocations', 'Prevent displacement without tailored support', 'Champion inclusive vocational opportunities']
  },
  {
    id: 'business-chamber',
    name: 'Grand Gedeh Business & Entrepreneurial Chamber',
    category: 'Local Economy & Commerce',
    leadStakeholders: 'Grand Gedeh Chamber of Commerce, Cross-Border Traders, Local Construction & Transport Contractors',
    seatAllocation: 'Economic Partner Seats',
    description: 'Local enterprises advocating for unbundled procurement contracts, prompt supplier payments, and business incubation.',
    coreResponsibilities: ['Monitor local content spend percentages', 'Facilitate joint-venture partnerships between local firms and prime contractors', 'Assess SME readiness and training gaps', 'Advocate for commercial banking and fuel depot access']
  },
  {
    id: 'professionals-experts',
    name: 'Multi-Disciplinary Professionals & Technical Experts',
    category: 'Independent Technical Oversight',
    leadStakeholders: 'Grand Gedean Mining Engineers, Geologists, Accountants, Environmental Scientists, Economists',
    seatAllocation: 'Technical Advisory Panel',
    description: 'Grand Gedean professionals in Liberia and abroad providing rigorous technical analysis of geological models, financial audits, and environmental metrics.',
    coreResponsibilities: ['Review Mineral Development Agreement (MDA) fiscal terms', 'Independent audit of tailings dam safety & water sampling', 'Model revenue projections & county royalty shares', 'Design supplier qualification criteria']
  },
  {
    id: 'interfaith-institutions',
    name: 'Religious & Interfaith Council',
    category: 'Moral Oversight & Peacebuilding',
    leadStakeholders: 'Liberia Council of Churches (Grand Gedeh Chapter), Grand Gedeh Muslim Council, Pastors & Imams Forum',
    seatAllocation: 'Observer & Moral Witness Seats',
    description: 'Faith leaders providing moral oversight, promoting nonviolent dispute resolution, and maintaining community cohesion.',
    coreResponsibilities: ['Provide neutral grievance mediation', 'Encourage transparent stewardship of development funds', 'Prayers and moral encouragement for county unity', 'Monitor ethical conduct across Council leadership']
  },
  {
    id: 'civil-society-cso',
    name: 'Civil Society Organizations (CSOs) & Rights Defenders',
    category: 'Accountability & Human Rights',
    leadStakeholders: 'Community Rights Network, Environmental Watch NGOs, Anti-Corruption Coalitions',
    seatAllocation: 'Watchdog & Transparency Seats',
    description: 'Independent civil society monitors tracking compliance with environmental laws, human rights conventions, and EITI standards.',
    coreResponsibilities: ['Facilitate public right-to-information requests', 'Document environmental damage or human rights infractions', 'Conduct community civic education on mineral agreements', 'Publish independent county shadow reports']
  },
  {
    id: 'bar-association',
    name: 'Grand Gedeh Bar Association (GGBA)',
    category: 'Legal Expertise & Constitutional Defense',
    leadStakeholders: 'Grand Gedeh Bar Association Leadership, Legal Aid Practitioners, Natural Resource Lawyers',
    seatAllocation: 'Principal Legal Counsel',
    description: 'The premier legal institution offering independent statutory and customary legal counsel, contract review, and rights defense.',
    coreResponsibilities: ['Review MDA clauses against Liberian Mining Law & Land Rights Act', 'Draft GGCDC charter, bylaws, and dispute covenants', 'Represent affected communities in administrative and court proceedings', 'Ensure anti-conflict of interest enforcement']
  },
  {
    id: 'county-organizations',
    name: 'County-Based Organizations & District Associations',
    category: 'Civic Alliances & District Cohesion',
    leadStakeholders: 'Zwedru Development Association, Tchien District Union, Konobo Community Forum, Gbao Civic Association',
    seatAllocation: 'District Delegate Seats',
    description: 'District and town-level civic welfare organizations ensuring that development benefits disperse equitably across all administrative districts.',
    coreResponsibilities: ['Harmonize cross-district priorities', 'Prevent intra-county political friction', 'Coordinate district townhall hearings', 'Ensure even distribution of public infrastructure assets']
  },
  {
    id: 'diaspora-ggaa',
    name: 'Diaspora Organizations & GGAA',
    category: 'Diaspora Strategic & Technical Partner',
    leadStakeholders: 'Grand Gedeh Association in the Americas (GGAA), European Diaspora Chapters, Continental Networks',
    seatAllocation: 'Strategic Partner (Non-Controlling Advisory)',
    description: 'Mobilizer of global professional talent, philanthropic co-financing, international advocacy, and technical expertise in partnership with GGCDC.',
    coreResponsibilities: ['Provide technical analysis through diaspora professional roster', 'Coordinate international research and pro-bono assistance', 'Support GGCDC emissary and consultative groundwork', 'Respect GGCDC in-county leadership autonomy without controlling the platform']
  }
];

export interface RoadmapPhase {
  phase: number;
  title: string;
  leadEntity: string;
  status: 'Completed' | 'In progress' | 'Upcoming';
  timeline: string;
  description: string;
  keyMilestones: string[];
}

export const consultativeRoadmap: RoadmapPhase[] = [
  {
    phase: 1,
    title: 'Monrovia Stakeholder Consultations & Civic Outreach',
    leadEntity: 'GGAA Presidential Emissary / Civic Facilitator',
    status: 'In progress',
    timeline: 'Q1-Q2 2026',
    description: 'The emissary dispatched to Monrovia engages Grand Gedean civil society, youth groups, elders, student unions, professionals, and legislative caucuses to introduce the GGCDC civic framework as a proposed consultative platform rather than a predetermined body.',
    keyMilestones: [
      'Preliminary briefing with Grand Gedeh community leaders in Monrovia',
      'Dialogue session with Grand Gedeh Bar Association (GGBA)',
      'Engagement with Grand Gedeh Youth & Student Leadership',
      'Formation of the Interim Consultative Advisory Committee'
    ]
  },
  {
    phase: 2,
    title: 'In-County District Townhalls & Community Hearings',
    leadEntity: 'Joint Emissary & Local Consultative Team',
    status: 'Upcoming',
    timeline: 'Q2 2026',
    description: 'Direct grassroots listening tours across Zwedru, Putu Jarwodee, Pennoken, Tuzon, Konobo, Cavalla, and Gbao to ensure affected customary landowners articulate their priorities and consent criteria firsthand.',
    keyMilestones: [
      'Zwedru City Multi-Stakeholder Dialogue',
      'Putu Mining-Adjacent Community Hearings (Jarwodee, Pennoken, Tiama)',
      'Customary Chiefs & Landowners Sacred Council Consultation',
      'Compilation of Community Redlines & Development Desiderata'
    ]
  },
  {
    phase: 3,
    title: 'Legal Chartering & Governance Framework Drafting',
    leadEntity: 'Grand Gedeh Bar Association (GGBA) & Drafting Team',
    status: 'Upcoming',
    timeline: 'Q3 2026',
    description: 'Independent legal codification of the GGCDC Founding Charter, Bylaws, Electoral Procedures, and Anti-Conflict of Interest Protocols, strictly upholding the founding principle of community participation.',
    keyMilestones: [
      'Drafting of the GGCDC Nonpartisan Civic Charter',
      'Establishment of the 12-Pillar Delegate Allocation Formula',
      'Formalization of the Putu Mining & Development Working Group Terms of Reference',
      'Public comment and validation period for the draft Charter'
    ]
  },
  {
    phase: 4,
    title: 'Diaspora Technical Alignment & Expert Roster Mobilization',
    leadEntity: 'GGAA & Diaspora Professional Networks',
    status: 'Upcoming',
    timeline: 'Q3 2026',
    description: 'Structured alignment between GGAA professional networks (engineers, accountants, lawyers, geologists) and the in-county council, formalizing the technical support backbone.',
    keyMilestones: [
      'Launch of the Grand Gedeh Diaspora Expert Advisory Database',
      'Execution of the GGAA-GGCDC Strategic Technical Partnership Accord',
      'Establishment of Pro-Bono Technical Review Panels for MDA and EIA audits',
      'Joint fundraising and resource-mobilization framework for GGCDC operations'
    ]
  },
  {
    phase: 5,
    title: 'Grand Gedeh Stakeholder Constitutional Assembly',
    leadEntity: 'Full County Stakeholder Convention',
    status: 'Upcoming',
    timeline: 'Q4 2026',
    description: 'Historic formal assembly convened in Zwedru with accredited delegates across all 12 pillars to constitutionally adopt the Charter, swear in the Executive Secretariat, and formally inaugurate GGCDC.',
    keyMilestones: [
      'Accreditation of 120+ County & Diaspora Stakeholder Delegates',
      'Solemn Adoption of the GGCDC Charter and Guiding Principles',
      'Inauguration of the GGCDC Putu Mining & Development Working Group',
      'Issuance of the Zwedru Declaration of County Civic Unity'
    ]
  }
];

export const governingPrinciples = {
  name: 'Grand Gedeh Citizens Development Council (GGCDC)',
  motto: 'One County • One Voice • Shared Development',
  sacredRule: 'Nothing about Grand Gedeh without meaningful participation by Grand Gedeans—and nothing about an affected community without meaningful participation by that community.',
  mission: 'To provide an inclusive, nonpartisan and independent platform through which the people and stakeholders of Grand Gedeh County can coordinate, deliberate, develop informed positions, and engage constructively with Government, investors, development partners and other institutions on matters affecting the county\'s land, natural resources, communities, economy and long-term development.',
  institutionalArrangement: {
    platform: 'GGCDC is the county-centered, independent, inclusive civic stakeholder platform.',
    diasporaSupport: 'GGAA is a strategic partner and diaspora technical-support institution providing technical, research, and financial backing without exerting unilateral control.',
    legalCounsel: 'GGBA (Grand Gedeh Bar Association) provides independent legal oversight and defense of community rights.',
    affectedCommunities: 'Affected communities and customary landowners retain their direct voices, statutory rights, and veto power over customary land decisions.',
    externalParties: 'The Government of Liberia (exercising statutory regulatory and mineral powers) and the Mining Concessionaire/Investor are external negotiating parties with whom GGCDC engages through structured advocacy and monitoring.'
  }
};
