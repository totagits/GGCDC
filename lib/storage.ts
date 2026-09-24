// GGCDC Enterprise Client & Hybrid Storage Engine
// Provides high-performance persistence, seed dataset, CRUD, relational linking, and backup/restore
import { modules, statuses, counties, Module, stakeholderPillars, consultativeRoadmap, governingPrinciples } from '@/app/modules';

export interface RecordItem {
  id: string;
  module: string;
  title: string;
  status: string;
  county: string | null;
  community: string | null;
  owner: string | null;
  due_date: string | null;
  summary: string | null;
  details: string; // JSON string
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface RecordLink {
  id: string;
  source_id: string;
  target_id: string;
  relation: string;
  created_at?: string;
}

const STORAGE_KEY_RECORDS = 'ggcdc_records_v2';
const STORAGE_KEY_LINKS = 'ggcdc_links_v2';

export const initialRecords: RecordItem[] = [
  // 1. AGREEMENTS
  {
    id: 'rec-agr-01',
    module: 'agreements',
    title: 'MDA Article 14: Local Employment & Training Quotas',
    status: 'In progress',
    county: 'Grand Gedeh',
    community: 'Putu District',
    owner: 'GGBA Legal Advisory Team',
    due_date: '2026-11-15',
    summary: 'Binding statutory obligation requiring 70% unskilled local hiring, 40% skilled technical roles, and dedicated management apprenticeships.',
    details: JSON.stringify({
      agreement: 'Putu Iron Ore Mineral Development Agreement (25-Year Term)',
      clause: 'Article 14.2 & 14.5 - Employment, Training & Preferences',
      obligation: 'The Concessionaire shall give employment preference to qualified Liberians, with first priority to residents of Grand Gedeh County. Within 5 years, at least 70% of all administrative and technical positions shall be held by Liberians.',
      counterparty: 'Ministry of Mines & Energy / Putu Concessionaire',
      evidence: 'MDA Approved Copy, Vol 3, pp. 48-52 (GGCDC Archive)'
    }),
    created_by: 'ggba-counsel@ggcdc.org.lr',
    created_at: '2026-02-10T10:00:00Z',
    updated_at: '2026-03-01T14:30:00Z'
  },
  {
    id: 'rec-agr-02',
    module: 'agreements',
    title: 'MDA Article 22: Environmental Reclamation & Tailings Security Escrow',
    status: 'Under review',
    county: 'Grand Gedeh',
    community: 'Putu Ridge & Cavalla Basin',
    owner: 'Environmental Working Group',
    due_date: '2026-12-01',
    summary: 'Mandatory $15M cash escrow fund for post-mining reclamation, tailings management, and water table remediation.',
    details: JSON.stringify({
      agreement: 'Putu MDA Environmental Protocol Agreement',
      clause: 'Article 22.4 - Post-Closure Environmental Restoration Fund',
      obligation: 'Establishment of an internationally co-managed environmental guarantee fund before commercial extraction commences. Annual third-party audits with GGCDC civil observer participation.',
      counterparty: 'Environmental Protection Agency (EPA) / Mining Investor',
      evidence: 'EPA Environmental Permit EPA/MINE/2026/04'
    }),
    created_by: 'env-specialist@ggcdc.org.lr',
    created_at: '2026-02-14T09:15:00Z',
    updated_at: '2026-03-05T11:20:00Z'
  },
  {
    id: 'rec-agr-03',
    module: 'agreements',
    title: 'MDA Article 9: Corridor Rail & Port Multi-User Shared Access',
    status: 'Verified',
    county: 'Grand Gedeh',
    community: 'Putu to Sinoe Corridor',
    owner: 'Corridor Infrastructure Committee',
    due_date: '2026-10-30',
    summary: 'Ensures that heavy-haul rail from Putu to Greenville Port provides shared commercial access for local agricultural produce and passenger transport.',
    details: JSON.stringify({
      agreement: 'Infrastructure Corridor Access Accord',
      clause: 'Article 9.1 - Multi-User Transport Provisions',
      obligation: 'The railway line constructed from Putu to Greenville shall not be an exclusive enclave. Third-party commercial freight (timber, palm oil, cocoa, agricultural crops) and designated weekly community passenger wagons must be accommodated at non-discriminatory tariffs.',
      counterparty: 'Ministry of Transport / National Port Authority / Investor',
      evidence: 'Infrastructure Concession Addendum 2026'
    }),
    created_by: 'infrastructure@ggcdc.org.lr',
    created_at: '2026-01-20T08:00:00Z',
    updated_at: '2026-02-28T16:00:00Z'
  },

  // 2. LAND RIGHTS
  {
    id: 'rec-lnd-01',
    module: 'land',
    title: 'Putu Jarwodee Customary Clan Land Demarcation & FPIC Protocol',
    status: 'Verified',
    county: 'Grand Gedeh',
    community: 'Putu Jarwodee',
    owner: 'Chief Gbarbo & Customary Land Committee',
    due_date: '2026-08-30',
    summary: 'Codification of 14,500 hectares of customary communal land under the Land Rights Act of 2018 with formal boundary markers.',
    details: JSON.stringify({
      claimType: 'Customary land',
      affectedGroup: 'Jarwodee Clan Council & Farming Collectives (4,200 residents)',
      parcel: 'Parcels PJ-01 through PJ-08 (Putu North Foothills)',
      consultation: 'Held 6 public palava hut consultations between Oct 2025 and Feb 2026. Free Prior and Informed Consent (FPIC) resolution signed with customary elders, youth, and women reps.',
      remedy: 'Formal survey deed registration with Liberia Land Authority and explicit exclusion of ancestral shrine groves from mine pit concession.'
    }),
    created_by: 'land-chair@ggcdc.org.lr',
    created_at: '2026-01-15T12:00:00Z',
    updated_at: '2026-03-02T10:15:00Z'
  },
  {
    id: 'rec-lnd-02',
    module: 'land',
    title: 'Pennoken Community Resettlement Action Plan (RAP) Verification',
    status: 'In progress',
    county: 'Grand Gedeh',
    community: 'Pennoken Old Town',
    owner: 'GGBA Legal & Human Rights Taskforce',
    due_date: '2026-09-15',
    summary: 'Independent audit of proposed housing relocation, potable water supply, and agricultural replacement acreage for 180 affected households.',
    details: JSON.stringify({
      claimType: 'Resettlement',
      affectedGroup: 'Pennoken Mining Impacted Families (180 households / 950 citizens)',
      parcel: 'Pennoken Relocation Zone B (Highway Junction East)',
      consultation: 'Detailed household asset inventory conducted. Concerns voiced regarding soil fertility of new farmland and distance to primary school.',
      remedy: 'Company must provide modern brick homes with solar power, 2 mechanized community wells, 5 acres of fertile replacement farmland per household, and transitional food support for 18 months.'
    }),
    created_by: 'ggba-counsel@ggcdc.org.lr',
    created_at: '2026-02-18T14:00:00Z',
    updated_at: '2026-03-10T09:45:00Z'
  },
  {
    id: 'rec-lnd-03',
    module: 'land',
    title: 'Tiama Creek Sacred Headwaters Conservation Accord',
    status: 'Verified',
    county: 'Grand Gedeh',
    community: 'Tiama / Cavalla Tributary',
    owner: 'Traditional Council of Elders',
    due_date: '2026-07-20',
    summary: 'Binding covenant guaranteeing 500-meter inviolable buffer along the sacred Tiama headwaters supplying drinking water to 5 downstream towns.',
    details: JSON.stringify({
      claimType: 'Compensation',
      affectedGroup: 'Downstream agrarian and fishing communities',
      parcel: 'Tiama Watershed Hydrology Protection Buffer (320 hectares)',
      consultation: 'Elders, women leaders, and EPA hydrologists walked the stream perimeter. GPS coordinates mapped and agreed with concession surveyors.',
      remedy: 'Permanent no-drilling and no-tailings covenant logged with county authorities; solar-powered water filtration station installed as secondary safeguard.'
    }),
    created_by: 'traditional-council@ggcdc.org.lr',
    created_at: '2026-01-25T11:00:00Z',
    updated_at: '2026-02-15T15:30:00Z'
  },

  // 3. EMPLOYMENT
  {
    id: 'rec-emp-01',
    module: 'employment',
    title: 'Heavy Equipment & Haulage Operators Hiring Quota',
    status: 'In progress',
    county: 'Grand Gedeh',
    community: 'Zwedru & Putu Corridor',
    owner: 'Youth Employment Coordinator',
    due_date: '2026-10-01',
    summary: 'Tracking recruitment targets for 90 heavy equipment operators with mandatory 75% Grand Gedean hire ratio.',
    details: JSON.stringify({
      position: 'CAT 777 Haul Truck & 390 Excavator Operators',
      target: '90',
      actual: '52',
      employer: 'Putu Earthworks Joint Venture & Subcontractors',
      period: 'Q1-Q2 2026',
      evidence: 'Quarterly HR Audit Report HR-Q2-08, Verified by GGCDC Labor Desk'
    }),
    created_by: 'youth-caucus@ggcdc.org.lr',
    created_at: '2026-02-01T08:00:00Z',
    updated_at: '2026-03-08T13:20:00Z'
  },
  {
    id: 'rec-emp-02',
    module: 'employment',
    title: 'Environmental Field Technicians & Assayers Quota',
    status: 'Verified',
    county: 'Grand Gedeh',
    community: 'Zwedru Multilateral / Tubman University Graduates',
    owner: 'Technical Professionals Advisory Panel',
    due_date: '2026-06-30',
    summary: 'Recruitment of 20 Grand Gedean graduates in chemistry, geology, and forestry for baseline monitoring teams.',
    details: JSON.stringify({
      position: 'Environmental & Water Quality Technicians',
      target: '20',
      actual: '19',
      employer: 'SGS / Bureau Veritas & Putu HSE Department',
      period: 'H1 2026',
      evidence: 'Employment contracts and social security registration numbers logged.'
    }),
    created_by: 'professionals@ggcdc.org.lr',
    created_at: '2026-01-30T10:00:00Z',
    updated_at: '2026-02-25T16:10:00Z'
  },

  // 4. WORKFORCE
  {
    id: 'rec-wrk-01',
    module: 'workforce',
    title: 'John K. Tiah - Master Heavy Equipment Operator',
    status: 'Verified',
    county: 'Grand Gedeh',
    community: 'Zwedru (Bassa Community)',
    owner: 'Workforce Registry Desk',
    due_date: '2026-12-31',
    summary: '12 years verified experience operating CAT D9 dozers and 349 excavators. Completed OSHA 30 safety certification.',
    details: JSON.stringify({
      track: 'Track A: Certified Professional / Skilled Artisan',
      occupation: 'Heavy Equipment Operator (Tier 3)',
      skills: 'CAT D9, D10 Dozers, 349 Excavators, Front-End Loaders, Mine Site Grade Control, Basic Mechanical Diagnostics',
      experience: '12',
      availability: 'Available now',
      contact: '+231-770-456-789',
      qualification: 'Liberia Ministry of Transport Certified Heavy Duty License / Caterpillar Operator Certificate',
      institution: 'Liberia Heavy Machinery Training Academy (Nimba / Buchanan)',
      recommendationStatus: 'Endorsed for Concessionaire Direct Hire',
      proofDocument: 'john_tiah_heavy_duty_license_cat_cert.pdf (1.8 MB)',
      endorsement: 'Grand Gedeh Motor Transport Union & Zwedru Youth Desk',
      consent: 'Yes',
      consentDate: '2026-01-14'
    }),
    created_by: 'workforce-desk@ggcdc.org.lr',
    created_at: '2026-01-14T09:00:00Z',
    updated_at: '2026-02-20T11:00:00Z'
  },
  {
    id: 'rec-wrk-02',
    module: 'workforce',
    title: 'Comfort S. Doe - Environmental Assayer & Water Analyst',
    status: 'Verified',
    county: 'Grand Gedeh',
    community: 'Pennoken',
    owner: 'Workforce Registry Desk',
    due_date: '2026-12-31',
    summary: 'BSc in Environmental Science from Tubman University. Certified in turbidity, cyanide spectrometry, and aquatic bio-monitoring.',
    details: JSON.stringify({
      track: 'Track A: Certified Professional / Skilled Artisan',
      occupation: 'Environmental Scientist / Hydrology Analyst',
      skills: 'Water sampling, spectrophotometry, soil heavy metal testing, GIS spatial mapping, EPA compliance auditing',
      experience: '5',
      availability: 'Available now',
      contact: '+231-886-234-567',
      qualification: 'BSc Environmental Science, EPA Certified Environmental Inspector ID #774',
      institution: 'Tubman University, College of Agriculture & Food Sciences',
      recommendationStatus: 'Verified by GGAA Technical Desk',
      proofDocument: 'comfort_doe_tubman_univ_bsc_degree_epa_cert.pdf (2.4 MB)',
      endorsement: 'Pennoken Clan Council of Elders',
      consent: 'Yes',
      consentDate: '2026-01-18'
    }),
    created_by: 'workforce-desk@ggcdc.org.lr',
    created_at: '2026-01-18T10:30:00Z',
    updated_at: '2026-03-01T14:00:00Z'
  },
  {
    id: 'rec-wrk-03',
    module: 'workforce',
    title: 'Emmanuel G. Gbaryee - Certified 6G Pipe Welder & Fabricator',
    status: 'Verified',
    county: 'Grand Gedeh',
    community: 'Putu Jarwodee',
    owner: 'Workforce Registry Desk',
    due_date: '2026-12-31',
    summary: '8 years structural fabrication experience on industrial pipelines and mine crusher steel structures. AWS 6G certified.',
    details: JSON.stringify({
      track: 'Track A: Certified Professional / Skilled Artisan',
      occupation: 'Industrial Welder & Steel Fabricator',
      skills: 'SMAW, GTAW (TIG), FCAW, 6G High-Pressure Pipe Welding, Blueprint Reading, Plasma Cutting',
      experience: '8',
      availability: 'Within 30 days',
      contact: '+231-777-891-234',
      qualification: 'American Welding Society (AWS) 6G Certificate / Booker Washington Institute (BWI) Diploma',
      institution: 'Booker Washington Institute (BWI) Kakata',
      recommendationStatus: 'Endorsed for Concessionaire Direct Hire',
      proofDocument: 'emmanuel_gbaryee_bwi_diploma_aws_6g_cert.pdf (1.5 MB)',
      endorsement: 'Putu Jarwodee Traditional Council',
      consent: 'Yes',
      consentDate: '2026-02-02'
    }),
    created_by: 'workforce-desk@ggcdc.org.lr',
    created_at: '2026-02-02T11:15:00Z',
    updated_at: '2026-02-28T09:30:00Z'
  },
  {
    id: 'rec-wrk-04',
    module: 'workforce',
    title: 'Ruth N. Quiah - Supply Chain & Materials Warehouse Lead',
    status: 'Verified',
    county: 'Grand Gedeh',
    community: 'Zwedru Central',
    owner: 'Workforce Registry Desk',
    due_date: '2026-12-31',
    summary: 'Specialist in mining spare parts inventory control, SAP ERP, cross-border customs clearance, and fuel depot auditing.',
    details: JSON.stringify({
      track: 'Track A: Certified Professional / Skilled Artisan',
      occupation: 'Materials Management & Logistics Supervisor',
      skills: 'SAP ERP, hazardous material handling (HAZMAT), automated inventory control, supplier invoice auditing',
      experience: '7',
      availability: 'Available now',
      contact: '+231-880-998-112',
      qualification: 'BBA Accounting & Logistics (Cuttington University), CIPS Level 4 Diploma',
      institution: 'Cuttington University Suakoko & Chartered Institute of Procurement & Supply',
      recommendationStatus: 'Verified by GGAA Technical Desk',
      proofDocument: 'ruth_quiah_cuttington_bba_cips_cert.pdf (2.1 MB)',
      endorsement: 'Grand Gedeh Women in Business Chamber',
      consent: 'Yes',
      consentDate: '2026-02-10'
    }),
    created_by: 'workforce-desk@ggcdc.org.lr',
    created_at: '2026-02-10T14:45:00Z',
    updated_at: '2026-03-04T12:00:00Z'
  },
  {
    id: 'rec-wrk-05',
    module: 'workforce',
    title: 'Moses P. Gaye - Trainee Heavy Machinery & Drill Assistant',
    status: 'In progress',
    county: 'Grand Gedeh',
    community: 'Putu Jarwodee',
    owner: 'Workforce Registry Desk',
    due_date: '2026-12-31',
    summary: 'Young Jarwodee resident seeking sponsorship under Putu MDA Skills Development Fund for heavy haul truck operator apprenticeship.',
    details: JSON.stringify({
      track: 'Track B: Workforce Development / Apprenticeship Candidate',
      occupation: 'Workforce Development Trainee (Heavy Machinery / Drilling)',
      desiredTrade: 'Heavy Machinery Operator',
      skills: 'Manual physical laborer, motorcycle mechanics, farm land preparation, basic tool maintenance. Eager to master CAT haul truck operation.',
      experience: '0',
      availability: 'Available for Next Training Cohort',
      contact: '+231-775-334-112',
      qualification: 'No Formal Degree (High School Leaver - Ready for Apprenticeship)',
      institution: 'Zwedru Multilateral High School Graduate (2024)',
      recommendationStatus: 'Recommended for TVET Sponsorship',
      proofDocument: 'moses_gaye_voter_card_proof_jarwodee.pdf (0.9 MB)',
      endorsement: 'Elder Sampson Gaye & Jarwodee Youth Association',
      consent: 'Yes',
      consentDate: '2026-02-22'
    }),
    created_by: 'workforce-desk@ggcdc.org.lr',
    created_at: '2026-02-22T08:30:00Z',
    updated_at: '2026-03-05T10:15:00Z'
  },
  {
    id: 'rec-wrk-06',
    module: 'workforce',
    title: 'Beatrice K. Boley - Trainee Solar & Industrial Electrical',
    status: 'In progress',
    county: 'Grand Gedeh',
    community: 'Tiama',
    owner: 'Workforce Registry Desk',
    due_date: '2026-12-31',
    summary: 'Eager candidate from Tiama recommended by women leadership for TVET vocational electrical training and camp maintenance placement.',
    details: JSON.stringify({
      track: 'Track B: Workforce Development / Apprenticeship Candidate',
      occupation: 'Workforce Development Trainee (Solar & Electrical)',
      desiredTrade: 'Industrial Solar & Electrical',
      skills: 'Assisted local solar kiosk installations, basic house wiring helper, battery inverter diagnostics.',
      experience: '1',
      availability: 'Available for Next Training Cohort',
      contact: '+231-881-552-901',
      qualification: 'No Formal Certificate (Junior High / Self-Taught Farm Equipment Helper)',
      institution: 'Tiama Community Public School',
      recommendationStatus: 'Recommended for TVET Sponsorship',
      proofDocument: 'beatrice_boley_national_id_tiama_residence.pdf (0.8 MB)',
      endorsement: 'Tiama Women Leader Helena Boley & Town Chief',
      consent: 'Yes',
      consentDate: '2026-02-25'
    }),
    created_by: 'workforce-desk@ggcdc.org.lr',
    created_at: '2026-02-25T11:00:00Z',
    updated_at: '2026-03-06T14:20:00Z'
  },

  // 5. PROCUREMENT
  {
    id: 'rec-pro-01',
    module: 'procurement',
    title: 'Tender PR-2026-08: Local Aggregate, Sand & Crushed Rock Supply',
    status: 'In progress',
    county: 'Grand Gedeh',
    community: 'Putu Road Corridor',
    owner: 'Local Business Chamber Liaison',
    due_date: '2026-08-15',
    summary: '$450,000 package for 120,000 metric tons of construction aggregate; 100% reserved for Grand Gedeh registered quarry operators.',
    details: JSON.stringify({
      buyer: 'Mine Construction EPC Prime Contractor',
      category: 'Civil Construction Materials',
      deadline: '2026-08-15',
      estimatedValue: '$450,000 USD',
      awardee: 'Pending bid evaluation (3 Grand Gedeh firms shortlisted)',
      localContent: 'Mandatory 100% local enterprise participation; subcontractors must be registered in Grand Gedeh'
    }),
    created_by: 'business-chamber@ggcdc.org.lr',
    created_at: '2026-02-05T09:00:00Z',
    updated_at: '2026-03-09T16:00:00Z'
  },
  {
    id: 'rec-pro-02',
    module: 'procurement',
    title: 'Tender PR-2026-14: Camp Catering, Fresh Produce & Food Services',
    status: 'Awaiting response',
    county: 'Grand Gedeh',
    community: 'Zwedru, Konobo & Putu Farming Clusters',
    owner: 'Rural Women Association Liaison',
    due_date: '2026-09-01',
    summary: '$680,000 annual contract serving 1,400 daily workforce meals; minimum 65% farm-gate sourcing from local women cooperatives.',
    details: JSON.stringify({
      buyer: 'Putu Camp Operations Services',
      category: 'Catering & Agrarian Food Supplies',
      deadline: '2026-09-01',
      estimatedValue: '$680,000 USD / Year',
      awardee: 'Tender currently open for submission',
      localContent: 'At least 65% by value of vegetables, tubers, meat, eggs, and fruit must be sourced directly from Grand Gedeh farming collectives.'
    }),
    created_by: 'women-rep@ggcdc.org.lr',
    created_at: '2026-02-12T13:00:00Z',
    updated_at: '2026-03-07T10:00:00Z'
  },
  {
    id: 'rec-pro-03',
    module: 'procurement',
    title: 'Tender PR-2026-19: Construction of Putu Site Offices, Senior Staff Quarters & Central Canteen',
    status: 'In progress',
    county: 'Grand Gedeh',
    community: 'Putu Mining Corridor / Camp Site A',
    owner: 'Concession Infrastructure Procurement Board',
    due_date: '2026-10-15',
    summary: '$1,250,000 package for 14 prefabricated and reinforced masonry site buildings, modern kitchen canteen, and water treatment plant; 100% reserved for 51%+ Grand Gedean civil contractors.',
    details: JSON.stringify({
      buyer: 'Putu Mining Concession EPC Joint Venture',
      category: 'Civil Construction (Offices, Canteens, Staff Quarters)',
      deadline: '2026-10-15',
      estimatedValue: '$1,250,000 USD',
      awardee: 'Prequalification stage (Shortlisting 51% Grand Gedean Builders)',
      localContent: 'Statutory Section 13 Enforcement: Solely reserved for entities with >= 51% verified Grand Gedean beneficial ownership and county workforce commitment.'
    }),
    created_by: 'business-chamber@ggcdc.org.lr',
    created_at: '2026-02-20T10:00:00Z',
    updated_at: '2026-03-12T14:30:00Z'
  },
  {
    id: 'rec-pro-04',
    module: 'procurement',
    title: 'Tender PR-2026-22: Construction of 3 Community Elementary Schools & 2 Maternity Clinics',
    status: 'In progress',
    county: 'Grand Gedeh',
    community: 'Putu Jarwodee, Pennoken & Tiama',
    owner: 'Social Development Fund Project Implementation Unit',
    due_date: '2026-11-01',
    summary: '$850,000 community infrastructure package financed by Mineral Development Fund. Mandates 100% award to certified Grand Gedean contractors employing local artisans.',
    details: JSON.stringify({
      buyer: 'Grand Gedeh County Social Development Fund & Concessionaire CSR',
      category: 'Community Civil Works (Schools & Healthcare Clinics)',
      deadline: '2026-11-01',
      estimatedValue: '$850,000 USD',
      awardee: 'Tender open for bidding by prequalified 51% local contractors',
      localContent: 'Mandatory 100% Grand Gedean contractor execution; minimum 85% of site carpenters, masons, and welders must be sourced from host clans.'
    }),
    created_by: 'landowner@ggcdc.org.lr',
    created_at: '2026-02-25T11:30:00Z',
    updated_at: '2026-03-14T09:00:00Z'
  },

  // 6. SUPPLIERS
  {
    id: 'rec-sup-01',
    module: 'suppliers',
    title: 'Grand Gedeh United Logistics & Hauling Cooperative',
    status: 'Verified',
    county: 'Grand Gedeh',
    community: 'Zwedru Industrial Zone',
    owner: 'Local Business Chamber',
    due_date: '2026-11-30',
    summary: 'Consortium of 14 local truck owners operating 26 heavy tipper trucks and 4 low-bed trailers. 100% Grand Gedean owned, tax-cleared, and prequalified.',
    details: JSON.stringify({
      ownership: '100% Grand Gedean Owned',
      sector: 'Haulage, Earthmoving & Aggregate Transport',
      principals: 'Marcus K. Gaye (Tchien Clan), Sampson Boley (Konobo Clan), Helena Toe (Gbarzon Clan)',
      registration: 'Liberia Business Registry #2024-TR-0912 / TIN #100445982',
      taxStatus: 'Current & Cleared (Bid Ready)',
      headquarters: 'Zwedru Commercial District',
      capacity: 'Fleet of 26 tipper trucks (15-25 ton), 4 low-bed heavy equipment haulers, 2 mobile repair service vans. Capable of moving 3,500 tons/day.',
      employees: '38 permanent staff (92% Grand Gedeans)',
      pastContracts: 'Subcontractor for Zwedru-Harper Road corridor culvert aggregate; transport of 45,000 metric tons crushed rock for bridge maintenance.',
      contact: 'Marcus K. Gaye (+231-776-554-321 / transport@ggunitedlogistics.com)',
      endorsement: 'Grand Gedeh Motor Transport Union & County Chamber of Commerce',
      prequalificationStatus: 'Prequalified 51%+ Local Contractor',
      proofDocument: 'lbr_articles_of_incorporation_haulage_certified.pdf (2.2 MB)'
    }),
    created_by: 'business-chamber@ggcdc.org.lr',
    created_at: '2026-01-22T10:00:00Z',
    updated_at: '2026-03-02T15:20:00Z'
  },
  {
    id: 'rec-sup-02',
    module: 'suppliers',
    title: 'Zwedru Agro-Producers & Poultry Processing Enterprise',
    status: 'In progress',
    county: 'Grand Gedeh',
    community: 'Tchien District',
    owner: 'Women & Youth Micro-Enterprise Hub',
    due_date: '2026-10-15',
    summary: 'Grassroots cooperative of 85 smallholder farmers producing eggs, dressed chicken, cabbage, cassava, and plantains for mine site catering.',
    details: JSON.stringify({
      ownership: '100% Grand Gedean Owned',
      sector: 'Fresh Agricultural Produce & Food Supplies',
      principals: 'Hawa V. Kromah (Chairperson), Beatrice K. Toe (Women Caucus Leader), Mary Gaye',
      registration: 'Cooperative Development Authority (CDA) Reg #CDA-GG-118 / TIN #100589123',
      taxStatus: 'Current & Cleared (Bid Ready)',
      headquarters: 'Zwedru Commercial District',
      capacity: 'Current production: 2,500 eggs/day, 800 dressed broilers/month, 12 tons seasonal tubers. Expanding cold-chain facility.',
      employees: '85 member-owners (100% Grand Gedean women & youth)',
      pastContracts: 'Supplied 18 tons of tubers and 12,000 eggs to local hospitals and secondary school boarding programs.',
      contact: 'Hawa V. Kromah (+231-886-778-990 / zapp-coop@zwedruagro.org)',
      endorsement: 'Grand Gedeh Rural Women Association & Zwedru Market Superintendent',
      prequalificationStatus: 'Endorsed for Concession Direct Award',
      proofDocument: 'cda_charter_and_beneficial_ownership_registry.pdf (1.9 MB)'
    }),
    created_by: 'women-rep@ggcdc.org.lr',
    created_at: '2026-02-08T14:30:00Z',
    updated_at: '2026-03-06T11:45:00Z'
  },
  {
    id: 'rec-sup-03',
    module: 'suppliers',
    title: 'Putu Mountain Civil Builders & Infrastructure Ltd',
    status: 'Verified',
    county: 'Grand Gedeh',
    community: 'Putu Mining Corridor',
    owner: 'Local Business Chamber',
    due_date: '2026-12-15',
    summary: 'General civil construction firm specializing in pre-engineered steel buildings, camp offices, staff quarters, canteens, community schools, and clinics. 100% Grand Gedean owned.',
    details: JSON.stringify({
      ownership: '100% Grand Gedean Owned',
      sector: 'Civil Construction (Offices, Canteens, Schools, Clinics)',
      principals: 'Eng. Emmanuel T. Quiah (Lead Structural Engineer, Putu Clan), Sarah D. Gaye (Managing Director)',
      registration: 'Liberia Business Registry #2023-C-4421 / MPW Category A Civil Contractor #MPW-2024-088 / TIN #100388910',
      taxStatus: 'Current & Cleared (Bid Ready)',
      headquarters: 'Putu Mining Corridor',
      capacity: '2 concrete batching mixers, 1 vibratory soil compactor, scaffolding for 3-story structures, fleet of 3 10-ton flatbeds, carpentry and block-molding yard (capacity 4,000 blocks/day).',
      employees: '52 permanent technicians, carpenters, and masons (88% Grand Gedeans)',
      pastContracts: 'Constructed 6-classroom Tubman University annex facility, constructed 2 rural clinics in Gbarzon and Sinoe border with solar cold chain, built 240-seat local assembly hall in Zwedru.',
      contact: 'Eng. Emmanuel T. Quiah (+231-770-889-443 / info@putucivilbuilders.com.lr)',
      endorsement: 'Grand Gedeh Chamber of Commerce & Putu Clan Paramount Chief',
      prequalificationStatus: 'Prequalified 51%+ Local Contractor',
      proofDocument: 'putu_builders_lbr_articles_mpw_license_clearance.pdf (3.4 MB)'
    }),
    created_by: 'business-chamber@ggcdc.org.lr',
    created_at: '2026-02-15T09:00:00Z',
    updated_at: '2026-03-10T14:00:00Z'
  },
  {
    id: 'rec-sup-04',
    module: 'suppliers',
    title: 'Cavalla River Engineering & Metal Fabrication Enterprise',
    status: 'Verified',
    county: 'Grand Gedeh',
    community: 'Pennoken Industrial Hub',
    owner: 'Technical Professionals Advisory Panel',
    due_date: '2026-11-20',
    summary: 'Heavy structural steel welding, security gates, fuel tank skids, trailer chassis repair, and machinery reconditioning. 75% Grand Gedean owned.',
    details: JSON.stringify({
      ownership: '75% - 99% Grand Gedean Owned',
      sector: 'Metal Fabrication, Welding & Maintenance',
      principals: 'T. Harrison Boley (Master Certified Welder, Pennoken), Roland K. Bailey (Machinist)',
      registration: 'Liberia Business Registry #2024-ENG-7731 / TIN #100654321',
      taxStatus: 'Current & Cleared (Bid Ready)',
      headquarters: 'Pennoken Industrial Hub',
      capacity: '6 industrial Miller multi-process TIG/MIG welding rigs, 2 oxy-acetylene track cutters, 50-ton hydraulic press, mobile field welding rig truck.',
      employees: '18 certified welders and fabricators (83% Grand Gedeans)',
      pastContracts: 'Fabricated overhead fuel tank gantries and heavy security boundary gates for road construction substations; trailer axle reconditioning.',
      contact: 'T. Harrison Boley (+231-886-554-119 / hboley@cavallaengineering.com)',
      endorsement: 'Pennoken Elders Council & Vocational Training Alumni Caucus',
      prequalificationStatus: 'Prequalified 51%+ Local Contractor',
      proofDocument: 'cavalla_metal_lbr_articles_tin_tax_clearance.pdf (2.1 MB)'
    }),
    created_by: 'professionals@ggcdc.org.lr',
    created_at: '2026-02-18T11:00:00Z',
    updated_at: '2026-03-08T16:20:00Z'
  },
  {
    id: 'rec-sup-05',
    module: 'suppliers',
    title: 'Zwedru Industrial Catering & Camp Services Consortium',
    status: 'Verified',
    county: 'Grand Gedeh',
    community: 'Zwedru Commercial District',
    owner: 'Local Business Chamber',
    due_date: '2026-10-31',
    summary: 'Full-service industrial hospitality, commercial kitchen canteen management, camp janitorial, laundry, and daily shift meal catering. 100% Grand Gedean owned.',
    details: JSON.stringify({
      ownership: '100% Grand Gedean Owned',
      sector: 'Catering, Canteen & Food Service',
      principals: 'Comfort N. Tarley (Executive Director, Zwedru), Patience B. Doe (Operations Lead)',
      registration: 'Liberia Business Registry #2023-CAT-8902 / Ministry of Health Sanitary Certificate #MOH-GG-2025-044 / TIN #100412876',
      taxStatus: 'Current & Cleared (Bid Ready)',
      headquarters: 'Zwedru Commercial District',
      capacity: 'Commercial kitchen facility capable of preparing 1,200 hot meals per shift, 2 refrigerated food transit vans, 4 mobile buffet service units, industrial laundry facility.',
      employees: '42 staff including certified chefs, kitchen hands, hygiene technicians (95% Grand Gedeans)',
      pastContracts: 'Managed catering for international road development camp (300 staff for 14 months) with zero food safety incidents; multi-district event catering.',
      contact: 'Comfort N. Tarley (+231-777-123-987 / catering@zwedruservices.com)',
      endorsement: 'Grand Gedeh Women in Business Chamber & County Health Team',
      prequalificationStatus: 'Prequalified 51%+ Local Contractor',
      proofDocument: 'zwedru_catering_lbr_moh_sanitary_tax_clearance.pdf (2.8 MB)'
    }),
    created_by: 'women-rep@ggcdc.org.lr',
    created_at: '2026-02-22T13:15:00Z',
    updated_at: '2026-03-11T12:00:00Z'
  },

  // 7. SKILLS TRANSFER
  {
    id: 'rec-skl-01',
    module: 'skills',
    title: 'Putu Technical Apprenticeship Program (Cohort 1)',
    status: 'In progress',
    county: 'Grand Gedeh',
    community: 'Zwedru Multilateral High School / Site Campus',
    owner: 'Skills Development Working Group',
    due_date: '2026-09-30',
    summary: '60 seats fully funded for 18-month certified technical apprenticeships in industrial electrical systems and heavy diesel mechanics.',
    details: JSON.stringify({
      provider: 'National Industrial Training Institute (NITI) in partnership with Mining EPC',
      trade: 'Heavy Mining Equipment Diesel Mechanics & Electrical Automation',
      places: '60',
      startDate: '2026-09-15',
      completion: 'Dual certification: City & Guilds Level 3 + National Vocational Diploma. 100% on-the-job mentorship with senior expatriate master mechanics.',
      outcome: 'Direct employment placement into permanent maintenance positions for at least 85% of graduates.'
    }),
    created_by: 'youth-caucus@ggcdc.org.lr',
    created_at: '2026-01-28T09:30:00Z',
    updated_at: '2026-03-04T16:00:00Z'
  },

  // 8. ENVIRONMENT
  {
    id: 'rec-env-01',
    module: 'environment',
    title: 'Cavalla River & Gbeh-Zohn Watershed Baseline Water Quality Testing',
    status: 'Verified',
    county: 'Grand Gedeh',
    community: 'Downstream Putu Watershed (6 Sampling Stations)',
    owner: 'Environmental Independent Monitoring Team',
    due_date: '2026-11-01',
    summary: 'Monthly third-party laboratory analysis testing for arsenic, mercury, lead, turbidity, and dissolved oxygen across 6 community monitoring stations.',
    details: JSON.stringify({
      topic: 'Water',
      location: 'Stations WQ-01 (Jarwodee upper), WQ-02 (Plant outflow), WQ-05 (Pennoken bridge)',
      observation: 'Pre-mining baseline shows pristine water quality (turbidity < 4 NTU, heavy metals below WHO detection thresholds). No industrial contaminants present.',
      standard: 'Liberian EPA Potable Water Guidelines / WHO Drinking Water Standards',
      correctiveAction: 'Establish automated continuous turbidity sensors with public solar telemetry dashboards accessible to GGCDC observers.',
      verification: 'Certified Lab Reports SGS-2026-WQ-091 verified by GGAA diaspora environmental scientists.'
    }),
    created_by: 'env-specialist@ggcdc.org.lr',
    created_at: '2026-02-15T11:00:00Z',
    updated_at: '2026-03-08T09:00:00Z'
  },
  {
    id: 'rec-env-02',
    module: 'environment',
    title: 'Putu Mountain Tailings Storage Facility (TSF) Design & Safety Audit',
    status: 'Under review',
    county: 'Grand Gedeh',
    community: 'Putu Central Ridge Valley',
    owner: 'Independent Geological & Tailings Panel',
    due_date: '2026-10-20',
    summary: 'Comprehensive geotechnical audit of the proposed downstream-constructed tailings dam to ensure zero-risk to adjacent valleys and agrarian settlements.',
    details: JSON.stringify({
      topic: 'Tailings',
      location: 'Putu Valley TSF Site (Coordinates: Lat 5.682, Long -8.214)',
      observation: 'Geotechnical review confirms downstream rockfill dam design (safer than upstream construction), but emergency spillway sizing must be updated for extreme 1-in-10,000-year rainfall events.',
      standard: 'Global Industry Standard on Tailings Management (GISTM 2020)',
      correctiveAction: 'Company engineers must incorporate secondary emergency rock spillway and real-time piezometer sensor array.',
      verification: 'Independent peer review conducted by GGAA diaspora geotechnical engineers.'
    }),
    created_by: 'professionals@ggcdc.org.lr',
    created_at: '2026-02-20T14:00:00Z',
    updated_at: '2026-03-09T17:15:00Z'
  },

  // 9. INFRASTRUCTURE
  {
    id: 'rec-inf-01',
    module: 'infrastructure',
    title: 'Putu to Greenville Heavy Rail Corridor & Community Crossings',
    status: 'In progress',
    county: 'Grand Gedeh',
    community: 'Putu - Sinoe Border Section (62 km within Grand Gedeh)',
    owner: 'Corridor Infrastructure Working Group',
    due_date: '2026-12-15',
    summary: '130 km standard-gauge rail corridor connecting mine pit to port; includes 18 safe community cattle/pedestrian underpasses and farm crossings.',
    details: JSON.stringify({
      asset: 'Rail',
      route: 'Putu Mountain Mine Loadout Terminal to Sinoe County Line',
      milestone: 'Geotechnical soil coring 90% complete; final route alignment avoids 4 historical town burial grounds.',
      publicAccess: 'Mandatory provision for 18 designated agricultural road crossings, 6 pedestrian overpasses, and twice-weekly non-concession freight slots.',
      budget: '$340M Corridor Capital Expenditure',
      evidence: 'Corridor Engineering Alignment Drawing Rev 4.2'
    }),
    created_by: 'infrastructure@ggcdc.org.lr',
    created_at: '2026-01-18T10:00:00Z',
    updated_at: '2026-03-03T11:30:00Z'
  },
  {
    id: 'rec-inf-02',
    module: 'infrastructure',
    title: 'Zwedru to Putu Main Highway Asphalt Paving & Solar Lighting',
    status: 'In progress',
    county: 'Grand Gedeh',
    community: 'Zwedru - Pennoken - Putu Junction (44 km)',
    owner: 'County Infrastructure Liaison',
    due_date: '2026-11-30',
    summary: 'All-weather dual-lane asphalt road upgrade replacing seasonal muddy track; includes 120 solar streetlights across 8 transit towns.',
    details: JSON.stringify({
      asset: 'Road',
      route: 'Zwedru Central Roundabout to Putu Mining Gate',
      milestone: 'Sub-base earthworks complete for 28 km; 14 reinforced concrete culverts installed.',
      publicAccess: 'Public national highway remains 100% open and un-gated for all citizens, transport unions, and traders.',
      budget: '$28.5M Co-Financed by Concession Infrastructure Obligation',
      evidence: 'Ministry of Public Works Supervised Inspection Report MPW/SE/09'
    }),
    created_by: 'infrastructure@ggcdc.org.lr',
    created_at: '2026-02-04T08:30:00Z',
    updated_at: '2026-03-05T14:45:00Z'
  },

  // 10. COMMUNITY BENEFITS
  {
    id: 'rec-ben-01',
    module: 'benefits',
    title: 'County Social Development Fund (CSDF) Annual Mineral Contribution',
    status: 'In progress',
    county: 'Grand Gedeh',
    community: 'County-Wide (All 3 Statutory Districts)',
    owner: 'Council Financial Stewardship Committee',
    due_date: '2026-10-31',
    summary: '$1,250,000 USD mandatory annual concession contribution deposited into dedicated county development account with transparent public audit.',
    details: JSON.stringify({
      benefitType: 'Direct Social Development Fund (SDF)',
      amount: '$1,250,000 USD / Year',
      recipient: 'Grand Gedeh County Development Account (Joint Signatory: County Administration & GGCDC Civic Trustees)',
      disbursement: '2026-04-15',
      deliverable: '50% dedicated to rural health clinics, high school science laboratories, clean water boreholes, and townhall solar power; 30% to youth vocational grants; 20% to affected community priority projects.',
      proof: 'Central Bank of Liberia Escrow Deposit Receipt #CBL-SDF-2026-02'
    }),
    created_by: 'secretariat@ggcdc.org.lr',
    created_at: '2026-01-10T14:00:00Z',
    updated_at: '2026-03-01T16:20:00Z'
  },
  {
    id: 'rec-ben-02',
    module: 'benefits',
    title: 'Jarwodee Comprehensive Health Center & Solar Maternity Clinic',
    status: 'Verified',
    county: 'Grand Gedeh',
    community: 'Putu Jarwodee',
    owner: 'Women & Health Committee',
    due_date: '2026-09-01',
    summary: 'Modern 30-bed community health clinic featuring digital ultrasound, solar power, staff quarters, and dedicated 4x4 ambulance.',
    details: JSON.stringify({
      benefitType: 'Social Infrastructure Grant',
      amount: '$320,000 USD',
      recipient: 'Jarwodee Community Health Board & County Health Team',
      disbursement: '2026-01-20',
      deliverable: 'Fully operational clinic structure, staff quarters for 4 nurses/midwives, solar cold chain for vaccine storage, and Toyota Land Cruiser ambulance.',
      proof: 'Official Commissioning Certificate signed by Grand Gedeh County Health Officer and Paramount Chief.'
    }),
    created_by: 'women-rep@ggcdc.org.lr',
    created_at: '2026-01-20T11:00:00Z',
    updated_at: '2026-02-28T10:00:00Z'
  },

  // 11. GRIEVANCES
  {
    id: 'rec-grv-01',
    module: 'grievances',
    title: 'Grievance GR-2026-004: Farm Crop Destruction along Haul Road Survey Line',
    status: 'In progress',
    county: 'Grand Gedeh',
    community: 'Tiama Village Farm Cluster',
    owner: 'GGBA Grievance Mediator & Land Officer',
    due_date: '2026-08-30',
    summary: 'Bulldozer survey work cleared 4.5 acres of mature cocoa, plantain, and rubber trees prior to formal compensation agreement with 3 families.',
    details: JSON.stringify({
      category: 'Crop Damage & Compensation Dispute',
      channel: 'Community Palava Hut Written Submission',
      confidentiality: 'Standard',
      requestedRemedy: 'Immediate stop-work order on affected parcel; certified agricultural assessment by Ministry of Agriculture price schedule; fair restitution payment of $12,400 to the 3 farm families.',
      response: 'Concession contractor suspended clearance on section km 14-16; Joint assessment completed on Feb 26; company finance team processing compensation voucher.',
      closedDate: ''
    }),
    created_by: 'ggba-counsel@ggcdc.org.lr',
    created_at: '2026-02-18T13:00:00Z',
    updated_at: '2026-03-08T15:00:00Z'
  },
  {
    id: 'rec-grv-02',
    module: 'grievances',
    title: 'Grievance GR-2026-009: Subcontractor Hiring Favoritism & Kickback Allegations',
    status: 'Under review',
    county: 'Grand Gedeh',
    community: 'Putu Gate Labor Pool',
    owner: 'Ethics & Grievance Panel',
    due_date: '2026-09-10',
    summary: 'Whistleblower alert alleging recruitment agency charged $50 application fees to local youth for camp cleaning positions in violation of zero-fee policy.',
    details: JSON.stringify({
      category: 'Labor Malpractice & Corruption',
      channel: 'Confidential Whistleblower Drop-Box',
      confidentiality: 'Restricted',
      requestedRemedy: 'Termination of corrupt recruitment agency contract; full refund of unauthorized fees to 34 youth; mandatory direct hiring via GGCDC Workforce Registry.',
      response: 'GGCDC Secretariat conducted independent interviews; dossier submitted to concession HR director; recruiter suspended pending final investigation.',
      closedDate: ''
    }),
    created_by: 'ethics-panel@ggcdc.org.lr',
    created_at: '2026-02-25T16:00:00Z',
    updated_at: '2026-03-10T11:30:00Z'
  },

  // 12. TRANSPARENCY
  {
    id: 'rec-trn-01',
    module: 'transparency',
    title: 'Public Right-to-Information Request: Putu MDA Full Text & Fiscal Modeling',
    status: 'Verified',
    county: 'Grand Gedeh',
    community: 'Monrovia / Zwedru Public Library',
    owner: 'Transparency & Freedom of Information Desk',
    due_date: '2026-07-01',
    summary: 'Official request to National Investment Commission and Ministry of Mines for unredacted copies of concession agreements and tax incentive schedules.',
    details: JSON.stringify({
      document: 'Mineral Development Agreement (MDA) 2026 Revision & Financial Annexes',
      requestDate: '2026-01-15',
      holder: 'Ministry of Mines & Energy / National Investment Commission (NIC)',
      publication: 'https://ggcdc.org.lr/repository/putu-mda-full-text-2026.pdf',
      disclosureStatus: 'Published',
      reason: 'Mandatory civic disclosure under the Freedom of Information Act and LEITI standard. Physical copies distributed to Zwedru City Hall and district offices.'
    }),
    created_by: 'transparency-desk@ggcdc.org.lr',
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-02-22T14:00:00Z'
  },
  {
    id: 'rec-trn-02',
    module: 'transparency',
    title: 'Concession Royalty Payments & County Revenue Reconciliation (LEITI Q1)',
    status: 'In progress',
    county: 'Grand Gedeh',
    community: 'County-Wide',
    owner: 'Professionals & Accountants Committee',
    due_date: '2026-10-15',
    summary: 'Independent civic reconciliation comparing concessionaire reported royalty disbursements against Ministry of Finance receipts and county bank accounts.',
    details: JSON.stringify({
      document: 'Q1 2026 Extractive Revenue Triangulation Report',
      requestDate: '2026-02-01',
      holder: 'Liberia Extractive Industries Transparency Initiative (LEITI)',
      publication: '',
      disclosureStatus: 'Received',
      reason: 'Ensure zero revenue leakage between Monrovia national treasury and Grand Gedeh County development account.'
    }),
    created_by: 'professionals@ggcdc.org.lr',
    created_at: '2026-02-01T15:00:00Z',
    updated_at: '2026-03-05T12:00:00Z'
  },

  // 13. MONITORING
  {
    id: 'rec-mon-01',
    module: 'monitoring',
    title: 'KPI IND-01: Grand Gedeh Resident Workforce Employment Share',
    status: 'In progress',
    county: 'Grand Gedeh',
    community: 'Mine Site & Construction Camps',
    owner: 'Independent Monitoring Taskforce',
    due_date: '2026-11-30',
    summary: 'Quarterly indicator auditing actual local hiring percentages across unskilled, skilled technical, and supervisory positions.',
    details: JSON.stringify({
      indicator: 'Percentage of total workforce originating from or permanently residing in Grand Gedeh County',
      baseline: '32% (Pre-agreement status)',
      target: '65% overall (100% unskilled, 50% skilled)',
      actual: '54.2% verified as of March 2026',
      period: 'Q1 2026 Audit',
      verification: 'Bi-monthly biometric site audit and National Social Security & Welfare Corporation (NASSCORP) employee rosters.'
    }),
    created_by: 'monitoring@ggcdc.org.lr',
    created_at: '2026-01-25T13:00:00Z',
    updated_at: '2026-03-07T16:30:00Z'
  },
  {
    id: 'rec-mon-02',
    module: 'monitoring',
    title: 'KPI IND-04: Local Commercial Procurement Spend Proportion',
    status: 'Under review',
    county: 'Grand Gedeh',
    community: 'County Commercial Market',
    owner: 'Local Business Chamber & Monitoring Unit',
    due_date: '2026-12-10',
    summary: 'Measuring total concession operational and capital expenditure awarded to Grand Gedeh domiciled enterprises.',
    details: JSON.stringify({
      indicator: 'Share of total non-specialized procurement spend going to Grand Gedeh vendors',
      baseline: '4.8% ($210,000 in 2025)',
      target: '25% ($2.4M by Q4 2026)',
      actual: '14.1% ($780,000 as of March 2026)',
      period: 'H1 2026 Benchmark',
      verification: 'Audited vendor invoices, tax identification verification, and bank deposit confirmations.'
    }),
    created_by: 'monitoring@ggcdc.org.lr',
    created_at: '2026-02-10T11:00:00Z',
    updated_at: '2026-03-09T14:15:00Z'
  },

  // 14. GOVERNANCE
  {
    id: 'rec-gov-01',
    module: 'governance',
    title: 'GGCDC Resolution 2026-01: Adoption of Founding Charter Principles & Civic Covenant',
    status: 'Verified',
    county: 'Grand Gedeh',
    community: 'Zwedru City Hall & Monrovia Consultative Session',
    owner: 'Interim Executive Secretariat',
    due_date: '2026-06-30',
    summary: 'Solemn adoption of the founding principle: "Nothing about Grand Gedeh without meaningful participation by Grand Gedeans—and nothing about an affected community without meaningful participation by that community."',
    details: JSON.stringify({
      meetingDate: '2026-02-28',
      body: 'Joint Interim Consultative Advisory Committee & Pillar Delegates',
      decision: 'Unanimous adoption of the GGCDC Civic Covenant: (1) Nonpartisan status, (2) Strict anti-conflict of interest rules prohibiting political exploitation, (3) Autonomy from statutory mining rights negotiations, (4) GGAA recognized as technical partner without unilateral control, (5) Affected communities retain sacred rights over customary lands.',
      participants: '58 delegates representing Chiefs, Women, Youth, Bar Association, Business Chamber, and Diaspora',
      conflict: 'All 7 interim presiding officers completed and published statutory conflict-of-interest disclosures.',
      minutes: 'GGCDC Minutes Vol 1, Session 02 (Monrovia / Zwedru Hybrid)'
    }),
    created_by: 'secretariat@ggcdc.org.lr',
    created_at: '2026-02-28T18:00:00Z',
    updated_at: '2026-03-02T10:00:00Z'
  },
  {
    id: 'rec-gov-02',
    module: 'governance',
    title: 'Resolution 2026-02: Mandate & Constitution of the Putu Mining Working Group',
    status: 'Verified',
    county: 'Grand Gedeh',
    community: 'Putu District & Zwedru',
    owner: 'Council Steering Committee',
    due_date: '2026-07-15',
    summary: 'Formal appointment of 14 thematic leads across agreements, land rights, workforce, procurement, environment, and community benefits.',
    details: JSON.stringify({
      meetingDate: '2026-03-05',
      body: 'Full Stakeholder Consultative Assembly',
      decision: 'Constituted the specialized "GGCDC Putu Mining & Development Working Group". Assigned technical conveners from GGAA expert roster and local community delegates to co-chair each of the 14 specialized areas.',
      participants: 'Traditional Chiefs, Youth Leaders, Women Reps, GGBA Legal Team, GGAA Emissary',
      conflict: 'No pecuniary conflicts declared; zero corporate retaining fees permitted.',
      minutes: 'GGCDC Resolution Registry 2026-02-PUTU'
    }),
    created_by: 'secretariat@ggcdc.org.lr',
    created_at: '2026-03-05T15:30:00Z',
    updated_at: '2026-03-06T12:00:00Z'
  }
];

export const initialLinks: RecordLink[] = [
  { id: 'lnk-01', source_id: 'rec-agr-01', target_id: 'rec-emp-01', relation: 'Governs Hiring Target' },
  { id: 'lnk-02', source_id: 'rec-agr-01', target_id: 'rec-mon-01', relation: 'Audited By Indicator' },
  { id: 'lnk-03', source_id: 'rec-agr-02', target_id: 'rec-env-01', relation: 'Enforces Environmental Baseline' },
  { id: 'lnk-04', source_id: 'rec-agr-02', target_id: 'rec-env-02', relation: 'Mandates Tailings Standard' },
  { id: 'lnk-05', source_id: 'rec-lnd-01', target_id: 'rec-lnd-03', relation: 'Protects Customary Headwaters' },
  { id: 'lnk-06', source_id: 'rec-lnd-02', target_id: 'rec-grv-01', relation: 'Triggered by Crop Disturbance' },
  { id: 'lnk-07', source_id: 'rec-pro-01', target_id: 'rec-sup-01', relation: 'Shortlisted Local Vendor' },
  { id: 'lnk-08', source_id: 'rec-pro-02', target_id: 'rec-sup-02', relation: 'Agricultural Sourcing Partner' },
  { id: 'lnk-09', source_id: 'rec-skl-01', target_id: 'rec-emp-01', relation: 'Pipelines Trained Artisans' },
  { id: 'lnk-10', source_id: 'rec-ben-01', target_id: 'rec-ben-02', relation: 'Financed Priority Project' },
  { id: 'lnk-11', source_id: 'rec-gov-01', target_id: 'rec-gov-02', relation: 'Constitutes Working Group' },
  { id: 'lnk-12', source_id: 'rec-trn-01', target_id: 'rec-agr-01', relation: 'Public Right-to-Information Archive' }
];

export class StorageEngine {
  private static isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  static getRecords(): RecordItem[] {
    if (!this.isBrowser()) return initialRecords;
    try {
      const data = localStorage.getItem(STORAGE_KEY_RECORDS);
      if (!data) {
        this.saveRecords(initialRecords);
        return initialRecords;
      }
      return JSON.parse(data);
    } catch {
      return initialRecords;
    }
  }

