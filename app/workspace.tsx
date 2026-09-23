'use client';
import { useEffect, useMemo, useState, useRef } from 'react';
import {
  modules,
  statuses,
  counties,
  Module,
  stakeholderPillars,
  consultativeRoadmap,
  governingPrinciples,
  StakeholderPillar,
  RoadmapPhase
} from './modules';
import {
  StorageEngine,
  RecordItem,
  RecordLink,
  initialRecords,
  initialLinks
} from '@/lib/storage';
import {
  Home as HomeIcon,
  LayoutDashboard,
  FileText,
  Users,
  Handshake,
  Leaf,
  HardHat,
  Scale,
  BriefcaseBusiness,
  GraduationCap,
  TrainFront,
  HeartHandshake,
  MessageSquareWarning,
  Eye,
  ClipboardCheck,
  Landmark,
  Plus,
  Search,
  Download,
  Upload,
  Link2,
  Menu,
  X,
  Save,
  RefreshCw,
  ShieldCheck,
  Layers,
  Compass,
  Network,
  UserCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ExternalLink,
  Filter,
  Sparkles,
  BookOpen,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Database,
  Building2,
  ShieldAlert,
  Send,
  Play,
  Pause
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const moduleIcons: Record<string, any> = {
  agreements: FileText,
  land: Scale,
  employment: BriefcaseBusiness,
  workforce: Users,
  procurement: ClipboardCheck,
  suppliers: Handshake,
  skills: GraduationCap,
  environment: Leaf,
  infrastructure: TrainFront,
  benefits: HeartHandshake,
  grievances: MessageSquareWarning,
  transparency: Eye,
  monitoring: HardHat,
  governance: Landmark
};

const blankForm = (moduleId: string) => ({
  module: moduleId,
  title: '',
  status: 'Draft',
  county: 'Grand Gedeh',
  community: '',
  owner: '',
  dueDate: '',
  summary: '',
  details: {} as Record<string, string>
});

const ROLES = [
  { id: 'emissary', name: 'GGAA Emissary / Secretariat Facilitator', badge: 'Facilitator' },
  { id: 'ggaa', name: 'GGAA Diaspora Technical Advisor', badge: 'Technical Partner' },
  { id: 'ggba', name: 'GGBA Legal Counsel & Oversight', badge: 'Legal Advisor' },
  { id: 'landowner', name: 'Putu Customary Landowner Delegate', badge: 'Affected Community' },
  { id: 'environment', name: 'Environmental & Safeguards Specialist', badge: 'HSE Monitor' },
  { id: 'citizen', name: 'Grand Gedeh Citizen / Civic Delegate', badge: 'Public Stakeholder' }
];

// 8 Curated Photos for Hero Carousel
const HERO_SLIDES = [
  {
    id: 1,
    tag: 'PUTU MOUNTAIN RANGE',
    title: 'Putu Mountain Iron Ore Ridge',
    caption: 'The towering, mineral-rich crest of Putu Mountain containing multi-billion tons of iron ore reserves in Grand Gedeh.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    alt: 'Putu Mountain Iron Ore Ridge in Grand Gedeh'
  },
  {
    id: 2,
    tag: 'LOCAL EMPLOYMENT & LABOR',
    title: 'Grand Gedean Mine Workers & Artisans',
    caption: 'Skilled local heavy equipment operators, drillers, and certified technicians leading site preparation and mining works.',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    alt: 'Grand Gedean Mine Workers and Engineers'
  },
  {
    id: 3,
    tag: 'HUMAN CAPITAL & STEM',
    title: 'School Children & Next-Gen Education',
    caption: 'Investing mineral development revenues directly into modernized community schools, secondary labs, and youth scholarships.',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
    alt: 'Grand Gedeh School Children in modern classroom'
  },
  {
    id: 4,
    tag: 'COMMUNITY HEALTHCARE',
    title: 'Modern Hospital & Maternity Clinics',
    caption: 'Solar-powered healthcare centers, cold-chain medicine facilities, and 4x4 emergency transport across host districts.',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    alt: 'Grand Gedeh Healthcare Center and Doctors'
  },
  {
    id: 5,
    tag: 'CORRIDOR INFRASTRUCTURE',
    title: 'Heavy Freight Railway with Ore Leaving',
    caption: 'Standard-gauge heavy-haul railway carrying ore to port, equipped with multi-user commercial freight and community access.',
    imageUrl: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80',
    alt: 'Railway carrying iron ore to port'
  },
  {
    id: 6,
    tag: 'ALL-WEATHER CONNECTIVITY',
    title: 'Paved Asphalt Highway & Solar Lighting',
    caption: 'Replacing impassable seasonal muddy tracks with modern dual-lane paved highways connecting Zwedru, Pennoken, and Putu.',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    alt: 'Paved Highway in Grand Gedeh'
  },
  {
    id: 7,
    tag: 'AGRARIAN COOPERATIVES',
    title: 'Grand Gedeh Farmers & Food Security',
    caption: 'Local farming cooperatives producing fresh vegetables, poultry, and cassava directly contracted to mining catering services.',
    imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80',
    alt: 'Grand Gedeh farmers harvesting crops'
  },
  {
    id: 8,
    tag: 'CUSTOMARY GOVERNANCE',
    title: 'Customary Land & Palava Hut Consultations',
    caption: 'Traditional chiefs, elders, and women leaders conducting consensus assemblies safeguarding customary land and forest rights.',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    alt: 'Customary consultations in Grand Gedeh'
  }
];

export default function Workspace({ user: initialUser }: { user?: string }) {
  // Navigation State - defaults to 'home' landing page
  const [activeTab, setActiveTab] = useState<'home' | 'dashboard' | 'putu-group' | 'architecture' | 'roadmap' | 'pillars' | 'tools'>('home');
  const [activeModuleId, setActiveModuleId] = useState<string>('agreements');
  const [activeTool, setActiveTool] = useState<'matcher' | 'explorer' | 'grievance-portal' | 'charter' | 'backup'>('matcher');
  
  // Data State
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [links, setLinks] = useState<RecordLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'api' | 'local'>('local');
  const [error, setError] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  
  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselPlaying, setIsCarouselPlaying] = useState(true);
  const carouselTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Filtering & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [countyFilter, setCountyFilter] = useState('All');
  
  // Record Form Modal State
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<RecordItem | null>(null);
  const [form, setForm] = useState(blankForm('agreements'));
  const [saving, setSaving] = useState(false);
  const [targetLinkId, setTargetLinkId] = useState('');
  const [relationText, setRelationText] = useState('Supports');
  
  // Shell UI State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState(ROLES[0]);
  
  // Tool: Workforce Matcher
  const [matcherTrade, setMatcherTrade] = useState('All');
  const [matcherMinExp, setMatcherMinExp] = useState(0);

  // Tool: Grievance Portal
  const [grievanceForm, setGrievanceForm] = useState({
    title: '',
    category: 'Land & Environmental Damage',
    community: 'Putu Jarwodee',
    confidentiality: 'Restricted',
    description: '',
    remedy: '',
    claimantContact: ''
  });
  const [grievanceSuccessRef, setGrievanceSuccessRef] = useState<string | null>(null);

  // Carousel Auto-Play Timer
  useEffect(() => {
    if (isCarouselPlaying) {
      carouselTimerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
      }, 4500);
    }
    return () => {
      if (carouselTimerRef.current) clearInterval(carouselTimerRef.current);
    };
  }, [isCarouselPlaying]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  // Load records from Cloudflare D1 or fallback to Local Storage Engine
  async function loadData() {
    setLoading(true);
    try {
      const res = await fetch('/api/records', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.records && Array.isArray(data.records) && data.records.length > 0) {
          setRecords(data.records);
          setLinks(data.links || []);
          setDataSource('api');
          setError('');
          setLoading(false);
          return;
        }
      }
    } catch {
      // Fallback silently to client persistent storage
    }

    // Local Storage Fallback
    const localRecs = StorageEngine.getRecords();
    const localLnks = StorageEngine.getLinks();
    setRecords(localRecs);
    setLinks(localLnks);
    setDataSource('local');
    setError('');
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  // Filtered Records
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchModule = activeTab === 'putu-group' ? r.module === activeModuleId : true;
      const matchStatus = statusFilter === 'All' || r.status === statusFilter;
      const matchCounty = countyFilter === 'All' || r.county === countyFilter;
      const searchLower = search.toLowerCase();
      const matchSearch = !search || [
        r.title,
        r.summary,
        r.community,
        r.county,
        r.owner,
        r.details
      ].some(val => String(val || '').toLowerCase().includes(searchLower));

      return matchModule && matchStatus && matchCounty && matchSearch;
    });
  }, [records, activeTab, activeModuleId, statusFilter, countyFilter, search]);

  // Counts by module
  const moduleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const m of modules) {
      counts[m.id] = records.filter(r => r.module === m.id).length;
    }
    return counts;
  }, [records]);

  // Active module meta
  const currentModule = modules.find(m => m.id === activeModuleId) || modules[0];
  const formModule = modules.find(m => m.id === form.module) || modules[0];

  // Open modal for new record
  const handleOpenNew = (defaultModule?: string) => {
    setEditing(null);
    setForm(blankForm(defaultModule || (activeTab === 'putu-group' ? activeModuleId : 'agreements')));
    setTargetLinkId('');
    setFeedback('');
    setModal(true);
  };

  // Open modal for editing record
  const handleOpenEdit = (rec: RecordItem) => {
    setEditing(rec);
    let parsedDetails = {};
    try {
      parsedDetails = JSON.parse(rec.details || '{}');
    } catch {
      parsedDetails = {};
    }
    setForm({
      module: rec.module,
      title: rec.title,
      status: rec.status,
      county: rec.county || 'Grand Gedeh',
      community: rec.community || '',
      owner: rec.owner || '',
      dueDate: rec.due_date || '',
      summary: rec.summary || '',
      details: parsedDetails
    });
    setTargetLinkId('');
    setFeedback('');
    setModal(true);
  };

  // Save record (API or Local Storage)
  async function handleSaveRecord() {
    if (!form.title.trim()) {
      setError('Please enter a specific record title');
      return;
    }
    if (form.module === 'workforce' && form.details.consent !== 'Yes') {
      setError('Mandatory Safeguard: Workforce registration requires explicit consent to share profile data.');
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      ...form,
      id: editing?.id,
      details: form.details
    };

    // Try API if in API mode
    if (dataSource === 'api') {
      try {
        const res = await fetch('/api/records', {
          method: editing ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          setModal(false);
          await loadData();
          setSaving(false);
          return;
        }
      } catch {
        // Fall back to local
      }
    }

    // Local save
    if (editing) {
      StorageEngine.updateRecord(editing.id, {
        module: form.module,
        title: form.title.trim(),
        status: form.status,
        county: form.county,
        community: form.community,
        owner: form.owner,
        due_date: form.dueDate,
        summary: form.summary,
        details: JSON.stringify(form.details)
      });
    } else {
      StorageEngine.addRecord({
        module: form.module,
        title: form.title.trim(),
        status: form.status,
        county: form.county,
        community: form.community,
        owner: form.owner,
        due_date: form.dueDate,
        summary: form.summary,
        details: JSON.stringify(form.details),
        created_by: currentRole.name
      });
    }

    setModal(false);
    loadData();
    setSaving(false);
    setFeedback('Record successfully saved and persisted.');
    setTimeout(() => setFeedback(''), 4000);
  }

  // Add relational link
  async function handleAddLink() {
    if (!editing || !targetLinkId) return;
    try {
      if (dataSource === 'api') {
        const res = await fetch('/api/links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sourceId: editing.id,
            targetId: targetLinkId,
            relation: relationText
          })
        });
        if (res.ok) {
          setTargetLinkId('');
          await loadData();
          return;
        }
      }
    } catch {
      // Fall through to local
    }

    StorageEngine.addLink(editing.id, targetLinkId, relationText);
    setTargetLinkId('');
    loadData();
  }

  // Export CSV
  const handleExportCSV = () => {
    const columns = ['id', 'module', 'title', 'status', 'county', 'community', 'owner', 'due_date', 'summary', 'details', 'created_at', 'updated_at'];
    const encode = (s: any) => '"' + String(s ?? '').replaceAll('"', '""') + '"';
    const csvContent = [
      columns.join(','),
      ...filteredRecords.map(r => columns.map(c => encode((r as any)[c])).join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GGCDC_Records_${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export JSON Backup
  const handleExportJSON = () => {
    const jsonStr = StorageEngine.exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GGCDC_Full_Repository_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON Backup
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const success = StorageEngine.importBackupJSON(text);
      if (success) {
        loadData();
        setFeedback('Backup database restored successfully!');
      } else {
        setError('Invalid backup JSON format.');
      }
    };
    reader.readAsText(file);
  };

  // Reset to Seed
  const handleResetSeed = () => {
    if (confirm('Reset the database to the official 30+ Grand Gedeh verified seed records?')) {
      StorageEngine.resetToSeedData();
      loadData();
      setFeedback('Platform reset to official Grand Gedeh seed dataset.');
    }
  };

  // Submit Public Grievance
  const handleSubmitGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grievanceForm.title || !grievanceForm.description) {
      setError('Please provide a title and incident description.');
      return;
    }

    const refId = 'GR-2026-' + Math.floor(1000 + Math.random() * 9000);
    StorageEngine.addRecord({
      module: 'grievances',
      title: `${refId}: ${grievanceForm.title}`,
      status: 'Awaiting response',
      county: 'Grand Gedeh',
      community: grievanceForm.community,
      owner: 'Ethics & Grievance Panel',
      due_date: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      summary: grievanceForm.description.slice(0, 200),
      details: JSON.stringify({
        category: grievanceForm.category,
        channel: 'GGCDC Public Intake Portal',
        confidentiality: grievanceForm.confidentiality,
        requestedRemedy: grievanceForm.remedy,
        response: 'Received by GGCDC intake desk; preliminary review underway.',
        claimantContact: grievanceForm.confidentiality === 'Restricted' ? 'Encrypted / Redacted' : grievanceForm.claimantContact,
        closedDate: ''
      }),
      created_by: 'Public Stakeholder Intake'
    });

    setGrievanceSuccessRef(refId);
    setGrievanceForm({
      title: '',
      category: 'Land & Environmental Damage',
      community: 'Putu Jarwodee',
      confidentiality: 'Restricted',
      description: '',
      remedy: '',
      claimantContact: ''
    });
    loadData();
  };

  // Workforce Registry Candidates for Matcher
  const workforceCandidates = useMemo(() => {
    return records
      .filter(r => r.module === 'workforce')
      .map(r => {
        let details: any = {};
        try {
          details = JSON.parse(r.details || '{}');
        } catch {
          details = {};
        }
        return {
          id: r.id,
          name: r.title,
          community: r.community,
          occupation: details.occupation || 'Tradesperson',
          skills: details.skills || '',
          experience: parseInt(details.experience || '0', 10),
          availability: details.availability || 'Available now',
          contact: details.contact || '',
          qualification: details.qualification || '',
          consent: details.consent === 'Yes'
        };
      })
      .filter(c => {
        const matchesTrade = matcherTrade === 'All' || c.occupation.toLowerCase().includes(matcherTrade.toLowerCase());
        const matchesExp = c.experience >= matcherMinExp;
        return matchesTrade && matchesExp;
      });
  }, [records, matcherTrade, matcherMinExp]);

  const activeSlideData = HERO_SLIDES[currentSlide];

  return (
    <div className="shell">
      {/* SIDEBAR NAVIGATION */}
      <aside className={`sidebar ${mobileMenuOpen ? 'show' : ''}`}>
        <div className="brand">
          <div className="seal">G</div>
          <div>
            <strong>GGCDC</strong>
            <small>Grand Gedeh Citizens Dev. Council</small>
          </div>
          <button className="closeMobile" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <div className="sideScroll">
          {/* Main Navigation */}
          <p className="sideLabel">PORTAL & VIEWS</p>
          <button
            className={`nav ${activeTab === 'home' ? 'chosen' : ''}`}
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
          >
            <HomeIcon size={18} />
            Home / Landing Page
          </button>

          <button
            className={`nav ${activeTab === 'dashboard' ? 'chosen' : ''}`}
            onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
          >
            <LayoutDashboard size={18} />
            Command Center
            <span>{records.length}</span>
          </button>

          <button
            className={`nav ${activeTab === 'architecture' ? 'chosen' : ''}`}
            onClick={() => { setActiveTab('architecture'); setMobileMenuOpen(false); }}
          >
            <Building2 size={18} />
            Institutional Architecture
          </button>

          <button
            className={`nav ${activeTab === 'roadmap' ? 'chosen' : ''}`}
            onClick={() => { setActiveTab('roadmap'); setMobileMenuOpen(false); }}
          >
            <Compass size={18} />
            Consultative Roadmap
          </button>

          <button
            className={`nav ${activeTab === 'pillars' ? 'chosen' : ''}`}
            onClick={() => { setActiveTab('pillars'); setMobileMenuOpen(false); }}
          >
            <Users size={18} />
            12 Stakeholder Pillars
          </button>

          <button
            className={`nav ${activeTab === 'tools' ? 'chosen' : ''}`}
            onClick={() => { setActiveTab('tools'); setMobileMenuOpen(false); }}
          >
            <Sparkles size={18} />
            Specialized Tools
          </button>

          {/* Putu Working Group 14 Modules */}
          <p className="sideLabel groupLabel">PUTU MINING WORKING GROUP</p>
          {modules.map((m) => {
            const Icon = moduleIcons[m.id] || FileText;
            const isSelected = activeTab === 'putu-group' && activeModuleId === m.id;
            return (
              <button
                key={m.id}
                className={`nav ${isSelected ? 'chosen' : ''}`}
                onClick={() => {
                  setActiveTab('putu-group');
                  setActiveModuleId(m.id);
                  setSearch('');
                  setStatusFilter('All');
                  setMobileMenuOpen(false);
                }}
              >
                <Icon size={18} />
                {m.short}
                <span>{moduleCounts[m.id] || 0}</span>
              </button>
            );
          })}
        </div>

        <div className="sideFoot">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: '#d5ae59', fontWeight: 'bold' }}>{governingPrinciples.motto}</span>
          </div>
          <span style={{ fontSize: '11px', display: 'block', color: '#a0c4b6' }}>
            Data Engine: {dataSource === 'api' ? 'Cloudflare D1 Online' : 'Local Persistent Engine (Active)'}
          </span>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="main">
        {/* TOPBAR */}
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button className="menuBtn" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
              <Menu size={22} />
            </button>
            <div className="breadcrumb">
              <strong>GGCDC</strong>
              <span>/</span>
              {activeTab === 'home' && 'Public Portal · Welcome'}
              {activeTab === 'dashboard' && 'Executive Command Center'}
              {activeTab === 'putu-group' && `Putu Working Group · ${currentModule.name}`}
              {activeTab === 'architecture' && 'Institutional Architecture & Governance'}
              {activeTab === 'roadmap' && 'Consultative Formation Roadmap'}
              {activeTab === 'pillars' && '12 Founding Stakeholder Pillars'}
              {activeTab === 'tools' && 'Civic Tools & Verification Engine'}
            </div>
          </div>

          <div className="topRight">
            {activeTab !== 'home' ? (
              <Button variant="outline" size="sm" onClick={() => setActiveTab('home')} style={{ fontSize: '12px', height: '32px' }}>
                <HomeIcon size={14} /> Public Portal
              </Button>
            ) : (
              <Button size="sm" className="primary" onClick={() => setActiveTab('dashboard')} style={{ fontSize: '12px', height: '32px' }}>
                <LayoutDashboard size={14} /> Open Command Center
              </Button>
            )}

            {/* Persona / Role Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#688075', fontWeight: 600 }}>Persona:</span>
              <select
                value={currentRole.id}
                onChange={(e) => {
                  const r = ROLES.find(item => item.id === e.target.value);
                  if (r) setCurrentRole(r);
                }}
                style={{
                  height: '34px',
                  borderRadius: '6px',
                  border: '1px solid #d5ded9',
                  background: '#f8faf9',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#1a4338',
                  padding: '0 8px'
                }}
              >
                {ROLES.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            <div className="avatar" title={`Current persona: ${currentRole.name}`}>
              {currentRole.name[0]}
            </div>
          </div>
        </header>

        <div className="content">
          {/* NOTICES & FEEDBACK */}
          {feedback && (
            <div style={{ background: '#e9f7ef', color: '#145a32', border: '1px solid #a9dfbf', padding: '12px 18px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              <CheckCircle2 size={18} />
              <span>{feedback}</span>
            </div>
          )}
          {error && (
            <div style={{ background: '#fdf2e9', color: '#a04000', border: '1px solid #edbb99', padding: '12px 18px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              <AlertTriangle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* VIEW: 0. HOME / LANDING PAGE WITH HERO SECTION & PHOTO CAROUSEL */}
          {activeTab === 'home' && (
            <div>
              {/* HERO SECTION */}
              <div className="heroWrapper">
                <div className="heroGrid">
                  {/* Left Column: Title, Subtitle, Sacred Quote, CTAs */}
                  <div className="heroLeft">
                    <div className="heroTag">
                      <ShieldCheck size={14} />
                      INDEPENDENT CIVIC STAKEHOLDER PLATFORM
                    </div>

                    <h1 className="heroTitle">
                      Grand Gedeh Citizens Development Council
                    </h1>

                    <div className="heroSubtitle">
                      One County • One Voice • Shared Development
                    </div>

                    <p className="heroDesc">
                      A county-centered, nonpartisan platform uniting customary landowners, traditional chiefs, women, youth, professionals, and diaspora partners to safeguard our natural resources, secure genuine community benefits from Putu mining, and build lasting multi-generational prosperity.
                    </p>

                    <div className="heroQuote">
                      "{governingPrinciples.sacredRule}"
                    </div>

                    <div className="heroCtas">
                      <Button
                        className="primary"
                        onClick={() => setActiveTab('dashboard')}
                        style={{ height: '46px', padding: '0 24px', fontSize: '15px', fontWeight: 700 }}
                      >
                        <LayoutDashboard size={18} /> Enter Command Center
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => { setActiveTab('tools'); setActiveTool('grievance-portal'); }}
                        style={{ height: '46px', padding: '0 20px', fontSize: '14px', background: '#ffffff15', color: '#fff', borderColor: '#d5ae5980' }}
                      >
                        <ShieldAlert size={18} color="#f5d78e" /> Confidential Grievance Portal
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => { setActiveTab('putu-group'); setActiveModuleId('agreements'); }}
                        style={{ height: '46px', padding: '0 20px', fontSize: '14px', background: '#ffffff10', color: '#e0ece6', borderColor: '#ffffff30' }}
                      >
                        <BriefcaseBusiness size={18} /> Putu Working Group
                      </Button>
                    </div>

                    <div className="heroStats">
                      <div>
                        <strong>12 Pillars</strong>
                        <span>Founding Representation</span>
                      </div>
                      <div>
                        <strong>14 Areas</strong>
                        <span>Putu Working Groups</span>
                      </div>
                      <div>
                        <strong>100% Civic</strong>
                        <span>Nonpartisan & Independent</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: High-Impact Photo Carousel */}
                  <div
                    className="heroRight"
                    onMouseEnter={() => setIsCarouselPlaying(false)}
                    onMouseLeave={() => setIsCarouselPlaying(true)}
                  >
                    <div className="carouselBox">
                      <div className="carouselImgWrap">
                        <img
                          src={activeSlideData.imageUrl}
                          alt={activeSlideData.alt}
                          className="carouselImg"
                        />

                        {/* Top Controls Overlay */}
                        <div className="carouselControls">
                          <button
                            className="carouselBtn"
                            onClick={() => setIsCarouselPlaying(!isCarouselPlaying)}
                            aria-label={isCarouselPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
                            title={isCarouselPlaying ? 'Pause Slideshow' : 'Play Slideshow'}
                          >
                            {isCarouselPlaying ? <Pause size={15} /> : <Play size={15} />}
                          </button>
                          <button className="carouselBtn" onClick={prevSlide} aria-label="Previous image">
                            <ChevronLeft size={18} />
                          </button>
                          <button className="carouselBtn" onClick={nextSlide} aria-label="Next image">
                            <ChevronRight size={18} />
                          </button>
                          <div className="carouselCounter">
                            {currentSlide + 1} / {HERO_SLIDES.length}
                          </div>
                        </div>

                        {/* Slide Caption Overlay */}
                        <div className="carouselOverlay">
                          <span className="slidePill">{activeSlideData.tag}</span>
                          <h3 className="slideTitle">{activeSlideData.title}</h3>
                          <p className="slideCaption">{activeSlideData.caption}</p>
                        </div>

                        {/* Dot Navigation */}
                        <div className="carouselDots">
                          {HERO_SLIDES.map((slide, idx) => (
                            <button
                              key={slide.id}
                              className={`carouselDot ${idx === currentSlide ? 'activeDot' : ''}`}
                              onClick={() => setCurrentSlide(idx)}
                              aria-label={`Go to slide ${idx + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* THREE CORE PILLARS OF THE PLATFORM */}
              <div className="landingIntro">
                <div className="landingCard">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ background: '#eaf4ef', color: '#133e36', padding: '8px', borderRadius: '8px' }}>
                      <Building2 size={22} />
                    </div>
                    <strong>Tripartite Architecture</strong>
                  </div>
                  <p>
                    Clear distinction: GGCDC is the county-centered civic platform; GGAA provides diaspora technical backup; GGBA gives independent legal expertise; affected customary communities retain direct voices and land rights.
                  </p>
                  <Button variant="outline" size="sm" className="cardBtn" onClick={() => setActiveTab('architecture')}>
                    Explore Architecture <ChevronRight size={14} />
                  </Button>
                </div>

                <div className="landingCard">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ background: '#fdf6e8', color: '#976e1a', padding: '8px', borderRadius: '8px' }}>
                      <Compass size={22} />
                    </div>
                    <strong>Consultative Formation Roadmap</strong>
                  </div>
                  <p>
                    President Edith T. Poah's dispatched emissary is currently in Monrovia facilitating civic dialogues, followed by in-county district townhalls and legal chartering with GGBA toward a formal Constitutional Assembly.
                  </p>
                  <Button variant="outline" size="sm" className="cardBtn" onClick={() => setActiveTab('roadmap')}>
                    View 5-Phase Roadmap <ChevronRight size={14} />
                  </Button>
                </div>

                <div className="landingCard">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ background: '#eef2f9', color: '#1b4f8a', padding: '8px', borderRadius: '8px' }}>
                      <BriefcaseBusiness size={22} />
                    </div>
                    <strong>14 Putu Mining Work Areas</strong>
                  </div>
                  <p>
                    A specialized arm actively tracking MDA clauses, customary boundaries, local hiring quotas, environmental water testing, corridor rail multi-user access, and community development funds.
                  </p>
                  <Button variant="outline" size="sm" className="cardBtn" onClick={() => setActiveTab('putu-group')}>
                    Browse Work Areas <ChevronRight size={14} />
                  </Button>
                </div>
              </div>

              {/* QUICK FEATURE HIGHLIGHT: 14 PUTU MODULES */}
              <div style={{ background: '#fff', border: '1px solid #dce5e0', borderRadius: '14px', padding: '32px', marginBottom: '36px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h2 style={{ font: '700 24px Georgia', margin: 0, color: '#133e36' }}>
                      Putu Mining & Development Working Group
                    </h2>
                    <p style={{ margin: '4px 0 0', color: '#687d74', fontSize: '14px' }}>
                      Fourteen interconnected operational areas tracking commitments, safeguards, and citizen benefits.
                    </p>
                  </div>
                  <Button className="primary" onClick={() => setActiveTab('dashboard')}>
                    Access Working Group Records ({records.length})
                  </Button>
                </div>

                <div className="moduleGrid">
                  {modules.map((m) => {
                    const Icon = moduleIcons[m.id] || FileText;
                    return (
                      <button
                        key={m.id}
                        className="moduleCard"
                        onClick={() => {
                          setActiveTab('putu-group');
                          setActiveModuleId(m.id);
                        }}
                      >
                        <div className="moduleIcon">
                          <Icon size={21} />
                        </div>
                        <div>
                          <strong>{m.name}</strong>
                          <p>{m.description}</p>
                        </div>
                        <span>{moduleCounts[m.id] || 0}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: 1. COMMAND CENTER DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              {/* CHARTER BANNER */}
              <div style={{
                background: 'linear-gradient(135deg, #10352f 0%, #174b43 100%)',
                color: '#fff',
                borderRadius: '12px',
                padding: '24px 28px',
                marginBottom: '28px',
                boxShadow: '0 6px 20px #10352f20',
                border: '1px solid #d5ae5950'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'inline-block', background: '#d5ae5930', border: '1px solid #d5ae5980', color: '#f3d999', fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '4px', letterSpacing: '0.1em', marginBottom: '10px' }}>
                      FOUNDING CIVIC CHARTER PRINCIPLE
                    </div>
                    <h2 style={{ font: '700 24px Georgia, serif', margin: '0 0 8px', color: '#f5faf7' }}>
                      {governingPrinciples.name}
                    </h2>
                    <p style={{ margin: '0', fontSize: '15px', color: '#e0ece6', maxWidth: '850px', lineHeight: 1.5, fontStyle: 'italic' }}>
                      "{governingPrinciples.sacredRule}"
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '13px', color: '#d5ae59', fontWeight: 800, letterSpacing: '0.08em', display: 'block' }}>
                      PUBLIC IDENTITY
                    </span>
                    <strong style={{ fontSize: '18px', color: '#ffffff', letterSpacing: '0.02em' }}>
                      {governingPrinciples.motto}
                    </strong>
                    <div style={{ marginTop: '8px' }}>
                      <span style={{ fontSize: '11px', background: '#ffffff20', padding: '4px 8px', borderRadius: '4px', color: '#dcf0e7' }}>
                        Nonpartisan • Inclusive • County-Centered
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="heading">
                <div>
                  <div className="eyebrow">COUNCIL OPERATIONS COMMAND CENTER</div>
                  <h1>Grand Gedeh Development Dashboard</h1>
                  <p>
                    Coordinating evidence, customary land protection, employment commitments, and transparent governance across Grand Gedeh County.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button onClick={() => handleOpenNew()} className="primary">
                    <Plus size={18} /> New record
                  </Button>
                </div>
              </div>

              {/* STATS TILES */}
              <div className="stats">
                <div>
                  <span>Total Commitments & Records</span>
                  <strong>{records.length}</strong>
                  <small>Across 14 Putu working groups</small>
                </div>
                <div>
                  <span>Pending Actions & Reviews</span>
                  <strong>{records.filter(r => !['Closed', 'Verified'].includes(r.status)).length}</strong>
                  <small>Require advocacy or follow-up</small>
                </div>
                <div>
                  <span>Verified Workforce Talent</span>
                  <strong>{moduleCounts.workforce || 0}</strong>
                  <small>Consent verified local artisans</small>
                </div>
                <div>
                  <span>Active Relational Links</span>
                  <strong>{links.length}</strong>
                  <small>Cross-sector verified linkages</small>
                </div>
              </div>

              {/* QUICK WORKING GROUP GRID */}
              <h2 style={{ font: '700 22px Georgia', margin: '32px 0 16px', color: '#133e36' }}>
                Putu Mining & Development Working Group Areas
              </h2>
              <div className="moduleGrid">
                {modules.map((m) => {
                  const Icon = moduleIcons[m.id] || FileText;
                  return (
                    <button
                      key={m.id}
                      className="moduleCard"
                      onClick={() => {
                        setActiveTab('putu-group');
                        setActiveModuleId(m.id);
                      }}
                    >
                      <div className="moduleIcon">
                        <Icon size={21} />
                      </div>
                      <div>
                        <strong>{m.name}</strong>
                        <p>{m.description}</p>
                      </div>
                      <span>{moduleCounts[m.id] || 0}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* VIEW: 2. PUTU MINING WORKING GROUP DEEP-DIVE */}
          {activeTab === 'putu-group' && (
            <>
              <div className="heading">
                <div>
                  <div className="eyebrow">PUTU MINING & DEVELOPMENT WORKING GROUP</div>
                  <h1>{currentModule.name}</h1>
                  <p>{currentModule.description}</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Button onClick={() => handleOpenNew(activeModuleId)} className="primary">
                    <Plus size={18} /> New {currentModule.short} record
                  </Button>
                </div>
              </div>

              {/* Thematic Navigation Pills */}
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '20px' }}>
                {modules.map(m => (
                  <button
                    key={m.id}
                    onClick={() => { setActiveModuleId(m.id); setSearch(''); }}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      border: activeModuleId === m.id ? '2px solid #14493e' : '1px solid #d4ded8',
                      background: activeModuleId === m.id ? '#14493e' : '#ffffff',
                      color: activeModuleId === m.id ? '#ffffff' : '#455a52',
                      cursor: 'pointer'
                    }}
                  >
                    {m.short} ({moduleCounts[m.id] || 0})
                  </button>
                ))}
              </div>
            </>
          )}

          {/* VIEW: 3. INSTITUTIONAL ARCHITECTURE */}
          {activeTab === 'architecture' && (
            <div>
              <div className="heading">
                <div>
                  <div className="eyebrow">STRATEGIC GOVERNANCE ARCHITECTURE</div>
                  <h1>Independent County Stakeholder Platform</h1>
                  <p>
                    Why GGCDC is designed as an independent, county-centered platform rather than a diaspora branch, statutory authority, or political movement.
                  </p>
                </div>
              </div>

              {/* FLOWCHART / ARCHITECTURE VISUALIZATION */}
              <div style={{ background: '#fff', border: '1px solid #dce5e0', borderRadius: '14px', padding: '32px', marginBottom: '32px', boxShadow: '0 4px 16px #10352f08' }}>
                <h3 style={{ font: '700 20px Georgia', margin: '0 0 20px', color: '#10352f', textAlign: 'center' }}>
                  Grand Gedeh Institutional Tripartite Arrangement
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', alignItems: 'stretch' }}>
                  {/* Pillar 1: Sovereign Foundation */}
                  <div style={{ border: '2px solid #2e7d32', borderRadius: '12px', background: '#f4fbf5', padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <div style={{ background: '#2e7d32', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px' }}>
                        FOUNDATION
                      </div>
                      <strong style={{ fontSize: '16px', color: '#1b5e20' }}>In-County Citizens & Communities</strong>
                    </div>
                    <ul style={{ fontSize: '13px', color: '#2e4d34', lineHeight: 1.6, paddingLeft: '18px', margin: 0 }}>
                      <li>Customary Landowners & Clans (Jarwodee, Pennoken, Tiama, Konobo)</li>
                      <li>Traditional Chiefs & Council of Elders</li>
                      <li>Rural Women Networks & Youth Associations</li>
                      <li>Persons with Disabilities & Local Artisans</li>
                      <li>Retain sacred land rights and direct veto under Land Rights Act</li>
                    </ul>
                  </div>

                  {/* Pillar 2: The Civic Stakeholder Platform (GGCDC) */}
                  <div style={{ border: '3px solid #14493e', borderRadius: '12px', background: '#ebf4f1', padding: '20px', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <div style={{ background: '#14493e', color: '#d5ae59', padding: '6px 10px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px' }}>
                        CIVIC VEHICLE
                      </div>
                      <strong style={{ fontSize: '17px', color: '#10352f' }}>GGCDC (The Council)</strong>
                    </div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#1d5a4d', margin: '0 0 10px' }}>
                      "One County • One Voice • Shared Development"
                    </p>
                    <ul style={{ fontSize: '13px', color: '#274b42', lineHeight: 1.6, paddingLeft: '18px', margin: 0 }}>
                      <li>County-centered, independent & nonpartisan</li>
                      <li>Structured citizen coordination & evidence aggregation</li>
                      <li>Operates the specialized Putu Mining Working Group (14 focus areas)</li>
                      <li>Does NOT negotiate mineral rights (belonging to GoL)</li>
                      <li>Does NOT claim statutory powers (unlike a statutory Authority)</li>
                    </ul>
                  </div>

                  {/* Pillar 3: External Counterparties */}
                  <div style={{ border: '2px solid #b76e00', borderRadius: '12px', background: '#fdfaf2', padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                      <div style={{ background: '#b76e00', color: '#fff', padding: '6px 10px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px' }}>
                        EXTERNAL PARTIES
                      </div>
                      <strong style={{ fontSize: '16px', color: '#7a4a00' }}>Structured Engagement</strong>
                    </div>
                    <ul style={{ fontSize: '13px', color: '#68450d', lineHeight: 1.6, paddingLeft: '18px', margin: 0 }}>
                      <li><strong>Government of Liberia:</strong> Statutory mineral authority, regulatory permits (EPA), and fiscal revenue collection.</li>
                      <li><strong>Putu Mining Investor / Concessionaire:</strong> Capital investment, mine construction, operational compliance.</li>
                      <li>GGCDC engages these parties through formal consultative advocacy, monitoring, and legal dialogue.</li>
                    </ul>
                  </div>
                </div>

                {/* Technical Support Tier */}
                <div style={{ marginTop: '24px', padding: '18px 24px', background: '#f8faf9', border: '1px dashed #7ea395', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <ShieldCheck size={20} color="#1b5e20" />
                    <strong style={{ color: '#133e36', fontSize: '15px' }}>
                      Technical, Legal & Diaspora Support Backbone:
                    </strong>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', fontSize: '13px', color: '#38554c' }}>
                    <div>
                      <strong>Grand Gedeh Association in the Americas (GGAA):</strong> Strategic diaspora partner mobilizing engineers, accountants, environmental scientists, and international advocacy. Supports without controlling or claiming to speak over in-county residents.
                    </div>
                    <div>
                      <strong>Grand Gedeh Bar Association (GGBA):</strong> Provides independent legal counsel, reviews MDA clauses, drafts charter covenants, and enforces community land rights and anti-conflict of interest rules.
                    </div>
                  </div>
                </div>
              </div>

              {/* COMPARATIVE ANALYSIS CARDS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                <div style={{ background: '#fff', border: '1px solid #dce5e0', borderRadius: '12px', padding: '24px' }}>
                  <h4 style={{ font: '700 18px Georgia', margin: '0 0 12px', color: '#133e36' }}>
                    Why "Citizens Development Council"?
                  </h4>
                  <p style={{ fontSize: '14px', color: '#556961', lineHeight: 1.6, margin: '0 0 12px' }}>
                    The name communicates enduring legitimacy. It is broader than mining, broader than GGAA, and broader than any particular political administration or single investor.
                  </p>
                  <ul style={{ fontSize: '13px', color: '#455952', lineHeight: 1.6, paddingLeft: '18px', margin: 0 }}>
                    <li><strong>Avoids "Authority":</strong> Does not imply statutory governmental powers or attempt to supplant elected county administration or ministries.</li>
                    <li><strong>Avoids "People's Council":</strong> Prevents confusion with partisan political movements.</li>
                    <li><strong>Avoids "Putu Committee":</strong> Ensures the institution remains relevant long after Putu, addressing forestry, agriculture, corridor roads, and future concessions.</li>
                  </ul>
                </div>

                <div style={{ background: '#fff', border: '1px solid #dce5e0', borderRadius: '12px', padding: '24px' }}>
                  <h4 style={{ font: '700 18px Georgia', margin: '0 0 12px', color: '#133e36' }}>
                    Role of President Poah's Dispatched Emissary
                  </h4>
                  <p style={{ fontSize: '14px', color: '#556961', lineHeight: 1.6, margin: '0 0 12px' }}>
                    President Edith T. Poah dispatched an emissary to Monrovia to facilitate dialogue rather than arrive as a predetermined chairman.
                  </p>
                  <ul style={{ fontSize: '13px', color: '#455952', lineHeight: 1.6, paddingLeft: '18px', margin: 0 }}>
                    <li>Serves as a <strong>GGAA Liaison & Consultative Facilitator</strong>.</li>
                    <li>Coordinates with Monrovia-based Grand Gedeh elders, student unions, and professionals.</li>
                    <li>Engages GGBA to draft independent legal bylaws.</li>
                    <li>Facilitates the creation of the in-county platform where legitimacy is earned through open consultative formation in Grand Gedeh.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: 4. CONSULTATIVE FORMATION ROADMAP */}
          {activeTab === 'roadmap' && (
            <div>
              <div className="heading">
                <div>
                  <div className="eyebrow">FORMATION PROCESS & DIALOGUE MILESTONES</div>
                  <h1>Consultative Formation Roadmap</h1>
                  <p>
                    Tracking the 5-phase civic roadmap from Monrovia preliminary outreach to the Grand Gedeh Stakeholder Constitutional Assembly.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {consultativeRoadmap.map((phase) => (
                  <div
                    key={phase.phase}
                    style={{
                      background: '#fff',
                      border: '1px solid #dce5e0',
                      borderRadius: '12px',
                      padding: '24px 28px',
                      display: 'grid',
                      gridTemplateColumns: '60px 1fr 240px',
                      gap: '24px',
                      alignItems: 'start'
                    }}
                  >
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      background: phase.status === 'Completed' ? '#e1f4e7' : phase.status === 'In progress' ? '#14493e' : '#f0f4f2',
                      color: phase.status === 'Completed' ? '#21653b' : phase.status === 'In progress' ? '#fff' : '#698075',
                      display: 'grid',
                      placeItems: 'center',
                      font: '700 20px Georgia'
                    }}>
                      {phase.phase}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <h3 style={{ font: '700 20px Georgia', margin: 0, color: '#133e36' }}>
                          {phase.title}
                        </h3>
                        <span className={`status ${phase.status.toLowerCase().replaceAll(' ', '-')}`}>
                          {phase.status}
                        </span>
                      </div>
                      <p style={{ fontSize: '14px', color: '#5b6e66', lineHeight: 1.55, margin: '0 0 14px' }}>
                        {phase.description}
                      </p>
                      <div>
                        <strong style={{ fontSize: '13px', color: '#1b493e', display: 'block', marginBottom: '6px' }}>
                          Key Consultative Milestones:
                        </strong>
                        <ul style={{ fontSize: '13px', color: '#3d5249', lineHeight: 1.6, paddingLeft: '18px', margin: 0 }}>
                          {phase.keyMilestones.map((m, idx) => (
                            <li key={idx}>{m}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div style={{ background: '#f7faf8', padding: '16px', borderRadius: '8px', border: '1px solid #e1ebe5', fontSize: '13px' }}>
                      <span style={{ color: '#7a8c84', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                        LEAD FACILITATOR
                      </span>
                      <strong style={{ display: 'block', color: '#1b473c', margin: '4px 0 12px' }}>
                        {phase.leadEntity}
                      </strong>
                      <span style={{ color: '#7a8c84', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                        TIMELINE
                      </span>
                      <strong style={{ display: 'block', color: '#1b473c', marginTop: '4px' }}>
                        {phase.timeline}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: 5. 12 STAKEHOLDER PILLARS */}
          {activeTab === 'pillars' && (
            <div>
              <div className="heading">
                <div>
                  <div className="eyebrow">FOUNDING REPRESENTATION STRUCTURE</div>
                  <h1>The 12 Founding Stakeholder Pillars</h1>
                  <p>
                    Ensuring broad, balanced, and legitimate representation across customary landholders, women, youth, traditional chiefs, professionals, and diaspora partners.
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px' }}>
                {stakeholderPillars.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      background: '#fff',
                      border: '1px solid #dce5e0',
                      borderRadius: '12px',
                      padding: '22px 24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#976e1a', background: '#fcf6e8', padding: '4px 8px', borderRadius: '4px', letterSpacing: '0.05em' }}>
                        {p.category}
                      </span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#1d5a4d', background: '#eaf4f0', padding: '4px 8px', borderRadius: '4px' }}>
                        {p.seatAllocation}
                      </span>
                    </div>

                    <h3 style={{ font: '700 18px Georgia', margin: 0, color: '#123e37' }}>
                      {p.name}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#556960', lineHeight: 1.5, margin: 0 }}>
                      {p.description}
                    </p>

                    <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #edf2ef', fontSize: '12px', color: '#3d5248' }}>
                      <strong>Key Stakeholders:</strong> {p.leadStakeholders}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: 6. SPECIALIZED TOOLS */}
          {activeTab === 'tools' && (
            <div>
              <div className="heading">
                <div>
                  <div className="eyebrow">CIVIC TOOLS & INTEROPERABILITY</div>
                  <h1>Specialized Platform Tools</h1>
                  <p>
                    Interactive instruments for workforce talent matching, relational link exploration, confidential community grievance intake, and repository management.
                  </p>
                </div>
              </div>

              {/* Tool Selector Tabs */}
              <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #e1e9e4', paddingBottom: '14px', marginBottom: '24px' }}>
                <Button
                  variant={activeTool === 'matcher' ? 'default' : 'outline'}
                  onClick={() => setActiveTool('matcher')}
                  className={activeTool === 'matcher' ? 'primary' : ''}
                >
                  <Users size={16} /> Workforce Talent Matcher
                </Button>
                <Button
                  variant={activeTool === 'explorer' ? 'default' : 'outline'}
                  onClick={() => setActiveTool('explorer')}
                  className={activeTool === 'explorer' ? 'primary' : ''}
                >
                  <Network size={16} /> Relational Link Explorer
                </Button>
                <Button
                  variant={activeTool === 'grievance-portal' ? 'default' : 'outline'}
                  onClick={() => setActiveTool('grievance-portal')}
                  className={activeTool === 'grievance-portal' ? 'primary' : ''}
                >
                  <ShieldAlert size={16} /> Confidential Grievance Intake
                </Button>
                <Button
                  variant={activeTool === 'charter' ? 'default' : 'outline'}
                  onClick={() => setActiveTool('charter')}
                  className={activeTool === 'charter' ? 'primary' : ''}
                >
                  <BookOpen size={16} /> Founding Charter Viewer
                </Button>
                <Button
                  variant={activeTool === 'backup' ? 'default' : 'outline'}
                  onClick={() => setActiveTool('backup')}
                  className={activeTool === 'backup' ? 'primary' : ''}
                >
                  <Database size={16} /> Repository & Backups
                </Button>
              </div>

              {/* TOOL: WORKFORCE TALENT MATCHER */}
              {activeTool === 'matcher' && (
                <div style={{ background: '#fff', border: '1px solid #dce5e0', borderRadius: '12px', padding: '26px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <h3 style={{ font: '700 20px Georgia', margin: 0, color: '#133e36' }}>
                        Community Workforce Matcher
                      </h3>
                      <p style={{ fontSize: '14px', color: '#687b73', margin: '4px 0 0' }}>
                        Match verified Grand Gedean tradespeople and professionals to mining contractor recruitment quotas with consent safeguards.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <select
                        value={matcherTrade}
                        onChange={(e) => setMatcherTrade(e.target.value)}
                        style={{ height: '38px', borderRadius: '6px', border: '1px solid #d5ded9', padding: '0 10px' }}
                      >
                        <option value="All">All Trades & Occupations</option>
                        <option value="Operator">Heavy Equipment Operators</option>
                        <option value="Welder">Welding & Fabrication</option>
                        <option value="Environmental">Environmental Scientists</option>
                        <option value="Logistics">Supply Chain & Logistics</option>
                      </select>

                      <select
                        value={matcherMinExp}
                        onChange={(e) => setMatcherMinExp(Number(e.target.value))}
                        style={{ height: '38px', borderRadius: '6px', border: '1px solid #d5ded9', padding: '0 10px' }}
                      >
                        <option value="0">Any Experience</option>
                        <option value="5">5+ Years Experience</option>
                        <option value="8">8+ Years Experience</option>
                        <option value="10">10+ Years Experience</option>
                      </select>
                    </div>
                  </div>

                  <div className="tableWrap">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Candidate & Location</TableHead>
                          <TableHead>Trade / Occupation</TableHead>
                          <TableHead>Experience</TableHead>
                          <TableHead>Qualifications & Certification</TableHead>
                          <TableHead>Consent Verified</TableHead>
                          <TableHead>Availability</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {workforceCandidates.map((c) => (
                          <TableRow key={c.id}>
                            <TableCell>
                              <strong>{c.name}</strong>
                              <small>{c.community}, Grand Gedeh</small>
                            </TableCell>
                            <TableCell>{c.occupation}</TableCell>
                            <TableCell>{c.experience} Years</TableCell>
                            <TableCell><small>{c.qualification}</small></TableCell>
                            <TableCell>
                              {c.consent ? (
                                <span style={{ color: '#2e7d32', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <ShieldCheck size={16} /> Yes (Recorded)
                                </span>
                              ) : (
                                <span style={{ color: '#c62828' }}>No consent</span>
                              )}
                            </TableCell>
                            <TableCell><span className="status in-progress">{c.availability}</span></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* TOOL: RELATIONAL LINK EXPLORER */}
              {activeTool === 'explorer' && (
                <div style={{ background: '#fff', border: '1px solid #dce5e0', borderRadius: '12px', padding: '26px' }}>
                  <h3 style={{ font: '700 20px Georgia', margin: '0 0 8px', color: '#133e36' }}>
                    Relational Link Explorer
                  </h3>
                  <p style={{ fontSize: '14px', color: '#687b73', margin: '0 0 20px' }}>
                    Visualizing how obligations in the Mineral Development Agreement connect to customary land claims, environmental baselines, workforce pipelines, and council resolutions.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                    {links.map((link) => {
                      const source = records.find(r => r.id === link.source_id);
                      const target = records.find(r => r.id === link.target_id);
                      return (
                        <div key={link.id} style={{ border: '1px solid #dce5e0', borderRadius: '8px', padding: '16px', background: '#fbfcfc' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#7a8c83', marginBottom: '8px' }}>
                            <Link2 size={15} />
                            <strong>{link.relation}</strong>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                            <div style={{ flex: 1, padding: '10px', background: '#fff', border: '1px solid #e2ebe6', borderRadius: '6px' }}>
                              <strong style={{ fontSize: '13px', display: 'block', color: '#14493e' }}>{source?.title || 'Unknown Source'}</strong>
                              <small style={{ color: '#7a8b83' }}>{modules.find(m => m.id === source?.module)?.short}</small>
                            </div>
                            <ArrowRight size={18} color="#14493e" />
                            <div style={{ flex: 1, padding: '10px', background: '#fff', border: '1px solid #e2ebe6', borderRadius: '6px' }}>
                              <strong style={{ fontSize: '13px', display: 'block', color: '#14493e' }}>{target?.title || 'Unknown Target'}</strong>
                              <small style={{ color: '#7a8b83' }}>{modules.find(m => m.id === target?.module)?.short}</small>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TOOL: CONFIDENTIAL GRIEVANCE INTAKE */}
              {activeTool === 'grievance-portal' && (
                <div style={{ background: '#fff', border: '1px solid #dce5e0', borderRadius: '12px', padding: '28px', maxWidth: '850px', margin: 'auto' }}>
                  <h3 style={{ font: '700 22px Georgia', margin: '0 0 8px', color: '#133e36' }}>
                    Confidential Community Grievance & Incident Intake
                  </h3>
                  <p style={{ fontSize: '14px', color: '#687b73', margin: '0 0 20px', lineHeight: 1.5 }}>
                    Grand Gedean citizens, farmers, and workers can safely log complaints regarding land incursions, uncompensated crop damage, unfair subcontractor hiring, or environmental spills. Restricted submissions guarantee whistleblower protection.
                  </p>

                  {grievanceSuccessRef && (
                    <div style={{ background: '#e8f8f0', border: '1px solid #a3e4d7', padding: '16px', borderRadius: '8px', marginBottom: '20px', color: '#0e6251' }}>
                      <strong style={{ display: 'block', fontSize: '16px' }}>Grievance Successfully Registered!</strong>
                      <p style={{ margin: '6px 0 0', fontSize: '14px' }}>
                        Your reference case tracking code is <strong>{grievanceSuccessRef}</strong>. The GGBA Legal Counsel and Ethics Panel will review this within 14 business days.
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleSubmitGrievance} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#274b41', display: 'block', marginBottom: '6px' }}>
                        Incident Title / Subject *
                      </label>
                      <Input
                        value={grievanceForm.title}
                        onChange={(e) => setGrievanceForm({ ...grievanceForm, title: e.target.value })}
                        placeholder="e.g. Uncompensated clearing of cassava farm along Putu haul route"
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#274b41', display: 'block', marginBottom: '6px' }}>
                          Grievance Category
                        </label>
                        <select
                          value={grievanceForm.category}
                          onChange={(e) => setGrievanceForm({ ...grievanceForm, category: e.target.value })}
                          style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid #d5ded9', padding: '0 10px' }}
                        >
                          <option>Land & Environmental Damage</option>
                          <option>Labor & Hiring Kickbacks</option>
                          <option>Water Pollution / Turbidity</option>
                          <option>Resettlement & Housing</option>
                          <option>Contractor Non-Payment</option>
                          <option>Other Community Concern</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#274b41', display: 'block', marginBottom: '6px' }}>
                          Affected Community / Town
                        </label>
                        <Input
                          value={grievanceForm.community}
                          onChange={(e) => setGrievanceForm({ ...grievanceForm, community: e.target.value })}
                          placeholder="e.g. Putu Jarwodee, Pennoken, Tiama"
                          required
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#274b41', display: 'block', marginBottom: '6px' }}>
                          Confidentiality Level
                        </label>
                        <select
                          value={grievanceForm.confidentiality}
                          onChange={(e) => setGrievanceForm({ ...grievanceForm, confidentiality: e.target.value })}
                          style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid #d5ded9', padding: '0 10px' }}
                        >
                          <option value="Restricted">Restricted (Whistleblower Protection)</option>
                          <option value="Standard">Standard (Public within Council)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#274b41', display: 'block', marginBottom: '6px' }}>
                        Detailed Description of the Incident *
                      </label>
                      <Textarea
                        rows={4}
                        value={grievanceForm.description}
                        onChange={(e) => setGrievanceForm({ ...grievanceForm, description: e.target.value })}
                        placeholder="State the dates, parties involved, equipment or contractors, and specific harm caused..."
                        required
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#274b41', display: 'block', marginBottom: '6px' }}>
                        Requested Remedy / Corrective Action
                      </label>
                      <Textarea
                        rows={2}
                        value={grievanceForm.remedy}
                        onChange={(e) => setGrievanceForm({ ...grievanceForm, remedy: e.target.value })}
                        placeholder="What resolution or restitution are the community or workers requesting?"
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#274b41', display: 'block', marginBottom: '6px' }}>
                        Claimant Contact / Representative (Kept strictly private if Restricted)
                      </label>
                      <Input
                        value={grievanceForm.claimantContact}
                        onChange={(e) => setGrievanceForm({ ...grievanceForm, claimantContact: e.target.value })}
                        placeholder="Phone number, palava hut representative, or village elder contact"
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                      <Button type="submit" className="primary" style={{ padding: '0 24px' }}>
                        <Send size={16} /> Submit Grievance for Council Review
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* TOOL: FOUNDING CHARTER VIEWER */}
              {activeTool === 'charter' && (
                <div style={{ background: '#fff', border: '1px solid #dce5e0', borderRadius: '12px', padding: '32px', maxWidth: '880px', margin: 'auto' }}>
                  <div style={{ borderBottom: '2px solid #14493e', paddingBottom: '16px', marginBottom: '20px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#976e1a', letterSpacing: '0.1em' }}>
                      OFFICIAL DRAFT COVENANT
                    </span>
                    <h2 style={{ font: '700 26px Georgia', color: '#133e36', margin: '6px 0' }}>
                      Charter of the Grand Gedeh Citizens Development Council
                    </h2>
                    <strong style={{ color: '#1d5a4d' }}>{governingPrinciples.motto}</strong>
                  </div>

                  <div style={{ fontSize: '14px', lineHeight: 1.7, color: '#2a443a' }}>
                    <h4 style={{ font: '700 17px Georgia', color: '#14493e', margin: '20px 0 8px' }}>
                      Article 1: Name, Status & Identity
                    </h4>
                    <p>
                      The institution is solemnly established as the <strong>Grand Gedeh Citizens Development Council (GGCDC)</strong>. It is an independent, nonpartisan, inclusive civic stakeholder platform rooted in Grand Gedeh County. It is distinct from statutory governmental authorities, political movements, and diaspora-only associations.
                    </p>

                    <h4 style={{ font: '700 17px Georgia', color: '#14493e', margin: '20px 0 8px' }}>
                      Article 2: Sacred Governing Principle
                    </h4>
                    <p style={{ fontStyle: 'italic', background: '#f5faf7', padding: '14px', borderLeft: '4px solid #d5ae59', borderRadius: '4px' }}>
                      "{governingPrinciples.sacredRule}"
                    </p>
                    <p>
                      No representative body shall usurp the statutory land rights, compensation decisions, or FPIC determination of customary landowners and direct host communities living adjacent to mineral, agricultural, or forest operations.
                    </p>

                    <h4 style={{ font: '700 17px Georgia', color: '#14493e', margin: '20px 0 8px' }}>
                      Article 3: Institutional Roles & Tripartite Division
                    </h4>
                    <p>
                      (a) <strong>GGCDC</strong> provides citizen coordination, research, consultative advocacy, and implementation monitoring.<br />
                      (b) <strong>GGAA (Grand Gedeh Association in the Americas)</strong> serves as a strategic technical partner mobilizing diaspora professional talent, without exercising unilateral control over the Council.<br />
                      (c) <strong>GGBA (Grand Gedeh Bar Association)</strong> provides independent legal expertise, contract analysis, and human rights defense.<br />
                      (d) <strong>Government of Liberia & Mining Concessionaires</strong> remain external parties with whom the Council engages through structured advocacy.
                    </p>

                    <h4 style={{ font: '700 17px Georgia', color: '#14493e', margin: '20px 0 8px' }}>
                      Article 4: Anti-Conflict of Interest & Nonpartisanship
                    </h4>
                    <p>
                      Council leadership seats are civic trusts. No officer may accept retainers, gifts, or improper incentives from concessionaires or political campaigns that compromise the integrity of the people of Grand Gedeh.
                    </p>
                  </div>
                </div>
              )}

              {/* TOOL: REPOSITORY & BACKUPS */}
              {activeTool === 'backup' && (
                <div style={{ background: '#fff', border: '1px solid #dce5e0', borderRadius: '12px', padding: '28px', maxWidth: '780px', margin: 'auto' }}>
                  <h3 style={{ font: '700 20px Georgia', margin: '0 0 8px', color: '#133e36' }}>
                    Data Portability, Backups & Verification
                  </h3>
                  <p style={{ fontSize: '14px', color: '#687b73', margin: '0 0 24px' }}>
                    Export official records, create offline backups, or reset the local environment to the official 30+ verified Grand Gedeh seed records.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ border: '1px solid #e1ebe5', borderRadius: '8px', padding: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ display: 'block', fontSize: '15px', color: '#17473b' }}>Full JSON Repository Backup</strong>
                        <small style={{ color: '#778b82' }}>Export complete database including all 14 modules, details, and relational links.</small>
                      </div>
                      <Button variant="outline" onClick={handleExportJSON}>
                        <Download size={16} /> Export JSON
                      </Button>
                    </div>

                    <div style={{ border: '1px solid #e1ebe5', borderRadius: '8px', padding: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ display: 'block', fontSize: '15px', color: '#17473b' }}>Import Backup Archive</strong>
                        <small style={{ color: '#778b82' }}>Restore records and links from an exported GGCDC JSON backup file.</small>
                      </div>
                      <label style={{ display: 'inline-block' }}>
                        <input type="file" accept=".json" onChange={handleImportJSON} style={{ display: 'none' }} />
                        <span className="btn" style={{ padding: '8px 14px', border: '1px solid #c9d6cf', borderRadius: '6px', cursor: 'pointer', background: '#fff', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <Upload size={16} /> Select File
                        </span>
                      </label>
                    </div>

                    <div style={{ border: '1px solid #f2dede', borderRadius: '8px', padding: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fdf7f7' }}>
                      <div>
                        <strong style={{ display: 'block', fontSize: '15px', color: '#a94442' }}>Reset to Official Demo Data</strong>
                        <small style={{ color: '#c97878' }}>Restores the 30+ pre-seeded records (MDA clauses, Putu land claims, water quality tests, tenders).</small>
                      </div>
                      <Button variant="outline" onClick={handleResetSeed} style={{ color: '#a94442', borderColor: '#ebccd1' }}>
                        <RefreshCw size={16} /> Reset Demo Data
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* RECORDS TABLE & CRUD SECTION (Visible in Dashboard & Putu Working Group tabs) */}
          {(activeTab === 'dashboard' || activeTab === 'putu-group') && (
            <section className="records" style={{ marginTop: '28px' }}>
              <div className="recordHead">
                <div>
                  <h2>
                    {activeTab === 'dashboard' ? 'Active Council Records' : `${currentModule.name} Records`}
                  </h2>
                  <p>{filteredRecords.length} records shown · Select a row to review details or link</p>
                </div>
                <div className="actions" style={{ display: 'flex', gap: '10px' }}>
                  <Button variant="outline" onClick={handleExportCSV} disabled={!filteredRecords.length}>
                    <Download size={16} /> Export CSV
                  </Button>
                </div>
              </div>

              {/* SEARCH & FILTERS */}
              <div className="filters">
                <div className="search">
                  <Search size={18} />
                  <Input
                    placeholder="Search titles, communities, contractors, details..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  aria-label="Filter status"
                >
                  <option value="All">All Statuses</option>
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                <select
                  value={countyFilter}
                  onChange={(e) => setCountyFilter(e.target.value)}
                  aria-label="Filter county"
                >
                  <option value="All">All Counties</option>
                  {counties.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* TABLE */}
              {loading ? (
                <div className="empty">Loading records…</div>
              ) : filteredRecords.length ? (
                <div className="tableWrap">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Record Title & Summary</TableHead>
                        <TableHead>Work Area</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Community / Location</TableHead>
                        <TableHead>Lead / Owner</TableHead>
                        <TableHead>Last Updated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.map((r) => {
                        const m = modules.find(item => item.id === r.module);
                        return (
                          <TableRow key={r.id} className="clickRow" onClick={() => handleOpenEdit(r)}>
                            <TableCell>
                              <strong>{r.title}</strong>
                              <small>{r.summary || 'No summary entered'}</small>
                            </TableCell>
                            <TableCell>
                              <span style={{ fontSize: '13px', fontWeight: 600, color: '#164c40' }}>
                                {m?.short || r.module}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className={`status ${r.status.toLowerCase().replaceAll(' ', '-')}`}>
                                {r.status}
                              </span>
                            </TableCell>
                            <TableCell>{[r.community, r.county].filter(Boolean).join(', ') || '—'}</TableCell>
                            <TableCell><small>{r.owner || 'Unassigned'}</small></TableCell>
                            <TableCell>{new Date(r.updated_at).toLocaleDateString()}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="empty">
                  <ClipboardCheck size={32} />
                  <strong>No matching records found</strong>
                  <span>{search || statusFilter !== 'All' ? 'Try adjusting search or status filters.' : 'Add the first record to begin tracking this work.'}</span>
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      {/* RECORD EDITOR DIALOG */}
      <Dialog open={modal} onOpenChange={setModal}>
        <DialogContent className="editor">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Edit ${formModule.short} Record` : `New ${formModule.short} Record`}
            </DialogTitle>
          </DialogHeader>

          <div className="formScroll">
            <div className="formGrid">
              <label className="full">
                Work Area / Module
                <select
                  value={form.module}
                  onChange={(e) => setForm(blankForm(e.target.value))}
                  disabled={!!editing}
                >
                  {modules.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </label>

              <label className="full">
                Record Title <b>*</b>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder={form.module === 'workforce' ? 'Full Name of Candidate' : 'Concise, specific record title'}
                />
              </label>

              <label>
                Status
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>

              <label>
                Responsible Lead / Owner
                <Input
                  value={form.owner}
                  onChange={(e) => setForm({ ...form, owner: e.target.value })}
                  placeholder="e.g. GGBA Counsel, Youth Desk, HSE Officer"
                />
              </label>

              <label>
                County
                <select
                  value={form.county}
                  onChange={(e) => setForm({ ...form, county: e.target.value })}
                >
                  {counties.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>

              <label>
                Community / Town / Parcel
                <Input
                  value={form.community}
                  onChange={(e) => setForm({ ...form, community: e.target.value })}
                  placeholder="e.g. Putu Jarwodee, Pennoken, Tiama, Zwedru"
                />
              </label>

              <label>
                Target / Due Date
                <Input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                />
              </label>

              <label className="full">
                Executive Summary / Description
                <Textarea
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  rows={2}
                  placeholder="Brief summary of commitments, facts, or actions..."
                />
              </label>
            </div>

            {/* Specialized Module Fields */}
            <h3>{formModule.name} Details</h3>
            <div className="formGrid">
              {formModule.fields.map((field) => (
                <label key={field.key} className={field.type === 'textarea' ? 'full' : ''}>
                  {field.label}
                  {field.type === 'textarea' ? (
                    <Textarea
                      value={form.details[field.key] || ''}
                      onChange={(e) => setForm({
                        ...form,
                        details: { ...form.details, [field.key]: e.target.value }
                      })}
                      rows={3}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={form.details[field.key] || ''}
                      onChange={(e) => setForm({
                        ...form,
                        details: { ...form.details, [field.key]: e.target.value }
                      })}
                    >
                      <option value="">Select option…</option>
                      {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <Input
                      type={field.type || 'text'}
                      value={form.details[field.key] || ''}
                      onChange={(e) => setForm({
                        ...form,
                        details: { ...form.details, [field.key]: e.target.value }
                      })}
                    />
                  )}
                </label>
              ))}
            </div>

            {/* Workforce Mandatory Safeguard Notice */}
            {form.module === 'workforce' && (
              <div style={{ background: '#fdf6e9', border: '1px solid #f8c471', padding: '12px 16px', borderRadius: '6px', margin: '14px 0', fontSize: '13px', color: '#7d5208' }}>
                <strong>Mandatory Privacy & Consent Protocol:</strong> An applicant's profile will only be shared with verified prospective mining employers and contractors after written/verbal consent has been recorded.
              </div>
            )}

            {/* RELATIONAL LINKING */}
            {editing && (
              <div className="linkSection">
                <h3><Link2 size={17} /> Cross-Sector Linked Records</h3>
                {links
                  .filter(l => l.source_id === editing.id || l.target_id === editing.id)
                  .map(l => {
                    const otherId = l.source_id === editing.id ? l.target_id : l.source_id;
                    const other = records.find(r => r.id === otherId);
                    return (
                      <p key={l.id}>
                        <strong>{l.relation}</strong> · {other?.title || 'Referenced Record'}
                        <span>{modules.find(m => m.id === other?.module)?.short}</span>
                      </p>
                    );
                  })}

                <div className="linkControls">
                  <select
                    value={targetLinkId}
                    onChange={(e) => setTargetLinkId(e.target.value)}
                    aria-label="Record to link"
                  >
                    <option value="">Select record to link…</option>
                    {records.filter(r => r.id !== editing.id).map(r => (
                      <option key={r.id} value={r.id}>
                        {r.title} ({modules.find(m => m.id === r.module)?.short})
                      </option>
                    ))}
                  </select>

                  <Input
                    value={relationText}
                    onChange={(e) => setRelationText(e.target.value)}
                    placeholder="e.g. Enforces, Governs, Triggered by"
                  />

                  <Button variant="outline" onClick={handleAddLink} disabled={!targetLinkId}>
                    Link
                  </Button>
                </div>
              </div>
            )}
          </div>

          {error && <div className="error" role="alert">{error}</div>}

          <div className="editorFoot">
            <Button variant="outline" onClick={() => setModal(false)}>
              Cancel
            </Button>
            <Button className="primary" onClick={handleSaveRecord} disabled={saving}>
              <Save size={16} /> {saving ? 'Saving…' : 'Save Record'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
