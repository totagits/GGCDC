# Grand Gedeh Citizens Development Council (GGCDC) Platform

> **Public Identity:** One County • One Voice • Shared Development  
> **Sacred Charter Principle:** *"Nothing about Grand Gedeh without meaningful participation by Grand Gedeans—and nothing about an affected community without meaningful participation by that community."*  
> **Live Online Access:** [https://totagits.github.io/GGCDC/](https://totagits.github.io/GGCDC/)

---

## 🏛️ Institutional Architecture & Vision

The **Grand Gedeh Citizens Development Council (GGCDC)** is an independent, nonpartisan, inclusive, county-centered civic stakeholder platform.

### Tripartite Governance Structure
1. **The In-County Foundation (Communities & Customary Landowners):**
   - Retain sacred customary land rights, statutory protection under the Land Rights Act of 2018, and direct Free, Prior and Informed Consent (FPIC) authority.
   - Represented directly through clan elders, town chiefs, women networks, and youth caucuses across Putu Jarwodee, Pennoken, Tiama, Gbarzon, Konobo, Cavalla, and Tchien.

2. **The Civic Stakeholder Platform (GGCDC):**
   - Independent, inclusive civic vehicle representing the collective voice of Grand Gedeh.
   - Operates the specialized **GGCDC Putu Mining & Development Working Group** covering 14 thematic work areas.
   - Coordinates citizen deliberation, independent evidence aggregation, and structured advocacy.
   - **Crucial Distinction:** GGCDC does *not* claim statutory governmental powers (unlike a statutory Authority) and does *not* negotiate mineral rights (which belong to the Government of Liberia).

3. **External Negotiating Counterparties:**
   - **Government of Liberia (GoL):** Exercise of statutory mining, regulatory (EPA), and tax authorities.
   - **Mining Concessionaire / Investor:** Private capital, engineering execution, and contractual compliance.
   - GGCDC engages both counterparties through structured evidence-based advocacy, third-party monitoring, and grievance resolution.

4. **Technical & Legal Support Backbone:**
   - **Grand Gedeh Association in the Americas (GGAA):** Strategic diaspora partner mobilizing engineers, geologists, economists, and international technical review without exerting unilateral control over in-county residents.
   - **Grand Gedeh Bar Association (GGBA):** Principal legal counsel providing independent contract review, human rights oversight, and anti-conflict of interest enforcement.

---

## 📋 The 14 Putu Mining & Development Working Group Modules

The platform provides dedicated tracking, compliance audits, and relational linking across 14 specialized areas:

| # | Module | Core Function & Focus |
|---|---|---|
| 1 | **MDA & Project Agreements** | Track clauses, legal obligations, renegotiation items, and counterparty compliance. |
| 2 | **Land & Community Rights** | Customary land boundaries, FPIC consent, resettlement action plans, and crop compensation. |
| 3 | **Employment Commitments** | Audit local hiring targets (70% unskilled, 40% skilled quotas) against contractor payrolls. |
| 4 | **Community Workforce Registry** | Consent-based talent directory for matching local certified artisans to contractor openings. |
| 5 | **Local Procurement** | Tendering opportunities, local content spend thresholds, and contract award transparency. |
| 6 | **Supplier Development** | Readiness assessment, tax registration support, and capacity building for Grand Gedeh SMEs. |
| 7 | **Skills Transfer** | Technical apprenticeships, vocational institute partnerships, and professional placements. |
| 8 | **Environmental Safeguards** | Tailings storage facility (TSF) safety, monthly watershed testing, and dust suppression audits. |
| 9 | **Corridor Infrastructure** | Multi-user Greenville-Putu rail access, public road paving, clean water, and rural power. |
| 10 | **Community Benefits** | County Social Development Fund (CSDF) tracking, clinic construction, and school grants. |
| 11 | **Grievances & Remedies** | Confidential community incident intake, whistleblower protection, and independent mediation. |
| 12 | **Disclosure & Transparency** | Freedom of Information requests, LEITI revenue reconciliation, and open contract repositories. |
| 13 | **Implementation Monitoring** | Quantitative Key Performance Indicators (KPIs), baseline vs. actual metrics, and shadow reports. |
| 14 | **Council Governance** | Council resolutions, stakeholder delegate voting records, and conflict-of-interest declarations. |

---

## 👥 The 12 Founding Stakeholder Pillars

GGCDC is constituted through a public consultative process providing direct representation for:
1. Affected Communities & Customary Landowners (Jarwodee, Pennoken, Tiama, Konobo)
2. Traditional Leadership & Council of Paramount/Clan Chiefs
3. Women Leadership & Rural Women Networks
4. Youth Leadership & Grand Gedeh Student Union
5. Persons with Disabilities (PWD) & Vulnerable Groups
6. Grand Gedeh Business & Entrepreneurial Chamber
7. Multi-Disciplinary Professionals (Engineers, Geologists, Economists, Accountants)
8. Religious & Interfaith Institutions (Christian & Muslim leadership)
9. Civil Society Organizations (CSOs) & Human Rights Defenders
10. Grand Gedeh Bar Association (GGBA)
11. County-Based Organizations & District Associations
12. Diaspora Organizations, including GGAA

---

## 🧭 Consultative Formation Roadmap

Tracking the groundwork facilitated by President Edith T. Poah's dispatched emissary:
- **Phase 1: Monrovia Stakeholder Consultations & Civic Outreach** *(In Progress)*
- **Phase 2: In-County District Townhalls & Community Hearings** *(Upcoming)*
- **Phase 3: Legal Chartering & Governance Framework Drafting with GGBA** *(Upcoming)*
- **Phase 4: Diaspora Technical Alignment & Expert Roster with GGAA** *(Upcoming)*
- **Phase 5: Grand Gedeh Stakeholder Constitutional Assembly** *(Upcoming)*

---

## 🛠️ Specialized Interactive Tools

- **Workforce Talent Matcher:** Filter local candidates by trade and years of experience with automated consent checks.
- **Relational Link Explorer:** Visualize multi-directional connections between MDA obligations, environmental tests, and community grievances.
- **Confidential Grievance Portal:** Public intake form supporting restricted whistleblower submissions with automated tracking case IDs.
- **Founding Charter Viewer:** Read the complete official covenant, sacred participation principle, and anti-conflict of interest rules.
- **Data Manager:** Export filtered CSV tables, download full JSON repository backups, restore backups, or reset to official seed data.
- **Persona Switcher:** Switch between 6 stakeholder roles (Emissary, GGAA Technical Advisor, GGBA Legal Counsel, Landowner Delegate, Environmental Specialist, Public Citizen).

---

## 💾 Dual-Engine Storage Architecture

The platform operates seamlessly in two environments:
1. **GitHub Pages / Static Offline Mode:**
   - High-performance client-side storage engine (`localStorage`) pre-seeded with 30+ comprehensive, verified Grand Gedeh records.
   - Complete support for CRUD, search, filtering, relational links, CSV exports, and JSON backups without server dependencies.
2. **Cloudflare Workers / D1 Mode:**
   - Full-stack execution with D1 SQLite database bindings, Next.js server actions, and Cloudflare Worker runtime.

---

## 🚀 Running Locally

Requires Node.js 22 or later.

```bash
# Install dependencies
pnpm install

# Run static development server
pnpm run build:pages
npx vite preview --config vite.pages.config.ts

# Or run full-stack Cloudflare / Vinext development server
pnpm dev
```

### Build Commands
```bash
# Build standalone static site for GitHub Pages
pnpm run build:pages

# Build Cloudflare Worker bundle
pnpm run build
```