  static saveRecords(records: RecordItem[]): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
    } catch (e) {
      console.warn('Failed to save full records payload, attempting stripped storage fallback', e);
      try {
        const sanitized = records.map(r => {
          if (!r.details) return r;
          try {
            const parsed = JSON.parse(r.details);
            if (parsed.proofFileData && parsed.proofFileData.length > 50000) {
              parsed.proofFileData = undefined;
              return { ...r, details: JSON.stringify(parsed) };
            }
          } catch {}
          return r;
        });
        localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(sanitized));
      } catch (err2) {
        console.error('Critical localStorage write failure:', err2);
      }
    }
  }

  static getLinks(): RecordLink[] {
    if (!this.isBrowser()) return initialLinks;
    try {
      const data = localStorage.getItem(STORAGE_KEY_LINKS);
      if (!data) {
        this.saveLinks(initialLinks);
        return initialLinks;
      }
      return JSON.parse(data);
    } catch {
      return initialLinks;
    }
  }

  static saveLinks(links: RecordLink[]): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEY_LINKS, JSON.stringify(links));
    } catch (e) {
      console.error('Failed to save links to localStorage', e);
    }
  }

  static addRecord(data: Omit<RecordItem, 'id' | 'created_at' | 'updated_at'>): RecordItem {
    const records = this.getRecords();
    const now = new Date().toISOString();
    const newRecord: RecordItem = {
      ...data,
      id: 'rec-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
      created_at: now,
      updated_at: now
    };
    records.unshift(newRecord);
    this.saveRecords(records);
    return newRecord;
  }

  static updateRecord(id: string, updates: Partial<RecordItem>): RecordItem | null {
    const records = this.getRecords();
    const idx = records.findIndex(r => r.id === id);
    if (idx === -1) return null;
    const updated: RecordItem = {
      ...records[idx],
      ...updates,
      updated_at: new Date().toISOString()
    };
    records[idx] = updated;
    this.saveRecords(records);
    return updated;
  }

  static deleteRecord(id: string): boolean {
    let records = this.getRecords();
    const initialLen = records.length;
    records = records.filter(r => r.id !== id);
    if (records.length === initialLen) return false;
    this.saveRecords(records);

    // Also remove links associated with this record
    let links = this.getLinks();
    links = links.filter(l => l.source_id !== id && l.target_id !== id);
    this.saveLinks(links);
    return true;
  }

  static addLink(sourceId: string, targetId: string, relation: string): RecordLink {
    const links = this.getLinks();
    const newLink: RecordLink = {
      id: 'lnk-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
      source_id: sourceId,
      target_id: targetId,
      relation,
      created_at: new Date().toISOString()
    };
    links.push(newLink);
    this.saveLinks(links);
    return newLink;
  }

  static deleteLink(id: string): boolean {
    let links = this.getLinks();
    const initialLen = links.length;
    links = links.filter(l => l.id !== id);
    if (links.length === initialLen) return false;
    this.saveLinks(links);
    return true;
  }

  static resetToSeedData(): { records: RecordItem[]; links: RecordLink[] } {
    if (this.isBrowser()) {
      localStorage.removeItem(STORAGE_KEY_RECORDS);
      localStorage.removeItem(STORAGE_KEY_LINKS);
    }
    this.saveRecords(initialRecords);
    this.saveLinks(initialLinks);
    return { records: initialRecords, links: initialLinks };
  }

  static exportBackupJSON(): string {
    const payload = {
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      organization: governingPrinciples.name,
      motto: governingPrinciples.motto,
      records: this.getRecords(),
      links: this.getLinks()
    };
    return JSON.stringify(payload, null, 2);
  }

  static importBackupJSON(jsonStr: string): boolean {
    try {
      const data = JSON.parse(jsonStr);
      if (!Array.isArray(data.records)) return false;
      this.saveRecords(data.records);
      if (Array.isArray(data.links)) {
        this.saveLinks(data.links);
      }
      return true;
    } catch {
      return false;
    }
  }
}
