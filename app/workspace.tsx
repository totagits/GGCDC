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
  Pause,
  Lock,
  Unlock,
  LogOut,
  ArrowLeft,
  Printer,
  Award,
  FileUp,
  FileCheck,
  UploadCloud,
  Trash2
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

export interface RoleDef {
  id: string;
  name: string;
  badge: string;
  type: 'admin' | 'legal' | 'technical' | 'community' | 'observer';
  canCreate: boolean;
  canEdit: boolean;
  canLink: boolean;
  canManageData: boolean;
  canAccessRestricted: boolean;
  primaryModules: string[];
  description: string;
}

const ROLES: RoleDef[] = [
  {
    id: 'emissary',
    name: 'GGAA Emissary / Secretariat Facilitator',
    badge: 'Secretariat Admin',
    type: 'admin',
    canCreate: true,
    canEdit: true,
    canLink: true,
    canManageData: true,
    canAccessRestricted: true,
    primaryModules: ['agreements', 'governance', 'transparency', 'monitoring', 'benefits'],
    description: 'Full administrative rights to coordinate multi-stakeholder consultations, draft resolutions, and manage all 14 working group records.'
  },
  {
    id: 'ggba',
    name: 'GGBA Legal Counsel & Oversight',
    badge: 'Legal Oversight',
    type: 'legal',
    canCreate: true,
    canEdit: true,
    canLink: true,
    canManageData: false,
    canAccessRestricted: true,
    primaryModules: ['agreements', 'land', 'grievances', 'governance'],
    description: 'Statutory and customary legal review, contract clause analysis, grievance mediation, and human rights defense.'
  },
  {
    id: 'ggaa',
    name: 'GGAA Diaspora Technical Advisor',
    badge: 'Technical Partner',
    type: 'technical',
    canCreate: true,
    canEdit: true,
    canLink: true,
    canManageData: false,
    canAccessRestricted: false,
    primaryModules: ['environment', 'infrastructure', 'skills', 'procurement', 'monitoring'],
    description: 'Engineering, geotechnical, economic modeling, and environmental technical reviews without in-county political control.'
  },
  {
    id: 'landowner',
    name: 'Putu Customary Landowner Delegate',
    badge: 'Affected Landowner',
    type: 'community',
    canCreate: true,
    canEdit: false,
    canLink: false,
    canManageData: false,
    canAccessRestricted: false,
    primaryModules: ['land', 'benefits', 'grievances', 'environment'],
    description: 'Direct host community voice defending customary parcel demarcations, resettlement action plans, and sacred grove protections.'
  },
  {
    id: 'environment',
    name: 'Environmental & Safeguards Officer',
    badge: 'HSE Monitor',
    type: 'technical',
    canCreate: true,
    canEdit: true,
    canLink: true,
    canManageData: false,
    canAccessRestricted: false,
    primaryModules: ['environment', 'infrastructure', 'monitoring'],
    description: 'Specialized oversight of tailings dam stability (GISTM), monthly watershed testing, and air/dust suppression compliance.'
  },
  {
    id: 'citizen',
    name: 'Grand Gedeh Citizen / Public Stakeholder',
    badge: 'Public Observer',
    type: 'observer',
    canCreate: false,
    canEdit: false,
    canLink: false,
    canManageData: false,
    canAccessRestricted: false,
    primaryModules: ['transparency', 'benefits', 'employment', 'workforce'],
    description: 'General civic transparency access (read-only observer in council workspace, with direct access to public grievance & workforce portals).'
  }
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
  // Top-Level View Mode: 'public' (full-width public portal, NO internal sidebar) vs 'workspace' (internal operations, RBAC sidebar)
  const [viewMode, setViewMode] = useState<'public' | 'workspace'>('public');
  const [publicTab, setPublicTab] = useState<'home' | 'architecture' | 'roadmap' | 'pillars' | 'putu-group' | 'grievance' | 'workforce' | 'businesses'>('home');
  const [publicMobileNav, setPublicMobileNav] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'putu-group' | 'architecture' | 'roadmap' | 'pillars' | 'tools'>('dashboard');
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
  
  // Shell UI & RBAC State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<RoleDef>(ROLES[0]);
  
  // Tool: Workforce Matcher & Talent Desk
  const [matcherTrade, setMatcherTrade] = useState('All');
  const [matcherMinExp, setMatcherMinExp] = useState(0);
  const [matcherTrackFilter, setMatcherTrackFilter] = useState<'All' | 'Track A' | 'Track B'>('All');
  const [talentView, setTalentView] = useState<'register' | 'directory'>('register');
  const [talentTrack, setTalentTrack] = useState<'certified' | 'workforce_dev'>('certified');
  const [recommendationModalCandidate, setRecommendationModalCandidate] = useState<any | null>(null);
  const [talentForm, setTalentForm] = useState({
    fullName: '',
    county: 'Grand Gedeh',
    community: 'Putu Jarwodee',
    phone: '',
    email: '',
    profession: 'Heavy Equipment Operator',
    qualification: 'BSc / University Degree',
    institution: '',
    experience: '3',
    skills: '',
    availability: 'Available now',
    proofFileName: '',
    proofFileSize: '',
    proofFileData: '',
    endorsement: '',
    desiredTrade: 'Heavy Haul Truck Operator',
    schoolingLevel: 'High School Leaver',
    priorExperience: 'Informal / Ready to Learn',
    backgroundNotes: '',
    communityReference: '',
    consent: true
  });
  const [talentSuccessId, setTalentSuccessId] = useState<string | null>(null);
  const [isUploadingProof, setIsUploadingProof] = useState(false);
  const [proofDragActive, setProofDragActive] = useState(false);
  const fileInputRefA = useRef<HTMLInputElement>(null);
  const fileInputRefB = useRef<HTMLInputElement>(null);

  // Tool: 51% Grand Gedean Business Registry & Local Contractor Desk
  const [businessView, setBusinessView] = useState<'register' | 'directory' | 'tenders'>('register');
  const [businessSectorFilter, setBusinessSectorFilter] = useState('All');
  const [businessOwnershipFilter, setBusinessOwnershipFilter] = useState('All');
  const [businessModalVendor, setBusinessModalVendor] = useState<any | null>(null);
  const [businessForm, setBusinessForm] = useState({
    businessName: '',
    county: 'Grand Gedeh',
    headquarters: 'Zwedru Commercial District',
    lbrNumber: '',
    tinNumber: '',
    ownershipShare: '100% Grand Gedean Owned',
    ownershipPercentage: '100',
    principals: '',
    sector: 'Civil Construction (Offices, Canteens, Schools, Clinics)',
    capacity: '',
    employees: '15 staff (85% Grand Gedeans)',
    pastContracts: '',
    taxStatus: 'Current & Cleared (Bid Ready)',
    contactPerson: '',
    phone: '',
    email: '',
    endorsement: 'Grand Gedeh Chamber of Commerce',
    proofFileName: '',
    proofFileSize: '',
    proofFileData: '',
    consent: true
  });
  const [businessSuccessId, setBusinessSuccessId] = useState<string | null>(null);
  const [isUploadingBusinessProof, setIsUploadingBusinessProof] = useState(false);
  const [businessProofDragActive, setBusinessProofDragActive] = useState(false);
  const businessFileInputRef = useRef<HTMLInputElement>(null);

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

  // Filtered Records (with RBAC confidentiality redactions for observers)
  const filteredRecords = useMemo(() => {
    return records
      .map(r => {
        // Observers / non-authorized roles cannot view private whistleblower details
        if (r.module === 'grievances' && !currentRole.canAccessRestricted) {
          let detailsObj: any = {};
          try { detailsObj = JSON.parse(r.details || '{}'); } catch {}
          if (detailsObj.confidentiality === 'Restricted') {
            return {
              ...r,
              summary: '[Restricted Confidential Grievance - Access restricted to GGBA Legal Counsel & Ethics Panel]',
              owner: 'Ethics Panel (Protected)',
              details: JSON.stringify({
                category: detailsObj.category,
                channel: detailsObj.channel,
                confidentiality: 'Restricted',
                response: 'Case under formal investigation by GGBA & Ethics Panel.',
                claimantContact: '[Redacted Whistleblower Identity]'
              })
            };
          }
        }
        return r;
      })
      .filter(r => {
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
  }, [records, activeTab, activeModuleId, statusFilter, countyFilter, search, currentRole]);

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

  // Open modal for new record (RBAC checked)
  const handleOpenNew = (defaultModule?: string) => {
    if (!currentRole.canCreate) {
      setError(`Your current persona (${currentRole.name}) has Read-Only Observer status. To log complaints, use the Public Grievance Portal.`);
      return;
    }
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
    if (!currentRole.canCreate && !editing) {
      setError('Permission Denied: Your role does not have permission to create records.');
      return;
    }
    if (editing && !currentRole.canEdit) {
      setError('Permission Denied: Your role does not have authorization to edit official records.');
      return;
    }
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
    if (!currentRole.canLink) {
      setError('Permission Denied: Your role does not have authorization to link records.');
      return;
    }
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
    if (!currentRole.canManageData) {
      setError('Permission Denied: Only Secretariat Administrators can import backups.');
      return;
    }
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
    if (!currentRole.canManageData) {
      setError('Permission Denied: Only Secretariat Administrators can reset official data.');
      return;
    }
    if (confirm('Reset the database to the official 30+ Grand Gedeh verified seed records?')) {
      StorageEngine.resetToSeedData();
      loadData();
      setFeedback('Platform reset to official Grand Gedeh seed dataset.');
    }
  };

  // Submit Public Grievance (Accessible to ALL, including Citizens)
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
      created_by: `${currentRole.name} (Public Submission)`
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

  // Robust File Upload Processors
  const processUploadedFile = (file: File | null) => {
    if (!file) return;
    setIsUploadingProof(true);

    const sizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    setTimeout(() => {
      setTalentForm(prev => ({
        ...prev,
        proofFileName: file.name,
        proofFileSize: sizeStr,
        proofFileData: '' // Keep empty to ensure localStorage stays safely within browser quota
      }));
      setIsUploadingProof(false);
      setFeedback(`Document attached successfully: ${file.name} (${sizeStr})`);
    }, 250);
  };

  const handleProofFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleProofDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setProofDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleUseSampleProof = (track: 'certified' | 'workforce_dev') => {
    setIsUploadingProof(true);
    setTimeout(() => {
      if (track === 'certified') {
        setTalentForm(prev => ({
          ...prev,
          proofFileName: 'tubman_univ_bsc_environmental_science_diploma_verified.pdf',
          proofFileSize: '1.8 MB',
          proofFileData: ''
        }));
        setFeedback('Sample credential attached: Tubman University BSc Diploma (Verified)');
      } else {
        setTalentForm(prev => ({
          ...prev,
          proofFileName: 'republic_of_liberia_voter_card_grand_gedeh_residency.pdf',
          proofFileSize: '850 KB',
          proofFileData: ''
        }));
        setFeedback('Sample residency proof attached: Republic of Liberia Voter Card (Grand Gedeh)');
      }
      setIsUploadingProof(false);
    }, 200);
  };

  const handleRemoveProof = () => {
    setTalentForm(prev => ({
      ...prev,
      proofFileName: '',
      proofFileSize: '',
      proofFileData: ''
    }));
    if (fileInputRefA.current) fileInputRefA.current.value = '';
    if (fileInputRefB.current) fileInputRefB.current.value = '';
  };

  // Submit Talent Profile (Public Ingestion into Workforce Repository)
  const handleSubmitTalent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!talentForm.fullName.trim()) {
      setError('Please provide your full legal name.');
      return;
    }
    if (!talentForm.phone.trim()) {
      setError('Please provide a contact phone number or WhatsApp.');
      return;
    }
    if (!talentForm.consent) {
      setError('Mandatory Safeguard: Explicit consent is required to register with the GGCDC workforce registry.');
      return;
    }

    const isTrackA = talentTrack === 'certified';
    const trackingCode = `GGCDC-${isTrackA ? 'PRO' : 'WFD'}-${Math.floor(1000 + Math.random() * 9000)}`;
    const recordTitle = isTrackA 
      ? `${talentForm.fullName} - ${talentForm.profession}` 
      : `${talentForm.fullName} - Trainee ${talentForm.desiredTrade}`;
      
    const recordSummary = isTrackA 
      ? `${talentForm.qualification} from ${talentForm.institution || 'Accredited Institution'}. ${talentForm.experience} years experience. Proof document: ${talentForm.proofFileName || 'Official credential on file'}.`
      : `Workforce Development candidate from ${talentForm.community}. Desired Trade: ${talentForm.desiredTrade}. Endorsed by ${talentForm.communityReference || 'Community Leadership'}.`;

    const detailsObj = {
      track: isTrackA ? 'Track A: Certified Professional / Skilled Artisan' : 'Track B: Workforce Development / Apprenticeship Candidate',
      occupation: isTrackA ? talentForm.profession : `Workforce Development Trainee (${talentForm.desiredTrade})`,
      desiredTrade: isTrackA ? talentForm.profession : talentForm.desiredTrade,
      skills: isTrackA ? talentForm.skills : (talentForm.backgroundNotes || 'Eager apprentice, ready for intensive technical sponsorship'),
      experience: isTrackA ? talentForm.experience : '0',
      availability: talentForm.availability,
      contact: talentForm.phone + (talentForm.email ? ` / ${talentForm.email}` : ''),
      qualification: isTrackA ? talentForm.qualification : `No Formal Degree (${talentForm.schoolingLevel} - Ready for Apprenticeship)`,
      institution: isTrackA ? (talentForm.institution || 'Accredited Institution') : (talentForm.schoolingLevel || 'Community Learner'),
      recommendationStatus: isTrackA ? 'Endorsed for Concessionaire Direct Hire' : 'Recommended for TVET Sponsorship',
      proofDocument: talentForm.proofFileName ? `${talentForm.proofFileName} (${talentForm.proofFileSize})` : (isTrackA ? 'Degree / License Verification on File' : 'Residency & Community Verification Attached'),
      proofFileData: talentForm.proofFileData || undefined,
      endorsement: isTrackA ? (talentForm.endorsement || `${talentForm.community} Stakeholder Group`) : (talentForm.communityReference || `${talentForm.community} Traditional Council`),
      trackingCode,
      consent: 'Yes',
      consentDate: new Date().toISOString().split('T')[0]
    };

    StorageEngine.addRecord({
      module: 'workforce',
      title: recordTitle,
      status: 'In progress',
      county: talentForm.county,
      community: talentForm.community,
      owner: 'Workforce Registry Desk',
      due_date: `${new Date().getFullYear()}-12-31`,
      summary: recordSummary,
      details: JSON.stringify(detailsObj),
      created_by: `Public Registration (${isTrackA ? 'Track A Certified' : 'Track B Trainee'})`
    });

    setTalentSuccessId(trackingCode);
    setFeedback(`Talent profile successfully submitted! Reference ID: ${trackingCode}. Recorded in GGCDC Workforce Repository.`);
    setError('');
    loadData();
  };

  // Workforce Registry Candidates for Matcher & Directory
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
        const isTrackB = (details.track || '').includes('Track B') || (details.qualification || '').includes('No Formal') || (r.title || '').includes('Trainee');
        return {
          id: r.id,
          name: r.title,
          community: r.community,
          county: r.county || 'Grand Gedeh',
          track: isTrackB ? 'Track B: Workforce Development / Apprenticeship' : 'Track A: Certified Professional / Skilled Artisan',
          trackType: isTrackB ? ('Track B' as const) : ('Track A' as const),
          occupation: details.occupation || 'Tradesperson',
          desiredTrade: details.desiredTrade || details.occupation || '',
          skills: details.skills || '',
          experience: parseInt(details.experience || '0', 10),
          availability: details.availability || 'Available now',
          contact: details.contact || '',
          qualification: details.qualification || 'Certified Professional',
          institution: details.institution || 'Accredited Institution',
          recommendationStatus: details.recommendationStatus || (isTrackB ? 'Recommended for TVET Sponsorship' : 'Endorsed for Concessionaire Direct Hire'),
          proofDocument: details.proofDocument || (isTrackB ? 'Residency Proof on File' : 'Certified Degree on File'),
          proofFileData: details.proofFileData || null,
          endorsement: details.endorsement || `${r.community} Stakeholder Desk`,
          summary: r.summary,
          trackingCode: details.trackingCode || `GGCDC-${isTrackB ? 'WFD' : 'PRO'}-${r.id.replace('rec-wrk-', '')}`,
          consent: details.consent === 'Yes'
        };
      })
      .filter(c => {
        const matchesTrade = matcherTrade === 'All' || 
          c.occupation.toLowerCase().includes(matcherTrade.toLowerCase()) || 
          c.desiredTrade.toLowerCase().includes(matcherTrade.toLowerCase()) ||
          c.skills.toLowerCase().includes(matcherTrade.toLowerCase());
        const matchesExp = c.experience >= matcherMinExp;
        const matchesTrack = matcherTrackFilter === 'All' || c.trackType === matcherTrackFilter;
        return matchesTrade && matchesExp && matchesTrack;
      });
  }, [records, matcherTrade, matcherMinExp, matcherTrackFilter]);

  // 51% Grand Gedean Registered Businesses for Directory & Tender Matching
  const registeredBusinesses = useMemo(() => {
    return records
      .filter(r => r.module === 'suppliers')
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
          community: r.community || details.headquarters || 'Grand Gedeh',
          county: r.county || 'Grand Gedeh',
          ownership: details.ownership || '100% Grand Gedean Owned',
          ownershipPercentage: details.ownershipPercentage || (details.ownership?.includes('100%') ? '100%' : details.ownership?.includes('75%') ? '75%' : '51%'),
          sector: details.sector || 'Civil Construction & Camp Services',
          principals: details.principals || 'Grand Gedean Founders & Shareholders',
          registration: details.registration || 'Liberia Business Registry Verified',
          taxStatus: details.taxStatus || 'Current & Cleared (Bid Ready)',
          headquarters: details.headquarters || r.community || 'Zwedru Commercial District',
          capacity: details.capacity || 'Operational fleet and equipment ready for site mobilization',
          employees: details.employees || 'Local Grand Gedean technical team',
          pastContracts: details.pastContracts || 'Documented contractor track record on file',
          contact: details.contact || '',
          endorsement: details.endorsement || 'County Chamber of Commerce',
          prequalificationStatus: details.prequalificationStatus || 'Prequalified 51%+ Local Contractor',
          proofDocument: details.proofDocument || 'LBR Articles & Ownership Ledger Attached',
          trackingCode: details.trackingCode || `GGCDC-BIZ-${r.id.replace('rec-sup-', '')}`,
          summary: r.summary
        };
      })
      .filter(b => {
        const matchesSector = businessSectorFilter === 'All' || b.sector.toLowerCase().includes(businessSectorFilter.toLowerCase());
        const matchesOwnership = businessOwnershipFilter === 'All' || b.ownership.toLowerCase().includes(businessOwnershipFilter.toLowerCase());
        return matchesSector && matchesOwnership;
      });
  }, [records, businessSectorFilter, businessOwnershipFilter]);

  // Concession Tenders & Local Content Quotas
  const concessionTenders = useMemo(() => {
    return records
      .filter(r => r.module === 'procurement')
      .map(r => {
        let details: any = {};
        try {
          details = JSON.parse(r.details || '{}');
        } catch {
          details = {};
        }
        return {
          id: r.id,
          title: r.title,
          community: r.community,
          county: r.county || 'Grand Gedeh',
          buyer: details.buyer || 'Concession Procurement Directorate',
          category: details.category || 'Civil Construction & Camp Works',
          deadline: details.deadline || r.due_date || '2026-10-15',
          estimatedValue: details.estimatedValue || 'To Be Announced',
          awardee: details.awardee || 'Tender Open for Bidding',
          localContent: details.localContent || 'Statutory 51%+ Grand Gedean preference applies',
          summary: r.summary,
          status: r.status
        };
      });
  }, [records]);

  // Robust Business Proof Upload Processors
  const processUploadedBusinessFile = (file: File | null) => {
    if (!file) return;
    setIsUploadingBusinessProof(true);

    const sizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    setTimeout(() => {
      setBusinessForm(prev => ({
        ...prev,
        proofFileName: file.name,
        proofFileSize: sizeStr,
        proofFileData: '' // Keep empty to safeguard browser storage quota
      }));
      setIsUploadingBusinessProof(false);
      setFeedback(`Ownership document attached: ${file.name} (${sizeStr})`);
    }, 250);
  };

  const handleBusinessProofFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedBusinessFile(file);
    }
  };

  const handleBusinessProofDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setBusinessProofDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedBusinessFile(file);
    }
  };

  const handleUseSampleBusinessProof = () => {
    setIsUploadingBusinessProof(true);
    setTimeout(() => {
      setBusinessForm(prev => ({
        ...prev,
        proofFileName: 'lbr_articles_of_incorporation_51pct_ownership_ledger_verified.pdf',
        proofFileSize: '2.4 MB',
        proofFileData: ''
      }));
      setFeedback('Sample document attached: LBR Articles of Incorporation & 51% Beneficial Ownership Ledger');
      setIsUploadingBusinessProof(false);
    }, 200);
  };

  const handleRemoveBusinessProof = () => {
    setBusinessForm(prev => ({
      ...prev,
      proofFileName: '',
      proofFileSize: '',
      proofFileData: ''
    }));
    if (businessFileInputRef.current) businessFileInputRef.current.value = '';
  };

  // Submit Business Profile (Public Ingestion into 51% Contractor Directory)
  const handleSubmitBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessForm.businessName.trim()) {
      setError('Please provide the full legal name of the enterprise.');
      return;
    }
    if (!businessForm.lbrNumber.trim()) {
      setError('Please provide the Liberia Business Registry (LBR) registration number.');
      return;
    }
    if (!businessForm.principals.trim()) {
      setError('Please provide the Grand Gedean shareholders, founders, and clans.');
      return;
    }
    if (!businessForm.phone.trim()) {
      setError('Please provide an official business phone number or WhatsApp.');
      return;
    }
    if (!businessForm.consent) {
      setError('Mandatory Safeguard: Legal declaration of bona fide 51% Grand Gedean beneficial ownership is required.');
      return;
    }

    const trackingCode = `GGCDC-BIZ-${Math.floor(1000 + Math.random() * 9000)}`;
    const recordTitle = businessForm.businessName.trim();
    const recordSummary = `${businessForm.ownershipShare} enterprise in ${businessForm.sector}. LBR #${businessForm.lbrNumber}. Capacity: ${businessForm.capacity.slice(0, 150) || 'Operational fleet and yard ready for mobilization'}.`;

    const detailsObj = {
      ownership: businessForm.ownershipShare,
      ownershipPercentage: businessForm.ownershipPercentage,
      sector: businessForm.sector,
      principals: businessForm.principals,
      registration: `LBR #${businessForm.lbrNumber}${businessForm.tinNumber ? ' / TIN #' + businessForm.tinNumber : ''}`,
      taxStatus: businessForm.taxStatus,
      headquarters: businessForm.headquarters,
      capacity: businessForm.capacity || 'Commercial equipment, machinery and technicians ready for mobilization',
      employees: businessForm.employees,
      pastContracts: businessForm.pastContracts || 'Documented track record on file with GGCDC Chamber of Commerce',
      contact: `${businessForm.contactPerson ? businessForm.contactPerson + ' - ' : ''}${businessForm.phone}${businessForm.email ? ' / ' + businessForm.email : ''}`,
      endorsement: businessForm.endorsement,
      prequalificationStatus: 'Prequalified 51%+ Local Contractor',
      proofDocument: businessForm.proofFileName ? `${businessForm.proofFileName} (${businessForm.proofFileSize})` : 'LBR Articles & Beneficial Ownership Certified on File',
      proofFileData: businessForm.proofFileData || undefined,
      trackingCode,
      consent: 'Yes',
      consentDate: new Date().toISOString().split('T')[0]
    };

    StorageEngine.addRecord({
      module: 'suppliers',
      title: recordTitle,
      status: 'Verified',
      county: businessForm.county,
      community: businessForm.headquarters,
      owner: 'Local Business Chamber',
      due_date: `${new Date().getFullYear()}-12-31`,
      summary: recordSummary,
      details: JSON.stringify(detailsObj),
      created_by: 'Public 51% Enterprise Registration Desk'
    });

    setBusinessSuccessId(trackingCode);
    setFeedback(`Enterprise registered successfully! Reference ID: ${trackingCode}. Enrolled in 51% Prequalified Contractor Directory.`);
    setError('');
    loadData();
  };

  // Official GGCDC 51% Beneficial Ownership Certificate & Procurement Endorsement Modal
  const renderBusinessEndorsementModal = () => {
    if (!businessModalVendor) return null;
    const v = businessModalVendor;
    const todayStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const refNum = v.trackingCode || `GGCDC-BIZ-CERT-${v.id.replace('rec-sup-', '')}`;

    return (
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(10, 25, 20, 0.75)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          overflowY: 'auto'
        }}
        onClick={() => setBusinessModalVendor(null)}
      >
        <div 
          style={{
            background: '#fff',
            borderRadius: '12px',
            maxWidth: '860px',
            width: '100%',
            maxHeight: '92vh',
            overflowY: 'auto',
            padding: '36px 44px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            border: '2px solid #133e36',
            color: '#1a2e26',
            fontFamily: 'serif',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Action buttons header (hidden when printing) */}
          <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #dce5e0', paddingBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#133e36', fontWeight: 600, fontSize: '13px', fontFamily: 'sans-serif' }}>
              <ShieldCheck size={18} color="#2e7d32" />
              <span>Official GGCDC Statutory Local Procurement Endorsement Instrument</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
              >
                <Printer size={15} /> Print / Export PDF
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setBusinessModalVendor(null)}
                style={{ padding: '4px 8px' }}
              >
                <X size={18} />
              </Button>
            </div>
          </div>

          {/* OFFICIAL LETTERHEAD */}
          <div style={{ textAlign: 'center', borderBottom: '3px double #133e36', paddingBottom: '18px', marginBottom: '22px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: '#133e36', color: '#f3d999', fontSize: '26px', fontWeight: 'bold', fontFamily: 'sans-serif', margin: '0 auto 10px' }}>
              G
            </div>
            <div style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#687b73', fontWeight: 700, fontFamily: 'sans-serif' }}>
              Republic of Liberia • Grand Gedeh County
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#133e36', margin: '4px 0 2px', fontFamily: 'Georgia, serif' }}>
              Grand Gedeh Citizens Development Council (GGCDC)
            </h1>
            <div style={{ fontSize: '13px', color: '#445b52', fontFamily: 'sans-serif', fontWeight: 600 }}>
              Joint Directorate for Local Content, Commercial Enterprise &amp; Concession Procurement
            </div>
            <div style={{ fontSize: '11px', color: '#7a8e85', marginTop: '4px', fontFamily: 'sans-serif' }}>
              In Statutory Alliance with Grand Gedeh Chamber of Commerce, Council of Chiefs &amp; Grand Gedeh Bar Association (GGBA)
            </div>
          </div>

          {/* META INFO BAR */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'sans-serif', color: '#556b62', marginBottom: '20px', borderBottom: '1px solid #edf2ef', paddingBottom: '10px' }}>
            <div><strong>Attestation Ref:</strong> <span style={{ fontFamily: 'monospace', color: '#133e36', fontWeight: 700 }}>{refNum}</span></div>
            <div><strong>Audit Date:</strong> {todayStr}</div>
            <div><strong>Beneficial Classification:</strong> <span style={{ color: '#2e7d32', fontWeight: 700 }}>{v.ownership}</span></div>
          </div>

          {/* ADDRESSEE */}
          <div style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '18px', fontFamily: 'sans-serif', color: '#2a3b34' }}>
            <strong>TO:</strong> The Managing Director &amp; Vice President for Global Procurement<br />
            <strong>CONCESSIONAIRE:</strong> Putu Iron Ore Mining Concessionaire, EPC Prime Contractors &amp; Subcontractors<br />
            <strong>COPY:</strong> Ministry of Mines &amp; Energy, National Investment Commission (NIC) &amp; Inter-Ministerial Concessions Committee (IMCC)
          </div>

          {/* DOCUMENT TITLE */}
          <div style={{ background: '#eef7f2', border: '1px solid #a3cfbb', borderRadius: '6px', padding: '12px 18px', textAlign: 'center', marginBottom: '22px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px', color: '#145a32', fontFamily: 'sans-serif' }}>
              Statutory Local Content Quota Enforcement • Mineral Development Agreement Section 13
            </div>
            <h2 style={{ fontSize: '17px', fontWeight: 700, margin: '4px 0', color: '#133e36', fontFamily: 'Georgia, serif' }}>
              OFFICIAL CERTIFICATE OF ≥51% GRAND GEDEH BENEFICIAL OWNERSHIP &amp; CONTRACTOR PREQUALIFICATION
            </h2>
            <div style={{ fontSize: '12px', color: '#556b62', fontFamily: 'sans-serif' }}>
              Mandatory Priority Right for Civil Works, Camp Infrastructure, Catering, Haulage &amp; Local Supplies
            </div>
          </div>

          {/* ATTESTATION BODY */}
          <div style={{ fontSize: '14px', lineHeight: '1.7', color: '#24362f', marginBottom: '22px' }}>
            <p style={{ margin: '0 0 12px' }}>
              The <strong>Grand Gedeh Citizens Development Council (GGCDC)</strong>, exercising its legal and civic mandate to monitor local content compliance and safeguard host-county economic entitlements, hereby formally certifies that:
            </p>
            <div style={{ textAlign: 'center', margin: '14px 0', padding: '12px', background: '#f5faf7', border: '1px solid #cce5d8', borderRadius: '6px' }}>
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#113e35', fontFamily: 'Georgia, serif' }}>
                {v.name}
              </span>
              <div style={{ fontSize: '13px', color: '#386355', marginTop: '4px', fontFamily: 'sans-serif' }}>
                <strong>Ownership Status:</strong> {v.ownership} • <strong>Operational Base:</strong> {v.headquarters}, Grand Gedeh
              </div>
            </div>
            <p style={{ margin: '0 0 12px' }}>
              Following a rigorous forensic audit of corporate registry filings, ownership ledgers, and physical yard inspection, the GGCDC Technical Secretariat verifies that this commercial enterprise is genuinely owned at least <strong>51% (or more)</strong> by bona fide indigenes of Grand Gedeh County (Principals: <em>{v.principals}</em>) and does not operate as a proxy or pass-through front for foreign or non-county entities.
            </p>
            <p style={{ margin: '0 0 12px' }}>
              <strong>Certified Operational Scope:</strong> The enterprise possesses certified operational and technical capacity in <strong>{v.sector}</strong>, maintaining a local workforce of <strong>{v.employees}</strong> and documented physical plant/machinery ready for immediate deployment.
            </p>
            <div style={{ background: '#fff9e6', border: '1px solid #f2da83', padding: '14px 18px', borderRadius: '6px', margin: '16px 0', fontSize: '13px', lineHeight: '1.6' }}>
              <strong style={{ color: '#7a5a07', display: 'block', marginBottom: '4px', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>
                Statutory Notice of Section 13 Concession Compliance:
              </strong>
              Under Section 13 (Local Procurement) of the Putu Mineral Development Agreement and Section 44 of the PPCA, the Concessionaire and its engineering prime contractors are <strong>strictly legally prohibited</strong> from awarding civil construction contracts (camp offices, staff quarters, central canteens, schools, and clinics), haulage, fresh food supply, or fabrication works to foreign or Monrovia-based firms without first soliciting and providing first-right preference to verified Grand Gedean contractors. Having officially audited and prequalified <strong>{v.name}</strong>, any claim that &ldquo;no qualified local enterprise exists&rdquo; is legally null and void.
            </div>
          </div>

          {/* VERIFIED ENTERPRISE AUDIT RECORD */}
          <div style={{ border: '1px solid #dce5e0', borderRadius: '8px', padding: '16px', background: '#fafcfb', marginBottom: '24px', fontSize: '13px', fontFamily: 'sans-serif' }}>
            <div style={{ fontWeight: 700, color: '#133e36', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}>
              Forensic Enterprise Audit &amp; Registry Verification
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px 20px' }}>
              <div><span style={{ color: '#687b73' }}>Enterprise Legal Name:</span> <strong>{v.name}</strong></div>
              <div><span style={{ color: '#687b73' }}>Grand Gedean Beneficial Share:</span> <strong style={{ color: '#1b5e20' }}>{v.ownership}</strong></div>
              <div><span style={{ color: '#687b73' }}>Shareholders &amp; Clan Origins:</span> <strong>{v.principals}</strong></div>
              <div><span style={{ color: '#687b73' }}>LBR &amp; Tax Status:</span> <strong>{v.registration} • {v.taxStatus}</strong></div>
              <div><span style={{ color: '#687b73' }}>Commercial Sector:</span> <strong>{v.sector}</strong></div>
              <div><span style={{ color: '#687b73' }}>County Yard / Office:</span> <strong>{v.headquarters}</strong></div>
              <div><span style={{ color: '#687b73' }}>Fleet &amp; Machinery Capacity:</span> <strong>{v.capacity}</strong></div>
              <div><span style={{ color: '#687b73' }}>Local Staff Ratio:</span> <strong>{v.employees}</strong></div>
              <div><span style={{ color: '#687b73' }}>Past Project References:</span> <strong>{v.pastContracts}</strong></div>
              <div><span style={{ color: '#687b73' }}>Official Business Contact:</span> <strong>{v.contact}</strong></div>
              <div><span style={{ color: '#687b73' }}>Audit Evidence Document:</span> <strong style={{ color: '#133e36' }}>{v.proofDocument}</strong></div>
              <div><span style={{ color: '#687b73' }}>Prequalification Standing:</span> <strong style={{ color: '#2e7d32' }}>{v.prequalificationStatus}</strong></div>
            </div>
          </div>

          {/* SIGNATURE BLOCK */}
          <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', textAlign: 'center', fontSize: '12px', fontFamily: 'sans-serif', borderTop: '1px solid #dce5e0', paddingTop: '20px' }}>
            <div>
              <div style={{ height: '36px', borderBottom: '1px dashed #7a8e85', margin: '0 20px 8px' }}></div>
              <strong>Hon. Marcus K. Gaye</strong><br />
              <span style={{ color: '#687b73', fontSize: '11px' }}>Chairperson, Grand Gedeh Chamber of Commerce<br />Local Enterprise Bureau</span>
            </div>
            <div>
              <div style={{ height: '36px', borderBottom: '1px dashed #7a8e85', margin: '0 20px 8px' }}></div>
              <strong>Paramount Chief Gbarbo Jarwodee</strong><br />
              <span style={{ color: '#687b73', fontSize: '11px' }}>President, Grand Gedeh Council of Traditional Chiefs<br />Customary Custodian</span>
            </div>
            <div>
              <div style={{ height: '36px', borderBottom: '1px dashed #7a8e85', margin: '0 20px 8px' }}></div>
              <strong>Cllr. J. Alexander Boley</strong><br />
              <span style={{ color: '#687b73', fontSize: '11px' }}>Lead Legal Counsel, Grand Gedeh Bar Association (GGBA)<br />Concession Compliance Panel</span>
            </div>
          </div>

          {/* FOOTER WATERMARK */}
          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '10px', color: '#94a39b', fontFamily: 'sans-serif' }}>
            Grand Gedeh Citizens Development Council • Official Procurement Certificate • Section 13 Quota Enforcement Hotline: +231-776-GGCDC-PROCURE • procurement@ggcdc.org.lr
          </div>
        </div>
      </div>
    );
  };

  // Official GGCDC Endorsement & Recommendation Letter Modal
  const renderRecommendationModal = () => {
    if (!recommendationModalCandidate) return null;
    const c = recommendationModalCandidate;
    const isTrackA = c.trackType === 'Track A' || (c.track || '').includes('Track A');
    const todayStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const refNum = c.trackingCode || `GGCDC-REC-${c.id.replace('rec-wrk-', '')}`;

    return (
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(10, 25, 20, 0.75)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          overflowY: 'auto'
        }}
        onClick={() => setRecommendationModalCandidate(null)}
      >
        <div 
          style={{
            background: '#fff',
            borderRadius: '12px',
            maxWidth: '820px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '36px 44px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            border: '2px solid #133e36',
            color: '#1a2e26',
            fontFamily: 'serif',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Action buttons header (hidden when printing) */}
          <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #dce5e0', paddingBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#133e36', fontWeight: 600, fontSize: '13px', fontFamily: 'sans-serif' }}>
              <ShieldCheck size={18} color="#2e7d32" />
              <span>Official GGCDC Legal & Technical Endorsement Instrument</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
              >
                <Printer size={15} /> Print / Export PDF
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRecommendationModalCandidate(null)}
                style={{ padding: '4px 8px' }}
              >
                <X size={18} />
              </Button>
            </div>
          </div>

          {/* OFFICIAL LETTERHEAD */}
          <div style={{ textAlign: 'center', borderBottom: '3px double #133e36', paddingBottom: '18px', marginBottom: '22px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: '#133e36', color: '#f3d999', fontSize: '26px', fontWeight: 'bold', fontFamily: 'sans-serif', margin: '0 auto 10px' }}>
              G
            </div>
            <div style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: '#687b73', fontWeight: 700, fontFamily: 'sans-serif' }}>
              Republic of Liberia • Grand Gedeh County
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#133e36', margin: '4px 0 2px', fontFamily: 'Georgia, serif' }}>
              Grand Gedeh Citizens Development Council (GGCDC)
            </h1>
            <div style={{ fontSize: '12px', color: '#445b52', fontFamily: 'sans-serif', fontStyle: 'italic' }}>
              Secretariat for Human Capital, Concession Oversight & Community Labor Rights
            </div>
            <div style={{ fontSize: '11px', color: '#7a8e85', marginTop: '4px', fontFamily: 'sans-serif' }}>
              In Collaboration with Traditional Chiefs, Customary Landowners, GGBA Legal Desk & GGAA Technical Advisory
            </div>
          </div>

          {/* META INFO BAR */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'sans-serif', color: '#556b62', marginBottom: '22px', borderBottom: '1px solid #edf2ef', paddingBottom: '10px' }}>
            <div><strong>Dispatch Ref:</strong> <span style={{ fontFamily: 'monospace', color: '#133e36', fontWeight: 700 }}>{refNum}</span></div>
            <div><strong>Date of Attestation:</strong> {todayStr}</div>
            <div><strong>County Classification:</strong> Indigene of Grand Gedeh ({c.community})</div>
          </div>

          {/* ADDRESSEE */}
          <div style={{ fontSize: '13px', lineHeight: '1.6', marginBottom: '18px', fontFamily: 'sans-serif', color: '#2a3b34' }}>
            <strong>TO:</strong> The Managing Director & Human Resources Directorate<br />
            <strong>CONCESSIONAIRE:</strong> Putu Iron Ore Mining Concessionaire & Subcontracting Consortiums<br />
            <strong>ATTN:</strong> Community Liaison Office & National Labor Quota Compliance Inspectorate
          </div>

          {/* DOCUMENT TITLE */}
          <div style={{ background: isTrackA ? '#eef7f2' : '#fef9e7', border: `1px solid ${isTrackA ? '#a3cfbb' : '#f9e79f'}`, borderRadius: '6px', padding: '12px 18px', textAlign: 'center', marginBottom: '22px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px', color: isTrackA ? '#145a32' : '#7d6608', fontFamily: 'sans-serif' }}>
              {isTrackA ? 'Statutory Local Hiring Direct-Hire Attestation' : 'Human Resource Development Fund Apprenticeship Directive'}
            </div>
            <h2 style={{ fontSize: '17px', fontWeight: 700, margin: '4px 0', color: '#133e36', fontFamily: 'Georgia, serif' }}>
              {isTrackA 
                ? 'OFFICIAL ENDORSEMENT FOR CONCESSIONAIRE PROFESSIONAL PLACEMENT'
                : 'OFFICIAL RECOMMENDATION FOR CONCESSION-SPONSORED TVET & APPRENTICESHIP'}
            </h2>
            <div style={{ fontSize: '12px', color: '#556b62', fontFamily: 'sans-serif' }}>
              Pursuant to the Mineral Development Agreement (MDA) Sections on County First-Right Preference & Skills Transfer
            </div>
          </div>

          {/* LETTER BODY */}
          <div style={{ fontSize: '14px', lineHeight: '1.7', color: '#24362f', marginBottom: '22px' }}>
            {isTrackA ? (
              <>
                <p style={{ margin: '0 0 12px' }}>
                  The <strong>Grand Gedeh Citizens Development Council (GGCDC)</strong>, exercising its civic mandate to monitor local content compliance and protect host-community economic rights, hereby presents and officially endorses <strong>{c.name}</strong>, a bona fide citizen originating from <strong>{c.community}, Grand Gedeh County</strong>.
                </p>
                <p style={{ margin: '0 0 12px' }}>
                  Following rigorous examination of technical credentials, the GGCDC Technical Secretariat certifies that the candidate holds verified qualifications in <strong>{c.occupation}</strong>, with <strong>{c.experience} years of operational experience</strong>, formally accredited by <strong>{c.institution}</strong>.
                </p>
                <p style={{ margin: '0 0 12px' }}>
                  <strong>Legal Quota Notice:</strong> Under the terms of the Mineral Development Agreement, the Concessionaire is contractually obligated to give priority consideration to qualified citizens of Grand Gedeh before recruiting non-county or expatriate personnel. Having verified the attached credentials, GGCDC asserts that any claim of &ldquo;lack of qualified local talent&rdquo; for this role is legally void.
                </p>
              </>
            ) : (
              <>
                <p style={{ margin: '0 0 12px' }}>
                  The <strong>Grand Gedeh Citizens Development Council (GGCDC)</strong>, in conjunction with the traditional elders and community leadership of <strong>{c.community}, Grand Gedeh County</strong>, hereby submits this formal recommendation on behalf of <strong>{c.name}</strong> for direct inclusion in the concessionaire-funded <strong>Workforce Development &amp; Apprenticeship Training Program</strong>.
                </p>
                <p style={{ margin: '0 0 12px' }}>
                  The candidate is a motivated Grand Gedean citizen seeking professional training in <strong>{c.desiredTrade}</strong>. While lacking formal academic diplomas, the candidate has demonstrated practical mechanical aptitude, strong community endorsement by <strong>{c.endorsement}</strong>, and an explicit commitment to complete intensive TVET training.
                </p>
                <p style={{ margin: '0 0 12px' }}>
                  <strong>MDA Skills Fund Notice:</strong> In accordance with the Concessionaire&apos;s contractual obligation to contribute annually to the <em>Community Human Resource Development Fund</em>, GGCDC sponsors this candidate for immediate placement in the upcoming vocational cohort, inclusive of industrial safety training, equipment apprenticeship, and subsequent mine-site placement.
                </p>
              </>
            )}
          </div>

          {/* CANDIDATE VERIFIED PROFILE TABLE */}
          <div style={{ border: '1px solid #dce5e0', borderRadius: '8px', padding: '16px', background: '#fafcfb', marginBottom: '24px', fontSize: '13px', fontFamily: 'sans-serif' }}>
            <div style={{ fontWeight: 700, color: '#133e36', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '11px' }}>
              Candidate Credential & Registry Record
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px 20px' }}>
              <div><span style={{ color: '#687b73' }}>Candidate Name:</span> <strong>{c.name}</strong></div>
              <div><span style={{ color: '#687b73' }}>Community / Clan:</span> <strong>{c.community}, Grand Gedeh</strong></div>
              <div><span style={{ color: '#687b73' }}>Designated Field:</span> <strong>{isTrackA ? c.occupation : c.desiredTrade}</strong></div>
              <div><span style={{ color: '#687b73' }}>Experience / Stage:</span> <strong>{isTrackA ? `${c.experience} Years Verified` : 'Ready for Apprenticeship'}</strong></div>
              <div><span style={{ color: '#687b73' }}>Academic / TVET Credential:</span> <strong>{c.qualification}</strong></div>
              <div><span style={{ color: '#687b73' }}>Institution / Schooling:</span> <strong>{c.institution}</strong></div>
              <div><span style={{ color: '#687b73' }}>Community Endorsement:</span> <strong>{c.endorsement}</strong></div>
              <div><span style={{ color: '#687b73' }}>Proof Document on Record:</span> <strong style={{ color: '#133e36' }}>{c.proofDocument}</strong></div>
              <div><span style={{ color: '#687b73' }}>Contact & Availability:</span> <strong>{c.contact} ({c.availability})</strong></div>
              <div><span style={{ color: '#687b73' }}>GGCDC Registry Status:</span> <strong style={{ color: '#2e7d32' }}>{c.recommendationStatus}</strong></div>
            </div>
          </div>

          {/* SIGNATURE BLOCK */}
          <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', textAlign: 'center', fontSize: '12px', fontFamily: 'sans-serif', borderTop: '1px solid #dce5e0', paddingTop: '20px' }}>
            <div>
              <div style={{ height: '36px', borderBottom: '1px dashed #7a8e85', margin: '0 20px 8px' }}></div>
              <strong>Dr. Eric G. Gaye</strong><br />
              <span style={{ color: '#687b73', fontSize: '11px' }}>Chairperson, Workforce &amp; TVET Committee<br />GGCDC</span>
            </div>
            <div>
              <div style={{ height: '36px', borderBottom: '1px dashed #7a8e85', margin: '0 20px 8px' }}></div>
              <strong>Elder Sampson K. Gaye</strong><br />
              <span style={{ color: '#687b73', fontSize: '11px' }}>Representative, Traditional Chiefs &amp; Landowners<br />Putu Customary Council</span>
            </div>
            <div>
              <div style={{ height: '36px', borderBottom: '1px dashed #7a8e85', margin: '0 20px 8px' }}></div>
              <strong>Atty. Helena B. Dennis</strong><br />
              <span style={{ color: '#687b73', fontSize: '11px' }}>Head of Secretariat &amp; Concession Oversight<br />Monrovia-Zwedru Coordination</span>
            </div>
          </div>

          {/* FOOTER WATERMARK */}
          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '10px', color: '#94a39b', fontFamily: 'sans-serif' }}>
            Grand Gedeh Citizens Development Council • Official Seal of Attestation • Verification Hotline: +231-770-GGCDC-TALENT • talent@ggcdc.org.lr
          </div>
        </div>
      </div>
    );
  };

  const activeSlideData = HERO_SLIDES[currentSlide];

  // ----------------------------------------------------------------------
  // REUSABLE VIEW CONTENT RENDERERS (PUBLIC & WORKSPACE)
  // ----------------------------------------------------------------------
  const renderArchitectureContent = () => (
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'stretch' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', fontSize: '13px', color: '#38554c' }}>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
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
  );

  const renderRoadmapContent = () => (
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
  );

  const renderPillarsContent = () => (
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
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
  );

  const renderPublicPutuGroupContent = () => (
    <div>
      <div className="heading">
        <div>
          <div className="eyebrow">PUTU MINING & DEVELOPMENT WORKING GROUP</div>
          <h1>Public Sector Transparency Directory</h1>
          <p>
            Explore public council monitoring, customary rights documentation, environmental readings, and workforce pipelines across the 14 operational sectors.
          </p>
        </div>
        <Button className="primary" onClick={() => { setViewMode('workspace'); setActiveTab('putu-group'); }}>
          <LayoutDashboard size={16} /> Enter Council Workspace
        </Button>
      </div>

      {/* Thematic Navigation Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '24px' }}>
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

      {/* Active Module Banner */}
      <div style={{ background: '#fff', border: '1px solid #dce5e0', borderRadius: '12px', padding: '24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 800, color: '#976e1a', letterSpacing: '0.06em' }}>
            SECTOR FOCUS AREA #{modules.findIndex(m => m.id === currentModule.id) + 1}
          </span>
          <h2 style={{ font: '700 22px Georgia', margin: '4px 0 6px', color: '#10352f' }}>
            {currentModule.name}
          </h2>
          <p style={{ margin: 0, fontSize: '14px', color: '#526960', maxWidth: '800px' }}>
            {currentModule.description}
          </p>
        </div>
        <div style={{ fontSize: '13px', color: '#1b493e', background: '#ebf4f1', padding: '8px 14px', borderRadius: '8px', fontWeight: 600 }}>
          {filteredRecords.length} Public Entries Logged
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filterBar" style={{ marginBottom: '20px' }}>
        <div className="searchBox">
          <Search size={18} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search public ${currentModule.short} records…`}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ height: '40px', borderRadius: '8px', border: '1px solid #d5ded9', padding: '0 12px', fontSize: '13px' }}
          >
            <option value="All">All Statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={countyFilter}
            onChange={(e) => setCountyFilter(e.target.value)}
            style={{ height: '40px', borderRadius: '8px', border: '1px solid #d5ded9', padding: '0 12px', fontSize: '13px' }}
          >
            <option value="All">All Counties / Areas</option>
            {counties.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Public Records Table */}
      <div className="tableWrap" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #dce5e0', padding: '6px' }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Record Title & ID</TableHead>
              <TableHead>Community / Clan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Target Date</TableHead>
              <TableHead>Public Summary</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#7a8c83' }}>
                  No records match your search filter in this sector.
                </TableCell>
              </TableRow>
            ) : (
              filteredRecords.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <strong style={{ color: '#133e36', display: 'block' }}>{r.title}</strong>
                    <small style={{ color: '#7c8e86' }}>Ref: #{r.id.slice(0, 8)}</small>
                  </TableCell>
                  <TableCell>
                    <span>{r.community}</span>
                    <small style={{ display: 'block', color: '#7c8e86' }}>{r.county}</small>
                  </TableCell>
                  <TableCell>
                    <span className={`status ${r.status.toLowerCase().replaceAll(' ', '-')}`}>
                      {r.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {r.due_date ? new Date(r.due_date).toLocaleDateString() : '—'}
                  </TableCell>
                  <TableCell style={{ maxWidth: '350px' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: '#4a6157', lineHeight: 1.4 }}>
                      {r.summary || 'Verified council entry.'}
                    </p>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  const renderPublicGrievanceSection = () => (
    <div style={{ background: '#fff', border: '1px solid #dce5e0', borderRadius: '14px', padding: '32px', maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <div className="eyebrow">ETHICS & WHISTLEBLOWER INTAKE</div>
        <h2 style={{ font: '700 24px Georgia', margin: '4px 0 8px', color: '#10352f' }}>
          Confidential Grievance Portal
        </h2>
        <p style={{ fontSize: '14px', color: '#596e65', lineHeight: 1.55, margin: 0 }}>
          Grand Gedean citizens, farmers, and workers can safely log complaints regarding land incursions, uncompensated crop damage, unfair subcontractor hiring, or environmental spills. Restricted submissions guarantee whistleblower protection.
        </p>
      </div>

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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
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
            placeholder="Phone number, WhatsApp, or trusted town representative"
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
          <Button type="submit" className="primary" style={{ height: '42px', padding: '0 24px', fontSize: '14px', fontWeight: 700 }}>
            <Send size={16} /> Submit Confidential Grievance
          </Button>
        </div>
      </form>
    </div>
  );

  const renderPublicWorkforceContent = () => (
    <div style={{ background: '#fff', border: '1px solid #dce5e0', borderRadius: '12px', padding: '28px' }}>
      {/* HEADER */}
      <div style={{ marginBottom: '24px', borderBottom: '1px solid #edf2ef', paddingBottom: '18px' }}>
        <div className="eyebrow">COUNTY HUMAN CAPITAL & LOCAL CONTENT REPOSITORY</div>
        <h2 style={{ font: '700 24px Georgia', margin: '4px 0 6px', color: '#133e36' }}>
          Grand Gedeh Talent Pool &amp; TVET Apprenticeship Engine
        </h2>
        <p style={{ fontSize: '14px', color: '#556b62', margin: 0, maxWidth: '840px', lineHeight: '1.6' }}>
          Empowering Grand Gedeans to benefit directly from Putu Mountain and county natural resource operations. 
          Register qualified degrees to legally defeat &ldquo;no local talent&rdquo; concessionaire excuses, or register for concession-mandated TVET skills development and apprenticeship programs.
        </p>
      </div>

      {/* TOP NAVIGATION / VIEW TOGGLE */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <Button
          variant={talentView === 'register' ? 'default' : 'outline'}
          className={talentView === 'register' ? 'primary' : ''}
          onClick={() => { setTalentView('register'); setTalentSuccessId(null); }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}
        >
          <GraduationCap size={16} /> Register Talent / Apply for TVET Sponsorship
        </Button>
        <Button
          variant={talentView === 'directory' ? 'default' : 'outline'}
          className={talentView === 'directory' ? 'primary' : ''}
          onClick={() => setTalentView('directory')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}
        >
          <Users size={16} /> Public Talent Registry &amp; Directory ({workforceCandidates.length})
        </Button>
      </div>

      {/* VIEW 1: REGISTRATION & TVET APPLICATION */}
      {talentView === 'register' && (
        <div>
          {/* SUCCESS BANNER IF JUST SUBMITTED */}
          {talentSuccessId ? (
            <div style={{ background: '#eef7f2', border: '1px solid #a3cfbb', borderRadius: '10px', padding: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <CheckCircle2 size={26} color="#1e7e34" />
                <div>
                  <h3 style={{ margin: 0, color: '#145a32', font: '700 18px Georgia' }}>
                    Talent Profile Registered Successfully!
                  </h3>
                  <div style={{ fontSize: '13px', color: '#276e43' }}>
                    Reference Tracking Number: <strong style={{ fontFamily: 'monospace', fontSize: '14px', background: '#d4edda', padding: '2px 6px', borderRadius: '4px' }}>{talentSuccessId}</strong>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#2b5138', margin: '0 0 16px', lineHeight: '1.5' }}>
                Your profile has been ingested into the GGCDC Workforce Repository. 
                {talentTrack === 'certified' 
                  ? ' Your academic and technical credentials are on record to ensure concessionaires comply with mandatory local hiring quotas.'
                  : ' Your application has been logged for official GGCDC sponsorship under the Concessionaire Community Human Resource Development Fund.'}
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Button
                  className="primary"
                  onClick={() => {
                    const match = workforceCandidates.find(c => c.trackingCode === talentSuccessId) || workforceCandidates[0];
                    setRecommendationModalCandidate(match);
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Printer size={15} /> View Official GGCDC Endorsement Brief
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setTalentSuccessId(null);
                    setTalentForm(prev => ({
                      ...prev,
                      fullName: '',
                      phone: '',
                      email: '',
                      skills: '',
                      proofFileName: '',
                      proofFileSize: '',
                      proofFileData: '',
                      backgroundNotes: ''
                    }));
                  }}
                >
                  Register Another Citizen
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setTalentView('directory')}
                >
                  Browse Talent Directory
                </Button>
              </div>
            </div>
          ) : (
            <div>
              {/* TWO TRACK SELECTOR CARDS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                {/* TRACK A CARD */}
                <div
                  onClick={() => setTalentTrack('certified')}
                  style={{
                    border: `2px solid ${talentTrack === 'certified' ? '#133e36' : '#dce5e0'}`,
                    borderRadius: '10px',
                    padding: '20px',
                    cursor: 'pointer',
                    background: talentTrack === 'certified' ? '#f4f9f6' : '#fff',
                    transition: 'all 0.15s ease',
                    boxShadow: talentTrack === 'certified' ? '0 4px 12px rgba(19, 62, 54, 0.08)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: talentTrack === 'certified' ? '#133e36' : '#e8efe9', color: talentTrack === 'certified' ? '#f3d999' : '#133e36', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Award size={22} />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '12px', background: '#d4edda', color: '#155724', textTransform: 'uppercase' }}>
                      Direct Hire Quota
                    </span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px', color: '#133e36' }}>
                    Track A: Certified Professionals &amp; Skilled Artisans
                  </h3>
                  <p style={{ fontSize: '13px', color: '#556b62', margin: '0 0 10px', lineHeight: '1.5' }}>
                    For degree holders, certified engineers, TVET diploma holders, AWS welders, heavy equipment operators, accountants, and medics.
                  </p>
                  <div style={{ fontSize: '12px', color: '#276e43', fontWeight: 600 }}>
                    ✓ Upload Degree / Certificate Proof to defeat &ldquo;no local talent&rdquo; claims
                  </div>
                </div>

                {/* TRACK B CARD */}
                <div
                  onClick={() => setTalentTrack('workforce_dev')}
                  style={{
                    border: `2px solid ${talentTrack === 'workforce_dev' ? '#b7791f' : '#dce5e0'}`,
                    borderRadius: '10px',
                    padding: '20px',
                    cursor: 'pointer',
                    background: talentTrack === 'workforce_dev' ? '#fefcf8' : '#fff',
                    transition: 'all 0.15s ease',
                    boxShadow: talentTrack === 'workforce_dev' ? '0 4px 12px rgba(183, 121, 31, 0.08)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: talentTrack === 'workforce_dev' ? '#b7791f' : '#e8efe9', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <HardHat size={22} />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '12px', background: '#fef3c7', color: '#92400e', textTransform: 'uppercase' }}>
                      MDA Funded Training
                    </span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px', color: '#854d0e' }}>
                    Track B: Workforce Development &amp; Apprenticeship Trainees
                  </h3>
                  <p style={{ fontSize: '13px', color: '#556b62', margin: '0 0 10px', lineHeight: '1.5' }}>
                    For Grand Gedeans who want to work in mining, welding, driving, electrical, or camp services but <em>do not have formal degrees or certificates</em>.
                  </p>
                  <div style={{ fontSize: '12px', color: '#92400e', fontWeight: 600 }}>
                    ✓ GGCDC sponsors your placement in concession-funded TVET programs
                  </div>
                </div>
              </div>

              {/* REGISTRATION FORM */}
              <form onSubmit={handleSubmitTalent} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* SECTION 1: CITIZEN DEMOGRAPHICS */}
                <div style={{ background: '#fbfcfc', border: '1px solid #e1e9e4', borderRadius: '8px', padding: '18px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: '#133e36', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={16} /> 1. Citizen Identity &amp; Grand Gedeh Residency
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#274b41', display: 'block', marginBottom: '6px' }}>
                        Full Legal Name *
                      </label>
                      <Input
                        value={talentForm.fullName}
                        onChange={(e) => setTalentForm({ ...talentForm, fullName: e.target.value })}
                        placeholder="e.g. Emmanuel B. Gaye"
                        required
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#274b41', display: 'block', marginBottom: '6px' }}>
                        County of Origin
                      </label>
                      <Input value="Grand Gedeh" disabled style={{ background: '#f0f3f2' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#274b41', display: 'block', marginBottom: '6px' }}>
                        Community / Clan / District *
                      </label>
                      <Input
                        value={talentForm.community}
                        onChange={(e) => setTalentForm({ ...talentForm, community: e.target.value })}
                        placeholder="e.g. Putu Jarwodee, Tiama, Pennoken, Zwedru, Konobo"
                        required
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#274b41', display: 'block', marginBottom: '6px' }}>
                        Phone Number / WhatsApp *
                      </label>
                      <Input
                        value={talentForm.phone}
                        onChange={(e) => setTalentForm({ ...talentForm, phone: e.target.value })}
                        placeholder="e.g. +231-770-123-456"
                        required
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#274b41', display: 'block', marginBottom: '6px' }}>
                        Email Address (Optional)
                      </label>
                      <Input
                        value={talentForm.email}
                        onChange={(e) => setTalentForm({ ...talentForm, email: e.target.value })}
                        placeholder="e.g. candidate@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: TRACK-SPECIFIC PROFILE */}
                {talentTrack === 'certified' ? (
                  /* TRACK A FIELDS */
                  <div style={{ background: '#fbfcfc', border: '1px solid #e1e9e4', borderRadius: '8px', padding: '18px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: '#133e36', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Award size={16} /> 2. Professional Qualifications &amp; Verified Experience (Track A)
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#274b41', display: 'block', marginBottom: '6px' }}>
                          Primary Profession / Trade *
                        </label>
                        <select
                          value={talentForm.profession}
                          onChange={(e) => setTalentForm({ ...talentForm, profession: e.target.value })}
                          style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid #d5ded9', padding: '0 10px', fontSize: '13px' }}
                          required
                        >
                          <option>Heavy Equipment Operator</option>
                          <option>Industrial Welder &amp; Steel Fabricator</option>
                          <option>Mining Engineer / Geologist</option>
                          <option>Environmental Scientist / Hydrologist</option>
                          <option>Electrical / Power Plant Engineer</option>
                          <option>Heavy Plant &amp; Mechanical Technician</option>
                          <option>Materials Management &amp; Logistics</option>
                          <option>Health, Safety &amp; Environment (HSE) Officer</option>
                          <option>Mine Surveyor &amp; GIS Analyst</option>
                          <option>Certified Accountant &amp; Financial Analyst</option>
                          <option>Occupational Health Nurse / Paramedic</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#274b41', display: 'block', marginBottom: '6px' }}>
                          Highest Degree / Certificate Level *
                        </label>
                        <select
                          value={talentForm.qualification}
                          onChange={(e) => setTalentForm({ ...talentForm, qualification: e.target.value })}
                          style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid #d5ded9', padding: '0 10px', fontSize: '13px' }}
                        >
                          <option>BSc / University Bachelor Degree</option>
                          <option>Master of Science (MSc) / Post-Graduate</option>
                          <option>TVET Advanced Diploma (3-Year Technical)</option>
                          <option>Booker Washington Institute (BWI) Vocational Diploma</option>
                          <option>Ministry of Transport Certified Heavy Duty License</option>
                          <option>American Welding Society (AWS) 6G Certificate</option>
                          <option>EPA Certified Environmental Inspector</option>
                          <option>Chartered Professional License</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#274b41', display: 'block', marginBottom: '6px' }}>
                          Accredited Institution Attended *
                        </label>
                        <Input
                          value={talentForm.institution}
                          onChange={(e) => setTalentForm({ ...talentForm, institution: e.target.value })}
                          placeholder="e.g. Tubman University, BWI Kakata, Cuttington, UL"
                          required
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#274b41', display: 'block', marginBottom: '6px' }}>
                          Years of Verified Experience *
                        </label>
                        <select
                          value={talentForm.experience}
                          onChange={(e) => setTalentForm({ ...talentForm, experience: e.target.value })}
                          style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid #d5ded9', padding: '0 10px', fontSize: '13px' }}
                        >
                          <option value="1">1 - 2 Years</option>
                          <option value="3">3 - 4 Years</option>
                          <option value="5">5 - 7 Years</option>
                          <option value="8">8 - 10 Years</option>
                          <option value="12">10+ Years (Senior / Specialist)</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#274b41', display: 'block', marginBottom: '6px' }}>
                          Availability Timeline
                        </label>
                        <select
                          value={talentForm.availability}
                          onChange={(e) => setTalentForm({ ...talentForm, availability: e.target.value })}
                          style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid #d5ded9', padding: '0 10px', fontSize: '13px' }}
                        >
                          <option>Available now</option>
                          <option>Within 15 days</option>
                          <option>Within 30 days</option>
                          <option>Within 60 days</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#274b41', display: 'block', marginBottom: '6px' }}>
                          Community / Clan Endorsement Body
                        </label>
                        <Input
                          value={talentForm.endorsement}
                          onChange={(e) => setTalentForm({ ...talentForm, endorsement: e.target.value })}
                          placeholder="e.g. Putu Jarwodee Council, Zwedru Youth Desk"
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#274b41', display: 'block', marginBottom: '6px' }}>
                        Key Technical Machinery, Tools &amp; Methodologies
                      </label>
                      <Textarea
                        rows={2}
                        value={talentForm.skills}
                        onChange={(e) => setTalentForm({ ...talentForm, skills: e.target.value })}
                        placeholder="List specific models (CAT 349, D9 Dozer), software (Surpac, SAP ERP, ArcGIS), or welding codes (SMAW 6G)..."
                      />
                    </div>

                    {/* DEGREE / CERTIFICATE PROOF UPLOAD */}
                    <div style={{ marginTop: '16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 700, fontSize: '14px' }}>
                          <FileUp size={18} />
                          <span>Upload Degree, TVET Diploma or Heavy License Proof</span>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 700, background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '10px', textTransform: 'uppercase' }}>
                          Local Hiring Quota Mandate
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#374151', margin: '0 0 14px', lineHeight: '1.5' }}>
                        Attach your university degree, TVET diploma, or certified heavy operator license (PDF, DOC, DOCX, JPG, PNG). GGCDC uses this document to legally defeat &ldquo;no local talent&rdquo; concessionaire excuses.
                      </p>

                      {/* HIDDEN NATIVE FILE INPUT */}
                      <input
                        ref={fileInputRefA}
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleProofFileUpload}
                        style={{ display: 'none' }}
                      />

                      {/* UPLOAD STATUS CARD */}
                      {talentForm.proofFileName ? (
                        <div style={{ background: '#fff', border: '2px solid #22c55e', borderRadius: '8px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FileCheck size={24} />
                            </div>
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: 700, color: '#14532d' }}>
                                {talentForm.proofFileName}
                              </div>
                              <div style={{ fontSize: '12px', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                <span>{talentForm.proofFileSize}</span>
                                <span>•</span>
                                <span style={{ fontWeight: 600 }}>✓ Verified Document Proof Attached</span>
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => fileInputRefA.current?.click()}
                              style={{ fontSize: '12px' }}
                            >
                              Change File
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={handleRemoveProof}
                              style={{ color: '#dc2626', fontSize: '12px' }}
                            >
                              <Trash2 size={14} /> Remove
                            </Button>
                          </div>
                        </div>
                      ) : isUploadingProof ? (
                        <div style={{ background: '#fff', border: '2px dashed #16a34a', borderRadius: '8px', padding: '24px', textAlign: 'center' }}>
                          <RefreshCw size={24} className="spin" style={{ color: '#16a34a', margin: '0 auto 8px', animation: 'spin 1s linear infinite' }} />
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#14532d' }}>Processing and verifying proof document...</div>
                        </div>
                      ) : (
                        <div>
                          {/* CLICKABLE / DRAG-AND-DROP ZONE */}
                          <div
                            onClick={() => fileInputRefA.current?.click()}
                            onDragOver={(e) => { e.preventDefault(); setProofDragActive(true); }}
                            onDragLeave={() => setProofDragActive(false)}
                            onDrop={handleProofDrop}
                            style={{
                              border: `2px dashed ${proofDragActive ? '#15803d' : '#86efac'}`,
                              background: proofDragActive ? '#dcfce7' : '#fff',
                              borderRadius: '8px',
                              padding: '22px',
                              textAlign: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                              <UploadCloud size={24} />
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: '#14532d', marginBottom: '4px' }}>
                              Click to Browse Files or Drag &amp; Drop Here
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
                              Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 15MB)
                            </div>
                            <div style={{ display: 'inline-flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                              <Button
                                type="button"
                                className="primary"
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); fileInputRefA.current?.click(); }}
                                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
                              >
                                <FileUp size={14} /> Select Document from Device
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); handleUseSampleProof('certified'); }}
                                style={{ fontSize: '12px', borderColor: '#86efac', color: '#15803d' }}
                              >
                                ⚡ Use Sample Degree / License Proof
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* TRACK B FIELDS */
                  <div style={{ background: '#fbfcfc', border: '1px solid #e1e9e4', borderRadius: '8px', padding: '18px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: '#854d0e', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <HardHat size={16} /> 2. Workforce Development &amp; Desired Apprenticeship Trade (Track B)
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#274b41', display: 'block', marginBottom: '6px' }}>
                          Desired Vocational Apprenticeship Trade *
                        </label>
                        <select
                          value={talentForm.desiredTrade}
                          onChange={(e) => setTalentForm({ ...talentForm, desiredTrade: e.target.value })}
                          style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid #d5ded9', padding: '0 10px', fontSize: '13px' }}
                        >
                          <option>Heavy Haul Mining Truck Operator (CAT 777/785)</option>
                          <option>Drill Rig &amp; Blasting Assistant</option>
                          <option>Industrial Welding &amp; Metal Fabrication Apprentice</option>
                          <option>Industrial Solar &amp; Camp Electrical Maintenance</option>
                          <option>Heavy Plant &amp; Mechanical Maintenance Helper</option>
                          <option>Mine Surveying &amp; Ore Grade Sampling Helper</option>
                          <option>Camp Catering, Hospitality &amp; Food Services</option>
                          <option>Light Vehicle &amp; Fleet Mechanic Trainee</option>
                          <option>Mine Site Safety &amp; Physical Security Guard</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#274b41', display: 'block', marginBottom: '6px' }}>
                          Highest Schooling Level Attained
                        </label>
                        <select
                          value={talentForm.schoolingLevel}
                          onChange={(e) => setTalentForm({ ...talentForm, schoolingLevel: e.target.value })}
                          style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid #d5ded9', padding: '0 10px', fontSize: '13px' }}
                        >
                          <option>High School Graduate (12th Grade Passed)</option>
                          <option>High School Leaver (Completed 10th - 11th Grade)</option>
                          <option>Junior High School (Completed 9th Grade)</option>
                          <option>Primary Schooling / Literacy Program</option>
                          <option>Informal / Practical Apprenticeship Learner</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#274b41', display: 'block', marginBottom: '6px' }}>
                          Prior Practical Experience / Mechanical Exposure
                        </label>
                        <select
                          value={talentForm.priorExperience}
                          onChange={(e) => setTalentForm({ ...talentForm, priorExperience: e.target.value })}
                          style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid #d5ded9', padding: '0 10px', fontSize: '13px' }}
                        >
                          <option>Informal Helper / Ready to Learn</option>
                          <option>Motorcycle / Generator Repair Experience</option>
                          <option>Farm Tool &amp; Chainsaw Operator</option>
                          <option>Masonry / Carpentry Laborer</option>
                          <option>Camp Security / Watchman Experience</option>
                          <option>Commercial Driver (Light Vehicle / Motorbike)</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: '#274b41', display: 'block', marginBottom: '6px' }}>
                          Community Sponsor / Elder Reference *
                        </label>
                        <Input
                          value={talentForm.communityReference}
                          onChange={(e) => setTalentForm({ ...talentForm, communityReference: e.target.value })}
                          placeholder="e.g. Town Chief Sampson Gaye, Tiama Women Chair"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#274b41', display: 'block', marginBottom: '6px' }}>
                        Candidate Background &amp; Motivation for Training
                      </label>
                      <Textarea
                        rows={2}
                        value={talentForm.backgroundNotes}
                        onChange={(e) => setTalentForm({ ...talentForm, backgroundNotes: e.target.value })}
                        placeholder="State why you are eager to learn this trade, past manual work experience, and commitment to the community..."
                      />
                    </div>

                    {/* RESIDENCY / VOTER PROOF UPLOAD */}
                    <div style={{ marginTop: '16px', background: '#fefce8', border: '1px solid #fef08a', borderRadius: '10px', padding: '18px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#854d0e', fontWeight: 700, fontSize: '14px' }}>
                          <FileUp size={18} />
                          <span>Upload Community Residency Proof / National ID</span>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 700, background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '10px', textTransform: 'uppercase' }}>
                          MDA TVET Fund Eligibility
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#4b5563', margin: '0 0 14px', lineHeight: '1.5' }}>
                        Under the Mineral Development Agreement, concession-sponsored TVET seats are reserved for Grand Gedeh residents. Attach your National ID, Voter Registration Card, or letter from your Town Chief.
                      </p>

                      {/* HIDDEN NATIVE FILE INPUT */}
                      <input
                        ref={fileInputRefB}
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleProofFileUpload}
                        style={{ display: 'none' }}
                      />

                      {/* UPLOAD STATUS CARD */}
                      {talentForm.proofFileName ? (
                        <div style={{ background: '#fff', border: '2px solid #eab308', borderRadius: '8px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#fef9c3', color: '#ca8a04', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FileCheck size={24} />
                            </div>
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: 700, color: '#713f12' }}>
                                {talentForm.proofFileName}
                              </div>
                              <div style={{ fontSize: '12px', color: '#a16207', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                <span>{talentForm.proofFileSize}</span>
                                <span>•</span>
                                <span style={{ fontWeight: 600 }}>✓ Verified Residency Proof Attached</span>
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => fileInputRefB.current?.click()}
                              style={{ fontSize: '12px' }}
                            >
                              Change File
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={handleRemoveProof}
                              style={{ color: '#dc2626', fontSize: '12px' }}
                            >
                              <Trash2 size={14} /> Remove
                            </Button>
                          </div>
                        </div>
                      ) : isUploadingProof ? (
                        <div style={{ background: '#fff', border: '2px dashed #ca8a04', borderRadius: '8px', padding: '24px', textAlign: 'center' }}>
                          <RefreshCw size={24} className="spin" style={{ color: '#ca8a04', margin: '0 auto 8px', animation: 'spin 1s linear infinite' }} />
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#713f12' }}>Processing and verifying proof document...</div>
                        </div>
                      ) : (
                        <div>
                          {/* CLICKABLE / DRAG-AND-DROP ZONE */}
                          <div
                            onClick={() => fileInputRefB.current?.click()}
                            onDragOver={(e) => { e.preventDefault(); setProofDragActive(true); }}
                            onDragLeave={() => setProofDragActive(false)}
                            onDrop={handleProofDrop}
                            style={{
                              border: `2px dashed ${proofDragActive ? '#ca8a04' : '#fde047'}`,
                              background: proofDragActive ? '#fef9c3' : '#fff',
                              borderRadius: '8px',
                              padding: '22px',
                              textAlign: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fef9c3', color: '#a16207', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                              <UploadCloud size={24} />
                            </div>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: '#713f12', marginBottom: '4px' }}>
                              Click to Browse Files or Drag &amp; Drop Here
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
                              Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 15MB)
                            </div>
                            <div style={{ display: 'inline-flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                              <Button
                                type="button"
                                className="primary"
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); fileInputRefB.current?.click(); }}
                                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', background: '#b45309' }}
                              >
                                <FileUp size={14} /> Select Document from Device
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); handleUseSampleProof('workforce_dev'); }}
                                style={{ fontSize: '12px', borderColor: '#fde047', color: '#854d0e' }}
                              >
                                ⚡ Use Sample Residency Proof
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* MANDATORY CONSENT CHECKBOX */}
                <div style={{ background: '#f5f7f6', border: '1px solid #d5ded9', borderRadius: '8px', padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <input
                    type="checkbox"
                    id="talentConsentCheck"
                    checked={talentForm.consent}
                    onChange={(e) => setTalentForm({ ...talentForm, consent: e.target.checked })}
                    style={{ marginTop: '3px', cursor: 'pointer' }}
                    required
                  />
                  <label htmlFor="talentConsentCheck" style={{ fontSize: '13px', color: '#24362f', cursor: 'pointer', lineHeight: '1.5' }}>
                    <strong>Mandatory Civic Consent:</strong> I verify that all submitted qualifications and residency details are truthful. I consent to the Grand Gedeh Citizens Development Council (GGCDC) storing and sharing my profile with Concessionaire HR departments, subcontractors, and TVET institutes solely for employment placement and apprenticeship sponsorship under the Mineral Development Agreement.
                  </label>
                </div>

                {/* SUBMIT BUTTON */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <Button
                    type="submit"
                    className="primary"
                    style={{ height: '42px', padding: '0 24px', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Send size={16} /> Submit Candidate Profile &amp; Generate Tracking ID
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: PUBLIC TALENT REGISTRY DIRECTORY */}
      {talentView === 'directory' && (
        <div>
          {/* STATS TILES */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '22px' }}>
            <div style={{ background: '#f4f9f6', border: '1px solid #cfe2d8', borderRadius: '8px', padding: '14px 18px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#133e36', textTransform: 'uppercase' }}>Total Registered Talent</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#133e36', margin: '4px 0 0' }}>{records.filter(r => r.module === 'workforce').length}</div>
            </div>
            <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '8px', padding: '14px 18px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#3730a3', textTransform: 'uppercase' }}>Track A: Certified Pros</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#3730a3', margin: '4px 0 0' }}>{workforceCandidates.filter(c => c.trackType === 'Track A').length}</div>
            </div>
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '14px 18px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#92400e', textTransform: 'uppercase' }}>Track B: TVET Trainees</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#92400e', margin: '4px 0 0' }}>{workforceCandidates.filter(c => c.trackType === 'Track B').length}</div>
            </div>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '14px 18px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>Active Endorsements</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#166534', margin: '4px 0 0' }}>{workforceCandidates.filter(c => c.consent).length}</div>
            </div>
          </div>

          {/* FILTERS */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Button
                variant={matcherTrackFilter === 'All' ? 'default' : 'outline'}
                size="sm"
                className={matcherTrackFilter === 'All' ? 'primary' : ''}
                onClick={() => setMatcherTrackFilter('All')}
              >
                All Tracks
              </Button>
              <Button
                variant={matcherTrackFilter === 'Track A' ? 'default' : 'outline'}
                size="sm"
                className={matcherTrackFilter === 'Track A' ? 'primary' : ''}
                onClick={() => setMatcherTrackFilter('Track A')}
              >
                Track A: Certified
              </Button>
              <Button
                variant={matcherTrackFilter === 'Track B' ? 'default' : 'outline'}
                size="sm"
                className={matcherTrackFilter === 'Track B' ? 'primary' : ''}
                onClick={() => setMatcherTrackFilter('Track B')}
              >
                Track B: TVET Trainees
              </Button>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <select
                value={matcherTrade}
                onChange={(e) => setMatcherTrade(e.target.value)}
                style={{ height: '36px', borderRadius: '6px', border: '1px solid #d5ded9', padding: '0 10px', fontSize: '13px' }}
              >
                <option value="All">All Trades &amp; Specializations</option>
                <option value="Operator">Equipment / Truck Operators</option>
                <option value="Welder">Welding &amp; Metal Fabrication</option>
                <option value="Environmental">Environmental &amp; Water</option>
                <option value="Electrical">Solar &amp; Electrical</option>
                <option value="Logistics">Logistics &amp; Supply Chain</option>
                <option value="Drill">Drill &amp; Blasting Assistant</option>
              </select>

              <select
                value={matcherMinExp}
                onChange={(e) => setMatcherMinExp(Number(e.target.value))}
                style={{ height: '36px', borderRadius: '6px', border: '1px solid #d5ded9', padding: '0 10px', fontSize: '13px' }}
              >
                <option value="0">Any Experience</option>
                <option value="3">3+ Years Experience</option>
                <option value="5">5+ Years Experience</option>
                <option value="8">8+ Years Experience</option>
              </select>
            </div>
          </div>

          {/* TABLE OF CANDIDATES */}
          <div className="tableWrap">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate &amp; Community</TableHead>
                  <TableHead>Track &amp; Designation</TableHead>
                  <TableHead>Qualifications &amp; Institution</TableHead>
                  <TableHead>Proof Document</TableHead>
                  <TableHead>Endorsement / Recommendation</TableHead>
                  <TableHead style={{ textAlign: 'right' }}>Official Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workforceCandidates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} style={{ textAlign: 'center', padding: '30px', color: '#687b73' }}>
                      No candidates found matching the selected filter criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  workforceCandidates.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <strong style={{ color: '#11352f', display: 'block' }}>{c.name}</strong>
                        <small style={{ color: '#6c8077' }}>{c.community}, Grand Gedeh</small>
                      </TableCell>
                      <TableCell>
                        <span style={{
                          display: 'inline-block',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: c.trackType === 'Track A' ? '#e0e7ff' : '#fef3c7',
                          color: c.trackType === 'Track A' ? '#3730a3' : '#92400e',
                          marginBottom: '4px'
                        }}>
                          {c.trackType === 'Track A' ? 'Track A (Certified)' : 'Track B (TVET Trainee)'}
                        </span>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a2e26' }}>{c.occupation}</div>
                      </TableCell>
                      <TableCell>
                        <div style={{ fontSize: '13px', fontWeight: 500 }}>{c.qualification}</div>
                        <small style={{ color: '#687b73', display: 'block' }}>{c.institution}</small>
                      </TableCell>
                      <TableCell>
                        <span style={{ fontSize: '12px', color: '#2e7d32', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                          <FileCheck size={14} /> {c.proofDocument.length > 28 ? c.proofDocument.slice(0, 26) + '…' : c.proofDocument}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span style={{
                          display: 'inline-block',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: c.trackType === 'Track A' ? '#e8f5e9' : '#fff3e0',
                          color: c.trackType === 'Track A' ? '#2e7d32' : '#e65100'
                        }}>
                          {c.recommendationStatus}
                        </span>
                        <small style={{ display: 'block', color: '#6c8077', marginTop: '2px' }}>{c.endorsement}</small>
                      </TableCell>
                      <TableCell style={{ textAlign: 'right' }}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setRecommendationModalCandidate(c)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600 }}
                        >
                          <Printer size={13} /> View Endorsement
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );

  const renderPublicBusinessContent = () => (
    <div style={{ background: '#fff', border: '1px solid #dce5e0', borderRadius: '12px', padding: '28px' }}>
      {/* HEADER */}
      <div style={{ marginBottom: '24px', borderBottom: '1px solid #edf2ef', paddingBottom: '18px' }}>
        <div className="eyebrow">LOCAL PROCUREMENT &amp; 51% ENTERPRISE PREQUALIFICATION</div>
        <h2 style={{ font: '700 24px Georgia', margin: '4px 0 6px', color: '#133e36' }}>
          Grand Gedeh 51% Business &amp; Local Contractor Registry
        </h2>
        <p style={{ fontSize: '14px', color: '#556b62', margin: 0, maxWidth: '880px', lineHeight: '1.6' }}>
          Enforcing Section 13 (Local Procurement Quotas) of the Putu Mineral Development Agreement (MDA).
          Mining concessionaires and prime contractors are building camp offices, staff quarters, canteens, community schools, and clinics, and require daily catering, aggregate haulage, and site fabrication. GGCDC audits and prequalifies businesses with ≥51% Grand Gedean beneficial ownership to legally defeat &ldquo;no qualified local firm exists&rdquo; excuses and secure contract awards for our people.
        </p>
      </div>

      {/* TOP NAVIGATION / VIEW TOGGLE */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <Button
          variant={businessView === 'register' ? 'default' : 'outline'}
          className={businessView === 'register' ? 'primary' : ''}
          onClick={() => { setBusinessView('register'); setBusinessSuccessId(null); }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}
        >
          <Building2 size={16} /> Register 51% Local Enterprise / Apply for Prequalification
        </Button>
        <Button
          variant={businessView === 'directory' ? 'default' : 'outline'}
          className={businessView === 'directory' ? 'primary' : ''}
          onClick={() => setBusinessView('directory')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}
        >
          <BriefcaseBusiness size={16} /> Certified 51%+ Contractor Directory ({registeredBusinesses.length})
        </Button>
        <Button
          variant={businessView === 'tenders' ? 'default' : 'outline'}
          className={businessView === 'tenders' ? 'primary' : ''}
          onClick={() => setBusinessView('tenders')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}
        >
          <ClipboardCheck size={16} /> Concession Tenders &amp; Local Quotas ({concessionTenders.length})
        </Button>
      </div>

      {/* VIEW 1: REGISTRATION & PREQUALIFICATION APPLICATION */}
      {businessView === 'register' && (
        <div>
          {/* SUCCESS BANNER IF JUST SUBMITTED */}
          {businessSuccessId ? (
            <div style={{ background: '#eef7f2', border: '1px solid #a3cfbb', borderRadius: '10px', padding: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <CheckCircle2 size={26} color="#1e7e34" />
                <div>
                  <h3 style={{ margin: 0, color: '#145a32', font: '700 18px Georgia' }}>
                    51% Grand Gedean Enterprise Registered Successfully!
                  </h3>
                  <div style={{ fontSize: '13px', color: '#276e43' }}>
                    Audited Reference Code: <strong style={{ fontFamily: 'monospace', fontSize: '14px', background: '#d4edda', padding: '2px 6px', borderRadius: '4px' }}>{businessSuccessId}</strong>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#2b5138', margin: '0 0 16px', lineHeight: '1.5' }}>
                Your enterprise has been enrolled in the GGCDC Certified 51%+ Local Contractor Repository. An official Legal Attestation Instrument has been generated for direct submission to the Concessionaire Procurement Directorate and prime EPC contractors.
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Button
                  className="primary"
                  onClick={() => {
                    const match = registeredBusinesses.find(b => b.trackingCode === businessSuccessId) || registeredBusinesses[0];
                    setBusinessModalVendor(match);
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Printer size={15} /> View Official 51% Endorsement Certificate
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setBusinessSuccessId(null);
                    setBusinessForm(prev => ({
                      ...prev,
                      businessName: '',
                      lbrNumber: '',
                      tinNumber: '',
                      principals: '',
                      capacity: '',
                      pastContracts: '',
                      phone: '',
                      email: '',
                      proofFileName: '',
                      proofFileSize: '',
                      proofFileData: ''
                    }));
                  }}
                >
                  Register Another Enterprise
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setBusinessView('directory')}
                >
                  Browse Contractor Directory
                </Button>
              </div>
            </div>
          ) : (
            <div>
              {/* INFORMATION BANNER */}
              <div style={{ background: '#f5faf7', border: '1px solid #c9ded3', borderRadius: '10px', padding: '20px', marginBottom: '24px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#133e36', color: '#f3d999', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Award size={22} />
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px', font: '700 16px Georgia', color: '#133e36' }}>
                    Section 13 Beneficial Ownership Threshold: 51% Minimum Grand Gedean Equity
                  </h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#445b52', lineHeight: '1.5' }}>
                    Under the Putu Mineral Development Agreement and Liberian Local Content Guidelines, to qualify for protected county procurement quotas (civil building of offices, canteens, schools, clinics, haulage, catering, security), a business must demonstrate that at least 51% of its voting equity and beneficial control is held by Grand Gedean indigenes.
                  </p>
                </div>
              </div>

              {/* REGISTRATION FORM */}
              <form onSubmit={handleSubmitBusiness} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* ROW 1: LEGAL BUSINESS NAME & COMMERCIAL SECTOR */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#1a2e26', display: 'block', marginBottom: '6px' }}>
                      Enterprise Legal Registered Name *
                    </label>
                    <Input
                      value={businessForm.businessName}
                      onChange={(e) => setBusinessForm({ ...businessForm, businessName: e.target.value })}
                      placeholder="e.g. Putu Mountain Civil Builders & Infrastructure Ltd"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#1a2e26', display: 'block', marginBottom: '6px' }}>
                      Primary Commercial Sector / Service Package *
                    </label>
                    <select
                      value={businessForm.sector}
                      onChange={(e) => setBusinessForm({ ...businessForm, sector: e.target.value })}
                      style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid #d5ded9', padding: '0 10px', fontSize: '13px' }}
                      required
                    >
                      <option value="Civil Construction (Offices, Canteens, Schools, Clinics)">Civil Construction (Offices, Canteens, Schools, Clinics)</option>
                      <option value="Catering, Canteen & Food Service">Catering, Canteen &amp; Food Service</option>
                      <option value="Fresh Agricultural Produce & Food Supplies">Fresh Agricultural Produce &amp; Food Supplies</option>
                      <option value="Haulage, Earthmoving & Aggregate Transport">Haulage, Earthmoving &amp; Aggregate Transport</option>
                      <option value="Metal Fabrication, Welding & Maintenance">Metal Fabrication, Welding &amp; Maintenance</option>
                      <option value="Industrial Solar, Electrical & HVAC">Industrial Solar, Electrical &amp; HVAC</option>
                      <option value="Camp Janitorial, Laundry & Waste Services">Camp Janitorial, Laundry &amp; Waste Services</option>
                      <option value="Physical Site Security & Asset Guarding">Physical Site Security &amp; Asset Guarding</option>
                      <option value="Agro-Processing, Local Timber & Furniture">Agro-Processing, Local Timber &amp; Furniture</option>
                      <option value="Surveying, Environmental & Professional Services">Surveying, Environmental &amp; Professional Services</option>
                    </select>
                  </div>
                </div>

                {/* ROW 2: OWNERSHIP TIER & GRAND GEDEH PRINCIPALS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#1a2e26', display: 'block', marginBottom: '6px' }}>
                      Grand Gedean Beneficial Ownership Share *
                    </label>
                    <select
                      value={businessForm.ownershipShare}
                      onChange={(e) => setBusinessForm({ ...businessForm, ownershipShare: e.target.value })}
                      style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid #d5ded9', padding: '0 10px', fontSize: '13px' }}
                      required
                    >
                      <option value="100% Grand Gedean Owned">100% Grand Gedean Owned (Tier 1 Priority)</option>
                      <option value="75% - 99% Grand Gedean Owned">75% - 99% Grand Gedean Owned (Tier 1 Priority)</option>
                      <option value="51% - 74% Grand Gedean Owned (Statutory Minimum)">51% - 74% Grand Gedean Owned (Statutory Minimum)</option>
                      <option value="Joint Venture (51% County Partner)">Joint Venture (51% County Partner)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#1a2e26', display: 'block', marginBottom: '6px' }}>
                      Grand Gedean Shareholders / Founders &amp; Clan Origins *
                    </label>
                    <Input
                      value={businessForm.principals}
                      onChange={(e) => setBusinessForm({ ...businessForm, principals: e.target.value })}
                      placeholder="e.g. Eng. Emmanuel T. Quiah (Putu Clan), Sarah D. Gaye (Tchien Clan)"
                      required
                    />
                  </div>
                </div>

                {/* ROW 3: LBR & TIN REGISTRATION, TAX STATUS, HEADQUARTERS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#1a2e26', display: 'block', marginBottom: '6px' }}>
                      Liberia Business Registry (LBR) # *
                    </label>
                    <Input
                      value={businessForm.lbrNumber}
                      onChange={(e) => setBusinessForm({ ...businessForm, lbrNumber: e.target.value })}
                      placeholder="e.g. 2024-C-4421"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#1a2e26', display: 'block', marginBottom: '6px' }}>
                      Tax Identification Number (TIN #)
                    </label>
                    <Input
                      value={businessForm.tinNumber}
                      onChange={(e) => setBusinessForm({ ...businessForm, tinNumber: e.target.value })}
                      placeholder="e.g. 100388910"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#1a2e26', display: 'block', marginBottom: '6px' }}>
                      LRA Tax Clearance Status
                    </label>
                    <select
                      value={businessForm.taxStatus}
                      onChange={(e) => setBusinessForm({ ...businessForm, taxStatus: e.target.value })}
                      style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid #d5ded9', padding: '0 10px', fontSize: '13px' }}
                    >
                      <option value="Current & Cleared (Bid Ready)">Current &amp; Cleared (Bid Ready)</option>
                      <option value="Tax Clearance Pending LRA Audit">Tax Clearance Pending LRA Audit</option>
                      <option value="Assistance Needed for Formalization">Assistance Needed for Formalization</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#1a2e26', display: 'block', marginBottom: '6px' }}>
                      Grand Gedeh Operational Yard / Base *
                    </label>
                    <select
                      value={businessForm.headquarters}
                      onChange={(e) => setBusinessForm({ ...businessForm, headquarters: e.target.value })}
                      style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid #d5ded9', padding: '0 10px', fontSize: '13px' }}
                      required
                    >
                      <option value="Zwedru Commercial District">Zwedru Commercial District</option>
                      <option value="Putu Mining Corridor">Putu Mining Corridor</option>
                      <option value="Pennoken Industrial Hub">Pennoken Industrial Hub</option>
                      <option value="Gbarzon District">Gbarzon District</option>
                      <option value="Konobo / Cavalla Basin">Konobo / Cavalla Basin</option>
                      <option value="Monrovia Liaison Branch">Monrovia Liaison Branch</option>
                    </select>
                  </div>
                </div>

                {/* ROW 4: CAPACITY, FLEET & EMPLOYEES */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#1a2e26', display: 'block', marginBottom: '6px' }}>
                      Operational Fleet, Machinery &amp; Technical Capacity *
                    </label>
                    <Textarea
                      rows={3}
                      value={businessForm.capacity}
                      onChange={(e) => setBusinessForm({ ...businessForm, capacity: e.target.value })}
                      placeholder="List equipment: e.g. 2 concrete batching mixers, 1 vibratory soil compactor, 3 10-ton flatbeds, block molding yard capacity 4,000 blocks/day..."
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#1a2e26', display: 'block', marginBottom: '6px' }}>
                      Workforce Size &amp; Grand Gedean Employment Ratio *
                    </label>
                    <Input
                      value={businessForm.employees}
                      onChange={(e) => setBusinessForm({ ...businessForm, employees: e.target.value })}
                      placeholder="e.g. 45 permanent staff (85% Grand Gedeans)"
                      required
                      style={{ marginBottom: '10px' }}
                    />

                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#1a2e26', display: 'block', marginBottom: '6px' }}>
                      County Business Chamber / Community Endorsement
                    </label>
                    <Input
                      value={businessForm.endorsement}
                      onChange={(e) => setBusinessForm({ ...businessForm, endorsement: e.target.value })}
                      placeholder="e.g. Grand Gedeh Chamber of Commerce & Putu Paramount Chief"
                    />
                  </div>
                </div>

                {/* ROW 5: PAST CONTRACTS & REFERENCES */}
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#1a2e26', display: 'block', marginBottom: '6px' }}>
                    Past Completed Projects &amp; Commercial References
                  </label>
                  <Textarea
                    rows={2}
                    value={businessForm.pastContracts}
                    onChange={(e) => setBusinessForm({ ...businessForm, pastContracts: e.target.value })}
                    placeholder="e.g. Built 6-classroom school annex in Zwedru, constructed 2 rural clinics in Gbarzon with solar power, completed road culvert headwalls..."
                  />
                </div>

                {/* ROW 6: CONTACT INFORMATION */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#1a2e26', display: 'block', marginBottom: '6px' }}>
                      Contact Person &amp; Title
                    </label>
                    <Input
                      value={businessForm.contactPerson}
                      onChange={(e) => setBusinessForm({ ...businessForm, contactPerson: e.target.value })}
                      placeholder="e.g. Eng. Emmanuel T. Quiah, Managing Director"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#1a2e26', display: 'block', marginBottom: '6px' }}>
                      Official Phone / WhatsApp *
                    </label>
                    <Input
                      value={businessForm.phone}
                      onChange={(e) => setBusinessForm({ ...businessForm, phone: e.target.value })}
                      placeholder="+231-770-000-000"
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#1a2e26', display: 'block', marginBottom: '6px' }}>
                      Official Email Address
                    </label>
                    <Input
                      value={businessForm.email}
                      onChange={(e) => setBusinessForm({ ...businessForm, email: e.target.value })}
                      placeholder="procurement@mycompany.com.lr"
                    />
                  </div>
                </div>

                {/* UPLOAD PROOF OF 51% BENEFICIAL OWNERSHIP */}
                <div style={{ background: '#f8faf9', border: '1px solid #dce5e0', borderRadius: '8px', padding: '18px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#133e36', display: 'block', marginBottom: '4px' }}>
                    Upload Proof of Registration &amp; 51% Ownership (LBR Articles / Stock Ledger / Tax Clearance)
                  </label>
                  <p style={{ fontSize: '12px', color: '#687b73', margin: '0 0 12px' }}>
                    Attach your Liberia Business Registry (LBR) Certificate, Articles of Incorporation specifying Grand Gedean shareholders, or CDA Cooperative Registration.
                  </p>

                  {/* HIDDEN NATIVE FILE INPUT */}
                  <input
                    ref={businessFileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleBusinessProofFileUpload}
                    style={{ display: 'none' }}
                  />

                  {/* UPLOAD STATUS CARD */}
                  {businessForm.proofFileName ? (
                    <div style={{ background: '#fff', border: '2px solid #2e7d32', borderRadius: '8px', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: '#e8f5e9', color: '#2e7d32', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileCheck size={24} />
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 700, color: '#1b4d24' }}>
                            {businessForm.proofFileName}
                          </div>
                          <div style={{ fontSize: '12px', color: '#2e7d32', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                            <span>{businessForm.proofFileSize}</span>
                            <span>•</span>
                            <span style={{ fontWeight: 600 }}>✓ Verified Ownership Ledger Attached</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => businessFileInputRef.current?.click()}
                          style={{ fontSize: '12px' }}
                        >
                          Change Document
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveBusinessProof}
                          style={{ color: '#dc2626', fontSize: '12px' }}
                        >
                          <Trash2 size={14} /> Remove
                        </Button>
                      </div>
                    </div>
                  ) : isUploadingBusinessProof ? (
                    <div style={{ background: '#fff', border: '2px dashed #14493e', borderRadius: '8px', padding: '24px', textAlign: 'center' }}>
                      <RefreshCw size={24} className="spin" style={{ color: '#14493e', margin: '0 auto 8px', animation: 'spin 1s linear infinite' }} />
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#14493e' }}>Verifying ownership document format...</div>
                    </div>
                  ) : (
                    <div>
                      {/* DRAG-AND-DROP ZONE */}
                      <div
                        onClick={() => businessFileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setBusinessProofDragActive(true); }}
                        onDragLeave={() => setBusinessProofDragActive(false)}
                        onDrop={handleBusinessProofDrop}
                        style={{
                          border: `2px dashed ${businessProofDragActive ? '#1b5e20' : '#b7cebf'}`,
                          background: businessProofDragActive ? '#eaf4ee' : '#fff',
                          borderRadius: '8px',
                          padding: '22px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e8f5e9', color: '#2e7d32', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                          <UploadCloud size={24} />
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#133e36', marginBottom: '4px' }}>
                          Click to Browse LBR / Articles of Incorporation or Drag &amp; Drop Here
                        </div>
                        <div style={{ fontSize: '12px', color: '#687b73', marginBottom: '12px' }}>
                          Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 15MB)
                        </div>
                        <div style={{ display: 'inline-flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                          <Button
                            type="button"
                            className="primary"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); businessFileInputRef.current?.click(); }}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
                          >
                            <FileUp size={14} /> Select Document from Device
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); handleUseSampleBusinessProof(); }}
                            style={{ fontSize: '12px', borderColor: '#a3cfbb', color: '#133e36' }}
                          >
                            ⚡ Use Sample LBR Articles (51% Verified)
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* MANDATORY BENEFICIAL OWNERSHIP DECLARATION */}
                <div style={{ background: '#f5f7f6', border: '1px solid #d5ded9', borderRadius: '8px', padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <input
                    type="checkbox"
                    id="businessConsentCheck"
                    checked={businessForm.consent}
                    onChange={(e) => setBusinessForm({ ...businessForm, consent: e.target.checked })}
                    style={{ marginTop: '3px', cursor: 'pointer' }}
                    required
                  />
                  <label htmlFor="businessConsentCheck" style={{ fontSize: '13px', color: '#24362f', cursor: 'pointer', lineHeight: '1.5' }}>
                    <strong>Mandatory Beneficial Ownership Attestation:</strong> I solemnly declare under penalty of perjury that this enterprise is genuinely owned at least 51% by bona fide citizens of Grand Gedeh County and does not operate as a front or proxy for non-county or foreign third parties. I authorize the Grand Gedeh Citizens Development Council (GGCDC) and the Chamber of Commerce to conduct on-site physical audits of our yard/fleet and submit our profile to Concessionaires and EPC prime contractors for mandatory local procurement award under Section 13 of the Putu Mineral Development Agreement.
                  </label>
                </div>

                {/* SUBMIT BUTTON */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <Button
                    type="submit"
                    className="primary"
                    style={{ height: '44px', padding: '0 26px', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Send size={16} /> Submit Enterprise for Prequalification &amp; Generate Certificate
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: CERTIFIED 51%+ CONTRACTOR DIRECTORY */}
      {businessView === 'directory' && (
        <div>
          {/* STATS TILES */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '22px' }}>
            <div style={{ background: '#f4f9f6', border: '1px solid #cfe2d8', borderRadius: '8px', padding: '14px 18px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#133e36', textTransform: 'uppercase' }}>Certified Local Contractors</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#133e36', margin: '4px 0 0' }}>{records.filter(r => r.module === 'suppliers').length}</div>
            </div>
            <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '8px', padding: '14px 18px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#3730a3', textTransform: 'uppercase' }}>100% Grand Gedean Owned</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#3730a3', margin: '4px 0 0' }}>
                {records.filter(r => r.module === 'suppliers' && (r.details || '').includes('100% Grand Gedean')).length}
              </div>
            </div>
            <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px', padding: '14px 18px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#92400e', textTransform: 'uppercase' }}>Civil Construction &amp; Camp Builders</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#92400e', margin: '4px 0 0' }}>
                {records.filter(r => r.module === 'suppliers' && (r.details || '').includes('Civil Construction')).length}
              </div>
            </div>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '14px 18px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>Prequalified Bid-Ready</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#166534', margin: '4px 0 0' }}>100%</div>
            </div>
          </div>

          {/* FILTER BAR */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ fontSize: '14px', color: '#556b62' }}>
              Showing <strong>{registeredBusinesses.length}</strong> audited Grand Gedean enterprises eligible for concession tenders:
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <select
                value={businessSectorFilter}
                onChange={(e) => setBusinessSectorFilter(e.target.value)}
                style={{ height: '36px', borderRadius: '6px', border: '1px solid #d5ded9', padding: '0 10px', fontSize: '13px' }}
              >
                <option value="All">All Commercial Sectors</option>
                <option value="Civil Construction">Civil Construction (Offices, Canteens, Schools, Clinics)</option>
                <option value="Catering">Catering, Canteen &amp; Food Service</option>
                <option value="Haulage">Haulage &amp; Earthmoving</option>
                <option value="Metal Fabrication">Metal Fabrication &amp; Welding</option>
                <option value="Agriculture">Fresh Farm Supplies</option>
              </select>

              <select
                value={businessOwnershipFilter}
                onChange={(e) => setBusinessOwnershipFilter(e.target.value)}
                style={{ height: '36px', borderRadius: '6px', border: '1px solid #d5ded9', padding: '0 10px', fontSize: '13px' }}
              >
                <option value="All">All Ownership Tiers</option>
                <option value="100%">100% Grand Gedean Owned</option>
                <option value="75%">75% - 99% Grand Gedean Owned</option>
                <option value="51%">51% - 74% Statutory Minimum</option>
              </select>
            </div>
          </div>

          {/* TABLE OF REGISTERED BUSINESSES */}
          <div className="tableWrap">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Enterprise &amp; Yard Location</TableHead>
                  <TableHead>Ownership &amp; Principals</TableHead>
                  <TableHead>Commercial Sector</TableHead>
                  <TableHead>Fleet &amp; Capacity</TableHead>
                  <TableHead>Prequalification Status</TableHead>
                  <TableHead style={{ textAlign: 'right' }}>Official Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registeredBusinesses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} style={{ textAlign: 'center', padding: '30px', color: '#687b73' }}>
                      No contractors found matching the selected filter criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  registeredBusinesses.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell>
                        <strong style={{ color: '#11352f', display: 'block', fontSize: '14px' }}>{b.name}</strong>
                        <small style={{ color: '#6c8077' }}>{b.headquarters}</small>
                      </TableCell>
                      <TableCell>
                        <span style={{
                          display: 'inline-block',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: b.ownership.includes('100%') ? '#e0f2fe' : '#fef3c7',
                          color: b.ownership.includes('100%') ? '#0369a1' : '#92400e',
                          marginBottom: '4px'
                        }}>
                          {b.ownership}
                        </span>
                        <div style={{ fontSize: '12px', color: '#374151' }}>{b.principals}</div>
                      </TableCell>
                      <TableCell>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a2e26' }}>{b.sector}</div>
                        <small style={{ color: '#687b73', display: 'block' }}>{b.registration}</small>
                      </TableCell>
                      <TableCell style={{ maxWidth: '240px' }}>
                        <div style={{ fontSize: '12px', color: '#4b5563', lineHeight: '1.4' }}>
                          {b.capacity.length > 80 ? b.capacity.slice(0, 78) + '…' : b.capacity}
                        </div>
                        <span style={{ fontSize: '11px', color: '#166534', fontWeight: 600 }}>{b.employees}</span>
                      </TableCell>
                      <TableCell>
                        <span style={{
                          display: 'inline-block',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: '#e8f5e9',
                          color: '#2e7d32'
                        }}>
                          {b.prequalificationStatus}
                        </span>
                        <small style={{ display: 'block', color: '#6c8077', marginTop: '2px' }}>{b.taxStatus}</small>
                      </TableCell>
                      <TableCell style={{ textAlign: 'right' }}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setBusinessModalVendor(b)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600 }}
                        >
                          <Printer size={13} /> View Official Endorsement
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* VIEW 3: CONCESSION TENDERS & LOCAL QUOTAS */}
      {businessView === 'tenders' && (
        <div>
          {/* STATUTORY SECTION 13 EXPLAINER BANNER */}
          <div style={{ background: '#fdfbf7', border: '1px solid #ecd8a5', borderRadius: '10px', padding: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <ShieldCheck size={20} color="#b45309" />
              <strong style={{ fontSize: '16px', color: '#78350f', fontFamily: 'Georgia, serif' }}>
                Section 13 (Local Content) Protected Procurement Packages
              </strong>
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#5b4010', lineHeight: '1.6' }}>
              The Putu Mineral Development Agreement mandates that civil construction (camp offices, staff quarters, central canteens, schools, and clinics), local catering, crushed aggregate haulage, and site security packages <strong>must be awarded on a priority first-right basis to registered Grand Gedean contractors with ≥51% local ownership</strong>. GGCDC matches prequalified local firms directly to active tender scopes.
            </p>
          </div>

          {/* TENDER LISTINGS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {concessionTenders.map((t) => (
              <div
                key={t.id}
                style={{
                  background: '#fff',
                  border: '1px solid #dce5e0',
                  borderRadius: '10px',
                  padding: '22px 26px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 260px',
                  gap: '20px',
                  alignItems: 'start'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#133e36', background: '#eaf4ee', padding: '3px 8px', borderRadius: '4px' }}>
                      {t.category}
                    </span>
                    <span className="status in-progress">Active Tender</span>
                  </div>
                  <h3 style={{ font: '700 18px Georgia', margin: '0 0 8px', color: '#133e36' }}>
                    {t.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#556b62', margin: '0 0 12px', lineHeight: '1.5' }}>
                    {t.summary}
                  </p>
                  <div style={{ background: '#f8faf9', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e1ebe5', fontSize: '12px', color: '#274b41' }}>
                    <strong>Mandatory Section 13 Quota:</strong> {t.localContent}
                  </div>
                </div>

                <div style={{ background: '#fafcfb', border: '1px solid #e1ebe5', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ marginBottom: '10px' }}>
                    <span style={{ fontSize: '11px', color: '#7a8e85', textTransform: 'uppercase', fontWeight: 700 }}>Contract Budget</span>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#133e36' }}>{t.estimatedValue}</div>
                  </div>
                  <div style={{ marginBottom: '14px' }}>
                    <span style={{ fontSize: '11px', color: '#7a8e85', textTransform: 'uppercase', fontWeight: 700 }}>Submission Deadline</span>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#445b52' }}>{t.deadline}</div>
                  </div>
                  <Button
                    className="primary"
                    size="sm"
                    style={{ width: '100%', fontSize: '12px' }}
                    onClick={() => {
                      setBusinessView('directory');
                      if (t.category.includes('Civil Construction')) setBusinessSectorFilter('Civil Construction');
                      else if (t.category.includes('Catering')) setBusinessSectorFilter('Catering');
                      else if (t.category.includes('Aggregate') || t.category.includes('Haulage')) setBusinessSectorFilter('Haulage');
                      else setBusinessSectorFilter('All');
                    }}
                  >
                    View Matched 51% Contractors →
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // ----------------------------------------------------------------------
  // SCENARIO 1: PUBLIC CIVIC PORTAL (FULL-WIDTH, STRICTLY NO INTERNAL SIDEBAR)
  // ----------------------------------------------------------------------
  if (viewMode === 'public') {
    return (
      <div className="publicShell">
        {/* PUBLIC TOP NAVBAR */}
        <header className="publicNavbar">
          <div className="publicBrand" onClick={() => setPublicTab('home')}>
            <div className="seal">G</div>
            <div>
              <strong>GGCDC</strong>
              <small>Grand Gedeh Citizens Development Council</small>
            </div>
          </div>

          <nav className="publicNavLinks">
            <button
              className={`publicNavLink ${publicTab === 'home' ? 'activeNavLink' : ''}`}
              onClick={() => setPublicTab('home')}
            >
              Home
            </button>
            <button
              className={`publicNavLink ${publicTab === 'architecture' ? 'activeNavLink' : ''}`}
              onClick={() => setPublicTab('architecture')}
            >
              Architecture & Model
            </button>
            <button
              className={`publicNavLink ${publicTab === 'roadmap' ? 'activeNavLink' : ''}`}
              onClick={() => setPublicTab('roadmap')}
            >
              Consultative Roadmap
            </button>
            <button
              className={`publicNavLink ${publicTab === 'pillars' ? 'activeNavLink' : ''}`}
              onClick={() => setPublicTab('pillars')}
            >
              12 Stakeholder Pillars
            </button>
            <button
              className={`publicNavLink ${publicTab === 'putu-group' ? 'activeNavLink' : ''}`}
              onClick={() => { setPublicTab('putu-group'); setActiveModuleId('agreements'); }}
            >
              Putu Working Groups (14)
            </button>
            <button
              className={`publicNavLink ${publicTab === 'grievance' ? 'activeNavLink' : ''}`}
              onClick={() => setPublicTab('grievance')}
            >
              Public Grievance Desk
            </button>
            <button
              className={`publicNavLink ${publicTab === 'workforce' ? 'activeNavLink' : ''}`}
              onClick={() => setPublicTab('workforce')}
            >
              Workforce Talent Pool
            </button>
            <button
              className={`publicNavLink ${publicTab === 'businesses' ? 'activeNavLink' : ''}`}
              onClick={() => setPublicTab('businesses')}
            >
              51% Local Businesses
            </button>
          </nav>

          <div className="publicNavActions">
            {/* Primary Action to Enter Internal Workspace */}
            <Button
              className="primary"
              onClick={() => { setViewMode('workspace'); setActiveTab('dashboard'); }}
              style={{ height: '38px', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <LayoutDashboard size={15} /> Enter Council Workspace
            </Button>

            <button
              className="publicMobileToggle"
              onClick={() => setPublicMobileNav(!publicMobileNav)}
              aria-label="Toggle navigation menu"
            >
              {publicMobileNav ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        {/* MOBILE NAVIGATION DRAWER */}
        {publicMobileNav && (
          <div className="publicMobileDrawer">
            <button className={`mobileLink ${publicTab === 'home' ? 'chosen' : ''}`} onClick={() => { setPublicTab('home'); setPublicMobileNav(false); }}>Home</button>
            <button className={`mobileLink ${publicTab === 'architecture' ? 'chosen' : ''}`} onClick={() => { setPublicTab('architecture'); setPublicMobileNav(false); }}>Architecture & Model</button>
            <button className={`mobileLink ${publicTab === 'roadmap' ? 'chosen' : ''}`} onClick={() => { setPublicTab('roadmap'); setPublicMobileNav(false); }}>Consultative Roadmap</button>
            <button className={`mobileLink ${publicTab === 'pillars' ? 'chosen' : ''}`} onClick={() => { setPublicTab('pillars'); setPublicMobileNav(false); }}>12 Stakeholder Pillars</button>
            <button className={`mobileLink ${publicTab === 'putu-group' ? 'chosen' : ''}`} onClick={() => { setPublicTab('putu-group'); setPublicMobileNav(false); }}>Putu Working Groups (14)</button>
            <button className={`mobileLink ${publicTab === 'grievance' ? 'chosen' : ''}`} onClick={() => { setPublicTab('grievance'); setPublicMobileNav(false); }}>Public Grievance Desk</button>
            <button className={`mobileLink ${publicTab === 'workforce' ? 'chosen' : ''}`} onClick={() => { setPublicTab('workforce'); setPublicMobileNav(false); }}>Workforce Talent Pool</button>
            <button className={`mobileLink ${publicTab === 'businesses' ? 'chosen' : ''}`} onClick={() => { setPublicTab('businesses'); setPublicMobileNav(false); }}>51% Local Businesses</button>
            <Button className="primary" style={{ width: '100%', marginTop: '10px' }} onClick={() => { setViewMode('workspace'); setActiveTab('dashboard'); setPublicMobileNav(false); }}>
              <LayoutDashboard size={15} /> Enter Council Workspace
            </Button>
          </div>
        )}

        {/* PUBLIC CONTENT CONTAINER */}
        <div className="publicContent">
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

          {/* TAB 1: HOME */}
          {publicTab === 'home' && (
            <>
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
                        onClick={() => { setViewMode('workspace'); setActiveTab('dashboard'); }}
                        style={{ height: '46px', padding: '0 24px', fontSize: '15px', fontWeight: 700 }}
                      >
                        <LayoutDashboard size={18} /> Enter Council Command Center
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => setPublicTab('grievance')}
                        style={{ height: '46px', padding: '0 20px', fontSize: '14px', background: '#ffffff15', color: '#fff', borderColor: '#d5ae5980' }}
                      >
                        <ShieldAlert size={18} color="#f5d78e" /> Confidential Grievance Desk
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => { setPublicTab('putu-group'); setActiveModuleId('agreements'); }}
                        style={{ height: '46px', padding: '0 20px', fontSize: '14px', background: '#ffffff10', color: '#e0ece6', borderColor: '#ffffff30' }}
                      >
                        <BriefcaseBusiness size={18} /> Putu Working Groups
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
                  <Button variant="outline" size="sm" className="cardBtn" onClick={() => setPublicTab('architecture')}>
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
                  <Button variant="outline" size="sm" className="cardBtn" onClick={() => setPublicTab('roadmap')}>
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
                  <Button variant="outline" size="sm" className="cardBtn" onClick={() => { setPublicTab('putu-group'); setActiveModuleId('agreements'); }}>
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
                  <Button className="primary" onClick={() => { setViewMode('workspace'); setActiveTab('dashboard'); }}>
                    Enter Council Workspace ({records.length} records)
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
                          setPublicTab('putu-group');
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
            </>
          )}

          {/* TAB 2: ARCHITECTURE */}
          {publicTab === 'architecture' && renderArchitectureContent()}

          {/* TAB 3: ROADMAP */}
          {publicTab === 'roadmap' && renderRoadmapContent()}

          {/* TAB 4: PILLARS */}
          {publicTab === 'pillars' && renderPillarsContent()}

          {/* TAB 5: PUTU WORKING GROUPS DIRECTORY */}
          {publicTab === 'putu-group' && renderPublicPutuGroupContent()}

          {/* TAB 6: GRIEVANCE DESK */}
          {publicTab === 'grievance' && renderPublicGrievanceContent()}

          {/* TAB 7: WORKFORCE MATCHER */}
          {publicTab === 'workforce' && renderPublicWorkforceContent()}

          {/* TAB 8: 51% LOCAL BUSINESS REGISTRY */}
          {publicTab === 'businesses' && renderPublicBusinessContent()}
        </div>

        {/* PUBLIC FOOTER */}
        <footer className="publicFooter">
          <div className="publicFooterInner">
            <div className="publicFooterTop">
              <div className="publicFooterBrand">
                <strong>Grand Gedeh Citizens Development Council (GGCDC)</strong>
                <p>
                  A nonpartisan, county-centered platform uniting customary communities, traditional elders, women, youth, professionals, and diaspora partners to advocate for Grand Gedeh's natural resources and ensure genuine community benefits.
                </p>
                <div className="publicFooterQuote">
                  "{governingPrinciples.sacredRule}"
                </div>
              </div>
              <div className="publicFooterCol">
                <strong>Institutional Tripartite Pillars</strong>
                <ul>
                  <li><strong>Foundation:</strong> In-County Landowners & Elders</li>
                  <li><strong>Facilitator:</strong> GGAA Dispatched Emissary</li>
                  <li><strong>Legal Oversight:</strong> Grand Gedeh Bar Association (GGBA)</li>
                  <li><strong>Technical Partner:</strong> Grand Gedeh Association in the Americas (GGAA)</li>
                </ul>
              </div>
              <div className="publicFooterCol">
                <strong>Public Access & Portals</strong>
                <ul>
                  <li><button onClick={() => setPublicTab('grievance')} style={{ background: 'none', border: 'none', color: '#cbdcd4', cursor: 'pointer', padding: 0, textAlign: 'left', font: 'inherit' }}>Confidential Grievance Portal</button></li>
                  <li><button onClick={() => setPublicTab('workforce')} style={{ background: 'none', border: 'none', color: '#cbdcd4', cursor: 'pointer', padding: 0, textAlign: 'left', font: 'inherit' }}>Workforce Talent Matcher</button></li>
                  <li><button onClick={() => setPublicTab('businesses')} style={{ background: 'none', border: 'none', color: '#cbdcd4', cursor: 'pointer', padding: 0, textAlign: 'left', font: 'inherit' }}>51% Local Contractor Registry</button></li>
                  <li><button onClick={() => setPublicTab('roadmap')} style={{ background: 'none', border: 'none', color: '#cbdcd4', cursor: 'pointer', padding: 0, textAlign: 'left', font: 'inherit' }}>5-Phase Formation Roadmap</button></li>
                  <li><button onClick={() => { setViewMode('workspace'); setActiveTab('dashboard'); }} style={{ background: 'none', border: 'none', color: '#f3d999', cursor: 'pointer', padding: 0, textAlign: 'left', fontWeight: 'bold', font: 'inherit' }}>Council Member Login →</button></li>
                </ul>
              </div>
            </div>
            <div className="publicFooterBottom">
              <div>© {new Date().getFullYear()} Grand Gedeh Citizens Development Council. All rights reserved.</div>
              <div style={{ color: '#d5ae59', fontWeight: 600 }}>One County • One Voice • Shared Development</div>
            </div>
          </div>
        </footer>
        {renderRecommendationModal()}
        {renderBusinessEndorsementModal()}
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // SCENARIO 2: AUTHENTICATED COUNCIL WORKSPACE (SIDEBAR ACTIVE & RBAC ENFORCED)
  // ----------------------------------------------------------------------
  return (
    <div className="shell">
      {/* SIDEBAR NAVIGATION */}
      <aside className={`sidebar ${mobileMenuOpen ? 'show' : ''}`}>
        <div className="brand">
          <div className="seal">G</div>
          <div>
            <strong>GGCDC</strong>
            <small>Council Workspace</small>
          </div>
          <button className="closeMobile" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        {/* Exit back to Public Portal Button */}
        <div style={{ padding: '12px 14px', borderBottom: '1px solid #ffffff15' }}>
          <button
            onClick={() => { setViewMode('public'); setPublicTab('home'); setMobileMenuOpen(false); }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #d5ae5960',
              background: '#d5ae5920',
              color: '#f5d993',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} /> Exit to Public Portal
          </button>
        </div>

        <div className="sideScroll">
          {/* Main Workspace Navigation */}
          <p className="sideLabel">WORKSPACE OPERATIONS</p>
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
            const isPrimary = currentRole.primaryModules.includes(m.id);

            return (
              <button
                key={m.id}
                className={`nav ${isSelected ? 'chosen' : ''}`}
                style={isPrimary ? { borderLeft: '3px solid #d5ae59', paddingLeft: '9px' } : {}}
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

        {/* Sidebar Footer with Role Info */}
        <div className="sideFoot">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ color: '#d5ae59', fontWeight: 'bold' }}>{currentRole.badge}</span>
            <span className={`rbacTag ${currentRole.type}`}>{currentRole.type}</span>
          </div>
          <span style={{ fontSize: '11px', display: 'block', color: '#a0c4b6', lineHeight: 1.4 }}>
            {currentRole.canCreate ? 'Full Write & Audit Access' : 'Read-Only Observer Access'}
          </span>
        </div>
      </aside>

      {/* WORKSPACE MAIN CONTENT AREA */}
      <main className="main">
        {/* TOPBAR */}
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button className="menuBtn" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
              <Menu size={22} />
            </button>
            <div className="breadcrumb">
              <strong>GGCDC Workspace</strong>
              <span>/</span>
              {activeTab === 'dashboard' && 'Executive Command Center'}
              {activeTab === 'putu-group' && `Putu Working Group · ${currentModule.name}`}
              {activeTab === 'architecture' && 'Institutional Architecture & Governance'}
              {activeTab === 'roadmap' && 'Consultative Formation Roadmap'}
              {activeTab === 'pillars' && '12 Founding Stakeholder Pillars'}
              {activeTab === 'tools' && 'Civic Tools & Verification Engine'}
            </div>
          </div>

          <div className="topRight">
            <Button variant="outline" size="sm" onClick={() => { setViewMode('public'); setPublicTab('home'); }} style={{ fontSize: '12px', height: '32px' }}>
              <ArrowLeft size={14} /> Public Portal
            </Button>

            {/* Persona / RBAC Role Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#688075', fontWeight: 600 }}>Active Role:</span>
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
                  <option key={r.id} value={r.id}>{r.name} ({r.badge})</option>
                ))}
              </select>
            </div>

            <div className="avatar" title={`Current persona: ${currentRole.name}`}>
              {currentRole.name[0]}
            </div>
          </div>
        </header>

        <div className="content">
          {/* RBAC PERMISSION NOTICE BAR */}
          <div className="roleNotice">
            <div>
              <strong>Active RBAC Persona: {currentRole.name}</strong> — <span>{currentRole.description}</span>
            </div>
            <span className={`rbacTag ${currentRole.type}`}>
              {currentRole.canCreate ? 'Authorized Contributor' : 'Read-Only Observer'}
            </span>
          </div>

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
                  {currentRole.canCreate ? (
                    <Button onClick={() => handleOpenNew()} className="primary">
                      <Plus size={18} /> New record
                    </Button>
                  ) : (
                    <Button variant="outline" disabled style={{ opacity: 0.7 }}>
                      <Lock size={16} /> Read-Only Observer
                    </Button>
                  )}
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
                  const isPrimary = currentRole.primaryModules.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      className="moduleCard"
                      style={isPrimary ? { borderColor: '#1b5e20', background: '#fcfdfc' } : {}}
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
                        {isPrimary && (
                          <span style={{ fontSize: '11px', color: '#1b5e20', fontWeight: 'bold', display: 'block', margin: '2px 0' }}>
                            ★ Primary for your role
                          </span>
                        )}
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
                  {currentRole.canCreate ? (
                    <Button onClick={() => handleOpenNew(activeModuleId)} className="primary">
                      <Plus size={18} /> New {currentModule.short} record
                    </Button>
                  ) : (
                    <Button variant="outline" disabled style={{ opacity: 0.7 }}>
                      <Lock size={16} /> Read-Only Observer
                    </Button>
                  )}
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
          {activeTab === 'architecture' && renderArchitectureContent()}

          {/* VIEW: 4. CONSULTATIVE FORMATION ROADMAP */}
          {activeTab === 'roadmap' && renderRoadmapContent()}

          {/* VIEW: 5. 12 STAKEHOLDER PILLARS */}
          {activeTab === 'pillars' && renderPillarsContent()}

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
                        Community Workforce Matcher &amp; Recommendation Engine
                      </h3>
                      <p style={{ fontSize: '14px', color: '#687b73', margin: '4px 0 0' }}>
                        Match verified Grand Gedean tradespeople and trainees to mining contractor recruitment quotas with official GGCDC legal endorsements.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                      {/* Track Filter Toggle */}
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <Button
                          variant={matcherTrackFilter === 'All' ? 'default' : 'outline'}
                          size="sm"
                          className={matcherTrackFilter === 'All' ? 'primary' : ''}
                          onClick={() => setMatcherTrackFilter('All')}
                        >
                          All
                        </Button>
                        <Button
                          variant={matcherTrackFilter === 'Track A' ? 'default' : 'outline'}
                          size="sm"
                          className={matcherTrackFilter === 'Track A' ? 'primary' : ''}
                          onClick={() => setMatcherTrackFilter('Track A')}
                        >
                          Track A (Certified)
                        </Button>
                        <Button
                          variant={matcherTrackFilter === 'Track B' ? 'default' : 'outline'}
                          size="sm"
                          className={matcherTrackFilter === 'Track B' ? 'primary' : ''}
                          onClick={() => setMatcherTrackFilter('Track B')}
                        >
                          Track B (Trainees)
                        </Button>
                      </div>

                      <select
                        value={matcherTrade}
                        onChange={(e) => setMatcherTrade(e.target.value)}
                        style={{ height: '36px', borderRadius: '6px', border: '1px solid #d5ded9', padding: '0 10px', fontSize: '13px' }}
                      >
                        <option value="All">All Trades &amp; Specializations</option>
                        <option value="Operator">Equipment / Truck Operators</option>
                        <option value="Welder">Welding &amp; Metal Fabrication</option>
                        <option value="Environmental">Environmental &amp; Water</option>
                        <option value="Electrical">Solar &amp; Electrical</option>
                        <option value="Logistics">Logistics &amp; Supply Chain</option>
                        <option value="Drill">Drill &amp; Blasting Assistant</option>
                      </select>

                      <select
                        value={matcherMinExp}
                        onChange={(e) => setMatcherMinExp(Number(e.target.value))}
                        style={{ height: '36px', borderRadius: '6px', border: '1px solid #d5ded9', padding: '0 10px', fontSize: '13px' }}
                      >
                        <option value="0">Any Experience</option>
                        <option value="3">3+ Years Experience</option>
                        <option value="5">5+ Years Experience</option>
                        <option value="8">8+ Years Experience</option>
                      </select>
                    </div>
                  </div>

                  <div className="tableWrap">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Candidate &amp; Location</TableHead>
                          <TableHead>Track &amp; Role</TableHead>
                          <TableHead>Qualifications &amp; Institution</TableHead>
                          <TableHead>Proof Document</TableHead>
                          <TableHead>Endorsement / Recommendation</TableHead>
                          <TableHead>Availability</TableHead>
                          <TableHead style={{ textAlign: 'right' }}>Official Instrument</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {workforceCandidates.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} style={{ textAlign: 'center', padding: '30px', color: '#687b73' }}>
                              No candidates found matching the selected filter criteria.
                            </TableCell>
                          </TableRow>
                        ) : (
                          workforceCandidates.map((c) => (
                            <TableRow key={c.id}>
                              <TableCell>
                                <strong style={{ color: '#11352f', display: 'block' }}>{c.name}</strong>
                                <small style={{ color: '#6c8077' }}>{c.community}, Grand Gedeh</small>
                              </TableCell>
                              <TableCell>
                                <span style={{
                                  display: 'inline-block',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  padding: '2px 8px',
                                  borderRadius: '12px',
                                  background: c.trackType === 'Track A' ? '#e0e7ff' : '#fef3c7',
                                  color: c.trackType === 'Track A' ? '#3730a3' : '#92400e',
                                  marginBottom: '4px'
                                }}>
                                  {c.trackType === 'Track A' ? 'Track A (Certified)' : 'Track B (TVET Trainee)'}
                                </span>
                                <div style={{ fontSize: '13px', fontWeight: 600 }}>{c.occupation}</div>
                              </TableCell>
                              <TableCell>
                                <div style={{ fontSize: '13px' }}>{c.qualification}</div>
                                <small style={{ color: '#687b73' }}>{c.institution}</small>
                              </TableCell>
                              <TableCell>
                                <span style={{ fontSize: '12px', color: '#2e7d32', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                                  <FileCheck size={14} /> {c.proofDocument.length > 24 ? c.proofDocument.slice(0, 22) + '…' : c.proofDocument}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span style={{
                                  display: 'inline-block',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  background: c.trackType === 'Track A' ? '#e8f5e9' : '#fff3e0',
                                  color: c.trackType === 'Track A' ? '#2e7d32' : '#e65100'
                                }}>
                                  {c.recommendationStatus}
                                </span>
                                <small style={{ display: 'block', color: '#6c8077', marginTop: '2px' }}>{c.endorsement}</small>
                              </TableCell>
                              <TableCell>
                                <span className="status in-progress">{c.availability}</span>
                              </TableCell>
                              <TableCell style={{ textAlign: 'right' }}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setRecommendationModalCandidate(c)}
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600 }}
                                >
                                  <Printer size={13} /> View Letter
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
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
                      {currentRole.canManageData ? (
                        <label style={{ display: 'inline-block' }}>
                          <input type="file" accept=".json" onChange={handleImportJSON} style={{ display: 'none' }} />
                          <span className="btn" style={{ padding: '8px 14px', border: '1px solid #c9d6cf', borderRadius: '6px', cursor: 'pointer', background: '#fff', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <Upload size={16} /> Select File
                          </span>
                        </label>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#999', fontStyle: 'italic' }}>Restricted to Admin</span>
                      )}
                    </div>

                    <div style={{ border: '1px solid #f2dede', borderRadius: '8px', padding: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fdf7f7' }}>
                      <div>
                        <strong style={{ display: 'block', fontSize: '15px', color: '#a94442' }}>Reset to Official Demo Data</strong>
                        <small style={{ color: '#c97878' }}>Restores the 30+ pre-seeded records (MDA clauses, Putu land claims, water quality tests, tenders).</small>
                      </div>
                      {currentRole.canManageData ? (
                        <Button variant="outline" onClick={handleResetSeed} style={{ color: '#a94442', borderColor: '#ebccd1' }}>
                          <RefreshCw size={16} /> Reset Demo Data
                        </Button>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#999', fontStyle: 'italic' }}>Restricted to Admin</span>
                      )}
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
                  disabled={!!editing || !currentRole.canCreate}
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
                  disabled={!currentRole.canCreate && !currentRole.canEdit}
                />
              </label>

              <label>
                Status
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  disabled={!currentRole.canCreate && !currentRole.canEdit}
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
                  disabled={!currentRole.canCreate && !currentRole.canEdit}
                />
              </label>

              <label>
                County
                <select
                  value={form.county}
                  onChange={(e) => setForm({ ...form, county: e.target.value })}
                  disabled={!currentRole.canCreate && !currentRole.canEdit}
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
                  disabled={!currentRole.canCreate && !currentRole.canEdit}
                />
              </label>

              <label>
                Target / Due Date
                <Input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  disabled={!currentRole.canCreate && !currentRole.canEdit}
                />
              </label>

              <label className="full">
                Executive Summary / Description
                <Textarea
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  rows={2}
                  placeholder="Brief summary of commitments, facts, or actions..."
                  disabled={!currentRole.canCreate && !currentRole.canEdit}
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
                      disabled={!currentRole.canCreate && !currentRole.canEdit}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      value={form.details[field.key] || ''}
                      onChange={(e) => setForm({
                        ...form,
                        details: { ...form.details, [field.key]: e.target.value }
                      })}
                      disabled={!currentRole.canCreate && !currentRole.canEdit}
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
                      disabled={!currentRole.canCreate && !currentRole.canEdit}
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
            {editing && currentRole.canLink && (
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
            {(currentRole.canCreate || (editing && currentRole.canEdit)) && (
              <Button className="primary" onClick={handleSaveRecord} disabled={saving}>
                <Save size={16} /> {saving ? 'Saving…' : 'Save Record'}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {renderRecommendationModal()}
      {renderBusinessEndorsementModal()}
    </div>
  );
}
